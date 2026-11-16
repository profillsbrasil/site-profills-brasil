-- Os 3 posts que viviam em conteudo/blog/posts, todos como rascunho: nenhum exemplo aparece publicado sem o autor decidir.

insert into blog_posts (slug, estado, versao, criado_em, atualizado_em, publicado_em, conteudo)
values (
  'exemplo-gt-ganha-troca-de-formato-sem-ferramenta',
  'rascunho',
  1,
  '2026-11-03T13:00:00.000Z',
  '2026-11-03T15:00:00.000Z',
  null,
  $post${
  "assunto": "maquina",
  "titulo": "Exemplo: GT ganha troca de formato sem ferramenta",
  "resumo": "A nova versão da GT troca de caixa de 500 ml para 1 litro pelo painel, sem chave e sem parar a linha por mais de 15 minutos.",
  "capa": null,
  "linhas": [
    {
      "id": "l-o-que-mudou",
      "colunas": [
        {
          "id": "b-o-que-mudou",
          "tipo": "titulo",
          "texto": "O que mudou"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-troca",
      "colunas": [
        {
          "id": "b-troca",
          "tipo": "paragrafo",
          "texto": "Até aqui, trocar o formato da caixa gable top pedia dois operadores e cerca de uma hora de linha parada. Na nova GT, o operador escolhe o formato na tela e confirma."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-tabela",
      "colunas": [
        {
          "id": "b-tabela",
          "tipo": "tabela",
          "linhas": [
            [
              "Na troca de formato",
              "Antes",
              "Agora"
            ],
            [
              "Linha parada",
              "60 min",
              "15 min"
            ],
            [
              "Operadores",
              "2",
              "1"
            ]
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-para-quem",
      "colunas": [
        {
          "id": "b-para-quem",
          "tipo": "titulo",
          "texto": "Para quem serve"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-lista",
      "colunas": [
        {
          "id": "b-lista",
          "tipo": "lista",
          "itens": [
            "Laticínios que alternam leite integral e desnatado",
            "Indústrias de suco com lotes curtos por sabor",
            "Marcas próprias que envasam para mais de um cliente"
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-maquina",
      "colunas": [
        {
          "id": "b-maquina",
          "tipo": "maquina",
          "slug": "envasadora-gable-top-gt"
        }
      ],
      "proporcao": 50
    }
  ]
}$post$::jsonb
)
on conflict (slug) do nothing;

insert into blog_posts (slug, estado, versao, criado_em, atualizado_em, publicado_em, conteudo)
values (
  'exemplo-profills-na-feira-com-a-linha-montada',
  'rascunho',
  1,
  '2026-11-06T13:00:00.000Z',
  '2026-11-06T16:00:00.000Z',
  null,
  $post${
  "assunto": "evento",
  "titulo": "Exemplo: Profills na feira com a linha montada",
  "resumo": "O estande leva uma linha de envase funcionando, para o visitante ver a troca de formato e conversar com quem monta a máquina.",
  "capa": null,
  "linhas": [
    {
      "id": "l-estande",
      "colunas": [
        {
          "id": "b-estande",
          "tipo": "paragrafo",
          "texto": "Neste exemplo, o post mostra um parágrafo ao lado de um aviso, com a primeira coluna mais larga. Troque o texto pelo da feira de verdade."
        },
        {
          "id": "b-onde",
          "tipo": "aviso",
          "titulo": "Onde encontrar",
          "texto": "Rua B, estande 42. Das 10h às 19h."
        }
      ],
      "proporcao": 62
    },
    {
      "id": "l-citacao",
      "colunas": [
        {
          "id": "b-citacao",
          "tipo": "citacao",
          "texto": "A gente prefere mostrar a máquina rodando a mostrar um catálogo.",
          "autor": "Time comercial da Profills"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-link",
      "colunas": [
        {
          "id": "b-link",
          "tipo": "link",
          "titulo": "Página oficial da feira",
          "url": "https://example.com"
        }
      ],
      "proporcao": 50
    }
  ]
}$post$::jsonb
)
on conflict (slug) do nothing;

insert into blog_posts (slug, estado, versao, criado_em, atualizado_em, publicado_em, conteudo)
values (
  'exemplo-recesso-de-fim-de-ano-na-fabrica',
  'rascunho',
  1,
  '2026-11-10T16:00:00.000Z',
  '2026-11-10T16:00:00.000Z',
  null,
  $post${
  "assunto": "aviso",
  "titulo": "Exemplo: Recesso de fim de ano na fábrica",
  "resumo": "A fábrica para entre o Natal e o Ano-Novo. O suporte técnico segue de plantão para máquinas paradas.",
  "capa": null,
  "linhas": [
    {
      "id": "l-aviso",
      "colunas": [
        {
          "id": "b-aviso",
          "tipo": "aviso",
          "titulo": "Rascunho de exemplo",
          "texto": "Este post ainda não foi publicado. Ajuste as datas antes de publicar."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-datas",
      "colunas": [
        {
          "id": "b-datas",
          "tipo": "tabela",
          "linhas": [
            [
              "Setor",
              "Para em",
              "Volta em"
            ],
            [
              "Fábrica",
              "23 de dezembro",
              "5 de janeiro"
            ],
            [
              "Suporte técnico",
              "Não para",
              "Não para"
            ]
          ]
        }
      ],
      "proporcao": 50
    }
  ]
}$post$::jsonb
)
on conflict (slug) do nothing;
