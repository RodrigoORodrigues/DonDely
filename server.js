import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================================
// SEGURANÇA: SESSION_SECRET OBRIGATÓRIO EM PRODUÇÃO
// ============================================================================
let SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
    if (NODE_ENV === 'production') {
        console.error('❌ FATAL: SESSION_SECRET ausente ou fraco em produção!');
        console.error('   Gere com: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
        process.exit(1);
    }
    SESSION_SECRET = crypto.randomBytes(32).toString('hex');
    console.warn('⚠️  SESSION_SECRET gerado em runtime (APENAS DEV). Sessões serão invalidadas ao reiniciar.');
}

// ============================================================================
// SECURITY HEADERS, HTTPS & OCULTAR POWERED-BY
// ============================================================================
app.disable('x-powered-by');

app.use((req, res, next) => {
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    if (!isHttps && NODE_ENV === 'production') {
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');

    if (isHttps) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    next();
});

// ============================================================================
// RESTRINGIR UPLOADS & TAMANHO MÁXIMO DE PAYLOAD (2MB)
// ============================================================================
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ============================================================================
// RATE LIMITING & BOT PROTECTION
// ============================================================================
const rateLimitStore = new Map();

setInterval(() => {
    const now = Date.now();
    for (const [ip, records] of rateLimitStore.entries()) {
        const filtered = records.filter(timestamp => now - timestamp < 60000);
        if (filtered.length === 0) {
            rateLimitStore.delete(ip);
        } else {
            rateLimitStore.set(ip, filtered);
        }
    }
}, 300000);

function createRateLimiter(maxRequests = 100, windowMs = 60000, label = 'Geral') {
    return (req, res, next) => {
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
        const key = `${label}:${clientIp}`;
        const now = Date.now();

        const timestamps = rateLimitStore.get(key) || [];
        const recentTimestamps = timestamps.filter(t => now - t < windowMs);

        if (recentTimestamps.length >= maxRequests) {
            return res.status(429).json({
                success: false,
                error: `Muitas requisições. Aguarde um momento antes de tentar novamente. (${label})`
            });
        }

        recentTimestamps.push(now);
        rateLimitStore.set(key, recentTimestamps);
        next();
    };
}

function botProtectionMiddleware(req, res, next) {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        const body = req.body || {};
        if (body._bot_check || body.website_hp || body.honeypot) {
            console.warn(`🤖 [BOT DETECTADO E BLOQUEADO] IP: ${req.ip}`);
            return res.status(400).json({ success: false, error: 'Requisição inválida.' });
        }
    }
    next();
}

app.use(botProtectionMiddleware);

const generalLimiter = createRateLimiter(300, 60000, 'Geral');
const authLimiter = createRateLimiter(60, 60000, 'Autenticação');
const orderReadLimiter = createRateLimiter(600, 60000, 'Consulta Pedidos');
const orderWriteLimiter = createRateLimiter(120, 60000, 'Envio Pedidos');

// ============================================================================
// CRIPTOGRAFIA DE DADOS, HASH SEGURO E ASSINATURA HMAC
// ============================================================================
function hashPassword(password, salt = null) {
    if (!password) return { hash: '', salt: '' };
    const usedSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, usedSalt, 10000, 32, 'sha256').toString('hex');
    return { hash, salt: usedSalt };
}

function verifyPassword(password, hash, salt) {
    if (!password || !hash || !salt) return false;
    const computed = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256').toString('hex');
    try {
        return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computed, 'hex'));
    } catch {
        return false;
    }
}

function validateCompanyPassword(enteredPassword, storedPassword) {
    if (!storedPassword) return false;
    // Se formato salt:hash → validar com PBKDF2
    if (storedPassword.includes(':')) {
        const [salt, hash] = storedPassword.split(':');
        return verifyPassword(enteredPassword, hash, salt);
    }
    // Fallback texto plano (compatibilidade com cadastros antigos)
    return enteredPassword === storedPassword;
}

// Hash da senha da empresa no objeto (se ainda estiver em texto plano)
// Retorna novo objeto com adminPassword hasheado
function hashCompanyPasswordInObject(company) {
    if (!company || !company.adminPassword) return company;
    const pwd = company.adminPassword;
    // Se já estiver no formato salt:hash, não re-hashear
    if (pwd.includes(':')) return company;
    const { hash, salt } = hashPassword(pwd);
    return { ...company, adminPassword: `${salt}:${hash}` };
}

function generateSessionToken(payload) {
    const data = JSON.stringify({ ...payload, exp: Date.now() + 86400000 });
    const b64Data = Buffer.from(data).toString('base64url');
    const signature = crypto.createHmac('sha256', SESSION_SECRET).update(b64Data).digest('base64url');
    return `${b64Data}.${signature}`;
}

function verifySessionToken(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [b64Data, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(b64Data).digest('base64url');

    try {
        if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return null;
        const decoded = JSON.parse(Buffer.from(b64Data, 'base64url').toString('utf-8'));
        if (decoded.exp && decoded.exp < Date.now()) return null;
        return decoded;
    } catch {
        return null;
    }
}

// ============================================================================
// VALIDAÇÃO DE INPUTS & BLOQUEIO DE MASS ASSIGNMENT
// ============================================================================
function sanitizeString(str, maxLength = 255) {
    if (typeof str !== 'string') return '';
    return str.trim().slice(0, maxLength).replace(/[<>]/g, '');
}

function sanitizeSlug(text) {
    if (!text) return '';
    return String(text)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);
}

function generateSlug(text) {
    const clean = sanitizeSlug(text);
    return clean || ('loja-' + Date.now().toString(36));
}

function sanitizeNumber(val, defaultVal = 0, min = 0, max = 999999) {
    const num = Number(val);
    if (isNaN(num)) return defaultVal;
    return Math.max(min, Math.min(max, num));
}

function sanitizeOrderPayload(input, fallbackCompanyId = 'company-demo-don') {
    if (!input || typeof input !== 'object') return null;

    const id = sanitizeString(input.id || `#${Date.now().toString().slice(-4)}`, 30);
    const companyId = sanitizeString(input.companyId || fallbackCompanyId, 60);
    const companyName = sanitizeString(input.companyName || '', 100);
    const companyWhatsapp = sanitizeString(input.companyWhatsapp || '', 30);
    const customerName = sanitizeString(input.customerName || 'Cliente', 100);
    const customerPhone = sanitizeString(input.customerPhone || '', 30);
    const customerAddress = sanitizeString(input.customerAddress || '', 255);
    const customerNeighborhood = sanitizeString(input.customerNeighborhood || '', 100);
    const customerNeighborhoodZone = sanitizeString(input.customerNeighborhoodZone || '', 100);
    const customerReference = sanitizeString(input.customerReference || '', 150);
    const deliveryTime = sanitizeString(input.deliveryTime || '30 - 45 min', 50);
    const paymentMethod = sanitizeString(input.paymentMethod || 'Pix', 60);
    const couponCode = sanitizeString(input.couponCode || '', 30);
    const couponDiscount = sanitizeNumber(input.couponDiscount, 0);
    const discountValue = sanitizeNumber(input.discountValue || input.discount, 0);
    const discount = discountValue;
    const observations = sanitizeString(input.observations || '', 500);
    const date = sanitizeString(input.date || new Date().toLocaleString('pt-BR'), 50);
    const status = ['RECEIVED', 'PREPARING', 'DELIVERING', 'COMPLETED', 'CANCELLED'].includes(input.status)
        ? input.status
        : 'RECEIVED';

    const subtotal = sanitizeNumber(input.subtotal, 0);
    const deliveryFee = sanitizeNumber(input.deliveryFee, 0);
    const total = sanitizeNumber(input.total, Math.max(0, subtotal + deliveryFee - discount));
    const cashChangeFor = input.cashChangeFor ? sanitizeNumber(input.cashChangeFor, 0) : null;

    // NOVO: campos de encomenda/agendamento
    const rawIsScheduled = input.isScheduled === true;
    const rawDate = sanitizeString(input.scheduledDate || '', 20);
    const rawTime = sanitizeString(input.scheduledTime || '', 10);
    const scheduledDate = (rawIsScheduled && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)) ? rawDate : null;
    const scheduledTime = (rawIsScheduled && /^\d{2}:\d{2}$/.test(rawTime)) ? rawTime : null;
    const isScheduled = (rawIsScheduled && scheduledDate && scheduledTime) ? true : false;
    const orderType = isScheduled ? 'SCHEDULED' : 'IMMEDIATE';

    const items = Array.isArray(input.items) ? input.items.map(item => ({
        id: item.id ? String(item.id).slice(0, 50) : undefined,
        name: sanitizeString(item.name || 'Item', 120),
        price: sanitizeNumber(item.price, 0),
        quantity: Math.max(1, Math.min(99, parseInt(item.quantity, 10) || 1)),
        details: sanitizeString(item.details || '', 500),
        image: sanitizeString(item.image || '', 500)
    })) : [];

    return {
        id,
        companyId,
        companyName,
        companyWhatsapp,
        customerName,
        customerPhone,
        customerAddress,
        customerNeighborhood,
        customerNeighborhoodZone,
        customerReference,
        deliveryTime,
        paymentMethod,
        date,
        items,
        subtotal,
        deliveryFee,
        discount,
        discountValue,
        couponCode,
        couponDiscount,
        total,
        cashChangeFor,
        observations,
        status,
        isScheduled,
        scheduledDate,
        scheduledTime,
        orderType,
        created_at: input.created_at || new Date().toISOString(),
        updated_at: input.updated_at || new Date().toISOString()
    };
}

