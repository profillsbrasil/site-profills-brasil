import { defineRule } from '@oxlint/plugins';

import { atributo, atributoLigado, nomeDoElemento, temSpread } from '../jsx.ts';

export const videoCompletoRule = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        'Exige `poster` em `<video>` e `preload` em `<video autoPlay>`.'
    },
    messages: {
      semPoster:
        '`<video>` sem `poster` mostra caixa vazia até o primeiro quadro. Siga o padrão do hero: poster webp em public/videos/.',
      autoplaySemPreload:
        '`<video autoPlay>` sem `preload` deixa o navegador baixar o arquivo inteiro. Declare `preload` (o hero usa `metadata`).'
    }
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (nomeDoElemento(node) !== 'video' || temSpread(node)) return;

        if (atributo(node, 'poster') === null) {
          context.report({ node, messageId: 'semPoster' });
        }

        if (
          atributoLigado(node, 'autoPlay') &&
          atributo(node, 'preload') === null
        ) {
          context.report({ node, messageId: 'autoplaySemPreload' });
        }
      }
    };
  }
});
