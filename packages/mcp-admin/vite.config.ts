import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import Icons from 'unplugin-icons/vite';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(
    mode.replace('development', ''), // 直接加载.env
    path.resolve(__dirname, '../..'),
    '',
  );

  return {
    plugins: [
      tsconfigPaths(),
      react(),
      Icons({ autoInstall: true, compiler: 'jsx', jsx: 'react' }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: { '/api': `http://localhost:${env.SERVER_PORT}` },
    },
    envDir: '../..',
  };
});
