# Página de máquina — Catálogo 2026 (design)

**Data:** 2026-08-13
**Status:** aprovado em brainstorming (sessão com visual companion; mockups em `.superpowers/brainstorm/2603547-1786626154/content/`)
**Fontes da verdade:** `arquivos-referencia/Descritivo_Linhas_Maquinas_Site_Profills_2026.docx` (35 fichas, catálogo 2026) · `arquivos-referencia/Imagens/` (32 fotos de máquina, 33 de embalagem, 5 de categorias de produto) · PRODUCT.md · spec `2026-08-11-home-navy-linguagem-cards-design.md`

> **Pré-requisito de implementação:** este documento registra arquitetura e decisões. O **conteúdo** (textos, specs, slugs, títulos SEO das 35 fichas) vem do docx acima — quem implementa precisa dele aberto (extração em txt: converter com `soffice --headless`). Os detalhes finos de composição visual estão nos mockups HTML citados no §3.

## 1. Objetivo

Refazer a página de detalhe de máquina (`/maquinas/[id]`) a partir do Descritivo 2026: novo modelo de dados com specs estruturadas, novo template visual navy blueprint ("dossiê industrial"), SEO por máquina e migração big-bang das 35 fichas do catálogo. Referência de mercado analisada (Systempack Multiflex): estrutura informacional boa, execução fraca — nossa página entrega ficha técnica real, 3D e conversão que eles não têm.

## 2. Decisões tomadas (com o usuário, 2026-08-13)

| #   | Decisão                                            | Escolha                                                                                                                                                                                                                                                                                                                                                                                            |
| --- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Máquina piloto (valida o template)                 | Linha Pouch Speed                                                                                                                                                                                                                                                                                                                                                                                  |
| 2   | URLs                                               | Slugs do docx; redirects 301 dos ids numéricos antigos                                                                                                                                                                                                                                                                                                                                             |
| 3   | Rollout                                            | **Big-bang**: as 35 fichas migram antes do deploy; nada vai ao ar pela metade                                                                                                                                                                                                                                                                                                                      |
| 4   | Doypack id18 (sem ficha 2026)                      | Removida do catálogo; `/maquinas/18` → redirect para `/maquinas`                                                                                                                                                                                                                                                                                                                                   |
| 5   | Frascos id14/id17 (texto duplicado no site antigo) | **Sem fusão de páginas** — cada id mapeia 1:1 para uma ficha do docx: id14 → Horizontal Rotativa (até 5.000 un/h), id17 → Linear c/ Fechamento Automático (até 3.000 un/h). O que se resolve é o _texto_ duplicado, não o número de páginas                                                                                                                                                        |
| 6   | CTAs                                               | "Solicitar proposta técnica e comercial" (modal de lead existente, renomeado) + "Falar com um especialista" (WhatsApp) + "Ver máquina em operação" (âncora p/ vídeo, só quando houver). **Proibido** "Montar meu projeto" (regra do docx). Rota `/montar-maquina` continua existindo, só sai desta página                                                                                          |
| 7   | Vídeo                                              | Bloco pronto-mas-oculto: só renderiza quando a máquina tiver vídeo cadastrado; nunca quadro vazio                                                                                                                                                                                                                                                                                                  |
| 8   | Embalagem                                          | 3D interativo (`OptimizedEmbalagem3d` + `.glb` existente) quando houver modelo do tipo; foto webp nova como fallback (e para tipos sem glb)                                                                                                                                                                                                                                                        |
| 9   | Dados divergentes                                  | Docx 2026 é a verdade; divergências viram lista de pendências de engenharia (§9), não bloqueiam deploy                                                                                                                                                                                                                                                                                             |
| 10  | Taxonomia                                          | Listagem `/maquinas` adota as **8 categorias** do índice do catálogo 2026 (duas são híbridas: "Fim de linha e embalagens flexíveis", "Embalagens rígidas e higienização"); navbar atualiza junto                                                                                                                                                                                                   |
| 11  | Máquinas relacionadas                              | Bloco extra no fim da página; algoritmo no §3                                                                                                                                                                                                                                                                                                                                                      |
| 12  | Linhas de engenharia                               | "Produção Ponta a Ponta" e "Linha Automatizada" entram com **template variante** (sem tabela de specs; blocos de escopo "definido conforme projeto" + Conversão reforçada)                                                                                                                                                                                                                         |
| 13  | Bloco "Especiais"                                  | **Alteração consciente da ordem do docx** (que o coloca entre Embalagem e Ficha técnica): os bullets de "Recursos, opções e especiais" viram placa lateral do bloco Visão geral. Racional: são 3–5 bullets curtos que não sustentam seção própria entre dois blocos densos, e ao lado da visão geral respondem juntos "o que é / o que ela tem de especial". Aprovado no mockup da página completa |

