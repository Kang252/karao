import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const githubBase = '/karao/';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'github-pages-public-assets',
      transform(code, id) {
        if (process.env.GITHUB_ACTIONS && id.endsWith('/src/main.jsx')) {
          return code.replace('/magic-music-chest.png', `${githubBase}magic-music-chest.png`);
        }
      },
    },
  ],
  base: process.env.GITHUB_ACTIONS ? githubBase : '/',
});
