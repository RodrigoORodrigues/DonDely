import express from 'express';
import path from 'path';
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

// Configuração do Cliente Supabase
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
    console.log('ℹ️ Supabase não configurado via variáveis de ambiente. Modo local/híbrido ativo.');
}

// ========== ROTAS DE API SUPABASE COM ISOLAMENTO ESTRITO POR EMPRESA ==========

// Status da Conexão Supabase
app.get('/api/supabase/status', (req, res) => {
    res.json({
        configured: !!supabase,
        url: supabaseUrl ? supabaseUrl.replace(/https?:\/\//, '').split('.')[0] + '.supabase.co' : null,
        mode: supabase ? 'supabase_cloud' : 'local_storage_sync'
    });
});

// Middleware de validação de Tenant / Empresa
const validateCompanyHeader = (req, res, next) => {
    const companyId = req.headers['x-company-id'] || req.query.company_id || (req.body && req.body.company_id);
    if (!companyId && req.method !== 'GET') {
        return res.status(400).json({ error: 'Tenant / company_id obrigatório para isolamento de dados.' });
    }
    req.companyId = companyId;
    next();
};

// 1. Listar ou salvar empresas
app.get('/api/supabase/companies', async (req, res) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase não conectado' });
    try {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('active', true)
            .order('name');
        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Buscar produtos restritos à empresa selecionada
app.get('/api/supabase/products', validateCompanyHeader, async (req, res) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase não conectado' });
    const { companyId } = req;
    if (!companyId) return res.status(400).json({ error: 'company_id é obrigatório' });

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('company_id', companyId)
            .eq('available', true)
            .order('display_order');
        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Salvar / Atualizar produtos restritos à empresa
app.post('/api/supabase/products', validateCompanyHeader, async (req, res) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase não conectado' });
    const { companyId } = req;
    const { product } = req.body;
    if (!product) return res.status(400).json({ error: 'Dados do produto ausentes' });

    // Garantir que o company_id seja estritamente o da empresa atual
    product.company_id = companyId;

    try {
        const { data, error } = await supabase
            .from('products')
            .upsert([product])
            .select();
        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Buscar Pedidos (Restrito estritamente à empresa - nenhum cruzamento de dados)
app.get('/api/supabase/orders', validateCompanyHeader, async (req, res) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase não conectado' });
    const { companyId } = req;
    if (!companyId) return res.status(400).json({ error: 'company_id é obrigatório para acessar pedidos' });

    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Criar Pedido com isolamento por empresa
app.post('/api/supabase/orders', validateCompanyHeader, async (req, res) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase não conectado' });
    const { companyId } = req;
    const orderData = req.body;
    orderData.company_id = companyId;

    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([orderData])
            .select();
        if (error) throw error;
        res.json({ success: true, data: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Atualizar status de pedido da empresa
app.patch('/api/supabase/orders/:id/status', validateCompanyHeader, async (req, res) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase não conectado' });
    const { companyId } = req;
    const { id } = req.params;
    const { status } = req.body;

    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .eq('company_id', companyId) // Segurança: impede alterar pedido de outra empresa
            .select();
        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Sincronização e Backup em Lote por Empresa
app.post('/api/supabase/sync-company', validateCompanyHeader, async (req, res) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase não conectado' });
    const { companyId } = req;
    const { company, settings, products, orders } = req.body;

    try {
        // Upsert Empresa
        if (company) {
            company.id = companyId;
            await supabase.from('companies').upsert([company]);
        }
        // Upsert Configurações
        if (settings) {
            settings.company_id = companyId;
            await supabase.from('company_settings').upsert([settings]);
        }
        // Upsert Produtos isolados
        if (Array.isArray(products) && products.length > 0) {
            const isolatedProducts = products.map(p => ({ ...p, company_id: companyId }));
            await supabase.from('products').upsert(isolatedProducts);
        }
        // Upsert Pedidos isolados
        if (Array.isArray(orders) && orders.length > 0) {
            const isolatedOrders = orders.map(o => ({ ...o, company_id: companyId }));
            await supabase.from('orders').upsert(isolatedOrders);
        }

        res.json({ success: true, message: `Dados da empresa ${companyId} sincronizados com segurança no Supabase.` });
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
    console.log(`🔒 Arquitetura Multi-Tenant Supabase ativa com isolamento por empresa.`);
});
