import path from 'path';
import { configDefaults, defineConfig } from 'vitest/config';

const fora = [...configDefaults.exclude, '.claude/worktrees/**'];
const testesNode = '**/*.node.test.ts';

export default defineConfig({
  css: {
    postcss: {
      plugins: []
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      'server-only': path.resolve(
        __dirname,
        'node_modules/server-only/empty.js'
      )
    }
  },
  test: {
    exclude: fora,
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    projects: [
      {
        extends: true,
        test: {
          name: 'jsdom',
          environment: 'jsdom',
          exclude: [...fora, testesNode]
        }
      },
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: [testesNode],
          exclude: fora
        }
      }
    ]
  }
});
