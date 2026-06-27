# MeuCarro

Controle inteligente de veículos — gastos, manutenções, documentos e alertas.

## Stack

**Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui + TanStack Query + Recharts + PWA  
**Backend:** Node.js + Express + TypeScript + Drizzle ORM + PostgreSQL  
**Auth:** JWT (access token 15min + refresh token 30d em HttpOnly cookie)

## Deploy

### Backend → Railway

1. Crie um projeto no [Railway](https://railway.app)
2. Adicione um serviço PostgreSQL ao projeto
3. Faça deploy da pasta `/backend` apontando para o `Dockerfile`
4. Configure as variáveis de ambiente (veja `/backend/.env.example`):
   - `DATABASE_URL` — copiado do serviço PostgreSQL do Railway
   - `JWT_SECRET` — string aleatória ≥32 caracteres
   - `JWT_REFRESH_SECRET` — string aleatória ≥32 caracteres
   - `FRONTEND_URL` — URL do seu deploy no Vercel
5. Após o deploy, rode as migrations:
   ```
   railway run npm run db:migrate
   ```

### Frontend → Vercel

1. Importe o repositório no [Vercel](https://vercel.com)
2. Configure o **Root Directory** como `frontend` (ou use o `vercel.json` na raiz)
3. Configure a variável de ambiente:
   - `VITE_API_URL` — URL do backend no Railway (ex: `https://meucarro-api.up.railway.app`)
4. Deploy automático a cada push no branch principal

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
