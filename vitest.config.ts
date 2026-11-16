import path from 'path';
import { configDefaults, defineConfig } from 'vitest/config';

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
    // Os worktrees de agentes são cópias do repo em outra branch: os testes deles não são deste checkout.
    exclude: [...configDefaults.exclude, '.claude/worktrees/**'],
    globals: true,
    setupFiles: ['./vitest.setup.ts']
  }
});