function trimCompanyOutput(company) {
    if (!company) return null;
    const safe = { ...company };
    delete safe.adminPassword;
    delete safe.passwordHash;
    delete safe.salt;
    delete safe.secret;
    return safe;
}

function trimCustomerOutput(customer) {
    if (!customer) return null;
    const safe = { ...customer };
    delete safe.password;
    delete safe.passwordHash;
    delete safe.salt;
    return safe;
}

// ============================================================================
// PERSISTÊNCIA LOCAL SEGURA
// ============================================================================
let DATA_DIR = path.join(__dirname, 'data');
let isDataDirWritable = false;

try {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const testFile = path.join(DATA_DIR, `.write_test_${Date.now()}`);
    fs.writeFileSync(testFile, 'ok', 'utf-8');
    fs.unlinkSync(testFile);
    isDataDirWritable = true;
} catch (e) {
    DATA_DIR = path.join(os.tmpdir(), 'donfood_data');
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        isDataDirWritable = true;
    } catch (err2) {
        console.warn('ℹ️ Armazenamento em memória temporária ativado.');
    }
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const COMPANIES_FILE = path.join(DATA_DIR, 'companies.json');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');
const DEMO_LEADS_FILE = path.join(DATA_DIR, 'demo_leads.json');

const memoryStorage = new Map();

function readJsonFile(filePath, defaultValue = []) {
    const baseName = path.basename(filePath);
    try {
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf-8');
            const parsed = JSON.parse(raw || '[]');
            memoryStorage.set(baseName, parsed);
            return parsed;
        }

        const seedPath = path.join(__dirname, 'data', baseName);
        if (seedPath !== filePath && fs.existsSync(seedPath)) {
            try {
                const raw = fs.readFileSync(seedPath, 'utf-8');
                const parsed = JSON.parse(raw || '[]');
                writeJsonFile(filePath, parsed);
                return parsed;
            } catch (seedErr) {}
        }

        if (memoryStorage.has(baseName)) {
            return memoryStorage.get(baseName);
        }

        writeJsonFile(filePath, defaultValue);
        return defaultValue;
    } catch (err) {
        if (memoryStorage.has(baseName)) {
            return memoryStorage.get(baseName);
        }
        return defaultValue;
    }
}

function writeJsonFile(filePath, data) {
    const baseName = path.basename(filePath);
    memoryStorage.set(baseName, data);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {}
}

// ============================================================================
// CLIENTE SUPABASE SEGURO
// ============================================================================
const rawSupabaseUrl = process.env.SUPABASE_URL || '';
const supabaseUrl = typeof rawSupabaseUrl === 'string' ? rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '') : '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase = null;
if (supabaseUrl && supabaseKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false, autoRefreshToken: false }
        });
        console.log('✅ [Segurança] Supabase configurado:', supabaseUrl);
    } catch (err) {
        console.error('❌ [Segurança] Falha ao inicializar Supabase:', err.message);
    }
}

async function saveCompanyToSupabase(company) {
    if (!supabase || !company || !company.id) return;
    try {
        // Hashear senha se ainda estiver em texto plano
        let pwd = company.adminPassword || '';
        if (pwd && !pwd.includes(':')) {
            const { hash, salt } = hashPassword(pwd);
            pwd = `${salt}:${hash}`;
        }

        const compPayload = {
            id: String(company.id),
            name: company.name || 'Empresa Sem Nome',
            slug: company.slug ? sanitizeSlug(company.slug) : sanitizeSlug(company.name || company.id),
            email: company.email || 'contato@donfood.com',
            admin_password: pwd,
            cnpj: company.cnpj || '',
            address: company.address || '',
            phone: company.whatsappNumber || company.phone || '',
            whatsapp: company.whatsappNumber || company.phone || '',
            logo_url: company.logoUrl || '',
            category: company.presetType || company.category || 'delivery',
            is_demo: !!company.isDemo,
            active: company.active !== false,
            updated_at: new Date().toISOString()
        };
        const { error: cErr } = await supabase.from('companies').upsert([compPayload]);
        if (cErr) console.warn('[Supabase] Erro company:', cErr.message);

        const settingsPayload = {
            company_id: String(company.id),
            restaurant_name: company.name || 'Don Food',
            subtitle: company.subtitle || '',
            whatsapp_number: company.whatsappNumber || '',
            instagram: company.instagram || '',
            cnpj: company.cnpj || '',
            address: company.address || '',
            logo_url: company.logoUrl || '',
            delivery_fee: Number(company.deliveryFee || 0),
            delivery_time: company.deliveryTime || '30 - 45 min',
            preset_type: company.presetType || 'burguer',
            theme_colors: company.themeColors || {},
            schedule: company.schedule || {},
            coupons: Array.isArray(company.coupons) ? company.coupons : [],
            neighborhoods: Array.isArray(company.deliveryNeighborhoods) ? company.deliveryNeighborhoods : [],
            updated_at: new Date().toISOString()
        };
        const { error: sErr } = await supabase.from('company_settings').upsert([settingsPayload]);
        if (sErr) console.warn('[Supabase] Erro settings:', sErr.message);

        if (Array.isArray(company.products) && company.products.length > 0) {
            const prodPayloads = company.products.map(p => ({
                id: String(p.id),
                company_id: String(company.id),
                name: p.name || 'Produto',
                description: p.description || '',
                price: Number(p.price || 0),
                promo_price: p.promoPrice ? Number(p.promoPrice) : null,
                image_url: p.image || p.imageUrl || '',
                image: p.image || p.imageUrl || '',
                category: p.tag || p.category || '',
                tag: p.tag || p.category || '',
                is_customizable: !!p.isCustomizable,
                is_acai: !!p.isAcai,
                available: p.available !== false,
                updated_at: new Date().toISOString()
            }));
            const { error: pErr } = await supabase.from('products').upsert(prodPayloads);
            if (pErr) console.warn('[Supabase] Erro products:', pErr.message);
        }
    } catch (err) {
        console.warn('[Supabase] Erro geral:', err.message);
    }
}

