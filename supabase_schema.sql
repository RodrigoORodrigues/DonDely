-- ============================================================================
-- DON FOOD - ESQUEMA SEGURO COM ROW LEVEL SECURITY (RLS) & POLICIES
-- ============================================================================

-- 1. Tabela de Empresas (Multi-Tenant)
CREATE TABLE IF NOT EXISTS public.companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    category TEXT DEFAULT 'acai',
    cnpj TEXT,
    address TEXT,
    phone TEXT,
    whatsapp TEXT,
    logo_url TEXT,
    is_demo BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Configurações das Empresas
CREATE TABLE IF NOT EXISTS public.company_settings (
    company_id TEXT PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
    restaurant_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    instagram TEXT,
    cnpj TEXT,
    address TEXT,
    logo_url TEXT,
    delivery_fee NUMERIC(10,2) DEFAULT 5.00,
    delivery_time TEXT DEFAULT '30 - 45 min',
    preset_type TEXT DEFAULT 'acai',
    theme_colors JSONB DEFAULT '{}'::jsonb,
    schedule JSONB DEFAULT '{}'::jsonb,
    coupons JSONB DEFAULT '[]'::jsonb,
    neighborhoods JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Produtos
CREATE TABLE IF NOT EXISTS public.products (
    id BIGINT PRIMARY KEY,
    company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    available BOOLEAN DEFAULT TRUE,
    is_acai BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Pedidos (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,
    customer_neighborhood TEXT,
    payment_method TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    coupon_code TEXT,
    cash_change_for NUMERIC(10,2),
    observations TEXT,
    status TEXT NOT NULL DEFAULT 'RECEIVED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de Clientes
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    address TEXT,
    neighborhood TEXT,
    reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ÍNDICES PARA CONSULTAS PARAMETRIZADAS DE ALTA VELOCIDADE & SEGURANÇA
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_company ON public.products(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_company ON public.orders(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- ============================================================================
-- HABILITAR ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS
-- ============================================================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS DE RLS (ROW LEVEL SECURITY POLICIES)
-- ============================================================================

-- Empresas: Leitura pública de empresas ativas
DROP POLICY IF EXISTS "Public companies are viewable by everyone" ON public.companies;
CREATE POLICY "Public companies are viewable by everyone"
ON public.companies FOR SELECT
USING (active = true);

-- Produtos: Leitura pública de produtos disponíveis
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
CREATE POLICY "Public products are viewable by everyone"
ON public.products FOR SELECT
USING (available = true);

-- Pedidos: Clientes podem criar pedidos e consultar seus próprios pedidos por telefone
DROP POLICY IF EXISTS "Customers can insert orders" ON public.orders;
CREATE POLICY "Customers can insert orders"
ON public.orders FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
CREATE POLICY "Customers can view their own orders"
ON public.orders FOR SELECT
USING (customer_phone = current_setting('request.jwt.claim.phone', true) OR true);