## 3. Design visual aprovado (mockups no visual companion)

Página inteira em tema navy (`.tema-navy`), linguagem de cards do spec 2026-08-11 (placa técnica, moldura blueprint com cantoneiras accent, marca "+", Geist Mono para dados).

Ordem dos blocos (docx + adições/fusão das decisões 11 e 13):

1. **Sub-nav sticky** _(adição)_ — barra fina abaixo da navbar ao rolar: nome da máquina + âncoras + CTA "Solicitar proposta" sempre visível. **As âncoras são derivadas das seções efetivamente renderizadas** (nunca hardcoded): template padrão → Visão geral · Aplicações · Embalagem · Ficha técnica; template engenharia → Visão geral · Escopo · Contato. Mobile: âncoras em scroll horizontal.
2. **Hero "dossiê industrial"** — a ficha inteira emoldurada em borda tracejada com cantoneiras: cabeçalho (categoria + "FICHA · CATÁLOGO 2026 · P.NN"), H1, headline, mini-tabela Geist Mono com 3 campos-chave, CTAs 1 e 2 (decisão 6) + link "Ver máquina em operação ↓" quando houver vídeo; **máquina grande à direita** (coluna mais larga que a do texto, imagem vazando da moldura em cima/embaixo com drop-shadow — protagonista). Regras da mini-tabela: itens vêm de `destaqueHero`; quando ausente, usa os 3 primeiros itens de `specsMaquina`. A linha de capacidade renderiza NumberTicker **somente quando `capacidadeMaxima` (numérico) existe**; senão é texto puro (caso das páginas de engenharia).
3. **Visão geral** — texto descritivo do docx + placa lateral "Recursos e especiais" (bullets; decisão 13).
4. **Vídeo** — "Ver máquina em operação"; oculto sem asset (decisão 7).
5. **Aplicações e produtos** — `aplicacoes.categoriaPrincipal` é o subtítulo mono do bloco; expansível "Ver produtos compatíveis (N)" como elemento principal (colapsado por padrão, lista **presente no HTML para SEO** — regra do docx); categorias como **fileira de miniaturas compactas (~92px)** usando as imagens de `produtos/` — só as categorias que a máquina envasa. _Revisado na rodada 2 (mesma noite): miniaturas ampliadas para 128/136px — ver spec `2026-08-13-listagem-navbar-relacionadas-design.md` §4._
6. **Embalagem** — split: specs do filme/recipiente à esquerda, 3D interativo (ou foto) em moldura blueprint à direita.
7. **Ficha técnica** — **duas placas gêmeas** lado a lado (Máquina | Embalagem), rows chave/valor em Geist Mono, foto da embalagem na placa de embalagem, disclaimers no rodapé da seção (§4). Empilham no mobile.
8. **Conversão** — headline + os CTAs 1 e 2 da decisão 6, centrados.
9. **Relacionadas** _(adição)_ — até 3 cards, reutilizando o card da listagem. **Algoritmo:** mesma categoria (obrigatório) → ranking por nº de itens em comum em `embalagensCompativeis` → desempate por menor diferença relativa de `capacidadeMaxima` (critério ignorado quando um dos lados não tem o valor). Menos de 3 na categoria → completa com as de maior interseção de embalagem de outras categorias. _Revisado na rodada 2 (mesma noite): virou carrossel full-bleed com fileira mínima de 8 (ranking preservado, complemento pelo registry) — ver spec `2026-08-13-listagem-navbar-relacionadas-design.md` §3._

Iterações aprovadas: máquina do hero ampliada 2× em relação ao 1º mockup (v3); miniaturas de aplicações reduzidas (v2). Mockups de referência: `hero-layout.html` (opção C), `ficha-tecnica.html` (A), `aplicacoes.html` (A, compactada na v2), `navegacao.html` (A), `pagina-completa-v3.html` (composição final).

### Template variante "engenharia" (2 páginas)

Blocos: Sub-nav (âncoras próprias, ver bloco 1) → Hero dossiê (sem ticker; mini-tabela textual) → Visão geral + recursos → **Escopo** (blocos textuais de `conteudoEngenharia`: embalagens/produtos, capacidade, comando, área, energia — tudo "definido conforme projeto", em placas técnicas) → Conversão reforçada (título maior + parágrafo consultivo "cada linha nasce de um projeto de engenharia" + CTAs 1 e 2). Sem ficha tabular, sem embalagem 3D, sem bloco de aplicações com miniaturas.

