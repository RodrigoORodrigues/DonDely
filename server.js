import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Armazenamento local persistente em arquivos JSON (Zero Dependências Externas)
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const COMPANIES_FILE = path.join(DATA_DIR, 'companies.json');

function readJsonFile(filePath, defaultValue = []) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
            return defaultValue;
        }
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw || '[]');
    } catch (err) {
        console.error(`Erro ao ler ${filePath}:`, err.message);
        return defaultValue;
    }
}

function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        console.error(`Erro ao gravar ${filePath}:`, err.message);
    }
}

// Configuração do Cliente Supabase (Se configurado no .env)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase = null;
if (supabaseUrl && supabaseKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        });
        console.log('✅ Supabase Client inicializado com sucesso para:', supabaseUrl);
    } catch (err) {
        console.error('❌ Erro ao inicializar Supabase:', err.message);
    }
} else {
    console.log('ℹ️ Supabase em modo persistente local (data/orders.json ativo).');
}

// Status da Conexão
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        supabaseConfigured: !!supabase,
        storageMode: supabase ? 'supabase_plus_local' : 'persistent_file_store',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/supabase/status', (req, res) => {
    res.json({
        configured: !!supabase,
        url: supabaseUrl ? supabaseUrl.replace(/https?:\/\//, '').split('.')[0] + '.supabase.co' : null,
        mode: supabase ? 'supabase_cloud' : 'local_storage_sync'
    });
});

// Middleware de validação de Tenant / Empresa
const validateCompanyHeader = (req, res, next) => {
    const companyId = req.headers['x-company-id'] || req.query.company_id || req.query.companyId || (req.body && (req.body.companyId || req.body.company_id));
    req.companyId = companyId || 'company-fb-default';
    next();
};

// ========== ROTAS DE PEDIDOS (UNIVERSAL & EM TEMPO REAL) ==========

