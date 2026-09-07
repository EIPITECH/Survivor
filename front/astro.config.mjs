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
  server: { allowedHosts: ['frontend'] },

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
      name: "Stack",
      cssVariable: "--font-stack",
      options: {
        variants: [
          {
            src: ['./src/assets/Stack/StackSansHeadline-VariableFont_wght.ttf'],
            weight: 'normal',
            style: 'normal'
          },
          {
            src: ['./src/assets/Stack/StackSansHeadline-VariableFont_wght.ttf'],
            weight: 'bold',
            style: 'normal'
          }
        ]
      }
    }
  ]
});