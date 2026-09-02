// @ts-check
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  devToolbar: {
    enabled: false
  },

  integrations: [react()],

  fonts: [{
      provider: fontProviders.local(),
      name: "Spectral",
      cssVariable: "--font-spectral",
      options: {
        variants: [
          {
            src: ['./src/assets/Spectral/Spectral-Regular.ttf'],
            weight: 'normal',
            style: 'normal'
          },
          {
            src: ['./src/assets/Spectral/Spectral-Bold.ttf'],
            weight: 'bold',
            style: 'normal'
          }
        ]
      }
    },
    {
      provider: fontProviders.local(),
      name: "Marianne",
      cssVariable: "--font-marianne",
      options: {
        variants: [
          {
            src: ['./src/assets/Marianne/fontes_desktop/TTF/Marianne-Regular.ttf'],
            weight: 'normal',
            style: 'normal'
          },
          {
            src: ['./src/assets/Marianne/fontes_desktop/TTF/Marianne-Bold.ttf'],
            weight: 'bold',
            style: 'normal'
          }
        ]
      }
    }
  ]
});