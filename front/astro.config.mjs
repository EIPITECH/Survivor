// @ts-check
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],
  server: { allowedHosts: ['frontend'] },

  fonts: [{
    provider: fontProviders.local(),
    name: "Spectral",
    cssVariable: "--font-spectral",
    options: {
      variants: [{
        src: ['./src/assets/Spectral/Spectral-Regular.ttf'],
        weight: 'normal',
        style: 'normal'
      }]
    }
  },
  {
    provider: fontProviders.local(),
    name: "Marianne",
    cssVariable: "--font-marianne",
    options: {
      variants: [{
        src: ['./src/assets/Marianne/fontes_desktop/TTF/Marianne-Regular.ttf'],
        weight: 'normal',
        style: 'normal'
      }]
    }
  }]
});