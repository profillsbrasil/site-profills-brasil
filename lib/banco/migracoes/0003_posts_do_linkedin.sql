-- Os 8 posts escritos em 16/11/2026 a partir da página da Profills no LinkedIn, todos como rascunho: o autor publica pelo admin.
-- As imagens de capa e do meio do texto já estão no bucket, nas chaves que cada post aponta.

insert into blog_posts (slug, estado, versao, criado_em, atualizado_em, publicado_em, conteudo)
values (
  'nata-no-stand-up-pouch-de-300-g-com-bico-no-lugar-do-pote',
  'rascunho',
  1,
  '2026-11-16T21:00:00.000Z',
  '2026-11-16T21:00:00.000Z',
  null,
  $post${
  "assunto": "embalagem",
  "titulo": "Nata no stand-up pouch de 300 g com bico, no lugar do pote",
  "resumo": "O pouch com bico dosador dispensa a colher, ocupa menos espaço no caminhão e usa menos plástico que o pote de PP. Mostramos o que muda e a linha que envasa o pouch com tampa.",
  "capa": "/blog/nata-no-stand-up-pouch-de-300-g-com-bico-no-lugar-do-pote/capa-envasadora-stand-up-pouch-pre-formado-com-tampa-65e1f7a629.webp",
  "linhas": [
    {
      "id": "l-abertura",
      "colunas": [
        {
          "id": "b-abertura",
          "tipo": "paragrafo",
          "texto": "No laticínio, a nata de 300 g começa a trocar o pote rígido pelo stand-up pouch com bico dosador. A troca muda o uso da nata na cozinha de quem compra e a conta de quem transporta e estoca a embalagem."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-sem-colher",
      "colunas": [
        {
          "id": "b-sem-colher",
          "tipo": "titulo",
          "texto": "Sem colher na nata"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-bico",
      "colunas": [
        {
          "id": "b-bico",
          "tipo": "paragrafo",
          "texto": "Com o bico, o consumidor dosa a nata direto do pouch. Ele dispensa a colher, e o risco de contaminação cruzada cai junto."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-colapsa",
      "colunas": [
        {
          "id": "b-colapsa",
          "tipo": "paragrafo",
          "texto": "O pouch colapsa conforme a nata sai, então dá para tirar quase todo o produto. No pote rígido, parte da nata fica nos cantos. A tampa rosqueável veda a embalagem, segura o frescor e evita que a nata pegue cheiro da geladeira."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-ilustracao",
      "colunas": [
        {
          "id": "b-ilustracao",
          "tipo": "imagem",
          "src": "/blog/nata-no-stand-up-pouch-de-300-g-com-bico-no-lugar-do-pote/nata-pouch-bico-3a4c4388ef.webp",
          "legenda": "Nata saindo do stand-up pouch com bico sobre uma tigela de morangos, com o pote rígido ao lado."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-caminhao",
      "colunas": [
        {
          "id": "b-caminhao",
          "tipo": "titulo",
          "texto": "O pote vazio ocupa o caminhão"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-flexivel",
      "colunas": [
        {
          "id": "b-flexivel",
          "tipo": "paragrafo",
          "texto": "A diferença maior aparece antes do envase. Como o material é flexível, um caminhão de pouches vazios leva muito mais embalagens que um caminhão de potes rígidos. Na carga e no estoque, o pouch pesa menos e ocupa menos espaço."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-comparacao",
      "colunas": [
        {
          "id": "b-comparacao",
          "tipo": "tabela",
          "linhas": [
            [
              "Na nata",
              "Pote rígido",
              "Pouch com bico"
            ],
            [
              "Como dosar",
              "Colher",
              "Bico"
            ],
            [
              "Fim do produto",
              "Sobra nos cantos",
              "Quase tudo sai"
            ],
            [
              "Plástico",
              "Polipropileno (PP)",
              "Menos plástico"
            ],
            [
              "Peso na carga",
              "Maior",
              "Menor"
            ],
            [
              "Espaço no estoque",
              "Maior",
              "Menor"
            ]
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-gondola",
      "colunas": [
        {
          "id": "b-gondola",
          "tipo": "paragrafo",
          "texto": "Na gôndola, o formato vertical deixa a marca repetir mais frentes no mesmo trecho de prateleira."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-plastico",
      "colunas": [
        {
          "id": "b-plastico",
          "tipo": "paragrafo",
          "texto": "A redução de resíduo plástico também fica à vista de quem compra e alinha a marca às metas de ESG."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-linha",
      "colunas": [
        {
          "id": "b-linha",
          "tipo": "titulo",
          "texto": "A linha que envasa o pouch com tampa"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-linha-pouch",
      "colunas": [
        {
          "id": "b-linha-pouch",
          "tipo": "paragrafo",
          "texto": "Na Profills, a Linha Pouch envasa stand-up pouches pré-formados e aplica a tampa rosqueável na mesma máquina. Dosagem, posicionamento e fechamento ficam sob um CLP com IHM touchscreen."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-configuracao",
      "colunas": [
        {
          "id": "b-configuracao",
          "tipo": "paragrafo",
          "texto": "A linha foi feita para líquidos e pastosos, e bebidas lácteas estão na lista de produtos dela. Configuramos cada máquina conforme o bico, a tampa, o produto e o volume."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-ficha",
      "colunas": [
        {
          "id": "b-ficha",
          "tipo": "lista",
          "itens": [
            "Produção de até 2.400 unidades por hora",
            "Dosagem temporizada e datação por inkjet",
            "Largura final da embalagem de 157 mm e comprimento de 180 a 280 mm",
            "Pouch em PET + PE, PET + PE + alumínio, BOPP, BOPA ou EVOH",
            "Estrutura em aço inoxidável AISI 304, alumínio, policarbonato e aço carbono",
            "Área de operação de 5.300 x 3.300 mm"
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-fim",
      "colunas": [
        {
          "id": "b-fim",
          "tipo": "paragrafo",
          "texto": "Potência, consumo de ar e o restante da ficha técnica estão na página da máquina."
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
          "slug": "envasadora-stand-up-pouch-pre-formado-com-tampa"
        }
      ],
      "proporcao": 50
    }
  ]
}$post$
)
on conflict (slug) do nothing;

insert into blog_posts (slug, estado, versao, criado_em, atualizado_em, publicado_em, conteudo)
values (
  'geleia-em-stick-no-lugar-do-pote-de-vidro',
  'rascunho',
  1,
  '2026-11-16T21:00:00.000Z',
  '2026-11-16T21:00:00.000Z',
  null,
  $post${
  "assunto": "embalagem",
  "titulo": "Geleia em stick no lugar do pote de vidro",
  "resumo": "O stick de dose única pesa menos que o vidro, aguenta queda e deixa o cliente provar um sabor sem comprar o pote inteiro. Mostramos onde ele entra e como a Linha TC3SC envasa esse formato.",
  "capa": "/blog/geleia-em-stick-no-lugar-do-pote-de-vidro/capa-envasadora-stick-tc3sc-1-a-4-vias-dc54fea5bd.webp",
  "linhas": [
    {
      "id": "l-abertura",
      "colunas": [
        {
          "id": "b-abertura",
          "tipo": "paragrafo",
          "texto": "Durante muito tempo, a geleia foi produto de mesa: um pote de vidro aberto em casa e dividido pela família ao longo de semanas. Hoje o consumidor quer levar a porção na lancheira ou na mochila da academia, e o stick, uma embalagem estreita de dose única, atende esse uso."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-vidro-fica",
      "colunas": [
        {
          "id": "b-vidro-fica",
          "tipo": "paragrafo",
          "texto": "O pote de vidro continua com espaço no varejo gourmet e nos presentes. Em hotelaria, food service, e-commerce e lanche rápido, o stick resolve problemas de transporte e de higiene que o pote carrega."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-t-peso",
      "colunas": [
        {
          "id": "b-t-peso",
          "tipo": "titulo",
          "texto": "Menos peso no caminhão"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-peso",
      "colunas": [
        {
          "id": "b-peso",
          "tipo": "paragrafo",
          "texto": "Para o mesmo volume de geleia, o vidro pesa muito mais que a embalagem flexível. O pote é rígido e redondo e deixa espaço vazio entre as unidades. Na caixa, ele ainda pede divisória de papelão para não quebrar."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-denso",
      "colunas": [
        {
          "id": "b-denso",
          "tipo": "paragrafo",
          "texto": "O stick se acomoda denso na caixa secundária e ocupa menos prateleira, no estoque do fabricante e no do varejista. Ele também aguenta queda e compressão. Um pote que cai vira produto perdido e caco de vidro no chão."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-t-porcao",
      "colunas": [
        {
          "id": "b-t-porcao",
          "tipo": "titulo",
          "texto": "Uma porção fechada para cada cliente"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-selada",
      "colunas": [
        {
          "id": "b-selada",
          "tipo": "paragrafo",
          "texto": "Cada stick sai lacrado. A geleia fica protegida do ar e da umidade até a hora de abrir, enquanto o pote é aberto e fechado muitas vezes. No café da manhã do hotel, o hóspede recebe uma porção que ninguém tocou antes."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-imagem",
      "colunas": [
        {
          "id": "b-imagem",
          "tipo": "imagem",
          "src": "/blog/geleia-em-stick-no-lugar-do-pote-de-vidro/geleia-stick-b8bbb0e2c3.webp",
          "legenda": "Geleia saindo de um stick de dose única sobre a torrada, com o pote de vidro ao fundo."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-sem-talher",
      "colunas": [
        {
          "id": "b-sem-talher",
          "tipo": "paragrafo",
          "texto": "O cliente rasga o stick no entalhe de abre-fácil e passa a geleia direto no pão ou no biscoito. Do lado da cozinha, a dose fechada facilita a conta: o gestor sabe quanto custa cada café da manhã servido, sem o desperdício dos potes que ficaram abertos."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-t-sabor",
      "colunas": [
        {
          "id": "b-t-sabor",
          "tipo": "titulo",
          "texto": "Provar um sabor sem comprar o pote"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-iyengar",
      "colunas": [
        {
          "id": "b-iyengar",
          "tipo": "paragrafo",
          "texto": "A professora Sheena Iyengar conduziu um experimento que ficou conhecido como o estudo da geleia. Um expositor com 24 variedades atraiu mais curiosidade, mas só 3% das pessoas compraram. Com 6 opções, a compra chegou a 30%."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-kit",
      "colunas": [
        {
          "id": "b-kit",
          "tipo": "paragrafo",
          "texto": "Num kit com sabores sortidos em stick, o cliente experimenta uma combinação nova sem arriscar o preço de um pote inteiro. Se gostar, a marca ganha a chance de vender o pote depois."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-t-onde",
      "colunas": [
        {
          "id": "b-t-onde",
          "tipo": "titulo",
          "texto": "Onde o stick de geleia entra"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-onde",
      "colunas": [
        {
          "id": "b-onde",
          "tipo": "lista",
          "itens": [
            "Hotéis, companhias aéreas, cafés e catering que servem porção individual",
            "Kits de café da manhã vendidos para empresas",
            "Multipacks com sabores sortidos no varejo",
            "Lanche para levar na lancheira ou na mochila"
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-t-maquina",
      "colunas": [
        {
          "id": "b-t-maquina",
          "tipo": "titulo",
          "texto": "A Linha TC3SC no envase de geleia"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-tc3sc",
      "colunas": [
        {
          "id": "b-tc3sc",
          "tipo": "paragrafo",
          "texto": "A Linha TC3SC Stick envasa líquidos, pastosos, pós e granulados em stick e roda com uma a quatro vias de envase. O operador controla a máquina por um CLP com IHM touchscreen. O filme escolhido define a barreira da embalagem contra oxigênio e umidade."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-specs",
      "colunas": [
        {
          "id": "b-specs",
          "tipo": "tabela",
          "linhas": [
            [
              "Na TC3SC",
              "O que a máquina oferece"
            ],
            [
              "Vias de envase",
              "1 a 4"
            ],
            [
              "Capacidade",
              "Até 4.000 unidades por hora"
            ],
            [
              "Dosagem",
              "Temporizada, por bomba positiva ou volumétrica"
            ],
            [
              "Abre-fácil",
              "Simples, triangular ou serrilhado"
            ],
            [
              "Datação",
              "Alto-relevo, inkjet ou hot stamping"
            ],
            [
              "Filmes",
              "PET + PE; PET + PE + alumínio; BOPP; BOPA; EVOH"
            ],
            [
              "Tamanho do stick",
              "50 a 90 mm de largura e 70 a 180 mm de comprimento"
            ]
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-portfolio",
      "colunas": [
        {
          "id": "b-portfolio",
          "tipo": "paragrafo",
          "texto": "Quem já envasa geleia em pote pode manter o vidro na linha gourmet e abrir o stick para hotelaria e kits."
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
          "slug": "envasadora-stick-tc3sc-1-a-4-vias"
        }
      ],
      "proporcao": 50
    }
  ]
}$post$
)
on conflict (slug) do nothing;

insert into blog_posts (slug, estado, versao, criado_em, atualizado_em, publicado_em, conteudo)
values (
  'molho-de-tomate-em-stand-up-pouch-com-envase-mecanico',
  'rascunho',
  1,
  '2026-11-16T21:00:00.000Z',
  '2026-11-16T21:00:00.000Z',
  null,
  $post${
  "assunto": "maquina",
  "titulo": "Molho de tomate em stand-up pouch com envase mecânico",
  "resumo": "A Linha Pouch Speed doseia o molho de tomate por bomba de deslocamento positivo e produz até 5.400 pouches por hora, com controle pelo painel touchscreen.",
  "capa": "/blog/molho-de-tomate-em-stand-up-pouch-com-envase-mecanico/capa-envasadora-stand-up-pouch-speed-b2a5497b21.webp",
  "linhas": [
    {
      "id": "l-abertura",
      "colunas": [
        {
          "id": "b-abertura",
          "tipo": "paragrafo",
          "texto": "A consistência do molho de tomate varia, e a dosagem precisa entregar o mesmo volume em cada embalagem. Para esse produto, oferecemos a Linha Pouch Speed, a nossa envasadora stand-up pouch mecânica. Ela envasa molho de tomate, ketchup, maionese, mostarda e molhos prontos, com a dosagem configurada para cada produto."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-dosagem",
      "colunas": [
        {
          "id": "b-dosagem",
          "tipo": "titulo",
          "texto": "Dosagem por deslocamento positivo"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-bomba",
      "colunas": [
        {
          "id": "b-bomba",
          "tipo": "paragrafo",
          "texto": "No molho de tomate, a Linha Pouch Speed trabalha com bomba positiva. Projetamos esse sistema de deslocamento positivo para a consistência variável do molho. A dose fica igual de um pouch para o outro, e isso evita o desperdício de molho."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-outras-doses",
      "colunas": [
        {
          "id": "b-outras-doses",
          "tipo": "paragrafo",
          "texto": "A mesma máquina aceita dosagem temporizada ou volumétrica, para os outros produtos da fábrica."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-imagem",
      "colunas": [
        {
          "id": "b-imagem",
          "tipo": "imagem",
          "src": "/blog/molho-de-tomate-em-stand-up-pouch-com-envase-mecanico/molho-tomate-pouch-53a2ebc227.webp",
          "legenda": "Molho de tomate saindo de um stand-up pouch para a panela."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-caminho",
      "colunas": [
        {
          "id": "b-caminho",
          "tipo": "titulo",
          "texto": "O caminho do pouch na máquina"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-fluxo",
      "colunas": [
        {
          "id": "b-fluxo",
          "tipo": "paragrafo",
          "texto": "A Linha Pouch Speed junta as etapas do envase num fluxo contínuo:"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-etapas",
      "colunas": [
        {
          "id": "b-etapas",
          "tipo": "lista",
          "itens": [
            "Alimentação da embalagem",
            "Abertura do pouch",
            "Dosagem do molho",
            "Selagem"
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-capacidade",
      "colunas": [
        {
          "id": "b-capacidade",
          "tipo": "paragrafo",
          "texto": "A produção chega a 5.400 unidades por hora. A datação sai por inkjet ou por hot stamping, conforme a escolha da fábrica."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-embalagem",
      "colunas": [
        {
          "id": "b-embalagem",
          "tipo": "titulo",
          "texto": "A embalagem que sai da máquina"
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
              "Medida",
              "Faixa"
            ],
            [
              "Largura final da embalagem",
              "125 a 280 mm"
            ],
            [
              "Comprimento final da embalagem",
              "100 a 200 mm"
            ],
            [
              "Largura do filme",
              "320 a 650 mm"
            ],
            [
              "Espessura do filme",
              "130 a 160 µm"
            ],
            [
              "Materiais compatíveis",
              "PET + PE; PET + PE + alumínio; BOPP; BOPA; EVOH"
            ]
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-formato",
      "colunas": [
        {
          "id": "b-formato",
          "tipo": "paragrafo",
          "texto": "A máquina também trabalha com formato especial customizado, para a marca que quer um pouch com desenho próprio."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-painel",
      "colunas": [
        {
          "id": "b-painel",
          "tipo": "titulo",
          "texto": "O painel touchscreen"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-ihm",
      "colunas": [
        {
          "id": "b-ihm",
          "tipo": "paragrafo",
          "texto": "O comando é por CLP com IHM touchscreen. Pelo painel, o operador acompanha a produção em tempo real. Os ajustes e os diagnósticos também saem dali, e isso encurta o tempo de linha parada."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-clientes",
      "colunas": [
        {
          "id": "b-clientes",
          "tipo": "titulo",
          "texto": "Quem já usa máquinas Profills"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-instaladas",
      "colunas": [
        {
          "id": "b-instaladas",
          "tipo": "paragrafo",
          "texto": "Temos mais de 1.300 máquinas instaladas pelo país, em segmentos diferentes. Ambev e Tambaú estão entre as empresas que usam a nossa tecnologia."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-teste",
      "colunas": [
        {
          "id": "b-teste",
          "tipo": "titulo",
          "texto": "Antes de fechar a configuração"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-testes",
      "colunas": [
        {
          "id": "b-testes",
          "tipo": "paragrafo",
          "texto": "Fechamos a configuração da Linha Pouch Speed depois de testar o seu molho na embalagem que você pretende usar. É nesse teste que escolhemos a dosagem e os ajustes da máquina."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-instalacao",
      "colunas": [
        {
          "id": "b-instalacao",
          "tipo": "paragrafo",
          "texto": "Para planejar o espaço na fábrica, conte com uma área de operação de 5.300 x 3.300 mm. A máquina roda em 220 V / 60 Hz, tem 8,97 kW de potência ativa instalada e consome 349 L/min de ar. A estrutura usa aço inoxidável AISI 304, alumínio, policarbonato e aço carbono."
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
          "slug": "envasadora-stand-up-pouch-speed"
        }
      ],
      "proporcao": 50
    }
  ]
}$post$
)
on conflict (slug) do nothing;

insert into blog_posts (slug, estado, versao, criado_em, atualizado_em, publicado_em, conteudo)
values (
  'formar-o-pouch-na-maquina-ou-comprar-pre-formado',
  'rascunho',
  1,
  '2026-11-16T21:00:00.000Z',
  '2026-11-16T21:00:00.000Z',
  null,
  $post${
  "assunto": "embalagem",
  "titulo": "Quando formar o pouch na máquina e quando comprar pré-formado",
  "resumo": "Na HFFS, a máquina forma o pouch a partir da bobina de filme. No pick-fill-seal, ela recebe o pouch pronto. Comparamos os dois caminhos e mostramos onde entra a Linha Pouch Compacta.",
  "capa": "/blog/formar-o-pouch-na-maquina-ou-comprar-pre-formado/capa-envasadora-pouch-compacta-pre-formado-0f9adf99e0.webp",
  "linhas": [
    {
      "id": "l-dois-jeitos",
      "colunas": [
        {
          "id": "b-dois-jeitos",
          "tipo": "titulo",
          "texto": "Dois jeitos de chegar ao mesmo pouch"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-o-pouch",
      "colunas": [
        {
          "id": "b-o-pouch",
          "tipo": "paragrafo",
          "texto": "O stand-up pouch é um laminado de várias camadas feito para ficar em pé sozinho. O filme leva barreiras contra oxigênio, luz e umidade de acordo com o produto, e por isso o mesmo formato atende de grãos a líquidos corrosivos."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-tecnologias",
      "colunas": [
        {
          "id": "b-tecnologias",
          "tipo": "paragrafo",
          "texto": "Para envasar esse pouch, a fábrica escolhe entre duas tecnologias. Na HFFS (Horizontal Form-Fill-Seal), a máquina recebe uma bobina de filme, forma a embalagem, envasa e sela. No pick-fill-seal, a máquina recebe o pouch pré-formado e faz o envase e a selagem."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-escolha",
      "colunas": [
        {
          "id": "b-escolha",
          "tipo": "paragrafo",
          "texto": "A escolha mexe no investimento em máquina, na velocidade da linha e no tempo de troca entre um produto e outro. A tabela resume o que cada caminho oferece."
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
              "Critério",
              "HFFS",
              "Pouch pré-formado"
            ],
            [
              "A máquina recebe",
              "Bobina de filme",
              "Pouch pronto"
            ],
            [
              "A máquina faz",
              "Forma, envasa e sela",
              "Envasa e sela"
            ],
            [
              "Ponto forte",
              "Alta velocidade",
              "Troca rápida de produto"
            ],
            [
              "Formato",
              "Customizável",
              "O do pouch comprado"
            ],
            [
              "Investimento inicial em máquina",
              "Maior",
              "Menor"
            ]
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-quando-hffs",
      "colunas": [
        {
          "id": "b-quando-hffs",
          "tipo": "titulo",
          "texto": "Quando a HFFS faz sentido"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-hffs",
      "colunas": [
        {
          "id": "b-hffs",
          "tipo": "paragrafo",
          "texto": "A HFFS serve à fábrica que precisa de alta velocidade e quer customizar o formato da embalagem, já que é a própria máquina que forma o pouch a partir da bobina. Em troca, ela pede mais investimento em maquinário do que o caminho do pré-formado."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-quando-pre",
      "colunas": [
        {
          "id": "b-quando-pre",
          "tipo": "titulo",
          "texto": "Quando o pré-formado faz sentido"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-pre",
      "colunas": [
        {
          "id": "b-pre",
          "tipo": "paragrafo",
          "texto": "O pouch pré-formado atende quem quer começar com menos investimento em máquina e quem precisa de trocas rápidas de produto na linha, com setup ágil."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-ilustracao",
      "colunas": [
        {
          "id": "b-ilustracao",
          "tipo": "imagem",
          "src": "/blog/formar-o-pouch-na-maquina-ou-comprar-pre-formado/hffs-ou-pre-formado-7192988e3b.webp",
          "legenda": "À esquerda, a bobina de filme que vira pouch na máquina. À direita, os pouches que já chegam prontos."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-compacta-titulo",
      "colunas": [
        {
          "id": "b-compacta-titulo",
          "tipo": "titulo",
          "texto": "A Linha Pouch Compacta"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-compacta",
      "colunas": [
        {
          "id": "b-compacta",
          "tipo": "paragrafo",
          "texto": "Nós fabricamos a Linha Pouch Compacta para stand-up pouch pré-formado. Ela junta alimentação da embalagem, abertura, dosagem e selagem num conjunto com área de operação de 970 x 570 mm, e produz até 900 unidades por hora."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-compacta-para-quem",
      "colunas": [
        {
          "id": "b-compacta-para-quem",
          "tipo": "paragrafo",
          "texto": "Ela atende a empresa que quer automatizar o envase sem implantar uma linha de grande porte. A configuração sai do produto e da embalagem de cada cliente, com estas opções:"
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
            "Dosagem temporizada ou volumétrica, para líquidos, grãos e pós",
            "Datação por inkjet ou hot stamping",
            "Comando por CLP com IHM touchscreen",
            "Integração com alimentadores e esteiras, sob projeto"
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-speed",
      "colunas": [
        {
          "id": "b-speed",
          "tipo": "paragrafo",
          "texto": "Quando o volume cresce, a Linha Pouch Speed também envasa stand-up pouch e chega a 5.400 unidades por hora, com formato especial customizado."
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
          "slug": "envasadora-pouch-compacta-pre-formado"
        }
      ],
      "proporcao": 50
    }
  ]
}$post$
)
on conflict (slug) do nothing;

insert into blog_posts (slug, estado, versao, criado_em, atualizado_em, publicado_em, conteudo)
values (
  'embalagem-gable-top-para-liquidos-e-secos-sem-aluminio',
  'rascunho',
  1,
  '2026-11-16T21:00:00.000Z',
  '2026-11-16T21:00:00.000Z',
  null,
  $post${
  "assunto": "embalagem",
  "titulo": "Embalagem gable top para líquidos e secos, sem alumínio",
  "resumo": "A caixa gable top usa papel-cartão revestido de polietileno, sem alumínio, e recebe produto líquido e seco. Mostramos as versões da embalagem e como a Linha GT envasa e sela cada caixa.",
  "capa": "/blog/embalagem-gable-top-para-liquidos-e-secos-sem-aluminio/capa-envasadora-gable-top-gt-21e21a7cdf.webp",
  "linhas": [
    {
      "id": "l-abertura",
      "colunas": [
        {
          "id": "b-abertura",
          "tipo": "paragrafo",
          "texto": "Gable top é a embalagem cartonada de topo em duas águas, fechado por solda. Na Profills, envasamos esse formato com a Linha GT e fornecemos o conjunto completo: a máquina, as embalagens e as embalagens secundárias."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-material-titulo",
      "colunas": [
        {
          "id": "b-material-titulo",
          "tipo": "titulo",
          "texto": "Do que a caixa é feita"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-material",
      "colunas": [
        {
          "id": "b-material",
          "tipo": "paragrafo",
          "texto": "A estrutura que a Linha GT trabalha tem três camadas: polietileno de baixa densidade (PEBD), papel-cartão e mais uma camada de PEBD. A caixa não leva alumínio e usa menos plástico do que as embalagens convencionais."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-esg",
      "colunas": [
        {
          "id": "b-esg",
          "tipo": "paragrafo",
          "texto": "Esse material pesa na decisão de empresas que respondem a metas ESG e querem tirar parte do plástico da sua linha de produtos."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-produtos-titulo",
      "colunas": [
        {
          "id": "b-produtos-titulo",
          "tipo": "titulo",
          "texto": "O que dá para envasar"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-produtos",
      "colunas": [
        {
          "id": "b-produtos",
          "tipo": "paragrafo",
          "texto": "A mesma caixa recebe produto líquido e produto seco. Estas são as aplicações da Linha GT:"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-produtos-lista",
      "colunas": [
        {
          "id": "b-produtos-lista",
          "tipo": "lista",
          "itens": [
            "Leite, bebidas lácteas, iogurte líquido e bebidas vegetais",
            "Sucos, néctares, água de coco, cafés e chás prontos",
            "Óleos alimentícios e molhos líquidos",
            "Sabão líquido, detergente, amaciante e desinfetante",
            "Arroz, café, cereais e farinhas"
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-versoes-titulo",
      "colunas": [
        {
          "id": "b-versoes-titulo",
          "tipo": "titulo",
          "texto": "Versões da embalagem"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-versoes",
      "colunas": [
        {
          "id": "b-versoes",
          "tipo": "paragrafo",
          "texto": "A caixa sai em vários tamanhos e volumes, com tampa ou sem tampa. Há também versões com janela de visualização e com visor de nível. Na Linha GT, o volume de envase vai de 250 a 2.000 ml."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-marca",
      "colunas": [
        {
          "id": "b-marca",
          "tipo": "paragrafo",
          "texto": "A embalagem oferece boa área para comunicar a marca, e isso ajuda quem quer se diferenciar pela embalagem."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-ilustracao",
      "colunas": [
        {
          "id": "b-ilustracao",
          "tipo": "imagem",
          "src": "/blog/embalagem-gable-top-para-liquidos-e-secos-sem-aluminio/gable-top-cartonado-7e9ec52f5d.webp",
          "legenda": "Caixas gable top de tamanhos diferentes, uma servindo suco e outra ao lado de cereal."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-linha-titulo",
      "colunas": [
        {
          "id": "b-linha-titulo",
          "tipo": "titulo",
          "texto": "Como a Linha GT envasa"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-linha",
      "colunas": [
        {
          "id": "b-linha",
          "tipo": "paragrafo",
          "texto": "A Linha GT dosa o produto por volume e fecha o topo da caixa com calor e pressão. Para a higiene, a máquina esteriliza a embalagem com luz ultravioleta. O operador comanda o envase por uma tela touchscreen."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-linha-tabela",
      "colunas": [
        {
          "id": "b-linha-tabela",
          "tipo": "tabela",
          "linhas": [
            [
              "Sistema",
              "Na Linha GT"
            ],
            [
              "Dosagem",
              "Volumétrica, com variação de 0,1 a 1%"
            ],
            [
              "Esterilização",
              "Lâmpada germicida ultravioleta"
            ],
            [
              "Solda",
              "Barra quente, ar quente e pressão"
            ],
            [
              "Datação",
              "Inkjet ou hot stamping"
            ],
            [
              "Comando",
              "CLP com IHM touchscreen"
            ],
            [
              "Capacidade",
              "Até 3.000 unidades por hora"
            ]
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-instalacao",
      "colunas": [
        {
          "id": "b-instalacao",
          "tipo": "paragrafo",
          "texto": "A máquina ocupa uma área de operação de 3.000 x 2.500 mm e entrega as caixas numa esteira de saída de 1,5 m. É feita de aço inoxidável AISI 304, alumínio, policarbonato e aço carbono, e opera em 220 V / 60 Hz."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-troca-titulo",
      "colunas": [
        {
          "id": "b-troca-titulo",
          "tipo": "titulo",
          "texto": "A troca para o cartonado"
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
          "texto": "Quem decide passar um produto do plástico para o cartonado precisa da máquina e da embalagem ao mesmo tempo. Fornecemos as duas, junto com as embalagens secundárias, e acompanhamos a empresa na transição com a nossa experiência no envase gable top."
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
}$post$
)
on conflict (slug) do nothing;

insert into blog_posts (slug, estado, versao, criado_em, atualizado_em, publicado_em, conteudo)
values (
  'a-embalagem-certa-para-o-cafe',
  'rascunho',
  1,
  '2026-11-16T21:00:00.000Z',
  '2026-11-16T21:00:00.000Z',
  null,
  $post${
  "assunto": "embalagem",
  "titulo": "A embalagem certa para o café",
  "resumo": "A caixa gable top fecha de forma hermética, guarda o aroma do café e não leva alumínio. A Linha GT envasa café nesse formato.",
  "capa": "/blog/a-embalagem-certa-para-o-cafe/capa-envasadora-gable-top-gt-c07910c952.webp",
  "linhas": [
    {
      "id": "l-abertura",
      "colunas": [
        {
          "id": "b-abertura",
          "tipo": "paragrafo",
          "texto": "O café chega ao consumidor dentro de uma embalagem, e é ela que segura o aroma e a frescura do produto até a xícara. Para essa tarefa, nós da Profills indicamos a caixa gable top, um dos formatos que as nossas máquinas envasam."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-o-que-guarda",
      "colunas": [
        {
          "id": "b-o-que-guarda",
          "tipo": "titulo",
          "texto": "O que a caixa gable top guarda"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-hermetica",
      "colunas": [
        {
          "id": "b-hermetica",
          "tipo": "paragrafo",
          "texto": "A gable top fecha de forma hermética. Com a caixa lacrada, o aroma e a frescura do café ficam do lado de dentro até o consumidor abrir."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-material",
      "colunas": [
        {
          "id": "b-material",
          "tipo": "paragrafo",
          "texto": "A estrutura que a Linha GT trabalha tem PEBD, papel-cartão e PEBD. A caixa é reciclável e não leva alumínio."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-imagem",
      "colunas": [
        {
          "id": "b-imagem",
          "tipo": "imagem",
          "src": "/blog/a-embalagem-certa-para-o-cafe/embalagem-cafe-96db5daebf.webp",
          "legenda": "Caixa gable top e stand-up pouch com zipper ao lado de café em grão e moído."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-esg",
      "colunas": [
        {
          "id": "b-esg",
          "tipo": "paragrafo",
          "texto": "Consumidores e mercado valorizam cada vez mais as práticas ESG. Uma marca de café que troca para a gable top mostra ao cliente, na própria caixa, que se preocupa com o meio ambiente."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-po-grao",
      "colunas": [
        {
          "id": "b-po-grao",
          "tipo": "titulo",
          "texto": "Do pó ao café pronto"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-produtos",
      "colunas": [
        {
          "id": "b-produtos",
          "tipo": "paragrafo",
          "texto": "A Linha GT envasa líquidos, pós, grãos e sólidos em embalagem cartonada. Na lista de produtos da máquina estão o café e os cafés prontos, ao lado de arroz, cereais e farinhas. Assim, a mesma linha atende quem vende café para passar em casa e quem vende a bebida pronta."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-comparacao",
      "colunas": [
        {
          "id": "b-comparacao",
          "tipo": "titulo",
          "texto": "Gable top ou stand-up pouch"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-pouch",
      "colunas": [
        {
          "id": "b-pouch",
          "tipo": "paragrafo",
          "texto": "O stand-up pouch também serve ao café. Muitos modelos têm zipper, e o consumidor abre e fecha o pacote várias vezes com o frescor mantido por mais tempo. A gable top atende a marca que prefere a caixa lacrada e o material sem alumínio."
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
              "Para o café",
              "Gable top",
              "Stand-up pouch"
            ],
            [
              "Fechamento",
              "Hermético",
              "Zipper em muitos modelos"
            ],
            [
              "Na prateleira",
              "Área para a marca",
              "Fica em pé sozinho"
            ]
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-como-envasa",
      "colunas": [
        {
          "id": "b-como-envasa",
          "tipo": "titulo",
          "texto": "Como a Linha GT envasa"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-comando",
      "colunas": [
        {
          "id": "b-comando",
          "tipo": "paragrafo",
          "texto": "A Linha GT roda com comando por CLP e IHM touchscreen. Estes são os recursos que tocam na caixa de café:"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-recursos",
      "colunas": [
        {
          "id": "b-recursos",
          "tipo": "lista",
          "itens": [
            "Dosagem volumétrica, com variação de 0,1 a 1%",
            "Esterilização por lâmpada germicida ultravioleta",
            "Solda por barra quente, ar quente e pressão",
            "Datação por inkjet ou hot stamping"
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-capacidade",
      "colunas": [
        {
          "id": "b-capacidade",
          "tipo": "paragrafo",
          "texto": "A máquina envasa caixas de 250 a 2.000 ml e produz até 3.000 unidades por hora."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-fecho",
      "colunas": [
        {
          "id": "b-fecho",
          "tipo": "paragrafo",
          "texto": "Para o café em gable top, a máquina é a Linha GT."
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
}$post$
)
on conflict (slug) do nothing;

insert into blog_posts (slug, estado, versao, criado_em, atualizado_em, publicado_em, conteudo)
values (
  'acordo-ue-mercosul-e-a-modernizacao-da-fabrica-em-2026',
  'rascunho',
  1,
  '2026-11-16T21:00:00.000Z',
  '2026-11-16T21:00:00.000Z',
  null,
  $post${
  "assunto": "nota",
  "titulo": "Acordo UE-Mercosul e a modernização da fábrica em 2026",
  "resumo": "Em janeiro de 2026, olhamos o que o acordo com a União Europeia pedia de quem envasa no Brasil e onde a linha de envase entra nessa conta.",
  "capa": null,
  "linhas": [
    {
      "id": "l-o-que-escrevemos",
      "colunas": [
        {
          "id": "b-o-que-escrevemos",
          "tipo": "titulo",
          "texto": "O que escrevemos em janeiro"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-janeiro",
      "colunas": [
        {
          "id": "b-janeiro",
          "tipo": "paragrafo",
          "texto": "Em 16 de janeiro de 2026, publicamos no LinkedIn uma análise sobre o que o ano pedia da indústria brasileira. Um dos temas era o acordo entre o Mercosul e a União Europeia. Os dados abaixo são os daquela data, e o andamento do acordo depois de janeiro fica fora deste texto."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-acordo",
      "colunas": [
        {
          "id": "b-acordo",
          "tipo": "paragrafo",
          "texto": "Naquele momento, o assunto era a aprovação final de um pacto que cria uma das maiores zonas de livre comércio do mundo. Pelos números do Estadão e do Itamaraty, as tarifas de 95% dos bens brasileiros cairiam a zero, em prazos que variam de 4 a 12 anos."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-contrapartida",
      "colunas": [
        {
          "id": "b-contrapartida",
          "tipo": "titulo",
          "texto": "A contrapartida europeia"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-rigor",
      "colunas": [
        {
          "id": "b-rigor",
          "tipo": "paragrafo",
          "texto": "O mercado europeu cobra com rigor a rastreabilidade e as normas ambientais. Segundo a LLYC e o Agroportal, citados no artigo, quem não modernizar o processo produtivo pode ficar de fora."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-passaporte",
      "colunas": [
        {
          "id": "b-passaporte",
          "tipo": "paragrafo",
          "texto": "Por isso recomendamos antecipar a adequação às normas de sustentabilidade da Europa e investir em rastreamento da cadeia. No artigo, chamamos esse preparo de passaporte de entrada no mercado europeu."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-custo",
      "colunas": [
        {
          "id": "b-custo",
          "tipo": "titulo",
          "texto": "O custo de produzir aqui"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-abimaq",
      "colunas": [
        {
          "id": "b-abimaq",
          "tipo": "paragrafo",
          "texto": "A ABIMAQ calcula que produzir no Brasil custa 30% mais do que nos países da OCDE. Boa parte da diferença vem da produtividade baixa. Segundo a ABIMAQ e a InfoMoney, a indústria brasileira opera com 10 robôs para cada 10 mil trabalhadores."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-feira",
      "colunas": [
        {
          "id": "b-feira",
          "tipo": "paragrafo",
          "texto": "Para quem fabrica máquinas de envase e embalagem, a feira Envase Brasil 2026 indicava que o diferencial competitivo passou a ser a redução de perdas e o setup rápido de linha."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-ilustracao",
      "colunas": [
        {
          "id": "b-ilustracao",
          "tipo": "imagem",
          "src": "/blog/acordo-ue-mercosul-e-a-modernizacao-da-fabrica-em-2026/ue-mercosul-2026-f05dfcfea5.webp",
          "legenda": "Caixas saindo da linha de envase para o palete, com um contêiner na doca ao fundo."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-sugerimos",
      "colunas": [
        {
          "id": "b-sugerimos",
          "tipo": "titulo",
          "texto": "O que sugerimos à fábrica"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-acoes",
      "colunas": [
        {
          "id": "b-acoes",
          "tipo": "paragrafo",
          "texto": "O artigo fechava com ações práticas para a indústria que quer chegar à Europa com margem:"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-lista-acoes",
      "colunas": [
        {
          "id": "b-lista-acoes",
          "tipo": "lista",
          "itens": [
            "Trocar o maquinário obsoleto por linhas de envase automatizadas, que gastam menos insumo e energia",
            "Usar o crédito para inovação liberado pelo BNDES, de R$ 58 bilhões segundo o BNDES e a Informaq",
            "Produzir embalagens menores e monomateriais, para abrir canais em saudabilidade e e-commerce",
            "Trocar parte do gasto operacional por investimento em CAPEX, para reduzir o custo unitário"
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-profills",
      "colunas": [
        {
          "id": "b-profills",
          "tipo": "titulo",
          "texto": "Onde a Profills entra"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-ponta-a-ponta",
      "colunas": [
        {
          "id": "b-ponta-a-ponta",
          "tipo": "paragrafo",
          "texto": "Uma linha automatizada depende de equipamentos que trabalham no mesmo ritmo, do preparo do produto ao final de linha. A Profills projeta essa linha ponta a ponta, a partir do layout da fábrica, da embalagem e da meta de produção. O projeto pode reunir:"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-lista-linha",
      "colunas": [
        {
          "id": "b-lista-linha",
          "tipo": "lista",
          "itens": [
            "Reator e tanque encamisado no preparo do produto",
            "Bomba de transferência, bomba dosadora e elevador de rosca",
            "Envasadora GT ou TC",
            "Esteiras de elevação e saída, mesa acumuladora e encaixotadeira",
            "Plataforma NR17 para a operação"
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-clp",
      "colunas": [
        {
          "id": "b-clp",
          "tipo": "paragrafo",
          "texto": "O comando integra os equipamentos por CLP e pelas interfaces de cada um. A capacidade de produção depende do conjunto integrado, e a área de operação sai do estudo de layout. Energia, ar e utilidades são dimensionados no projeto executivo."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-produtos",
      "colunas": [
        {
          "id": "b-produtos",
          "tipo": "paragrafo",
          "texto": "Montamos linhas para alimentos, bebidas, laticínios, molhos, saneantes, cosméticos, fertilizantes, lubrificantes, grãos e rações, entre outros produtos, e também projetos de envase e embalagem sob medida."
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
          "slug": "linha-producao-completa-envase"
        }
      ],
      "proporcao": 50
    }
  ]
}$post$
)
on conflict (slug) do nothing;

insert into blog_posts (slug, estado, versao, criado_em, atualizado_em, publicado_em, conteudo)
values (
  'vagas-no-comercial-da-profills-em-curitiba',
  'rascunho',
  1,
  '2026-11-16T21:00:00.000Z',
  '2026-11-16T21:00:00.000Z',
  null,
  $post${
  "assunto": "aviso",
  "titulo": "Vagas no comercial da Profills em Curitiba",
  "resumo": "O time comercial da Profills vende máquinas de envase e trabalha em Curitiba. Veja os cargos que já abrimos, o perfil que procuramos e onde as vagas aparecem.",
  "capa": null,
  "linhas": [
    {
      "id": "l-situacao",
      "colunas": [
        {
          "id": "b-situacao",
          "tipo": "aviso",
          "titulo": "Vaga de consultor de vendas fechada",
          "texto": "A vaga mais recente do comercial, de consultor de vendas, não recebe candidaturas agora. As vagas do comercial saem na página da Profills no LinkedIn."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-quem-vende",
      "colunas": [
        {
          "id": "b-quem-vende",
          "tipo": "paragrafo",
          "texto": "A Profills fabrica máquinas para envase de líquidos, pastosos e sólidos e atende empresas em todo o Brasil. Quem vende essas máquinas trabalha com a gente em Curitiba, e é para esse time que abrimos vagas."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-cargos",
      "colunas": [
        {
          "id": "b-cargos",
          "tipo": "titulo",
          "texto": "Cargos que já abrimos"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-cargos-intro",
      "colunas": [
        {
          "id": "b-cargos-intro",
          "tipo": "paragrafo",
          "texto": "Nos últimos meses, publicamos no LinkedIn vagas para estes cargos do comercial:"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-cargos-lista",
      "colunas": [
        {
          "id": "b-cargos-lista",
          "tipo": "lista",
          "itens": [
            "Consultor de vendas",
            "Auxiliar de vendas",
            "SDR (Sales Development Representative)",
            "Vendedor técnico de máquinas de envase"
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-presencial",
      "colunas": [
        {
          "id": "b-presencial",
          "tipo": "paragrafo",
          "texto": "Todas foram presenciais, em Curitiba e região. A de consultor de vendas era em tempo integral, de segunda a sexta, no bairro Água Verde."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-trabalho",
      "colunas": [
        {
          "id": "b-trabalho",
          "tipo": "titulo",
          "texto": "O que o consultor de vendas faz"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-trabalho-intro",
      "colunas": [
        {
          "id": "b-trabalho-intro",
          "tipo": "paragrafo",
          "texto": "Na vaga de consultor de vendas, a mais recente, descrevemos o trabalho assim:"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-trabalho-lista",
      "colunas": [
        {
          "id": "b-trabalho-lista",
          "tipo": "lista",
          "itens": [
            "Encontrar e prospectar empresas com perfil para comprar máquinas envasadoras",
            "Falar com essas empresas por telefone, WhatsApp, e-mail e redes sociais",
            "Qualificar cada lead pelo que o negócio dele precisa",
            "Apresentar as soluções da Profills e conduzir a venda até o fechamento",
            "Registrar no CRM o que descobriu sobre cada lead"
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-ilustracao",
      "colunas": [
        {
          "id": "b-ilustracao",
          "tipo": "imagem",
          "src": "/blog/vagas-no-comercial-da-profills-em-curitiba/vagas-comercial-40e44e6c1a.webp",
          "legenda": "Reunião de vendas com amostras de embalagens sobre a mesa."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-perfil",
      "colunas": [
        {
          "id": "b-perfil",
          "tipo": "titulo",
          "texto": "O perfil que procuramos"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-perfil-base",
      "colunas": [
        {
          "id": "b-perfil-base",
          "tipo": "paragrafo",
          "texto": "Procuramos um vendedor ativo, que gosta de prospectar e monta a própria carteira de oportunidades. Na última vaga, pedimos experiência em vendas ativas e prospecção B2B e B2C, domínio de técnicas de fechamento e boa comunicação falada e escrita."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-perfil-favor",
      "colunas": [
        {
          "id": "b-perfil-favor",
          "tipo": "paragrafo",
          "texto": "Algumas experiências contam a favor, mesmo sem ser exigidas:"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-perfil-lista",
      "colunas": [
        {
          "id": "b-perfil-lista",
          "tipo": "lista",
          "itens": [
            "Venda consultiva ou venda para a indústria",
            "Conhecimento de automação industrial ou de equipamentos técnicos",
            "Uso de CRM e de funil de vendas",
            "Passagem por inside sales"
          ]
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-onde",
      "colunas": [
        {
          "id": "b-onde",
          "tipo": "titulo",
          "texto": "Onde as vagas aparecem"
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-onde-texto",
      "colunas": [
        {
          "id": "b-onde-texto",
          "tipo": "paragrafo",
          "texto": "As vagas do comercial saem na página da Profills do Brasil no LinkedIn, com a descrição do cargo e o caminho para se candidatar. Seguir a página é o jeito mais simples de ver uma vaga nova quando ela for publicada."
        }
      ],
      "proporcao": 50
    },
    {
      "id": "l-onde-link",
      "colunas": [
        {
          "id": "b-onde-link",
          "tipo": "link",
          "titulo": "Profills do Brasil no LinkedIn",
          "url": "https://www.linkedin.com/company/profillsdobrasil/"
        }
      ],
      "proporcao": 50
    }
  ]
}$post$
)
on conflict (slug) do nothing;
