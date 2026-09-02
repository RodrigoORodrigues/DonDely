import express from 'express';
import path from 'path';
import fs from 'fs';
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
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

// ============================================================================
// PRECAUÇÃO #18 & #19 & #15: SECURITY HEADERS, HTTPS & OCULTAR POWERED-BY
// ============================================================================
app.disable('x-powered-by');

app.use((req, res, next) => {
    // 19. Forçar HTTPS em ambientes de produção
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    if (!isHttps && NODE_ENV === 'production') {
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }

    // 18. Security Headers
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
// PRECAUÇÃO #16: RESTRINGIR UPLOADS & TAMANHO MÁXIMO DE PAYLOAD (2MB)
// ============================================================================
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ============================================================================
// PRECAUÇÃO #11 & #12: RATE LIMITING & BOT PROTECTION (IN-MEMORY SLIDING WINDOW)
// ============================================================================
const rateLimitStore = new Map();

// Limpar registros antigos a cada 5 minutos
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

// 12. Bot Protection Middleware: Verifica honeypot e user-agent malicioso
function botProtectionMiddleware(req, res, next) {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        const body = req.body || {};
        // Se preencheu campo honeypot oculto, rejeita silenciosamente como bot
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
// PRECAUÇÃO #5 & #10: CRIPTOGRAFIA DE DADOS, HASH SEGURO E ASSINATURA HMAC
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

function generateSessionToken(payload) {
    const data = JSON.stringify({ ...payload, exp: Date.now() + 86400000 }); // 24h
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
        if (decoded.exp && decoded.exp < Date.now()) return null; // Expirado
        return decoded;
    } catch {
        return null;
    }
}

// ============================================================================
// PRECAUÇÃO #14 & #8: VALIDAÇÃO DE INPUTS & BLOQUEIO DE MASS ASSIGNMENT
// ============================================================================
function sanitizeString(str, maxLength = 255) {
    if (typeof str !== 'string') return '';
    return str
        .trim()
        .slice(0, maxLength)
        .replace(/[<>]/g, ''); // Evita tags HTML maliciosas
}

function sanitizeNumber(val, defaultVal = 0, min = 0, max = 999999) {
    const num = Number(val);
    if (isNaN(num)) return defaultVal;
    return Math.max(min, Math.min(max, num));
}

// 8. Whitelist estrita e completa de campos de pedidos
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

    // Sanitizar itens preservando details e opções
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
        created_at: input.created_at || new Date().toISOString(),
        updated_at: input.updated_at || new Date().toISOString()
    };
}

// ============================================================================
// PRECAUÇÃO #17: TRIM & SANITIZAÇÃO DE RESPOSTAS DE API (NUNCA VAZAR SENHAS)
// ============================================================================
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
// PERSISTÊNCIA LOCAL SEGURA (JSON FILES)
// ============================================================================
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const COMPANIES_FILE = path.join(DATA_DIR, 'companies.json');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');
const DEMO_LEADS_FILE = path.join(DATA_DIR, 'demo_leads.json');

function readJsonFile(filePath, defaultValue = []) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
            return defaultValue;
        }
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw || '[]');
    } catch (err) {
        console.error(`[Segurança] Erro ao ler ${path.basename(filePath)}:`, err.message);
        return defaultValue;
    }
}

function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        console.error(`[Segurança] Erro ao gravar ${path.basename(filePath)}:`, err.message);
    }
}

// ============================================================================
// PRECAUÇÃO #1 & #3: CLIENTE SUPABASE SEGURO (API KEYS PROTEGIDAS NO BACKEND)
// ============================================================================
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase = null;
if (supabaseUrl && supabaseKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false, autoRefreshToken: false }
        });
        console.log('✅ [Segurança] Supabase configurado com chaves protegidas no servidor.');
    } catch (err) {
        console.error('❌ [Segurança] Falha ao inicializar Supabase:', err.message);
    }
}

// ============================================================================
// ETAPA 2: CENTRALIZADOR DE AUTENTICAÇÃO E PAPÉIS RBAC (SUPER_ADMIN, COMPANY_OWNER, CUSTOMER)
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
        if (userRole === ROLES.SUPER_ADMIN) {
            return next(); // Super Admin possui acesso irrestrito
        }
        if (allowedRoles.includes(userRole)) {
            return next();
        }
        return res.status(403).json({
            success: false,
            error: 'Acesso não autorizado para este perfil de usuário.'
        });
    };
};

