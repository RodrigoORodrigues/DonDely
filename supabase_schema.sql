-- ============================================================================
-- DON FOOD — SCHEMA COMPLETO v2.0
-- Multi-tenant, RLS seguro, suporte a encomenda agendada
-- Compatível com Supabase (PostgreSQL 15+)
-- Este script é IDEMPOTENTE — pode ser executado múltiplas vezes sem erro
-- ============================================================================

-- ============================================================================
-- 0. EXTENSÕES NECESSÁRIAS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. TABELA DE EMPRESAS (Multi-Tenant)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.companies (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    slug            TEXT UNIQUE,
    email           TEXT,
    admin_password  TEXT,
    category        TEXT DEFAULT 'acai',
    cnpj            TEXT,
    address         TEXT,
    phone           TEXT,
    whatsapp        TEXT,
    logo_url        TEXT,
    is_demo         BOOLEAN DEFAULT FALSE,
    active          BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Compatibilidade retroativa (caso a tabela já exista com schema antigo)
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS email          TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS admin_password TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS category       TEXT DEFAULT 'acai';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS cnpj           TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS address        TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS phone          TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS whatsapp       TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS logo_url       TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS is_demo        BOOLEAN DEFAULT FALSE;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS active         BOOLEAN DEFAULT TRUE;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ DEFAULT NOW();

-- ============================================================================
-- 2. TABELA DE CONFIGURAÇÕES DAS EMPRESAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.company_settings (
    company_id        TEXT PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
    restaurant_name   TEXT NOT NULL,
    subtitle          TEXT,
    whatsapp_number   TEXT NOT NULL,
    instagram         TEXT,
    cnpj              TEXT,
    address           TEXT,
    logo_url          TEXT,
    delivery_fee      NUMERIC(10,2) DEFAULT 5.00,
    delivery_time     TEXT DEFAULT '30 - 45 min',
    preset_type       TEXT DEFAULT 'acai',
    theme_colors      JSONB DEFAULT '{}'::jsonb,
    schedule          JSONB DEFAULT '{}'::jsonb,
    coupons           JSONB DEFAULT '[]'::jsonb,
    neighborhoods     JSONB DEFAULT '[]'::jsonb,
    is_open           BOOLEAN DEFAULT TRUE,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS subtitle   TEXT;
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS is_open    BOOLEAN DEFAULT TRUE;
ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================================================
-- 3. TABELA DE PRODUTOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id                          BIGINT PRIMARY KEY,
    company_id                  TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name                        TEXT NOT NULL,
    description                 TEXT,
    price                       NUMERIC(10,2) NOT NULL,
    promo_price                 NUMERIC(10,2),
    category                    TEXT NOT NULL DEFAULT 'geral',
    tag                         TEXT,
    image                       TEXT,
    image_url                   TEXT,
    available                   BOOLEAN DEFAULT TRUE,
    is_acai                     BOOLEAN DEFAULT FALSE,
    is_customizable             BOOLEAN DEFAULT FALSE,
    allow_free_accompaniments   BOOLEAN DEFAULT TRUE,
    free_accompaniments_limit   INT DEFAULT 3,
    allow_immediate             BOOLEAN DEFAULT TRUE,
    allow_scheduled             BOOLEAN DEFAULT TRUE,
    display_order               INT DEFAULT 0,
    created_at                  TIMESTAMPTZ DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS promo_price                NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url                  TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tag                        TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_customizable            BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS allow_free_accompaniments  BOOLEAN DEFAULT TRUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS free_accompaniments_limit  INT DEFAULT 3;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS allow_immediate            BOOLEAN DEFAULT TRUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS allow_scheduled            BOOLEAN DEFAULT TRUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at                 TIMESTAMPTZ DEFAULT NOW();

-- ============================================================================
-- 4. TABELA DE PEDIDOS (com suporte completo a encomenda agendada)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id                          TEXT PRIMARY KEY,
    company_id                  TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    company_name                TEXT,
    company_whatsapp            TEXT,

    -- Dados do cliente
    customer_name               TEXT NOT NULL,
    customer_phone              TEXT NOT NULL,
    customer_address            TEXT,
    customer_neighborhood       TEXT,
    customer_neighborhood_zone  TEXT,
    customer_reference          TEXT,

    -- Pagamento e entrega
    payment_method              TEXT NOT NULL DEFAULT 'Pix',
    cash_change_for             NUMERIC(10,2),
    delivery_time               TEXT DEFAULT '30 - 45 min',

    -- Itens e valores
    items                       JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal                    NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    delivery_fee                NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount                    NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount_value              NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    coupon_code                 TEXT,
    coupon_discount             NUMERIC(10,2) DEFAULT 0,
    total                       NUMERIC(10,2) NOT NULL DEFAULT 0.00,

    -- Encomenda / Agendamento
    is_scheduled                BOOLEAN DEFAULT FALSE,
    scheduled_date              DATE,
    scheduled_time              TIME,
    order_type                  TEXT DEFAULT 'IMMEDIATE'
                                CHECK (order_type IN ('IMMEDIATE', 'SCHEDULED')),

    -- Status e observações
    observations                TEXT,
    status                      TEXT NOT NULL DEFAULT 'RECEIVED'
                                CHECK (status IN ('RECEIVED','PREPARING','DELIVERING','COMPLETED','CANCELLED')),

    -- Metadados
    order_date                  TEXT,
    created_at                  TIMESTAMPTZ DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS company_name              TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS company_whatsapp          TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_neighborhood_zone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_reference        TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_time             TEXT DEFAULT '30 - 45 min';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_value            NUMERIC(10,2) NOT NULL DEFAULT 0.00;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_discount           NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_scheduled              BOOLEAN DEFAULT FALSE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS scheduled_date            DATE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS scheduled_time            TIME;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_type                TEXT DEFAULT 'IMMEDIATE';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_date                TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at                TIMESTAMPTZ DEFAULT NOW();

-- Constraint de order_type (só adiciona se ainda não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'orders_order_type_check'
    ) THEN
        ALTER TABLE public.orders
            ADD CONSTRAINT orders_order_type_check
            CHECK (order_type IN ('IMMEDIATE', 'SCHEDULED'));
    END IF;
END $$;

-- Constraint de status (só adiciona se ainda não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'orders_status_check'
    ) THEN
        ALTER TABLE public.orders
            ADD CONSTRAINT orders_status_check
            CHECK (status IN ('RECEIVED','PREPARING','DELIVERING','COMPLETED','CANCELLED'));
    END IF;
END $$;

-- ============================================================================
-- 5. TABELA DE CLIENTES (com suporte a Google OAuth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone          TEXT UNIQUE,
    name           TEXT NOT NULL,
    email          TEXT,
    password_hash  TEXT,
    salt           TEXT,
    google_id      TEXT,
    provider       TEXT DEFAULT 'local',
    picture        TEXT,
    address        TEXT,
    neighborhood   TEXT,
    reference      TEXT,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS email         TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS salt          TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS google_id     TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS provider      TEXT DEFAULT 'local';
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS picture       TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS reference     TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMPTZ DEFAULT NOW();

-- phone pode ser nulo para clientes que só logam via Google
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='customers'
          AND column_name='phone' AND is_nullable='NO'
    ) THEN
        ALTER TABLE public.customers ALTER COLUMN phone DROP NOT NULL;
    END IF;
END $$;

-- ============================================================================
-- 6. ÍNDICES PARA ALTA PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_companies_slug            ON public.companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_active          ON public.companies(active);
CREATE INDEX IF NOT EXISTS idx_companies_email           ON public.companies(email);

CREATE INDEX IF NOT EXISTS idx_products_company          ON public.products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_available        ON public.products(company_id, available);

CREATE INDEX IF NOT EXISTS idx_orders_company            ON public.orders(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone     ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status             ON public.orders(company_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_created            ON public.orders(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_scheduled          ON public.orders(company_id, is_scheduled, scheduled_date)
                                                          WHERE is_scheduled = TRUE;
CREATE INDEX IF NOT EXISTS idx_orders_type               ON public.orders(order_type);

CREATE INDEX IF NOT EXISTS idx_customers_phone           ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email           ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_google          ON public.customers(google_id);

-- ============================================================================
-- 7. FUNÇÃO E TRIGGERS DE updated_at AUTOMÁTICO
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_companies_updated_at         ON public.companies;
DROP TRIGGER IF EXISTS trg_company_settings_updated_at  ON public.company_settings;
DROP TRIGGER IF EXISTS trg_products_updated_at          ON public.products;
DROP TRIGGER IF EXISTS trg_orders_updated_at            ON public.orders;
DROP TRIGGER IF EXISTS trg_customers_updated_at         ON public.customers;

CREATE TRIGGER trg_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_company_settings_updated_at
    BEFORE UPDATE ON public.company_settings
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 8. VALIDAÇÃO DE ENCOMENDA AGENDADA (data e hora coerentes)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.validate_scheduled_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Se marcado como agendado, precisa ter data e hora
    IF NEW.is_scheduled = TRUE THEN
        IF NEW.scheduled_date IS NULL OR NEW.scheduled_time IS NULL THEN
            RAISE EXCEPTION 'Encomenda agendada requer scheduled_date e scheduled_time';
        END IF;
        NEW.order_type := 'SCHEDULED';
    ELSE
        NEW.is_scheduled := FALSE;
        NEW.scheduled_date := NULL;
        NEW.scheduled_time := NULL;
        NEW.order_type := 'IMMEDIATE';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_validate_scheduled ON public.orders;

CREATE TRIGGER trg_orders_validate_scheduled
    BEFORE INSERT OR UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.validate_scheduled_order();

-- ============================================================================
-- 9. HABILITAR ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS
-- ============================================================================
ALTER TABLE public.companies         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers         ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 10. POLÍTICAS DE RLS (SEGURAS — SEM BYPASS)
-- ============================================================================
--
-- ESTRATÉGIA DE SEGURANÇA:
-- • O servidor Node.js usa a SERVICE_ROLE_KEY, que IGNORA RLS automaticamente.
--   Portanto todas as operações críticas (INSERT/UPDATE/DELETE) já são feitas
--   com bypass de RLS no backend.
--
-- • As políticas abaixo definem o que a ANON_KEY (frontend) pode acessar
--   diretamente. Somente leitura pública de dados "vitrine".
--
-- • O acesso a pedidos e clientes via anon é BLOQUEADO. O frontend usa SSE
--   (Server-Sent Events) para realtime, que passa pelo backend autenticado.
-- ============================================================================

-- ----------------------------------------
-- 10.1 COMPANIES — leitura pública de empresas ativas
-- ----------------------------------------
DROP POLICY IF EXISTS "companies_public_read" ON public.companies;
CREATE POLICY "companies_public_read"
    ON public.companies FOR SELECT
    TO anon, authenticated
    USING (active = TRUE);

-- ----------------------------------------
-- 10.2 COMPANY_SETTINGS — leitura pública (apenas de empresas ativas)
-- ----------------------------------------
DROP POLICY IF EXISTS "company_settings_public_read" ON public.company_settings;
CREATE POLICY "company_settings_public_read"
    ON public.company_settings FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.companies c
            WHERE c.id = company_settings.company_id AND c.active = TRUE
        )
    );

-- ----------------------------------------
-- 10.3 PRODUCTS — leitura pública de produtos disponíveis
-- ----------------------------------------
DROP POLICY IF EXISTS "products_public_read" ON public.products;
CREATE POLICY "products_public_read"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (
        available = TRUE
        AND EXISTS (
            SELECT 1 FROM public.companies c
            WHERE c.id = products.company_id AND c.active = TRUE
        )
    );

-- ----------------------------------------
-- 10.4 ORDERS — acesso SOMENTE via service_role (backend)
--      Nenhuma política para anon/authenticated = bloqueado
-- ----------------------------------------
DROP POLICY IF EXISTS "Customers can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "orders_no_anon_access" ON public.orders;

-- (Nenhuma policy = nenhum acesso via anon. service_role ignora RLS.)

-- ----------------------------------------
-- 10.5 CUSTOMERS — acesso SOMENTE via service_role (backend)
-- ----------------------------------------
DROP POLICY IF EXISTS "customers_no_anon_access" ON public.customers;

-- (Nenhuma policy = nenhum acesso via anon.)

-- ============================================================================
-- 11. COMENTÁRIOS DE DOCUMENTAÇÃO
-- ============================================================================
COMMENT ON TABLE public.companies IS 'Empresas multi-tenant (lojas) do sistema Don Food';
COMMENT ON TABLE public.company_settings IS 'Configurações de cada empresa (tema, horários, bairros, cupons)';
COMMENT ON TABLE public.products IS 'Produtos do cardápio por empresa';
COMMENT ON TABLE public.orders IS 'Pedidos imediatos e encomendas agendadas';
COMMENT ON TABLE public.customers IS 'Clientes finais (login por telefone/Google)';

COMMENT ON COLUMN public.orders.is_scheduled   IS 'TRUE se o pedido é uma encomenda agendada';
COMMENT ON COLUMN public.orders.scheduled_date IS 'Data agendada (YYYY-MM-DD) da encomenda';
COMMENT ON COLUMN public.orders.scheduled_time IS 'Horário agendado (HH:MM) da encomenda';
COMMENT ON COLUMN public.orders.order_type     IS 'IMMEDIATE (entrega na hora) ou SCHEDULED (encomenda)';

COMMENT ON COLUMN public.products.allow_immediate IS 'Permite pedido imediato';
COMMENT ON COLUMN public.products.allow_scheduled IS 'Permite encomenda agendada';

-- ============================================================================
-- 12. VERIFICAÇÃO FINAL (opcional — exibe contagens)
-- ============================================================================
DO $$
DECLARE
    cnt_companies INT;
    cnt_products  INT;
    cnt_orders    INT;
    cnt_customers INT;
BEGIN
    SELECT COUNT(*) INTO cnt_companies FROM public.companies;
    SELECT COUNT(*) INTO cnt_products  FROM public.products;
    SELECT COUNT(*) INTO cnt_orders    FROM public.orders;
    SELECT COUNT(*) INTO cnt_customers FROM public.customers;

    RAISE NOTICE '✅ DON FOOD schema aplicado com sucesso!';
    RAISE NOTICE '   Empresas: % | Produtos: % | Pedidos: % | Clientes: %',
        cnt_companies, cnt_products, cnt_orders, cnt_customers;
    RAISE NOTICE '   RLS ativo em: companies, company_settings, products, orders, customers';
END $$;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================