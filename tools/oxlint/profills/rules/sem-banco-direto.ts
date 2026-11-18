import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

import { ehTexto } from '../jsx.ts';
import { relativoARaiz } from '../modulos3d.ts';
import path from 'node:path';

const MODULOS_DE_BANCO_E_DISCO = [
  'lib/banco/',
  'lib/armazem/',
  'lib/blog/repositorio'
];

const PACOTES_DE_BANCO_E_BUCKET = [
  'pg',
  '@electric-sql/pglite',
  '@aws-sdk/client-s3'
];

const PASTAS_LIBERADAS = [
  'lib/banco/',
  'lib/armazem/',
  'lib/blog/',
  'lib/admin/',
  'scripts/'
];

function caminhoNoRepoSemExtensao(fonte: string, arquivo: string) {
  let relativo: string;

  if (fonte.startsWith('@/')) relativo = path.posix.normalize(fonte.slice(2));
  else if (fonte.startsWith('.'))
    relativo = path.posix.join(path.posix.dirname(arquivo), fonte);
  else return null;

  return relativo.replace(/\.(?:ts|tsx|mjs|js)$/, '');
}

const ehInterno = (modulo: string) =>
  MODULOS_DE_BANCO_E_DISCO.some((i) =>
    i.endsWith('/') ? modulo.startsWith(i) : modulo === i
  );

const ehPacoteDeBanco = (fonte: string) =>
  PACOTES_DE_BANCO_E_BUCKET.some(
    (p) => fonte === p || fonte.startsWith(`${p}/`)
  );

function textoFixo(fonte: ESTree.Expression) {
  if (fonte.type === 'Literal' && ehTexto(fonte.value)) return fonte.value;

  if (fonte.type === 'TemplateLiteral' && fonte.expressions.length === 0)
    return fonte.quasis[0]?.value.cooked ?? null;

  return null;
}

export const semBancoDiretoRule = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        'Proíbe importar lib/banco, lib/armazem, lib/blog/repositorio, pg, @electric-sql/pglite ou @aws-sdk/client-s3 fora do domínio do blog, do login do admin, dos scripts e dos testes.'
    },
    messages: {
      interno:
        "'{{fonte}}' dá acesso direto ao banco ou ao disco. Use @/lib/blog/admin para escrever ou @/lib/blog/leitura para ler o que está publicado."
    }
  },
  create(context) {
    const arquivo = relativoARaiz(context.cwd, context.filename);

    if (
      PASTAS_LIBERADAS.some((d) => arquivo.startsWith(d)) ||
      /\.test\.tsx?$/.test(arquivo)
    ) {
      return {};
    }

    function checar(node: ESTree.Node, fonte: string, soTipo: boolean) {
      const modulo = caminhoNoRepoSemExtensao(fonte, arquivo);

      const proibido =
        modulo === null ? ehPacoteDeBanco(fonte) : ehInterno(modulo);

      if (!soTipo && proibido) {
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
        const fonte = textoFixo(node.source);

        if (fonte !== null) checar(node, fonte, false);
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
