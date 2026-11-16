import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

import { ehTexto } from '../jsx.ts';
import { relativoARaiz } from '../modulos3d.ts';
import path from 'node:path';

// Módulos que tocam o banco ou o disco direto; o app entra por lib/blog/admin.ts (escrita) ou lib/blog/leitura.ts (público).
const INTERNOS = ['lib/banco/', 'lib/armazem/', 'lib/blog/repositorio'];

// Pacotes que abrem conexão própria com o banco ou o bucket, contornando lib/banco e lib/armazem.
const PACOTES = ['pg', '@electric-sql/pglite', '@aws-sdk/client-s3'];

// Quem pode importá-los: o próprio domínio, o login do admin (limite de tentativas), os scripts de deploy e os testes.
const DONOS = [
  'lib/banco/',
  'lib/armazem/',
  'lib/blog/',
  'lib/admin/',
  'scripts/'
];

/** Caminho do módulo importado, relativo à raiz e sem extensão; null para pacote. */
function destino(fonte: string, arquivo: string): string | null {
  let relativo: string;

  if (fonte.startsWith('@/')) relativo = path.posix.normalize(fonte.slice(2));
  else if (fonte.startsWith('.'))
    relativo = path.posix.join(path.posix.dirname(arquivo), fonte);
  else return null;

  return relativo.replace(/\.(?:ts|tsx|mjs|js)$/, '');
}

const ehInterno = (modulo: string) =>
  INTERNOS.some((i) => (i.endsWith('/') ? modulo.startsWith(i) : modulo === i));

const ehPacoteDeBanco = (fonte: string) =>
  PACOTES.some((p) => fonte === p || fonte.startsWith(`${p}/`));

/** Texto fixo do import(): literal ou template sem expressão; null quando é calculado. */
function textoFixo(fonte: ESTree.Expression): string | null {
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
      DONOS.some((d) => arquivo.startsWith(d)) ||
      /\.test\.tsx?$/.test(arquivo)
    ) {
      return {};
    }

    function checar(node: ESTree.Node, fonte: string, soTipo: boolean) {
      const modulo = destino(fonte, arquivo);

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
