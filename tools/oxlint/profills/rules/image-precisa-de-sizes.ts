import { defineRule } from '@oxlint/plugins';

import {
  atributo,
  atributoLigado,
  importPadrao,
  nomeDoElemento,
  temSpread
} from '../jsx.ts';

export const imagePrecisaDeSizesRule = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        'Exige `sizes` em `Image` de next/image com `fill`, `priority` ou `preload`.'
    },
    messages: {
      semSizes:
        '`Image` com `{{prop}}` sem `sizes` baixa a maior largura do srcset (até w=3840). Declare `sizes` com a largura real do layout.'
    }
  },
  create(context) {
    let image: string | null = null;

    return {
      Program(node) {
        image = importPadrao(node, 'next/image');
      },
      JSXOpeningElement(node) {
        if (image === null || nomeDoElemento(node) !== image) return;

        if (temSpread(node) || atributo(node, 'sizes') !== null) return;

        const prop = ['fill', 'priority', 'preload'].find((p) =>
          atributoLigado(node, p)
        );

        if (prop !== undefined) {
          context.report({ node, messageId: 'semSizes', data: { prop } });
        }
      }
    };
  }
});
