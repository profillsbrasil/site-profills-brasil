import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

import { importPadrao } from '../jsx.ts';
import { ehModulo3d } from '../modulos3d.ts';

// Fonte do primeiro `import('x')` dentro do loader de `dynamic`.
function fonteDoImport(loader: ESTree.Node): string | null {
  if (
    loader.type !== 'ArrowFunctionExpression' &&
    loader.type !== 'FunctionExpression'
  ) {
    return null;
  }
  const corpo = loader.body;
  let atual: ESTree.Node | null | undefined = corpo;
  if (corpo?.type === 'BlockStatement') {
    atual = null;
    for (const s of corpo.body) {
      if (s.type === 'ReturnStatement') {
        atual = s.argument;
        break;
      }
    }
  }
  // Desce por `import(x).then(...)` até o `import(x)`.
  while (
    atual?.type === 'CallExpression' &&
    atual.callee.type === 'MemberExpression'
  ) {
    atual = atual.callee.object;
  }
  if (atual?.type === 'ImportExpression' && atual.source.type === 'Literal') {
    return typeof atual.source.value === 'string' ? atual.source.value : null;
  }
  return null;
}

function temSsrFalse(opcoes: ESTree.Node | undefined): boolean | null {
  if (opcoes === undefined) return false;
  if (opcoes.type !== 'ObjectExpression') return null;
  return opcoes.properties.some(
    (p) =>
      p.type === 'Property' &&
      p.key.type === 'Identifier' &&
      p.key.name === 'ssr' &&
      p.value.type === 'Literal' &&
      p.value.value === false
  );
}

export const dynamic3dSemSsrRule = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        'Exige `{ ssr: false }` no `dynamic()` que carrega 3D (three, globo, model-viewer, components/modelo3d).'
    },
    messages: {
      semSsrFalse:
        "`dynamic(() => import('{{fonte}}'))` sem `{ ssr: false }` tenta renderizar WebGL no servidor. Passe `{ ssr: false }`."
    }
  },
  create(context) {
    let dynamic: string | null = null;
    return {
      Program(node) {
        dynamic = importPadrao(node, 'next/dynamic');
      },
      CallExpression(node) {
        if (
          dynamic === null ||
          node.callee.type !== 'Identifier' ||
          node.callee.name !== dynamic
        ) {
          return;
        }
        const [loader, opcoes] = node.arguments;
        if (loader === undefined) return;
        const fonte = fonteDoImport(loader);
        if (fonte === null || !ehModulo3d(fonte, context.cwd, context.filename))
          return;
        // Opções vindas de variável ficam de fora: a regra não as resolve.
        if (temSsrFalse(opcoes) === false) {
          context.report({ node, messageId: 'semSsrFalse', data: { fonte } });
        }
      }
    };
  }
});