async function fetchCompaniesFromSupabase() {
    if (!supabase) return null;
    try {
        const { data: supaCompanies, error: compErr } = await supabase.from('companies').select('*');
        if (compErr || !Array.isArray(supaCompanies) || supaCompanies.length === 0) return null;

        const { data: supaSettings } = await supabase.from('company_settings').select('*');
        const { data: supaProducts } = await supabase.from('products').select('*');

        const settingsMap = new Map();
        if (Array.isArray(supaSettings)) {
            supaSettings.forEach(s => { if (s && s.company_id) settingsMap.set(s.company_id, s); });
        }

        const productsMap = new Map();
        if (Array.isArray(supaProducts)) {
            supaProducts.forEach(p => {
                if (p && p.company_id) {
                    if (!productsMap.has(p.company_id)) productsMap.set(p.company_id, []);
                    productsMap.get(p.company_id).push({
                        id: isNaN(Number(p.id)) ? p.id : Number(p.id),
                        name: p.name,
                        tag: p.tag || p.category || '',
                        description: p.description || '',
                        price: Number(p.price || 0),
                        promoPrice: p.promo_price ? Number(p.promo_price) : null,
                        image: p.image || p.image_url || '',
                        available: p.available !== false,
                        isAcai: !!p.is_acai,
                        isCustomizable: !!p.is_customizable
                    });
                }
            });
        }

        return supaCompanies.map(sc => {
            const st = settingsMap.get(sc.id) || {};
            const prods = productsMap.get(sc.id) || [];
            return {
                id: sc.id,
                slug: sc.slug,
                name: sc.name || st.restaurant_name,
                email: sc.email || 'contato@donfood.com',
                subtitle: st.subtitle || '',
                whatsappNumber: sc.whatsapp || sc.phone || st.whatsapp_number || '',
                instagram: st.instagram || '',
                cnpj: sc.cnpj || st.cnpj || '',
                address: sc.address || st.address || '',
                logoUrl: sc.logo_url || st.logo_url || '',
                adminPassword: sc.admin_password || '',
                deliveryFee: Number(st.delivery_fee || 5),
                deliveryTime: st.delivery_time || '30 - 45 min',
                presetType: sc.category || st.preset_type || 'burguer',
                themeColors: st.theme_colors || null,
                schedule: st.schedule || null,
                coupons: st.coupons || [],
                deliveryNeighborhoods: st.neighborhoods || [],
                products: prods,
                isDemo: !!sc.is_demo,
                active: sc.active !== false
            };
        });
    } catch (err) {
        console.warn('[Supabase] Falha leitura:', err.message);
        return null;
    }
}

async function deleteCompanyFromSupabase(companyId) {
    if (!supabase || !companyId || companyId === 'company-demo-don') return;
    const dependentTables = ['orders', 'products', 'company_settings'];
    for (const table of dependentTables) {
        const { error } = await supabase.from(table).delete().eq('company_id', companyId);
        if (error) throw new Error(`Falha ao excluir ${table}: ${error.message}`);
    }
    const { error: companyError } = await supabase.from('companies').delete().eq('id', companyId);
    if (companyError) throw new Error(`Falha ao excluir empresa: ${companyError.message}`);
}

async function deleteRemoteCompaniesMissingFrom(localCompanies) {
    // PROTEÇÃO: só apaga se ALLOW_REMOTE_PRUNE=true
    if (process.env.ALLOW_REMOTE_PRUNE !== 'true') {
        console.log('[Segurança] SKIP: ALLOW_REMOTE_PRUNE != true.');
        return;
    }
    if (!supabase) return;
    const keepIds = new Set(localCompanies.filter(c => c && c.id).map(c => String(c.id)));
    const { data: remoteCompanies, error } = await supabase.from('companies').select('id');
    if (error) throw new Error(`Falha ao consultar empresas remotas: ${error.message}`);

    for (const remote of remoteCompanies || []) {
        if (remote && remote.id && !keepIds.has(String(remote.id)) && remote.id !== 'company-demo-don') {
            console.warn(`[Segurança] Removendo empresa órfã: ${remote.id}`);
            await deleteCompanyFromSupabase(String(remote.id));
        }
    }
}

