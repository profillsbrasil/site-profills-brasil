import fotoGable from '@/lib/images/catalogo2026/maquinas/envasadora-gable-top-gt.webp';

import type { Post } from './tipos';

export const postExemplo: Post = {
  assunto: 'maquina',
  titulo: 'Envasadora gable top GT ganha troca de formato sem ferramenta',
  resumo:
    'A nova versão da GT troca de caixa de 500 ml para 1 litro pelo painel, sem chave e sem parar a linha por mais de 15 minutos.',
  capa: fotoGable.src,
  linhas: [
    {
      id: 'l-o-que-mudou',
      colunas: [{ id: 'b-o-que-mudou', tipo: 'titulo', texto: 'O que mudou' }],
      proporcao: 50
    },
    {
      id: 'l-troca',
      colunas: [
        {
          id: 'b-troca',
          tipo: 'paragrafo',
          texto:
            'Até aqui, trocar o formato da caixa gable top pedia dois operadores e cerca de uma hora de linha parada. Na nova GT, o operador escolhe o formato na tela e confirma.'
        }
      ],
      proporcao: 50
    },
    {
      id: 'l-tabela',
      colunas: [
        {
          id: 'b-tabela',
          tipo: 'tabela',
          linhas: [
            ['Na troca de formato', 'Antes', 'Agora'],
            ['Linha parada', '60 min', '15 min'],
            ['Operadores', '2', '1']
          ]
        }
      ],
      proporcao: 50
    },
    {
      id: 'l-para-quem',
      colunas: [
        { id: 'b-para-quem', tipo: 'titulo', texto: 'Para quem serve' }
      ],
      proporcao: 50
    },
    {
      id: 'l-lista',
      colunas: [
        {
          id: 'b-lista',
          tipo: 'lista',
          itens: [
            'Laticínios que alternam leite integral e desnatado',
            'Indústrias de suco com lotes curtos por sabor',
            'Marcas próprias que envasam para mais de um cliente'
          ]
        }
      ],
      proporcao: 50
    },
    {
      id: 'l-maquina',
      colunas: [
        { id: 'b-maquina', tipo: 'maquina', slug: 'envasadora-gable-top-gt' }
      ],
      proporcao: 50
    }
  ]
};