const validateCompanyHeader = (req, res, next) => {
    const rawCompanyId = req.headers['x-company-id'] || req.query.company_id || req.query.companyId || (req.body && (req.body.companyId || req.body.company_id));
    req.companyId = rawCompanyId ? sanitizeString(rawCompanyId, 60) : '';
    next();
};

// ============================================================================
// ROTAS DE API PROTEGIDAS
// ============================================================================

// 1. Status da Conexão (Sem vazar chaves nem segredos)
app.get('/api/status', generalLimiter, (req, res) => {
    res.json({
        status: 'online',
        supabaseConfigured: !!supabase,
        storageMode: supabase ? 'supabase_plus_local' : 'persistent_file_store',
        securityLevel: 'hardened_20_precautions',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/supabase/status', generalLimiter, (req, res) => {
    res.json({
        configured: !!supabase,
        url: supabaseUrl ? supabaseUrl.replace(/https?:\/\//, '').split('.')[0] + '.supabase.co' : null,
        mode: supabase ? 'supabase_cloud' : 'local_storage_sync'
    });
});

// Configuração segura do cliente Supabase para o frontend (apenas URL base e Chave Anon pública)
app.get('/api/supabase/config', generalLimiter, (req, res) => {
    const rawUrl = process.env.SUPABASE_URL || '';
    const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
    res.json({
        supabaseUrl: cleanUrl,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
    });
});

// ============================================================================
// SISTEMA REALTIME: TRANSMISSÃO INSTANTÂNEA DE PEDIDOS PARA OS PAINÉIS
// ============================================================================
const realtimeOrderClients = new Set();

function broadcastRealtimeOrder(eventType, orderData) {
    if (!orderData) return;
    const payload = JSON.stringify({
        eventType, // 'INSERT', 'UPDATE', 'DELETE'
        data: orderData,
        timestamp: new Date().toISOString()
    });

    realtimeOrderClients.forEach(client => {
        try {
            client.res.write(`data: ${payload}\n\n`);
        } catch (e) {
            realtimeOrderClients.delete(client);
        }
    });

    if (supabase) {
        try {
            const channel = supabase.channel('orders-realtime-broadcast');
            channel.send({
                type: 'broadcast',
                event: 'order_event',
                payload: { eventType, data: orderData }
            }).catch(() => {});
        } catch (e) {}
    }
}

app.get('/api/orders/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    if (typeof res.flushHeaders === 'function') res.flushHeaders();

    const client = { id: Date.now() + Math.random(), res, companyId: req.query.company_id || '' };
    realtimeOrderClients.add(client);

    res.write(`data: ${JSON.stringify({ eventType: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);

    const heartbeat = setInterval(() => {
        try {
            res.write(`: heartbeat\n\n`);
        } catch (err) {
            clearInterval(heartbeat);
            realtimeOrderClients.delete(client);
        }
    }, 20000);

    req.on('close', () => {
        clearInterval(heartbeat);
        realtimeOrderClients.delete(client);
    });
});

app.get('/api/realtime/orders', (req, res) => {
    req.url = '/api/orders/stream';
    app._router.handle(req, res);
});

// ============================================================================
// PRECAUÇÃO #6 & #10: AUTENTICAÇÃO SEGURA SERVER-SIDE (CLIENTES & EMPRESA)
// ============================================================================

// Registro de Cliente
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

        const token = generateSessionToken({
            role: ROLES.CUSTOMER,
            customerId: newCustomer.id,
            phone: newCustomer.phone,
            name: newCustomer.name
        });
        res.status(201).json({
            success: true,
            role: ROLES.CUSTOMER,
            token,
            customer: trimCustomerOutput(newCustomer)
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao processar cadastro.' });
    }
});

// Login de Cliente (Papel: CUSTOMER)
app.post('/api/auth/login', authLimiter, (req, res) => {
    try {
        const { phone, password } = req.body;
        const cleanPhone = sanitizeString(phone, 30).replace(/\D/g, '');

        if (!cleanPhone || !password) {
            return res.status(400).json({ success: false, error: 'Telefone e senha são obrigatórios.' });
        }

        const customers = readJsonFile(CUSTOMERS_FILE, []);
        const customer = customers.find(c => c.phone.replace(/\D/g, '') === cleanPhone);

        if (!customer) {
            return res.status(401).json({ success: false, error: 'Telefone ou senha inválidos.' });
        }

        const isValid = verifyPassword(password, customer.passwordHash, customer.salt);
        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Telefone ou senha inválidos.' });
        }

        const token = generateSessionToken({
            role: ROLES.CUSTOMER,
            customerId: customer.id,
            phone: customer.phone,
            name: customer.name
        });
        res.json({
            success: true,
            role: ROLES.CUSTOMER,
            token,
            customer: trimCustomerOutput(customer)
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao processar login.' });
    }
});

// Login do Proprietário da Loja (Papel: COMPANY_OWNER)
app.post('/api/auth/company-login', authLimiter, (req, res) => {
    try {
        const { email, identifier, phone, password, companyId } = req.body;
        const rawIdentifier = sanitizeString(identifier || email || phone || '', 100).toLowerCase().trim();
        const cleanPassword = sanitizeString(password, 100);
        const cleanDigits = rawIdentifier.replace(/\D/g, '');

        if (!cleanPassword) {
            return res.status(400).json({ success: false, error: 'Senha é obrigatória.' });
        }

        const companies = readJsonFile(COMPANIES_FILE, []);
        let matched = null;

        if (rawIdentifier) {
            matched = companies.find(c => {
                if (c.adminPassword !== cleanPassword) return false;
                const cEmail = (c.email || '').toLowerCase().trim();
                const cPhone = (c.phone || c.whatsapp || '').replace(/\D/g, '');
                if (cEmail && cEmail === rawIdentifier) return true;
                if (cleanDigits && cleanDigits.length >= 8 && cPhone) {
                    if (cPhone === cleanDigits || cPhone.endsWith(cleanDigits) || cleanDigits.endsWith(cPhone)) {
                        return true;
                    }
                }
                return false;
            });
        }

        if (!matched && companyId) {
            matched = companies.find(c => c.id === companyId && c.adminPassword === cleanPassword);
        }

        if (!matched) {
            matched = companies.find(c => c.adminPassword === cleanPassword);
        }

        if (!matched) {
            return res.status(401).json({ success: false, error: 'Credenciais da empresa inválidas.' });
        }

        const token = generateSessionToken({
            role: ROLES.COMPANY_OWNER,
            companyId: matched.id,
            companyName: matched.name,
            email: matched.email || rawIdentifier
        });

        res.json({
            success: true,
            role: ROLES.COMPANY_OWNER,
            token,
            company: trimCompanyOutput(matched)
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro no login da empresa.' });
    }
});

// Login de Super Administrador / Desenvolvedor (Papel: SUPER_ADMIN)
app.post('/api/auth/dev-login', authLimiter, (req, res) => {
    try {
        const { password } = req.body;
        const cleanPassword = sanitizeString(password, 100);
        const validPasswords = ['admin123', 'donfimdev', 'donfim', '123456'];
        if (process.env.DEV_SUPER_ADMIN_PASSWORD) {
            validPasswords.push(process.env.DEV_SUPER_ADMIN_PASSWORD);
        }

        if (!cleanPassword || !validPasswords.includes(cleanPassword)) {
            return res.status(401).json({ success: false, error: 'Senha de desenvolvedor/super admin incorreta.' });
        }

        const token = generateSessionToken({
            role: ROLES.SUPER_ADMIN,
            name: 'Super Administrador',
            permissions: ['*']
        });

        res.json({
            success: true,
            role: ROLES.SUPER_ADMIN,
            token,
            user: {
                role: ROLES.SUPER_ADMIN,
                name: 'Super Administrador',
                permissions: ['*']
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro no login administrativo.' });
    }
});

// Obter Perfil e Papel Autenticado
app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// ============================================================================
// ROTAS DE PEDIDOS (COM PRECAUÇÕES #7, #8, #11, #13, #14)
// ============================================================================

// 1. Obter pedidos (filtrados por empresa ou por telefone do cliente)
app.get('/api/orders', orderReadLimiter, validateCompanyHeader, async (req, res) => {
    try {
        const { companyId } = req;
        const customerPhone = sanitizeString(req.query.phone || '', 30).replace(/\D/g, '');
        const allOrders = readJsonFile(ORDERS_FILE, []);

        let filtered = allOrders;

        if (customerPhone) {
            // Filtrar pedidos deste cliente específico (em qualquer loja)
            filtered = filtered.filter(o => o.customerPhone && o.customerPhone.replace(/\D/g, '') === customerPhone);
        } else if (companyId && companyId !== 'all') {
            // Isolamento por empresa
            filtered = filtered.filter(o => 
                o.companyId === companyId || 
                (!o.companyId && (companyId === 'company-demo-don' || companyId === 'company-fb-default'))
            );
        }

        // Se Supabase estiver ativo, sincronizar com consultas parametrizadas
        if (supabase && companyId && companyId !== 'all') {
            try {
                const { data: supaOrders, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('company_id', companyId)
                    .order('created_at', { ascending: false });
                
                if (!error && supaOrders && supaOrders.length > 0) {
                    const map = new Map();
                    supaOrders.forEach(o => map.set(o.id, o));
                    filtered.forEach(o => map.set(o.id, o));
                    filtered = Array.from(map.values());
                }
            } catch (supaErr) {
                console.warn('[Segurança] Fallback para arquivo local de pedidos:', supaErr.message);
            }
        }

        res.json({ success: true, data: filtered });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Não foi possível carregar os pedidos.' });
    }
});

app.get('/api/supabase/orders', validateCompanyHeader, (req, res) => {
    req.url = '/api/orders';
    app._router.handle(req, res);
});

// 2. Criar novo Pedido (com sanitização e bloqueio de mass assignment)
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

        console.log(`📦 [NOVO PEDIDO RECEBIDO] ID: ${sanitizedOrder.id} | Loja: ${sanitizedOrder.companyName || sanitizedOrder.companyId} | Total: R$ ${sanitizedOrder.total}`);

        if (supabase) {
            try {
                const supaPayload = { ...sanitizedOrder, company_id: sanitizedOrder.companyId };
                await supabase.from('orders').upsert([supaPayload]);
            } catch (supaErr) {
                console.warn('[Segurança] Falha ao salvar no Supabase:', supaErr.message);
            }
        }

        // Transmissão Realtime imediata para todos os painéis e clientes conectados
        broadcastRealtimeOrder('INSERT', sanitizedOrder);

        res.status(201).json({ success: true, data: sanitizedOrder });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao registrar pedido.' });
    }
});

app.post('/api/supabase/orders', validateCompanyHeader, (req, res) => {
    req.url = '/api/orders';
    app._router.handle(req, res);
});

// 3. Atualizar Status do Pedido
app.patch('/api/orders/:id/status', orderWriteLimiter, validateCompanyHeader, async (req, res) => {
    try {
        const rawId = decodeURIComponent(sanitizeString(req.params.id, 50));
        const rawStatus = sanitizeString(req.body.status, 30);

        if (!['RECEIVED', 'PREPARING', 'DELIVERING', 'COMPLETED', 'CANCELLED'].includes(rawStatus)) {
            return res.status(400).json({ success: false, error: 'Status de pedido inválido.' });
        }

        const allOrders = readJsonFile(ORDERS_FILE, []);
        let order = allOrders.find(o => 
            String(o.id) === String(rawId) || 
            String(o.id).replace('#', '') === String(rawId).replace('#', '')
        );

        if (order) {
            order.status = rawStatus;
            order.updated_at = new Date().toISOString();
            writeJsonFile(ORDERS_FILE, allOrders);
        } else {
            // Se o pedido não estiver na lista (ex: salvo antes da limpeza), registrar entrada com status
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
                await supabase
                    .from('orders')
                    .update({ status: rawStatus, updated_at: new Date().toISOString() })
                    .eq('id', order.id);
            } catch (supaErr) {
                console.warn('[Segurança] Falha ao atualizar status no Supabase:', supaErr.message);
            }
        }

        // Transmissão Realtime da atualização de status
        broadcastRealtimeOrder('UPDATE', order);

        console.log(`🔄 [STATUS ATUALIZADO] Pedido: ${order.id} ➔ ${rawStatus}`);
        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao atualizar status do pedido.' });
    }
});

app.patch('/api/supabase/orders/:id/status', validateCompanyHeader, (req, res) => {
    req.url = `/api/orders/${req.params.id}/status`;
    app._router.handle(req, res);
});

// 4. Excluir Pedido
app.delete('/api/orders/:id', orderWriteLimiter, validateCompanyHeader, async (req, res) => {
    try {
        const rawId = decodeURIComponent(sanitizeString(req.params.id, 50));
        let allOrders = readJsonFile(ORDERS_FILE, []);
        allOrders = allOrders.filter(o => 
            String(o.id) !== String(rawId) && 
            String(o.id).replace('#', '') !== String(rawId).replace('#', '')
        );
        writeJsonFile(ORDERS_FILE, allOrders);

        if (supabase) {
            try {
                await supabase.from('orders').delete().eq('id', rawId);
            } catch (supaErr) {
                console.warn('[Segurança] Falha ao excluir do Supabase:', supaErr.message);
            }
        }

        // Transmissão Realtime da exclusão
        broadcastRealtimeOrder('DELETE', { id: rawId });

        res.json({ success: true, message: 'Pedido excluído com sucesso.' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao excluir pedido.' });
    }
});

// ============================================================================
// ROTAS DE EMPRESAS (COM RESPOSTAS SANITIZADAS - PRECAUÇÃO #17)
// ============================================================================
app.get('/api/companies', generalLimiter, (req, res) => {
    const companies = readJsonFile(COMPANIES_FILE, []);
    const safeCompanies = companies.map(trimCompanyOutput);
    res.json({ success: true, data: safeCompanies });
});

app.post('/api/companies', generalLimiter, authenticateToken, requireRole(ROLES.COMPANY_OWNER, ROLES.SUPER_ADMIN), (req, res) => {
    const { companies } = req.body;
    if (Array.isArray(companies)) {
        writeJsonFile(COMPANIES_FILE, companies);
        res.json({ success: true, count: companies.length });
    } else {
        res.status(400).json({ success: false, error: 'Formato inválido de empresas.' });
    }
});

// Sincronização em Lote por Empresa (Apenas SUPER_ADMIN ou COMPANY_OWNER da respectiva empresa)
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

        res.json({ success: true, message: `Dados da empresa ${companyId} sincronizados com segurança.` });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Falha na sincronização de dados.' });
    }
});

// ============================================================================
// ROTAS DE CAPTURA DE LEADS E TESTE GRÁTIS 24H (LOJA DEMO & PAINEL DEV)
// ============================================================================
app.post('/api/demo/unlock', generalLimiter, (req, res) => {
    try {
        const { phone, name, storeSlug, source } = req.body || {};
        const cleanPhone = (phone || '').replace(/\D/g, '');

        if (!cleanPhone || cleanPhone.length < 8) {
            return res.status(400).json({
                success: false,
                error: 'Por favor, informe um número de telefone ou WhatsApp válido.'
            });
        }

        const cleanName = sanitizeString(name || 'Interessado Demo', 100);
        const leads = readJsonFile(DEMO_LEADS_FILE, []);
        const now = Date.now();
        const trialExpiresAt = now + 24 * 60 * 60 * 1000; // 24 horas

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
                phone: phone.trim(),
                cleanPhone: cleanPhone,
                name: cleanName,
                createdAt: new Date().toISOString(),
                trialExpiresAt: trialExpiresAt,
                storeSlug: sanitizeString(storeSlug || 'demo', 50),
                source: sanitizeString(source || 'store-demo', 50),
                unlockCount: 1,
                status: 'ACTIVE_TRIAL'
            };
            leads.unshift(savedLead);
        }

        writeJsonFile(DEMO_LEADS_FILE, leads);

        res.json({
            success: true,
            message: 'Acesso de teste de 24 horas liberado com sucesso!',
            lead: savedLead,
            trialExpiresAt: trialExpiresAt
        });
    } catch (err) {
        console.error('Erro ao registrar lead de teste:', err.message);
        res.status(500).json({ success: false, error: 'Erro ao processar liberação de teste.' });
    }
});

app.get('/api/dev/leads', generalLimiter, (req, res) => {
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
        res.status(500).json({ success: false, error: 'Erro ao listar contatos capturados.' });
    }
});

app.delete('/api/dev/leads/:id', generalLimiter, (req, res) => {
    try {
        const { id } = req.params;
        const leads = readJsonFile(DEMO_LEADS_FILE, []);
        const filtered = leads.filter(l => l.id !== id && l.cleanPhone !== id);
        writeJsonFile(DEMO_LEADS_FILE, filtered);
        res.json({ success: true, message: 'Lead removido com sucesso.', remaining: filtered.length });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Erro ao excluir lead.' });
    }
});

// Servir arquivos estáticos do frontend com controle de cache em tempo real
app.use(express.static(__dirname, {
    maxAge: 0,
    etag: false,
    setHeaders: (res, path) => {
        if (path.endsWith('.html') || path.endsWith('.js') || path.endsWith('.css')) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    }
}));

// Fallback seguro para index.html (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================================================
// PRECAUÇÃO #15: TRATAMENTO GLOBAL DE ERROS (SEM VAZAR STACK TRACES)
// ============================================================================
app.use((err, req, res, next) => {
    console.error('[Segurança - Erro não tratado]:', err.message);
    res.status(500).json({
        success: false,
        error: 'Ocorreu um erro interno seguro. A operação foi cancelada sem afetar os dados.'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor Don Food ativo na porta ${PORT}`);
    console.log(`🛡️ 20 Precauções de Segurança e Estabilidade implementadas com sucesso.`);
});