function mapOrderToSupabase(order, companyId) {
    if (!order) return null;
    const targetCompId = companyId || order.companyId || order.company_id || 'company-demo-don';
    return {
        id: String(order.id || ''),
        company_id: targetCompId,
        customer_name: order.customerName || order.customer_name || 'Cliente',
        customer_phone: order.customerPhone || order.customer_phone || '',
        customer_address: order.customerAddress || order.customer_address || '',
        customer_neighborhood: order.customerNeighborhood || order.customer_neighborhood || '',
        payment_method: order.paymentMethod || order.payment_method || 'PIX',
        items: Array.isArray(order.items) ? order.items : [],
        subtotal: Number(order.subtotal || 0),
        delivery_fee: Number(order.deliveryFee || order.delivery_fee || 0),
        discount: Number(order.discount || order.discountValue || 0),
        total: Number(order.total || 0),
        status: order.status || 'RECEIVED',
        observations: order.observations || order.notes || '',
        coupon_code: order.couponCode || order.coupon_code || null,
        cash_change_for: Number(order.cashChangeFor || order.cash_change_for || 0) || null,
        is_scheduled: order.isScheduled === true,
        scheduled_date: order.scheduledDate || null,
        scheduled_time: order.scheduledTime || null,
        order_type: order.orderType || (order.isScheduled ? 'SCHEDULED' : 'IMMEDIATE'),
        created_at: order.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
}

async function saveOrderToSupabase(order, companyId) {
    if (!supabase || !order) return;
    try {
        const payload = mapOrderToSupabase(order, companyId);
        if (payload && payload.id) {
            const { error: oErr } = await supabase.from('orders').upsert([payload]);
            if (oErr) console.warn('[Supabase] Erro pedido:', oErr.message);
        }
    } catch (err) {
        console.warn('[Supabase] Erro salvar pedido:', err.message);
    }
}

async function saveCustomerToSupabase(customer, companyId) {
    if (!supabase || !customer) return;
    try {
        const custPayload = {
            id: crypto.randomUUID(),
            phone: String(customer.phone || ''),
            name: customer.name || 'Cliente',
            password_hash: customer.passwordHash || '',
            salt: customer.salt || '',
            address: customer.address || '',
            neighborhood: customer.neighborhood || '',
            created_at: customer.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        const { error } = await supabase.from('customers').upsert([custPayload]);
        if (error) console.warn('[Supabase] Erro cliente:', error.message);
    } catch (err) {
        console.warn('[Supabase] Erro salvar cliente:', err.message);
    }
}

// ============================================================================
// RBAC — CENTRALIZADOR DE AUTENTICAÇÃO
// ============================================================================
export const ROLES = Object.freeze({
    SUPER_ADMIN: 'SUPER_ADMIN',
    COMPANY_OWNER: 'COMPANY_OWNER',
    CUSTOMER: 'CUSTOMER'
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
    const token = authHeader ? (authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim()) : null;

    if (!token) {
        req.user = { role: ROLES.CUSTOMER, isAnonymous: true };
        return next();
    }

    const payload = verifySessionToken(token);
    if (!payload) {
        req.user = { role: ROLES.CUSTOMER, isAnonymous: true };
        return next();
    }

    req.user = payload;
    next();
};

const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role || ROLES.CUSTOMER;
        if (userRole === ROLES.SUPER_ADMIN) return next();
        if (allowedRoles.includes(userRole)) return next();
        return res.status(403).json({ success: false, error: 'Acesso não autorizado.' });
    };
};

const validateCompanyHeader = (req, res, next) => {
    const rawCompanyId = req.headers['x-company-id'] || req.query.company_id || req.query.companyId || (req.body && (req.body.companyId || req.body.company_id));
    req.companyId = rawCompanyId ? sanitizeString(rawCompanyId, 60) : '';
    next();
};

// ============================================================================
// ROTAS DE API
// ============================================================================
app.get(['/api/health', '/api/status'], generalLimiter, (req, res) => {
    try {
        const companiesCount = readJsonFile(COMPANIES_FILE, []).length;
        const ordersCount = readJsonFile(ORDERS_FILE, []).length;
        const customersCount = readJsonFile(CUSTOMERS_FILE, []).length;
        const leadsCount = readJsonFile(DEMO_LEADS_FILE, []).length;

        res.json({
            status: 'online',
            healthy: true,
            database: {
                localJson: { status: 'active', writable: isDataDirWritable, companies: companiesCount, orders: ordersCount, customers: customersCount, leads: leadsCount },
                supabase: { configured: !!supabase, url: supabaseUrl ? supabaseUrl.replace(/https?:\/\//, '').split('.')[0] + '.supabase.co' : null, mode: supabase ? 'cloud_active' : 'local_and_ready' }
            },
            securityLevel: 'hardened_20_precautions',
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.json({ status: 'online', healthy: true, supabaseConfigured: !!supabase, timestamp: new Date().toISOString() });
    }
});

app.get(['/api/customers', '/api/dev/customers'], generalLimiter, (req, res) => {
    try {
        const customers = readJsonFile(CUSTOMERS_FILE, []);
        const safeCustomers = customers.map(trimCustomerOutput);
        res.json({ success: true, data: safeCustomers, count: safeCustomers.length });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao listar clientes.' });
    }
});

app.get('/api/supabase/status', generalLimiter, (req, res) => {
    res.json({
        configured: !!supabase,
        url: supabaseUrl ? supabaseUrl.replace(/https?:\/\//, '').split('.')[0] + '.supabase.co' : null,
        mode: supabase ? 'supabase_cloud' : 'local_storage_sync'
    });
});

app.get('/api/supabase/config', generalLimiter, (req, res) => {
    try {
        const rawUrl = process.env.SUPABASE_URL || '';
        const cleanUrl = typeof rawUrl === 'string' ? rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '') : '';
        res.json({ supabaseUrl: cleanUrl, supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '' });
    } catch (err) {
        res.json({ supabaseUrl: '', supabaseAnonKey: '' });
    }
});

// ============================================================================
// REALTIME — TRANSMISSÃO DE PEDIDOS
// ============================================================================
const realtimeOrderClients = new Set();

function broadcastRealtimeOrder(eventType, orderData) {
    if (!orderData) return;
    const payload = JSON.stringify({ eventType, data: orderData, timestamp: new Date().toISOString() });

    realtimeOrderClients.forEach(client => {
        try {
            if (client.companyId && orderData.companyId && client.companyId !== orderData.companyId && client.companyId !== 'all') return;
            client.res.write(`data: ${payload}\n\n`);
        } catch (e) {
            realtimeOrderClients.delete(client);
        }
    });

    if (supabase) {
        try {
            const channel = supabase.channel('orders-realtime-broadcast');
            channel.send({ type: 'broadcast', event: 'order_event', payload: { eventType, data: orderData } }).catch(() => {});
        } catch (e) {}
    }
}

app.get('/api/orders/stream', (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        if (typeof res.flushHeaders === 'function') res.flushHeaders();

        const client = { id: Date.now() + Math.random(), res, companyId: req.query.company_id || '' };
        realtimeOrderClients.add(client);

        res.write(`data: ${JSON.stringify({ eventType: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);

        const heartbeat = setInterval(() => {
            try { res.write(`: heartbeat\n\n`); } catch (err) {
                clearInterval(heartbeat);
                realtimeOrderClients.delete(client);
            }
        }, 20000);

        req.on('close', () => {
            clearInterval(heartbeat);
            realtimeOrderClients.delete(client);
        });
    } catch (err) {
        try { res.status(200).json({ success: false, message: 'SSE fallback' }); } catch (e) {}
    }
});

// ============================================================================
// AUTENTICAÇÃO
// ============================================================================
app.post('/api/auth/register', authLimiter, (req, res) => {
    try {
        const { name, phone, password, address, neighborhood, reference } = req.body;
        const cleanPhone = sanitizeString(phone, 30).replace(/\D/g, '');
        const cleanName = sanitizeString(name, 100);

        if (!cleanPhone || cleanPhone.length < 8 || !cleanName || !password) {
            return res.status(400).json({ success: false, error: 'Nome, telefone válido e senha são obrigatórios.' });
        }

        const customers = readJsonFile(CUSTOMERS_FILE, []);
        const exists = customers.some(c => c.phone.replace(/\D/g, '') === cleanPhone);
        if (exists) {
            return res.status(409).json({ success: false, error: 'Este número de telefone já possui cadastro.' });
        }

        const { hash, salt } = hashPassword(password);
        const newCustomer = {
            id: `cust_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            name: cleanName,
            phone: cleanPhone,
            passwordHash: hash,
            salt: salt,
            address: sanitizeString(address, 200),
            neighborhood: sanitizeString(neighborhood, 100),
            reference: sanitizeString(reference, 150),
            created_at: new Date().toISOString()
        };

        customers.push(newCustomer);
        writeJsonFile(CUSTOMERS_FILE, customers);
        saveCustomerToSupabase(newCustomer).catch(e => console.warn('[Supabase Cust]:', e.message));

        const token = generateSessionToken({ role: ROLES.CUSTOMER, customerId: newCustomer.id, phone: newCustomer.phone, name: newCustomer.name });
        res.status(201).json({ success: true, role: ROLES.CUSTOMER, token, customer: trimCustomerOutput(newCustomer) });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao processar cadastro.' });
    }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        const { phone, password } = req.body;
        const cleanPhone = sanitizeString(phone, 30).replace(/\D/g, '');

        if (!cleanPhone || !password) {
            return res.status(400).json({ success: false, error: 'Telefone e senha são obrigatórios.' });
        }

        const customers = readJsonFile(CUSTOMERS_FILE, []);
        let customer = customers.find(c => c.phone.replace(/\D/g, '') === cleanPhone);

        if (!customer && supabase) {
            const { data: remoteCustomer, error: remoteError } = await supabase
                .from('customers').select('*').eq('phone', cleanPhone).maybeSingle();
            if (!remoteError && remoteCustomer) {
                customer = {
                    id: remoteCustomer.id, name: remoteCustomer.name, phone: remoteCustomer.phone,
                    passwordHash: remoteCustomer.password_hash, salt: remoteCustomer.salt,
                    address: remoteCustomer.address || '', neighborhood: remoteCustomer.neighborhood || '',
                    reference: remoteCustomer.reference || '', created_at: remoteCustomer.created_at
                };
            }
        }

        if (!customer) {
            return res.status(401).json({ success: false, error: 'Telefone ou senha inválidos.' });
        }

        const isValid = verifyPassword(password, customer.passwordHash, customer.salt);
        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Telefone ou senha inválidos.' });
        }

        const token = generateSessionToken({ role: ROLES.CUSTOMER, customerId: customer.id, phone: customer.phone, name: customer.name });
        res.json({ success: true, role: ROLES.CUSTOMER, token, customer: trimCustomerOutput(customer) });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao processar login.' });
    }
});

app.post('/api/auth/google-login', authLimiter, async (req, res) => {
    try {
        const { email, name, picture, googleId, phone, address, neighborhood, reference } = req.body;
        const cleanEmail = sanitizeString(email, 120).toLowerCase().trim();
        const cleanName = sanitizeString(name, 100).trim() || (cleanEmail.includes('@') ? cleanEmail.split('@')[0] : 'Usuário Google');
        const cleanGoogleId = sanitizeString(googleId || `google_${cleanEmail}`, 100);

        if (!cleanEmail || !cleanEmail.includes('@')) {
            return res.status(400).json({ success: false, error: 'E-mail do Google inválido.' });
        }

        const customers = readJsonFile(CUSTOMERS_FILE, []);
        let customer = customers.find(c =>
            (c.email && c.email.toLowerCase() === cleanEmail) ||
            (c.googleId && c.googleId === cleanGoogleId)
        );

        if (!customer) {
            customer = {
                id: `cust_google_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
                name: cleanName, email: cleanEmail, googleId: cleanGoogleId,
                picture: sanitizeString(picture, 500) || '', phone: sanitizeString(phone, 30) || cleanEmail,
                address: sanitizeString(address, 200) || '', neighborhood: sanitizeString(neighborhood, 100) || '',
                reference: sanitizeString(reference, 150) || '', provider: 'google',
                created_at: new Date().toISOString()
            };
            customers.push(customer);
        } else {
            customer.name = cleanName || customer.name;
            customer.email = cleanEmail;
            customer.picture = sanitizeString(picture, 500) || customer.picture || '';
            if (address) customer.address = sanitizeString(address, 200);
            if (neighborhood) customer.neighborhood = sanitizeString(neighborhood, 100);
            if (reference) customer.reference = sanitizeString(reference, 150);
            if (phone) customer.phone = sanitizeString(phone, 30);
            customer.updated_at = new Date().toISOString();
        }

        writeJsonFile(CUSTOMERS_FILE, customers);
        saveCustomerToSupabase(customer).catch(e => console.warn('[Supabase G Cust]:', e.message));

        const token = generateSessionToken({ role: ROLES.CUSTOMER, customerId: customer.id, email: customer.email, name: customer.name });
        res.json({ success: true, role: ROLES.CUSTOMER, token, customer: trimCustomerOutput(customer) });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao processar autenticação Google.' });
    }
});

app.post('/api/auth/company-login', authLimiter, async (req, res) => {
    try {
        const { email, identifier, phone, password, companyId } = req.body;
        const rawIdentifier = sanitizeString(identifier || email || phone || '', 100).toLowerCase().trim();
        const cleanPassword = sanitizeString(password, 100);
        const cleanDigits = rawIdentifier.replace(/\D/g, '');

        if (!cleanPassword) {
            return res.status(400).json({ success: false, error: 'Senha é obrigatória.' });
        }

        let companies = readJsonFile(COMPANIES_FILE, []);
        if (supabase) {
            const remoteCompanies = await fetchCompaniesFromSupabase();
            if (Array.isArray(remoteCompanies) && remoteCompanies.length > 0) {
                const companyMap = new Map(companies.filter(c => c && c.id).map(c => [c.id, c]));
                remoteCompanies.forEach(remote => {
                    const local = companyMap.get(remote.id) || {};
                    companyMap.set(remote.id, { ...local, ...remote, adminPassword: remote.adminPassword || local.adminPassword || '' });
                });
                companies = Array.from(companyMap.values());
                writeJsonFile(COMPANIES_FILE, companies);
            }
        }

        let matched = null;

        if (rawIdentifier) {
            matched = companies.find(c => {
                if (!validateCompanyPassword(cleanPassword, c.adminPassword)) return false;
                const cEmail = (c.email || '').toLowerCase().trim();
                const cPhone = (c.phone || c.whatsapp || '').replace(/\D/g, '');
                if (cEmail && cEmail === rawIdentifier) return true;
                if (cleanDigits && cleanDigits.length >= 8 && cPhone) {
                    if (cPhone === cleanDigits || cPhone.endsWith(cleanDigits) || cleanDigits.endsWith(cPhone)) return true;
                }
                return false;
            });
        }

        if (!matched && companyId) {
            matched = companies.find(c => c.id === companyId && validateCompanyPassword(cleanPassword, c.adminPassword));
        }

        if (!matched) {
            matched = companies.find(c => validateCompanyPassword(cleanPassword, c.adminPassword));
        }

        if (!matched) {
            return res.status(401).json({ success: false, error: 'Credenciais da empresa inválidas.' });
        }

        const token = generateSessionToken({ role: ROLES.COMPANY_OWNER, companyId: matched.id, companyName: matched.name, email: matched.email || rawIdentifier });
        res.json({ success: true, role: ROLES.COMPANY_OWNER, token, company: trimCompanyOutput(matched) });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro no login da empresa.' });
    }
});

// ============================================================================
// DEV LOGIN — SEM SENHAS HARDCODED EM PRODUÇÃO
// ============================================================================
app.post('/api/auth/dev-login', authLimiter, (req, res) => {
    try {
        const { password } = req.body;
        const cleanPassword = sanitizeString(password, 100);

        const validPasswords = [];
        if (process.env.DEV_SUPER_ADMIN_PASSWORD) {
            validPasswords.push(process.env.DEV_SUPER_ADMIN_PASSWORD);
        }
        if (NODE_ENV !== 'production') {
            validPasswords.push('admin123');
        }

        if (validPasswords.length === 0) {
            console.warn('[Segurança] Painel Dev bloqueado: DEV_SUPER_ADMIN_PASSWORD não configurado.');
            return res.status(503).json({
                success: false,
                error: 'Painel Dev não configurado. Defina DEV_SUPER_ADMIN_PASSWORD.'
            });
        }

        if (!cleanPassword || !validPasswords.includes(cleanPassword)) {
            console.warn(`[Segurança] Falha de login Dev de IP: ${req.ip}`);
            return res.status(401).json({ success: false, error: 'Senha de desenvolvedor incorreta.' });
        }

        const token = generateSessionToken({ role: ROLES.SUPER_ADMIN, name: 'Super Administrador', permissions: ['*'] });
        res.json({
            success: true,
            role: ROLES.SUPER_ADMIN,
            token,
            user: { role: ROLES.SUPER_ADMIN, name: 'Super Administrador', permissions: ['*'] }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro no login administrativo.' });
    }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json({ success: true, user: req.user });
});

// ============================================================================
// PEDIDOS
// ============================================================================
app.get('/api/orders', orderReadLimiter, validateCompanyHeader, async (req, res) => {
    try {
        const { companyId } = req;
        const customerPhone = sanitizeString(req.query.phone || '', 30).replace(/\D/g, '');
        let allOrders = [];
        try {
            allOrders = readJsonFile(ORDERS_FILE, []);
        } catch (e) {
            allOrders = [];
        }

        let filtered = Array.isArray(allOrders) ? allOrders : [];
        const targetCompanyId = (companyId && companyId !== 'all') ? companyId : 'company-demo-don';

        if (customerPhone) {
            filtered = filtered.filter(o => o && o.customerPhone && o.customerPhone.replace(/\D/g, '') === customerPhone);
        } else {
            filtered = filtered.filter(o =>
                o && (o.companyId === targetCompanyId || (!o.companyId && targetCompanyId === 'company-demo-don'))
            );
        }

        if (supabase && targetCompanyId) {
            try {
                const { data: supaOrders, error } = await supabase
                    .from('orders').select('*').eq('company_id', targetCompanyId).order('created_at', { ascending: false });

                if (!error && Array.isArray(supaOrders) && supaOrders.length > 0) {
                    const map = new Map();
                    supaOrders.forEach(o => { if (o && o.id) map.set(o.id, o); });
                    filtered.forEach(o => { if (o && o.id) map.set(o.id, o); });
                    filtered = Array.from(map.values());
                }
            } catch (supaErr) {
                console.warn('[Segurança] Fallback local:', supaErr.message);
            }
        }

        return res.json({ success: true, data: filtered });
    } catch (err) {
        console.warn('[Orders GET Fallback]:', err.message);
        return res.json({ success: true, data: [], fallback: true });
    }
});

app.post('/api/orders', orderWriteLimiter, validateCompanyHeader, async (req, res) => {
    try {
        const fallbackComp = req.companyId || 'company-demo-don';
        const sanitizedOrder = sanitizeOrderPayload(req.body, fallbackComp);

        if (!sanitizedOrder || !sanitizedOrder.id || sanitizedOrder.items.length === 0) {
            return res.status(400).json({ success: false, error: 'Dados do pedido inválidos ou carrinho vazio.' });
        }

        const allOrders = readJsonFile(ORDERS_FILE, []);
        const existingIdx = allOrders.findIndex(o =>
            String(o.id) === String(sanitizedOrder.id) ||
            String(o.id).replace('#', '') === String(sanitizedOrder.id).replace('#', '')
        );

        if (existingIdx >= 0) {
            allOrders[existingIdx] = { ...allOrders[existingIdx], ...sanitizedOrder, updated_at: new Date().toISOString() };
        } else {
            allOrders.unshift(sanitizedOrder);
        }
        writeJsonFile(ORDERS_FILE, allOrders);

        const typeLabel = sanitizedOrder.isScheduled ? '📅 ENCOMENDA' : '⚡ IMEDIATO';
        console.log(`${typeLabel} [NOVO PEDIDO] ID: ${sanitizedOrder.id} | Loja: ${sanitizedOrder.companyName} | Total: R$ ${sanitizedOrder.total}`);

        saveOrderToSupabase(sanitizedOrder, sanitizedOrder.companyId).catch(e => console.warn('[Supabase Ord]:', e.message));
        broadcastRealtimeOrder('INSERT', sanitizedOrder);

        res.status(201).json({ success: true, data: sanitizedOrder });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao registrar pedido.' });
    }
});

app.patch('/api/orders/:id/status', orderWriteLimiter, validateCompanyHeader, async (req, res) => {
    try {
        const rawId = decodeURIComponent(sanitizeString(req.params.id, 50));
        const rawStatus = sanitizeString(req.body.status, 30);

        if (!['RECEIVED', 'PREPARING', 'DELIVERING', 'COMPLETED', 'CANCELLED'].includes(rawStatus)) {
            return res.status(400).json({ success: false, error: 'Status inválido.' });
        }

        const allOrders = readJsonFile(ORDERS_FILE, []);
        let order = allOrders.find(o =>
            String(o.id) === String(rawId) || String(o.id).replace('#', '') === String(rawId).replace('#', '')
        );

        if (order) {
            order.status = rawStatus;
            order.updated_at = new Date().toISOString();
            writeJsonFile(ORDERS_FILE, allOrders);
        } else {
            order = {
                id: rawId.startsWith('#') ? rawId : `#${rawId}`,
                companyId: req.companyId || 'company-demo-don',
                status: rawStatus,
                updated_at: new Date().toISOString()
            };
            allOrders.unshift(order);
            writeJsonFile(ORDERS_FILE, allOrders);
        }

        if (supabase) {
            try {
                await supabase.from('orders').update({ status: rawStatus, updated_at: new Date().toISOString() }).eq('id', order.id);
            } catch (supaErr) {
                console.warn('[Segurança] Falha status Supabase:', supaErr.message);
            }
        }

        broadcastRealtimeOrder('UPDATE', order);
        console.log(`🔄 [STATUS] Pedido: ${order.id} ➔ ${rawStatus}`);
        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao atualizar status.' });
    }
});

app.delete('/api/orders/:id', orderWriteLimiter, validateCompanyHeader, async (req, res) => {
    try {
        const rawId = decodeURIComponent(sanitizeString(req.params.id, 50));
        let allOrders = readJsonFile(ORDERS_FILE, []);
        allOrders = allOrders.filter(o =>
            String(o.id) !== String(rawId) && String(o.id).replace('#', '') !== String(rawId).replace('#', '')
        );
        writeJsonFile(ORDERS_FILE, allOrders);

        if (supabase) {
            try {
                await supabase.from('orders').delete().eq('id', rawId);
            } catch (supaErr) {
                console.warn('[Segurança] Falha excluir Supabase:', supaErr.message);
            }
        }

        broadcastRealtimeOrder('DELETE', { id: rawId });
        res.json({ success: true, message: 'Pedido excluído com sucesso.' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao excluir pedido.' });
    }
});

// ============================================================================
// EMPRESAS
// ============================================================================
app.get('/api/companies', generalLimiter, async (req, res) => {
    try {
        let companies = readJsonFile(COMPANIES_FILE, []);

        if (supabase) {
            try {
                const remoteCompanies = await fetchCompaniesFromSupabase();
                if (Array.isArray(remoteCompanies) && remoteCompanies.length > 0) {
                    companies = remoteCompanies;
                    writeJsonFile(COMPANIES_FILE, companies);
                }
            } catch (supaErr) {
                console.warn('[Supabase Companies Fallback]:', supaErr.message);
            }
        }

        const safeCompanies = companies.map(trimCompanyOutput);
        res.json({ success: true, data: safeCompanies, source: supabase ? 'supabase_remote' : 'server_database' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao listar empresas.' });
    }
});

app.get(['/api/companies/lookup', '/api/company/lookup', '/api/company/:identifier', '/api/companies/:identifier'], generalLimiter, async (req, res) => {
    try {
        const query = req.query.q || req.query.empresa || req.query.loja || req.query.slug || req.params.identifier || '';
        const cleanQuery = sanitizeSlug(query).toLowerCase();
        const rawLower = String(query).toLowerCase().trim();
        let companies = readJsonFile(COMPANIES_FILE, []);

        if (supabase) {
            try {
                const remoteCompanies = await fetchCompaniesFromSupabase();
                if (Array.isArray(remoteCompanies) && remoteCompanies.length > 0) {
                    companies = remoteCompanies;
                    writeJsonFile(COMPANIES_FILE, companies);
                }
            } catch (e) {}
        }

        if (!cleanQuery || cleanQuery === 'demo' || rawLower === 'demo' || cleanQuery === 'donfood' || rawLower === 'don food') {
            const demo = companies.find(c => c && (c.id === 'company-demo-don' || c.slug === 'demo'));
            return res.json({ success: true, data: demo ? trimCompanyOutput(demo) : null });
        }

        let found = companies.find(c => {
            if (!c) return false;
            const cSlug = sanitizeSlug(c.slug || '').toLowerCase();
            return cSlug === cleanQuery || cSlug === rawLower;
        });

        if (!found) {
            found = companies.find(c => {
                if (!c) return false;
                const cId = (c.id || '').toLowerCase();
                return cId === rawLower || cId === cleanQuery;
            });
        }

        if (!found) {
            found = companies.find(c => {
                if (!c) return false;
                const cPreset = (c.presetType || '').toLowerCase().trim();
                const aliases = Array.isArray(c.aliases) ? c.aliases.map(a => sanitizeSlug(a).toLowerCase()) : [];
                return cPreset === cleanQuery || cPreset === rawLower || aliases.includes(cleanQuery) || aliases.includes(rawLower);
            });
        }

        if (!found) {
            found = companies.find(c => {
                if (!c) return false;
                const cNameSlug = sanitizeSlug(c.name || '').toLowerCase();
                const cNameRaw = (c.name || '').toLowerCase().trim();
                return cNameSlug === cleanQuery || cNameRaw === rawLower;
            });
        }

        if (!found && cleanQuery.length >= 3) {
            found = companies.find(c => {
                if (!c) return false;
                const cSlug = sanitizeSlug(c.slug || '').toLowerCase();
                const cNameSlug = sanitizeSlug(c.name || '').toLowerCase();
                return (cSlug && (cSlug.includes(cleanQuery) || (cSlug.length >= 3 && cleanQuery.includes(cSlug)))) ||
                       (cNameSlug && (cNameSlug.includes(cleanQuery) || (cNameSlug.length >= 3 && cleanQuery.includes(cNameSlug))));
            });
        }

        if (found) {
            return res.json({ success: true, data: trimCompanyOutput(found) });
        }

        res.status(404).json({ success: false, error: 'Empresa não encontrada.' });
    } catch (err) {
        console.error('[LOOKUP ERROR]:', err);
        res.status(500).json({ success: false, error: 'Erro ao buscar empresa: ' + err.message });
    }
});

app.post('/api/companies', generalLimiter, async (req, res) => {
    try {
        const { companies, company } = req.body;
        let existing = readJsonFile(COMPANIES_FILE, []);
        const compMap = new Map();
        existing.forEach(c => { if (c && c.id) compMap.set(c.id, c); });

        if (Array.isArray(companies)) {
            for (const c of companies) {
                if (c && c.id) {
                    const prev = compMap.get(c.id) || {};
                    // Hash password before saving locally
                    const companyWithHashedPwd = hashCompanyPasswordInObject({ ...prev, ...c });
                    compMap.set(c.id, companyWithHashedPwd);
                    await saveCompanyToSupabase(c);
                }
            }
            const merged = Array.from(compMap.values());
            writeJsonFile(COMPANIES_FILE, merged);
            return res.json({ success: true, count: merged.length });
        } else if (company && company.id) {
            const prev = compMap.get(company.id) || {};
            // Hash password before saving locally
            const companyWithHashedPwd = hashCompanyPasswordInObject({ ...prev, ...company });
            compMap.set(company.id, companyWithHashedPwd);
            const merged = Array.from(compMap.values());
            writeJsonFile(COMPANIES_FILE, merged);
            await saveCompanyToSupabase(company);
            return res.json({ success: true, company });
        }
        res.status(400).json({ success: false, error: 'Formato inválido.' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao salvar empresas.' });
    }
});

app.post('/api/companies/upsert', generalLimiter, async (req, res) => {
    try {
        const { company, companies } = req.body;
        let existing = readJsonFile(COMPANIES_FILE, []);
        const compMap = new Map();
        existing.forEach(c => { if (c && c.id) compMap.set(c.id, c); });

        if (Array.isArray(companies)) {
            for (const c of companies) {
                if (c && c.id) {
                    const prev = compMap.get(c.id) || {};
                    // Hash password before saving locally
                    const companyWithHashedPwd = hashCompanyPasswordInObject({ ...prev, ...c });
                    compMap.set(c.id, companyWithHashedPwd);
                    await saveCompanyToSupabase(c);
                }
            }
        }
        if (company && company.id) {
            const prev = compMap.get(company.id) || {};
            // Hash password before saving locally
            const companyWithHashedPwd = hashCompanyPasswordInObject({ ...prev, ...company });
            compMap.set(company.id, companyWithHashedPwd);
            await saveCompanyToSupabase(company);
        }
        const merged = Array.from(compMap.values());
        await deleteRemoteCompaniesMissingFrom(merged);
        writeJsonFile(COMPANIES_FILE, merged);
        res.json({ success: true, count: merged.length, message: 'Sincronizado.' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao persistir empresa.' });
    }
});

app.post('/api/companies/delete', generalLimiter, async (req, res) => {
    try {
        const { companyId } = req.body;
        if (!companyId || companyId === 'company-demo-don') {
            return res.status(400).json({ success: false, error: 'ID inválido ou empresa demo protegida.' });
        }
        let existing = readJsonFile(COMPANIES_FILE, []);
        existing = existing.filter(c => c.id !== companyId);
        writeJsonFile(COMPANIES_FILE, existing);
        if (supabase) await deleteCompanyFromSupabase(companyId);
        res.json({ success: true, message: 'Empresa excluída.' });
    } catch (err) {
        console.error('[Companies Delete]:', err.message);
        res.status(500).json({ success: false, error: 'Erro ao excluir empresa.' });
    }
});

app.post('/api/supabase/sync-company', generalLimiter, authenticateToken, validateCompanyHeader, requireRole(ROLES.COMPANY_OWNER, ROLES.SUPER_ADMIN), async (req, res) => {
    const { companyId } = req;
    const { company, settings, products, orders } = req.body;

    try {
        if (Array.isArray(orders) && orders.length > 0) {
            const sanitizedOrders = orders.map(o => sanitizeOrderPayload(o, companyId)).filter(Boolean);
            const allOrders = readJsonFile(ORDERS_FILE, []);
            const map = new Map();
            allOrders.forEach(o => map.set(o.id, o));
            sanitizedOrders.forEach(o => map.set(o.id, o));
            writeJsonFile(ORDERS_FILE, Array.from(map.values()));
        }

        if (supabase) {
            if (company) await supabase.from('companies').upsert([{ ...company, id: companyId }]);
            if (settings) await supabase.from('company_settings').upsert([{ ...settings, company_id: companyId }]);
            if (Array.isArray(products) && products.length > 0) {
                await supabase.from('products').upsert(products.map(p => ({ ...p, company_id: companyId })));
            }
            if (Array.isArray(orders) && orders.length > 0) {
                await supabase.from('orders').upsert(orders.map(o => ({ ...o, company_id: companyId })));
            }
        }

        res.json({ success: true, message: `Dados da empresa ${companyId} sincronizados.` });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Falha na sincronização.' });
    }
});

// ============================================================================
// LEADS E TESTE GRÁTIS
// ============================================================================
app.post('/api/demo/unlock', generalLimiter, (req, res) => {
    try {
        const { phone, name, storeSlug, source } = req.body || {};
        const cleanPhone = (phone || '').replace(/\D/g, '');

        if (!cleanPhone || cleanPhone.length < 8) {
            return res.status(400).json({ success: false, error: 'Telefone válido é obrigatório.' });
        }

        const cleanName = sanitizeString(name || 'Interessado Demo', 100);
        const leads = readJsonFile(DEMO_LEADS_FILE, []);
        const now = Date.now();
        const trialExpiresAt = now + 24 * 60 * 60 * 1000;

        const existingIndex = leads.findIndex(l => (l.phone || '').replace(/\D/g, '') === cleanPhone);
        let savedLead;

        if (existingIndex >= 0) {
            savedLead = {
                ...leads[existingIndex],
                name: cleanName !== 'Interessado Demo' ? cleanName : leads[existingIndex].name,
                updatedAt: new Date().toISOString(),
                trialExpiresAt: trialExpiresAt,
                unlockCount: (leads[existingIndex].unlockCount || 1) + 1,
                lastSource: sanitizeString(source || 'store-demo', 50)
            };
            leads[existingIndex] = savedLead;
        } else {
            savedLead = {
                id: `lead_${now}_${Math.random().toString(36).substring(2, 7)}`,
                phone: phone.trim(), cleanPhone: cleanPhone, name: cleanName,
                createdAt: new Date().toISOString(), trialExpiresAt: trialExpiresAt,
                storeSlug: sanitizeString(storeSlug || 'demo', 50),
                source: sanitizeString(source || 'store-demo', 50),
                unlockCount: 1, status: 'ACTIVE_TRIAL'
            };
            leads.unshift(savedLead);
        }

        writeJsonFile(DEMO_LEADS_FILE, leads);
        res.json({ success: true, message: 'Acesso liberado!', lead: savedLead, trialExpiresAt });
    } catch (err) {
        console.error('Erro lead:', err.message);
        res.status(500).json({ success: false, error: 'Erro ao processar.' });
    }
});

app.get('/api/dev/leads', generalLimiter, authenticateToken, requireRole(ROLES.SUPER_ADMIN), (req, res) => {
    try {
        const leads = readJsonFile(DEMO_LEADS_FILE, []);
        const now = Date.now();
        const formattedLeads = leads.map(l => ({
            ...l,
            isTrialActive: l.trialExpiresAt ? (l.trialExpiresAt > now) : false,
            remainingHours: l.trialExpiresAt ? Math.max(0, Math.round((l.trialExpiresAt - now) / 3600000)) : 0
        }));
        res.json({ success: true, data: formattedLeads, total: formattedLeads.length });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao listar leads.' });
    }
});

app.delete('/api/dev/leads/:id', generalLimiter, authenticateToken, requireRole(ROLES.SUPER_ADMIN), (req, res) => {
    try {
        const { id } = req.params;
        const leads = readJsonFile(DEMO_LEADS_FILE, []);
        const filtered = leads.filter(l => l.id !== id && l.cleanPhone !== id);
        writeJsonFile(DEMO_LEADS_FILE, filtered);
        res.json({ success: true, message: 'Lead removido.', remaining: filtered.length });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao excluir.' });
    }
});

app.get('/api/dev/supabase-schema', generalLimiter, authenticateToken, requireRole(ROLES.SUPER_ADMIN), (req, res) => {
    try {
        const schemaPath = path.join(__dirname, 'supabase_schema.sql');
        if (fs.existsSync(schemaPath)) {
            res.setHeader('Content-Type', 'application/sql');
            res.setHeader('Content-Disposition', 'attachment; filename="supabase_schema.sql"');
            return res.sendFile(schemaPath);
        }
        res.status(404).json({ success: false, error: 'Arquivo não encontrado.' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao obter schema.' });
    }
});

// ============================================================================
// GOOGLE OAUTH
// ============================================================================
app.get('/api/auth/google/config', (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || '';
    res.json({ hasGoogleAuth: Boolean(clientId), clientId: clientId || null, callbackUrl: `${req.protocol}://${req.get('host')}/auth/google/callback` });
});

app.get('/api/auth/google/url', (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || '';
    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const redirectUri = `${protocol}://${host}/auth/google/callback`;

    if (!clientId) {
        return res.json({ configured: false, message: 'GOOGLE_CLIENT_ID não configurado.', redirectUri });
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'select_account'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    res.json({ configured: true, url: authUrl, redirectUri });
});

app.get(['/auth/callback', '/auth/callback/', '/auth/google/callback', '/auth/google/callback/'], async (req, res) => {
    const { code, error } = req.query;
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;
    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const redirectUri = `${protocol}://${host}/auth/google/callback`;

    if (error) {
        return res.send(`<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:3rem;"><h3 style="color:#DC2626;">Cancelado</h3><p>${error}</p><script>if(window.opener){window.opener.postMessage({type:'OAUTH_AUTH_ERROR',error:'${error}'},'*');setTimeout(()=>window.close(),1500);}</script></body></html>`);
    }

    let userData = null;

    if (code && clientId && clientSecret) {
        try {
            const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' })
            });
            const tokenData = await tokenRes.json();
            if (tokenData.access_token) {
                const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${tokenData.access_token}` } });
                userData = await userRes.json();
            }
        } catch (err) { console.error('Erro Google OAuth:', err); }
    }

    const payload = userData ? {
        email: userData.email, name: userData.name || userData.given_name || 'Usuário Google',
        picture: userData.picture || '', googleId: userData.sub, provider: 'google'
    } : { email: req.query.email || 'usuario.google@gmail.com', name: 'Usuário Google', provider: 'google' };

    res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Autenticado</title><style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#F8FAFC;}.card{background:white;padding:2rem;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.08);text-align:center;}</style></head><body><div class="card"><h3>Conectando...</h3><p style="color:#64748B;">Fechando automaticamente.</p></div><script>const payload=${JSON.stringify(payload)};if(window.opener){window.opener.postMessage({type:'OAUTH_AUTH_SUCCESS',provider:'google',user:payload},'*');setTimeout(()=>window.close(),600);}else{window.location.href='/';}</script></body></html>`);
});

// ============================================================================
// ARQUIVOS ESTÁTICOS
// ============================================================================
app.get('/styles.css', (req, res) => {
    res.type('text/css');
    const localPath = path.join(__dirname, 'styles.css');
    if (fs.existsSync(localPath)) return res.sendFile(localPath);
    const pubPath = path.join(__dirname, 'public', 'styles.css');
    if (fs.existsSync(pubPath)) return res.sendFile(pubPath);
    res.send('/* styles.css */');
});

app.get(['/laydate.css', '/layer.css', '/code.css'], (req, res) => {
    res.type('text/css').send('/* Browser Extension Safe Stub */');
});

app.get('/favicon.ico', (req, res) => {
    const favPath = path.join(__dirname, 'favicon.ico');
    if (fs.existsSync(favPath)) { res.type('image/x-icon'); return res.sendFile(favPath); }
    const pubFav = path.join(__dirname, 'public', 'favicon.ico');
    if (fs.existsSync(pubFav)) { res.type('image/x-icon'); return res.sendFile(pubFav); }
    res.status(204).end();
});

app.use((req, res, next) => {
    const rawPath = (req.path || '').toLowerCase();
    const isRestricted =
        rawPath.startsWith('/data') ||
        rawPath.startsWith('/test') ||
        rawPath.startsWith('/node_modules') ||
        rawPath === '/server.js' ||
        rawPath === '/package.json' ||
        rawPath === '/package-lock.json' ||
        rawPath === '/bun.lock' ||
        rawPath === '/supabase_schema.sql' ||
        rawPath === '/metadata.json' ||
        rawPath === '/.env' ||
        rawPath === '/.env.example' ||
        rawPath.endsWith('.json') ||
        rawPath.endsWith('.sql') ||
        rawPath.endsWith('.env');

    if (isRestricted) {
        return res.status(403).json({ success: false, error: 'Acesso negado.' });
    }
    next();
});

app.get(['/dev', '/dev/*'], (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(__dirname, {
    maxAge: 0,
    etag: false,
    setHeaders: (res, path) => {
        if (path.endsWith('.html') || path.endsWith('.js') || path.endsWith('.css')) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    }
}));

app.get('*', (req, res) => {
    try {
        let empresaParam = req.query.empresa || req.query.loja || req.query.slug || req.query.c;

        if (!empresaParam && req.path && req.path !== '/' && !req.path.startsWith('/api/') && !req.path.includes('.')) {
            const pathParts = req.path.split('/').filter(Boolean);
            if (pathParts.length === 1 && pathParts[0] !== 'dev' && pathParts[0] !== 'admin' && pathParts[0] !== 'login') {
                empresaParam = pathParts[0];
            } else if (pathParts.length === 2 && pathParts[0] === 'loja') {
                empresaParam = pathParts[1];
            }
        }

        if (empresaParam && typeof empresaParam === 'string' && empresaParam.trim()) {
            const cleanSlug = encodeURIComponent(empresaParam.trim().toLowerCase());
            res.setHeader('Set-Cookie', [
                `donfood_company_slug=${cleanSlug}; Path=/; Max-Age=31536000; SameSite=Lax`,
                `donfood_last_access=${encodeURIComponent(new Date().toISOString())}; Path=/; Max-Age=31536000; SameSite=Lax`
            ]);
        }
    } catch(e) {}
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((err, req, res, next) => {
    console.error('[Erro não tratado]:', err.message);
    res.status(500).json({ success: false, error: 'Erro interno seguro.' });
});

if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Servidor Don Food ativo na porta ${PORT}`);
        console.log(`🛡️  20 Precauções de Segurança e Estabilidade implementadas.`);
    });
}

export default app;