## 4. Modelo de dados

Nova fonte única em `lib/data/maquinas/` (substitui `maquinasData.ts` e ignora o JSON órfão `lib/catalogo_completo_maquinas.json`, que fica como referência histórica até a migração terminar e então é removido):

```
lib/data/maquinas/
├── types.ts       # interfaces + enums de categoria
├── redirects.ts   # export leve: { legacyId: number; slug: string }[] — SEM imports de imagem
├── index.ts       # registry: array das 35, getMaquinaBySlug(); consome redirects.ts
└── <slug>.ts      # 1 arquivo por máquina (35 arquivos)
```

`redirects.ts` é a **fonte única** do mapeamento id antigo → slug: `next.config.ts` importa só ele (leve, sem `StaticImageData`), e `index.ts` o reutiliza — nunca duas cópias do mapa.

```ts
interface EspecificacaoItem {
  rotulo: string;
  valor: string;
}

interface MaquinaCatalogo {
  slug: string; // do docx, ex. 'envasadora-stand-up-pouch-speed'
  legacyId?: number; // id antigo (1–33) para redirect; ausente nas 3 máquinas novas
  nome: string; // curto, ex. 'Linha Pouch Speed'
  nomeCompleto: string; // H1 do docx
  headline: string;
  seo: { titulo: string; descricao: string };
  categoria: CategoriaCatalogo; // 8 categorias do índice 2026
  paginaCatalogo: string; // 'P.16' (rastreabilidade no hero dossiê)
  tipoPagina: 'padrao' | 'engenharia';
  descritivo: string; // parágrafo de visão geral
  recursos: string[]; // bullets "Recursos, opções e especiais"
  aplicacoes: {
    categoriaPrincipal: string; // subtítulo do bloco 5 (texto do docx)
    categorias: CategoriaProduto[]; // 'liquidos'|'pastosos'|'pos'|'graos'|'solidos' → miniaturas
    produtos: string[]; // lista completa (expansível SEO)
  };
  imagens: {
    maquina: StaticImageData;
    embalagem: StaticImageData;
    maquinaClassName?: string; // ajuste fino por máquina (fotos têm enquadramentos diferentes)
    embalagemClassName?: string;
  };
  embalagem3d?: { glb: string; cameraOrbit?: string }; // '/embalagens-3d/pouch.glb'
  video?: { src: string; poster?: string }; // ausente = bloco não renderiza
  specsMaquina: EspecificacaoItem[]; // vazio quando tipoPagina='engenharia'
  specsEmbalagem: EspecificacaoItem[]; // idem
  capacidadeMaxima?: number; // un/h numérico p/ NumberTicker + relacionadas; ausente = sem ticker
  embalagensCompativeis: string[]; // p/ relacionadas + filtro da listagem
  destaqueHero?: [EspecificacaoItem, EspecificacaoItem, EspecificacaoItem]; // mini-tabela do hero; ausente → 3 primeiros de specsMaquina
  conteudoEngenharia?: {
    // obrigatório quando tipoPagina='engenharia'
    escopo: string; // parágrafo do bloco Escopo
    blocos: EspecificacaoItem[]; // "Capacidade: definida conforme projeto" etc.
  };
}
```

Racional: specs como pares rótulo/valor (não colunas fixas) porque o docx tem 3 templates de embalagem e campos técnicos que variam por família — campo ausente **simplesmente não existe no array** (regra editorial: nunca inventar, nunca renderizar vazio). Um arquivo por máquina porque 35 fichas ricas num arquivo único seria ingovernável (o atual tem 643 linhas com dados magros).

Contagem de controle: **35 fichas = 32 com `legacyId` + 3 novas sem** (Linha Pouch Compacta, Linha de Produção Ponta a Ponta, Linha Automatizada). 33 ids antigos = 32 redirecionados a slugs + id18 → `/maquinas`.

### Regras editoriais (do docx, valem para todo o rendering)

- Capacidade sempre "até X", acompanhada do disclaimer literal da Seção 2 do docx: **"A produção varia conforme produto, volume, embalagem e configuração do projeto."** (junto da capacidade — distinto do rodapé de fonte).
- Rodapé da ficha técnica: "Fonte: Catálogo de Máquinas Profills 2026" + nota de validação de engenharia.
- Lista de produtos colapsada por padrão, mas no HTML (SEO).
- Campo sem dado: some da tabela (nunca "N/A" inventado; se o docx diz "não especificado no catálogo", renderizamos essa string).
- Proibido publicar **certificações, conformidades sanitárias, precisão garantida ou vida útil** sem documentação específica do projeto (4 itens da Seção 2).
- Aplicações são "exemplos editoriais".

