/// <reference types="vitest/config" />

import react from '@vitejs/plugin-react';
import path from 'path';
import Icons from 'unplugin-icons/vite';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  // 加载根目录的环境变量文件

  const env = loadEnv(
    mode.replace('development', ''), // 直接加载.env
    path.resolve(__dirname, '../..'),
    '',
  );

  return {
    resolve: { alias: { '@': path.resolve(__dirname, './src') } },
    server: {
      proxy: { '/api': `http://localhost:${env.SERVER_PORT}` },
    },
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
    // 将环境变量传递给客户端
    envDir: '../..',
  };
});
