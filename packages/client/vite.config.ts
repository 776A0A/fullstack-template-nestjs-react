/// <reference types="vitest/config" />

import react from '@vitejs/plugin-react';
import path from 'path';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: { outDir: 'frontend-dist' },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: { proxy: { '/api': 'http://localhost:9823' } },
  plugins: [
    tsconfigPaths(),
    react(),
    Icons({ autoInstall: true, compiler: 'jsx', jsx: 'react' }),
  ],
  test: {
    globals: false,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
