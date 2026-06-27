# MeuCarro

Sistema web PWA para gerenciamento completo de veículos.

## Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + TypeScript + Drizzle ORM
- **Database**: PostgreSQL
- **Auth**: JWT (Access + Refresh tokens)

## Desenvolvimento rápido

```bash
# 1. Subir o banco de dados
docker compose -f docker-compose.dev.yml up -d

# 2. Backend
cd backend
cp ../.env.example .env
# Edite o .env com suas configurações
npm install
npm run db:generate
npm run db:migrate
npm run dev

# 3. Frontend (outro terminal)
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:5173

## Etapas de desenvolvimento

- [x] Etapa 1 — Infraestrutura Base (Auth, Schema, Layout)
- [ ] Etapa 2 — Veículos
- [ ] Etapa 3 — Abastecimentos
- [ ] Etapa 4 — Manutenções
- [ ] Etapa 5 — Pneus & Documentos
- [ ] Etapa 6 — Dashboard & Alertas
- [ ] Etapa 7 — Relatórios & Histórico
- [ ] Etapa 8 — PWA & Polimento
