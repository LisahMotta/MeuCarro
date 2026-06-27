# MeuCarro

Controle inteligente de veículos — gastos, manutenções, documentos e alertas.

## Stack

**Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui + TanStack Query + Recharts + PWA  
**Backend:** Node.js + Express + TypeScript + Drizzle ORM + PostgreSQL  
**Auth:** JWT (access token 15min + refresh token 30d em HttpOnly cookie)

## Deploy

### Railway (Fullstack)

O backend Express serve o frontend React buildado como arquivos estáticos — um único serviço, uma única URL, sem CORS.

1. Acesse [railway.app](https://railway.app) → **New Project**
2. Adicione um serviço **PostgreSQL** (+ New → Database → PostgreSQL)
3. Adicione um serviço **GitHub Repo** → selecione o repositório → **Root Directory: `/`** (raiz)
4. Em **Variables** do serviço, adicione:
   - `DATABASE_URL` → copie `DATABASE_PUBLIC_URL` do serviço PostgreSQL
   - `JWT_SECRET` → string aleatória ≥ 32 chars
   - `JWT_REFRESH_SECRET` → outra string aleatória ≥ 32 chars
   - `NODE_ENV` → `production`
   - `FRONTEND_URL` → URL gerada pelo Railway (preencha após o primeiro deploy)
5. Após o deploy, rode as migrations:
   ```
   railway run node dist/migrate.js
   ```
   Ou via Railway CLI: `railway run npm run db:migrate`
6. Acesse a URL pública gerada — frontend e backend no mesmo domínio ✅

## Desenvolvimento local

```bash
# Banco de dados
docker compose -f docker-compose.dev.yml up -d

# Backend
cd backend
cp .env.example .env   # ajuste as variáveis
npm install
npm run db:migrate
npm run dev            # porta 3001

# Frontend
cd frontend
cp .env.example .env   # ajuste VITE_API_URL se necessário
npm install
npm run dev            # porta 5173
```

## Funcionalidades

- **Dashboard** — KPIs de gastos, consumo médio, custo/km, próximos serviços
- **Veículos** — multi-veículo com foto, seletor rápido
- **Abastecimentos** — cálculo automático de consumo (km/L) e autonomia
- **Manutenções** — 25 categorias, custo de peças + mão de obra, próximo serviço
- **Pneus** — calibragem, rodízio, substituição por posição
- **Documentos** — IPVA, seguro, licenciamento com alertas de vencimento
- **Alertas** — geração inteligente por km e por data
- **Relatórios** — gastos mensais/anuais, breakdown por categoria
- **Histórico** — timeline cronológica de todos os eventos
- **PWA** — instalável, offline-ready, dark mode
