import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'MeuCarro — Controle Inteligente',
        short_name: 'MeuCarro',
        description: 'Controle seus gastos, manutenções e documentos do veículo',
        theme_color: '#6366f1',
        background_color: '#09090b',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        shortcuts: [
          {
            name: 'Novo abastecimento',
            url: '/fuelings/new',
            description: 'Registrar abastecimento',
          },
          {
            name: 'Nova manutenção',
            url: '/maintenances/new',
            description: 'Registrar manutenção',
          },
        ],
        categories: ['automotive', 'finance', 'utilities'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https?.*\/api\/auth\/me/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'auth-cache',
              expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 },
            },
          },
          {
            urlPattern: /^https?.*\/api\/vehicles/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'vehicles-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
            },
          },
          {
            urlPattern: /^https?.*\/uploads\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'uploads-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/uploads': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
});