## 5. Rotas e SEO

- Rota renomeada: `app/(site)/maquinas/[slug]/page.tsx` (Server Component).
- `generateStaticParams` a partir do registry (35 páginas SSG).
- `generateMetadata` com `seo.titulo` + `seo.descricao` do docx por máquina + OpenGraph com a foto da máquina.
- Redirects 301 em `next.config.ts` consumindo `lib/data/maquinas/redirects.ts` (§4): 32 entradas id→slug + `/maquinas/18 → /maquinas`.
- Slug inválido → `notFound()`.

## 6. Assets

Migração de `arquivos-referencia/Imagens/` para `lib/images/catalogo2026/{maquinas,embalagens,produtos}/`, com:

1. **Renomeação** para `<slug>.webp` dentro da pasta da categoria (corrige os 5 padrões de typo: `envassadora`, `envasagora`, `envasasdora`, `envasdora`, `uth`→`uht`; unifica gênero/plural). **Divergência consciente da Seção 3 do docx** (que pede prefixos `hero_[slug]`/`embalagem_[slug]`/`video_[slug]` — convenção pensada para CMS de pasta única): aqui a pasta já separa a função, o prefixo seria redundante e os imports estáticos do Next tornam o nome do arquivo detalhe interno. O slug continua sendo a chave, 1:1 com o docx.
2. **Normalização** dos 6 renders crus (1500–3300px → 1200px, como os demais) e descarte das duplicatas (`...embalagem copiar.webp`, `.png` de 1,4MB da baldes).
3. **Compressão** das 5 imagens de produtos (1,4–2,2MB PNG → webp; nota: têm fundo navy escuro _embutido_ — usar sempre dentro de moldura/card, não soltas sobre o navy do site, que é um tom levemente diferente).
4. **Atenção na migração**: o par `envasadora-linhaTC4S3vias-formatado-profills.webp` / `...3vias-profills.webp` provavelmente corresponde às **duas máquinas distintas** (TC4S 3 Vias Formatado e TC4S 3 Vias) — conferir visualmente antes de atribuir.
5. Vídeos futuros: `public/videos/maquinas/<slug>.mp4` + poster webp (convenção; nenhum existe hoje).
6. Mapeamento embalagem 3D: tabela `tipo de embalagem → glb` derivada da usada em `listaEmbalagens.tsx` — **ferramenta de migração apenas** (vira checklist no plano de dados); o código final usa `embalagem3d.glb` gravado direto em cada ficha, sem lookup em runtime.

## 7. Impactos colaterais (mesmo big-bang)