// 1. Obter pedidos (filtrados por empresa ou por telefone do cliente)
app.get('/api/orders', validateCompanyHeader, async (req, res) => {
    try {
        const { companyId } = req;
        const customerPhone = req.query.phone;
        const allOrders = readJsonFile(ORDERS_FILE, []);

        let filtered = allOrders;

        if (customerPhone) {
            // Filtrar pedidos deste cliente específico
            filtered = filtered.filter(o => o.customerPhone && o.customerPhone.replace(/\D/g, '') === customerPhone.replace(/\D/g, ''));
        } else if (companyId && companyId !== 'all') {
            // Filtrar pedidos da empresa ativa (com fallback para default)
            filtered = filtered.filter(o => 
                o.companyId === companyId || 
                (!o.companyId && companyId === 'company-fb-default')
            );
        }

        // Se Supabase estiver ativo, tentar sincronizar
        if (supabase && companyId && companyId !== 'all') {
            try {
                const { data: supaOrders, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('company_id', companyId)
                    .order('created_at', { ascending: false });
                
                if (!error && supaOrders && supaOrders.length > 0) {
                    // Mesclar sem duplicar
                    const map = new Map();
                    supaOrders.forEach(o => map.set(o.id, o));
                    filtered.forEach(o => map.set(o.id, o));
                    filtered = Array.from(map.values());
                }
            } catch (supaErr) {
                console.warn('Supabase fetch fallback to local store:', supaErr.message);
            }
        }

        res.json({ success: true, data: filtered });
    } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Alias Supabase
app.get('/api/supabase/orders', validateCompanyHeader, (req, res) => {
    req.url = '/api/orders';
    app._router.handle(req, res);
});

// 2. Criar novo Pedido (chamado pelo cliente ao finalizar pedido)
app.post('/api/orders', validateCompanyHeader, async (req, res) => {
    try {
        const { companyId } = req;
        const orderData = req.body;

        if (!orderData || !orderData.id) {
            return res.status(400).json({ success: false, error: 'Dados do pedido inválidos' });
        }

        orderData.companyId = orderData.companyId || companyId || 'company-fb-default';
        orderData.created_at = orderData.created_at || new Date().toISOString();
        orderData.status = orderData.status || 'RECEIVED';

        // 1. Salvar no arquivo local persistente
        const allOrders = readJsonFile(ORDERS_FILE, []);
        const existingIdx = allOrders.findIndex(o => o.id === orderData.id);
        if (existingIdx >= 0) {
            allOrders[existingIdx] = { ...allOrders[existingIdx], ...orderData };
        } else {
            allOrders.unshift(orderData);
        }
        writeJsonFile(ORDERS_FILE, allOrders);

        console.log(`📦 [NOVO PEDIDO RECEBIDO] ID: ${orderData.id} | Loja: ${orderData.companyName || orderData.companyId} | Cliente: ${orderData.customerName} | Total: R$ ${orderData.total}`);

        // 2. Salvar no Supabase se ativo
        if (supabase) {
            try {
                const supaPayload = { ...orderData, company_id: orderData.companyId };
                await supabase.from('orders').upsert([supaPayload]);
            } catch (supaErr) {
                console.warn('Supabase upsert erro:', supaErr.message);
            }
        }

        res.status(201).json({ success: true, data: orderData });
    } catch (err) {
        console.error('Erro ao criar pedido:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Alias Supabase
app.post('/api/supabase/orders', validateCompanyHeader, (req, res) => {
    req.url = '/api/orders';
    app._router.handle(req, res);
});

// 3. Atualizar Status do Pedido
app.patch('/api/orders/:id/status', validateCompanyHeader, async (req, res) => {
    try {
        const { companyId } = req;
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, error: 'Status obrigatório' });
        }

        const allOrders = readJsonFile(ORDERS_FILE, []);
        const order = allOrders.find(o => String(o.id) === String(id));

        if (order) {
            order.status = status;
            order.updated_at = new Date().toISOString();
            writeJsonFile(ORDERS_FILE, allOrders);
        }

        if (supabase) {
            try {
                await supabase
                    .from('orders')
                    .update({ status, updated_at: new Date().toISOString() })
                    .eq('id', id);
            } catch (supaErr) {
                console.warn('Supabase status update error:', supaErr.message);
            }
        }

        res.json({ success: true, data: order || { id, status } });
    } catch (err) {
        console.error('Erro ao atualizar status:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Alias Supabase
app.patch('/api/supabase/orders/:id/status', validateCompanyHeader, (req, res) => {
    req.url = `/api/orders/${req.params.id}/status`;
    app._router.handle(req, res);
});

// 4. Excluir Pedido
app.delete('/api/orders/:id', validateCompanyHeader, async (req, res) => {
    try {
        const { id } = req.params;
        let allOrders = readJsonFile(ORDERS_FILE, []);
        allOrders = allOrders.filter(o => String(o.id) !== String(id));
        writeJsonFile(ORDERS_FILE, allOrders);

        if (supabase) {
            try {
                await supabase.from('orders').delete().eq('id', id);
            } catch (supaErr) {
                console.warn('Supabase delete error:', supaErr.message);
            }
        }

        res.json({ success: true, message: 'Pedido excluído com sucesso' });
    } catch (err) {
        console.error('Erro ao excluir pedido:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== ROTAS DE EMPRESAS E PRODUTOS ==========

app.get('/api/companies', (req, res) => {
    const companies = readJsonFile(COMPANIES_FILE, []);
    res.json({ success: true, data: companies });
});

app.post('/api/companies', (req, res) => {
    const { companies } = req.body;
    if (Array.isArray(companies)) {
        writeJsonFile(COMPANIES_FILE, companies);
        res.json({ success: true, count: companies.length });
    } else {
        res.status(400).json({ success: false, error: 'Formato inválido de empresas' });
    }
});

// Sincronização e Backup em Lote por Empresa
app.post('/api/supabase/sync-company', validateCompanyHeader, async (req, res) => {
    const { companyId } = req;
    const { company, settings, products, orders } = req.body;

    try {
        if (Array.isArray(orders) && orders.length > 0) {
            const allOrders = readJsonFile(ORDERS_FILE, []);
            const map = new Map();
            allOrders.forEach(o => map.set(o.id, o));
            orders.forEach(o => map.set(o.id, { ...o, companyId }));
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

        res.json({ success: true, message: `Dados da empresa ${companyId} sincronizados com sucesso.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Servir arquivos estáticos do frontend
app.use(express.static(__dirname));

// Fallback para index.html para SPAs
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor Don Delivery ativo na porta ${PORT}`);
    console.log(`🔒 Sincronização e persistência de pedidos em tempo real ativas.`);
});
