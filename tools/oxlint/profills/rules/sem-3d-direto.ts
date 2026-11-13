import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

import { nomeDoElemento } from '../jsx.ts';
import {
  DOMINIO_3D,
  ehPacote3d,
  noDominio3d,
  relativoARaiz
} from '../modulos3d.ts';

export const sem3dDiretoRule = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description: `Proíbe \`<model-viewer>\` e import de three, react-globe.gl ou @google/model-viewer fora de ${DOMINIO_3D.join(' e ')}.`
    },
    messages: {
      modelViewer:
        '`<model-viewer>` direto foge do fallback WebGL e do carregamento sob demanda. Renderize por components/modelo3d/.',
      import3d:
        "Import de '{{fonte}}' fora de components/modelo3d/ ou components/magicui/globe.tsx põe WebGL no bundle da rota. Use um componente desses via `dynamic(..., { ssr: false })`."
    }
  },
  create(context) {
    if (noDominio3d(relativoARaiz(context.cwd, context.filename))) return {};

    function checar(node: ESTree.Node, fonte: unknown, soTipo: boolean) {
      if (!soTipo && typeof fonte === 'string' && ehPacote3d(fonte)) {
        context.report({ node, messageId: 'import3d', data: { fonte } });
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
        if (node.source.type === 'Literal')
          checar(node, node.source.value, false);
      },
      ExportNamedDeclaration(node) {
        if (node.source)
          checar(node, node.source.value, node.exportKind === 'type');
      },
      ExportAllDeclaration(node) {
        checar(node, node.source.value, node.exportKind === 'type');
      },
      JSXOpeningElement(node) {
        if (
          node.name.type === 'JSXIdentifier' &&
          nomeDoElemento(node) === 'model-viewer'
        ) {
          context.report({ node, messageId: 'modelViewer' });
        }
      }
    };
  }
});
