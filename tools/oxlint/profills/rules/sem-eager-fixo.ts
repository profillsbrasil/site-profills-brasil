import { defineRule } from '@oxlint/plugins';

import {
  atributo,
  importPadrao,
  nomeDoElemento,
  valorLiteral
} from '../jsx.ts';

export const semEagerFixoRule = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        "Proíbe `loading='eager'` literal em `Image` e `img`; eager depende da posição na página."
    },
    messages: {
      eagerFixo:
        "`loading='eager'` fixo baixa a imagem antes da página, em toda instância. Use `preload` na imagem principal da dobra ou uma condição, como `index < N ? 'eager' : 'lazy'`."
    }
  },
  create(context) {
    let image: string | null = null;

    return {
      Program(node) {
        image = importPadrao(node, 'next/image');
      },
      JSXOpeningElement(node) {
        const nome = nomeDoElemento(node);

        if (nome !== 'img' && (image === null || nome !== image)) return;
        const loading = atributo(node, 'loading');

        if (loading !== null && valorLiteral(loading) === 'eager') {
          context.report({ node: loading, messageId: 'eagerFixo' });
        }
      }
    };
  }
});
