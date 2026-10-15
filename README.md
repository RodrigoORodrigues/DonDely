# Don Food (DonDely)

Sistema completo de **cardápio digital** e **gestão de pedidos** multi-tenant, com suporte a pedidos imediatos e agendados, WhatsApp, cupons, bairros/taxas e painel administrativo.

## Stack

- **Backend:** Node.js (ESM) + Express
- **Frontend:** HTML/CSS/JS (SPA em `index.html` + `app.js`)
- **Banco:** Supabase (PostgreSQL) + fallback local em JSON (`data/`)
- **Deploy:** Vercel (ou Node local)
- **Runtime sugerido:** Node ≥ 18 (ou Bun)

## Pré-requisitos

- Node.js 18+
- Conta Supabase (recomendado para produção)
- Variáveis de ambiente configuradas (veja `.env.example`)

## Configuração rápida

```bash
git clone https://github.com/RodrigoORodrigues/DonDely.git
cd DonDely
cp .env.example .env
# Edite o .env e preencha SUPABASE_*, SESSION_SECRET e DEV_SUPER_ADMIN_PASSWORD

npm install   # ou: bun install
npm run dev   # http://localhost:3000
```

### Variáveis essenciais

| Variável | Obrigatória | Descrição |
|----------|-------------|----------|
| `SESSION_SECRET` | Sim (prod) | Segredo HMAC de sessão (≥ 32 chars) |
| `DEV_SUPER_ADMIN_PASSWORD` | Sim (prod) | Senha do painel `/dev` |
| `SUPABASE_URL` | Recomendado | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Recomendado | Chave service role (backend) |
| `SUPABASE_ANON_KEY` | Opcional | Chave anônima |
| `PORT` | Não | Porta local (padrão 3000) |
| `NODE_ENV` | Não | `development` / `production` |

Gere um `SESSION_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Schema do banco

Execute o arquivo `supabase_schema.sql` no SQL Editor do Supabase (script idempotente).

## Scripts

| Comando | Descrição |
|---------|----------|
| `npm run dev` | Servidor com `--watch` |
| `npm start` | Servidor produção |
| `npm test` | Testes (`node --test`) |
| `npm run lint` | Verificação sintática dos módulos principais |

## Estrutura

```
├── server.js           # API Express + segurança + persistência
├── engines.js          # Lógica de negócio (taxa, cupom, pedido, WhatsApp, ESC/POS)
├── index.html          # Shell da aplicação
├── app.js              # Frontend (SPA)
├── styles.css
├── public/             # Assets estáticos servidos
├── data/               # Seeds JSON (fallback local)
├── test/               # Testes de API e integridade
├── supabase_schema.sql # Schema + RLS
└── vercel.json         # Deploy Vercel
```

## Segurança (resumo)

- Headers HTTP de proteção (HSTS, nosniff, frame, XSS)
- Rate limiting por IP (em memória — em multi-instância considere Redis)
- Sanitização de inputs e bloqueio de mass assignment
- Senhas com PBKDF2 + salt; tokens de sessão assinados (HMAC)
- Service role só no backend; RLS no Supabase para acesso anônimo restrito
- `.env` nunca versionado; use apenas `.env.example` sem valores reais

**Ação recomendada:** se a senha de exemplo `Donfood2211` já foi usada em produção, **troque imediatamente** `DEV_SUPER_ADMIN_PASSWORD` e qualquer senha de admin de empresas ainda em texto plano.

## Deploy (Vercel)

1. Conecte o repositório na Vercel.
2. Configure as variáveis de ambiente no painel do projeto.
3. O `vercel.json` roteia `/api/*` para `server.js` e o restante para a SPA.

Em ambientes serverless, o rate limit em memória e a escrita em disco (`data/`) são limitados — use Supabase como fonte da verdade.

## Testes

Os testes de integração em `test/api.test.js` esperam o servidor em `http://localhost:3000`:

```bash
npm run dev   # terminal 1
npm test      # terminal 2
```

## Licença

Uso privado / não licenciado (`UNLICENSED`).
