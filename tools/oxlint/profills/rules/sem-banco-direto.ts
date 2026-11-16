import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

import { ehTexto } from '../jsx.ts';
import { relativoARaiz } from '../modulos3d.ts';
import path from 'node:path';

// Módulos que tocam o banco ou o disco direto; o app entra por lib/blog/admin.ts (escrita) ou lib/blog/leitura.ts (público).
const INTERNOS = ['lib/banco/', 'lib/armazem/', 'lib/blog/repositorio'];

// Quem pode importá-los: o próprio domínio, os scripts de deploy e os testes.
const DONOS = ['lib/banco/', 'lib/armazem/', 'lib/blog/', 'scripts/'];

/** Caminho do módulo importado, relativo à raiz e sem extensão; null para pacote. */
function destino(fonte: string, arquivo: string): string | null {
  let relativo: string;

  if (fonte.startsWith('@/')) relativo = fonte.slice(2);
  else if (fonte.startsWith('.'))
    relativo = path.posix.join(path.posix.dirname(arquivo), fonte);
  else return null;

  return relativo.replace(/\.(?:ts|tsx|mjs|js)$/, '');
}

const ehInterno = (modulo: string) =>
  INTERNOS.some((i) => (i.endsWith('/') ? modulo.startsWith(i) : modulo === i));

export const semBancoDiretoRule = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        'Proíbe importar lib/banco, lib/armazem ou lib/blog/repositorio fora do domínio do blog, dos scripts e dos testes.'
    },
    messages: {
      interno:
        "'{{fonte}}' dá acesso direto ao banco ou ao disco. Use @/lib/blog/admin para escrever ou @/lib/blog/leitura para ler o que está publicado."
    }
  },
  create(context) {
    const arquivo = relativoARaiz(context.cwd, context.filename);

    if (
      DONOS.some((d) => arquivo.startsWith(d)) ||
      /\.test\.tsx?$/.test(arquivo)
    ) {
      return {};
    }

    function checar(node: ESTree.Node, fonte: string, soTipo: boolean) {
      const modulo = destino(fonte, arquivo);

      if (!soTipo && modulo !== null && ehInterno(modulo)) {
        context.report({ node, messageId: 'interno', data: { fonte } });
      }
    }

    return {
      ImportDeclaration(node) {
        const soTipo =
          node.importKind === 'type' ||
          (node.specifiers.length > 0 &&
            node.specifiers.every(
              (s) => s.type === 'ImportSpecifier' && s.importKind === 'type'
            ));

        checar(node, node.source.value, soTipo);
      },
      ImportExpression(node) {
        if (node.source.type === 'Literal' && ehTexto(node.source.value))
          checar(node, node.source.value, false);
      },
      ExportNamedDeclaration(node) {
        if (node.source)
          checar(node, node.source.value, node.exportKind === 'type');
      },
      ExportAllDeclaration(node) {
        checar(node, node.source.value, node.exportKind === 'type');
      }
    };
  }
});
