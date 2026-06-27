# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --no-audit --no-fund --prefer-offline
COPY frontend/ .
RUN npm run build

# Stage 2: Build backend + prune dev deps
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --no-audit --no-fund --prefer-offline
COPY backend/ .
RUN npm run build && npm prune --omit=dev

# Stage 3: Production image
FROM node:20-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=frontend-builder /app/frontend/dist ./public
RUN mkdir -p uploads
EXPOSE 3001
CMD ["node", "dist/server.js"]