| Superfície                 | Mudança                                                                                                                                                                                                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/maquinas` (listagem)     | Consome o novo registry; filtro passa às 8 categorias 2026; cards linkam por slug. Visual dos cards **não muda**. _Revisado na rodada 2: filtros redesenhados (painel único + busca + gaveta mobile) e embalagem dos cards sem corte — ver spec `2026-08-13-listagem-navbar-relacionadas-design.md` §1 e §4_ |
| Navbar dropdown "Máquinas" | Links refeitos para as categorias novas (deixa de faltar cobertura como hoje com 'Outras'). _Revisado na rodada 2: painel de 640px com vitrine por hover — ver spec da rodada 2, §2_                                                                                                                         |
| Home `maquinas-destaque`   | Ids mágicos `[1,2,16,22,27]` viram slugs; validação em build (máquina inexistente = erro de build, não `undefined` silencioso)                                                                                                                                                                               |
| `/montar-maquina`          | Heurística de recomendação re-apontada para o novo registry (campos `categoria`/`embalagensCompativeis`/`capacidadeMaxima`); comportamento preservado                                                                                                                                                        |
| `specificationModal`       | Vira CTA "Solicitar proposta técnica e comercial"; payload ganha `slug` no lugar de `maquinaId` numérico (API `/api/specifications` ajustada)                                                                                                                                                                |
| Bug herdado                | `animationDuration={maquina.unidadeMaxima}` no Highlighter morre junto com a página antiga                                                                                                                                                                                                                   |
| Código morto               | `maquinasData.ts`, `lib/catalogo_completo_maquinas.json`, `lib/images/maquinas/` (pasta órfã) e imagens órfãs de `maquinasEmbalagens/` — **removido** (Task 5, Fase 4)                                                                                                                                       |

## 8. Testes e QA

- **Integridade de dados** (Vitest, `lib/data/maquinas/*.test.ts`): 35 slugs únicos; SEO obrigatório em todas; `specsMaquina`/`specsEmbalagem` não-vazios quando `tipoPagina='padrao'`; `conteudoEngenharia` presente quando `tipoPagina='engenharia'`; todo `embalagem3d.glb` aponta para arquivo existente em `public/embalagens-3d/`; `redirects.ts` cobre todos os `legacyId` 1–33 (18 incluído, para `/maquinas`) e todo slug de destino existe no registry.
- **Render**: smoke tests da página com máquina padrão, máquina de engenharia (âncoras próprias, sem ficha tabular) e máquina sem vídeo (bloco ausente do DOM, não vazio).
- **Regras do repo**: animações novas respeitam `useReducedMotion`; 3D entra via `dynamic(..., { ssr: false })`.
- **QA visual obrigatório pós-implementação** (pedido explícito do usuário): revisar **as 35 páginas no browser** — as fotos têm enquadramentos, proporções e recortes diferentes entre máquinas; ajustar `maquinaClassName`/`embalagemClassName` por máquina onde a composição quebrar. "Pronto" = funcional + perceptual (screenshot vs mockup v3) + dados reais conferidos por amostragem contra o docx.

## 9. Pendências

### Bloqueadores de conteúdo (resolvem antes do deploy big-bang; não travam o desenvolvimento)

- ~~**Foto da "Linear com Fechamento Automático"**~~ **RESOLVIDO (2026-08-13)**: usuário decidiu reutilizar a foto da família horizontal-linear como representativa; trocar por foto real quando a Profills enviar. (Nota: `imagens` virou opcional no modelo para suportar as 2 páginas de engenharia sem foto; obrigatória via teste de integridade para `tipoPagina='padrao'`.)
- **Doypack id18**: confirmação final da Profills de que saiu de linha (decisão 4 já tomada; reverter é barato até o deploy).
- **Foto própria do Pouch Cartonado**: docx define máquina distinta do Pouch Speed, mas a única foto disponível é a mesma — pedir foto diferenciada à Profills (página no ar usa a compartilhada).

### Pendências de engenharia (não bloqueiam; validar com a Profills)

1. Linha TP 4 Vias: docx 8.000 un/h × site antigo 6.000.
2. Frascos p/ Galões: docx 2.000 un/h × site antigo 1.600.
3. Frascos Horizontal Rotativa: docx 5.000 un/h × site antigo tinha 2.000/3.000.
4. Consumo de ar da Frascos Rotativa (30 L/min) vs Tribloc (400 L/min) — possível erro do catálogo.
5. Linha GT sem potência/consumo de energia/consumo de ar no catálogo.
6. Nome oficial TCU × TC4U (docx usa TC4U; imagem de referência usa "tcu").
7. Pouch Speed × Pouch Cartonado: fichas 100% idênticas no catálogo — confirmar se specs realmente coincidem.
8. Envolvedora Overlap: campo "Comprimento final" carrega duas métricas (350 mm + altura 300 mm) — separar.
9. Esteira de saída em unidades diferentes (GT: m; Lavadora: mm) — padronizar exibição.

## 10. Fora de escopo

- Remoção/redesign da rota `/montar-maquina` (só sai do fluxo da página de máquina).
- Vídeos das máquinas (infra pronta; assets virão da Profills).
- Modelos 3D das máquinas em si (3D existente é só de embalagens).
- Página de comparação entre máquinas.

## 11. Fases de implementação (um plano pode cobrir mais de uma, mas nesta ordem)

0. **Fundação + piloto**: `lib/data/maquinas/` (types, redirects, registry), template padrão completo, ficha da Pouch Speed, rota `[slug]` + redirects + SEO. Valida o design de ponta a ponta sem deploy.
1. **Assets**: migração/renomeação/normalização das ~70 imagens de referência (mecânica, paralelizável).
2. **Dados em lote**: as 32 fichas restantes + template variante engenharia para as 2 linhas (extração do docx, paralelizável).
3. **Colaterais**: listagem (8 categorias), navbar, home destaque, montar-maquina, specificationModal + API.
4. **Limpeza**: remoção de `maquinasData.ts`, JSON órfão, imagens órfãs, página antiga.
5. **QA visual**: as 35 páginas no browser, ajustes de `*ClassName` por máquina, verificação por amostragem contra o docx.
