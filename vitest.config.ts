import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  css: {
    postcss: {
      plugins: []
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      // Os testes de servidor rodam fora da condição react-server, que já
      // resolve server-only para este arquivo vazio.
      'server-only': path.resolve(
        __dirname,
        'node_modules/server-only/empty.js'
      )
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts']
  }
});
