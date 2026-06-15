import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Base can be overridden for GitHub Pages project sites (e.g. "/who-paid/").
const base = process.env.VITE_BASE ?? '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-mark.svg', 'coin.svg'],
      manifest: {
        name: 'Who Paid?',
        short_name: 'Who Paid?',
        description: "Whose round was it again? One coin per table — flick it when it's your shout.",
        theme_color: '#1FCD7C',
        background_color: '#FFF7EE',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
