# Hero da home: carrossel de máquinas — design aprovado

**Data:** 2026-08-10 · **Status:** aprovado pelo Othavio via visual companion (brainstorm em `.superpowers/brainstorm/4037057-1786382371/content/`, mockup final `transicoes-v4.html`)

## Objetivo

Substituir o hero atual da home (scroll-driven: seção de 200vh com sticky, vídeo em expansão e modelo 3D) por um **carrossel de máquinas em tela cheia**, com um slide por linha de produto. O hero passa a vender as máquinas diretamente, com dados técnicos reais do catálogo.

## O que sai

- `ScrollExpandMedia` / `DesktopHero` / `MobileHero` em `app/(site)/(home)/_components/scrollExpansionHero.tsx` (as duas árvores mobile/desktop, o mecanismo sticky de 200vh, o gotcha do ScrollTimeline)
- Vídeo `videoCurto.webm/.mp4` e o modelo 3D `caixa-teste-3d.glb` deixam de ser usados no hero (arquivos permanecem no repo; remoção é decisão à parte)
- `HeroShowcase` (mini-carrossel de texto) e `ScrollHint` do hero

## O que entra

Uma seção única e responsiva (uma árvore só, sem duplicação mobile/desktop):

- `min-height: 100vh` com `padding-top` da navbar (h-16 / 64px) — **nada pode ser cortado pela navbar** (validado no mockup com navbar fake)
- Fundo: gradiente radial navy (#1b2a4d → #0f172a → #0a1122) + grid pattern sutil com máscara radial (usar `GridPattern` existente de `components/layout/`)
- Grid de 2 colunas ~50/50 (texto | palco da máquina); empilha abaixo de 900px

### Anatomia do slide (esquerda → direita)

1. **Lockup da linha**: nome (ex.: "Linha TP") em accent azul bold + categoria em Geist Mono uppercase, separados por divisor tracejado vertical. Sem contagem de soldas no lockup do slide TP. Sem eyebrow genérico.
2. **Headline** (2 linhas, quebra controlada): cada linha é um bloco `white-space: nowrap` — nunca quebra no meio da frase. Linha 2 em accent azul.
3. **Descrição**: 1-2 frases, fatos do catálogo, sem linguagem de folder (copy passou pelo humanize-pt-br).
4. **Placa de specs com CTA acoplado**: caixa de **borda tracejada** (motivo do site, cf. páginas de máquinas) com 3 dados em Geist Mono — produção (**sempre com "até"**, varia por embalagem), largura do filme, estrutura — e o botão azul "Conhecer →" colado na ponta direita da placa (cantos 2px, `rounded-xs` do site). Cada spec com `white-space: nowrap`.
5. **WhatsApp**: link discreto "Falar com um especialista" com ícone verde WhatsApp, abaixo da placa.

### Palco da máquina (coluna direita)

- **Máquina**: PNG da linha, dimensionada pela **altura** do palco (~106% de `min(76vh, 700px)`), **posição absoluta** (a largura natural do PNG não pode participar do cálculo do grid — foi a causa raiz de a coluna de texto ser esmagada). Deslocada ~6% à direita; anéis maiores podem sangrar na borda.
- **Embalagem**: PNG com **tamanho e posição por slide** (TP: altura 28%, left 14%; TC4s: altura 42%, left 2%), flutuação suave (translateY ±10px, 7s), sombra própria.
- **Sistema de anéis animado** (atrás da máquina, dimensionado pela altura do palco):
  - 3 anéis estáticos (86% / 64% / 104%, opacidades 0.14 / 0.10 / 0.06)
  - 2 anéis tracejados girando: 75% a 70s horário, 96% a 110s anti-horário (ecoam o motivo tracejado do site)
  - 2 anéis-pulso de radar defasados (5.5s, delay 2.75s entre eles)
  - 1 satélite azul com glow orbitando (26s)
  - 1 anel de **ping** disparado no momento da troca de slide (0.9s, uma vez)
  - Glow radial azul central + sombra elíptica no "chão"

### Navegação do carrossel (barra inferior)

- Esquerda: índice `01 / 02` em Geist Mono + barra de progresso do autoplay (2px, accent, 7s linear) + "A seguir: **{próxima linha}**"
- Direita: setas quadradas (44px, cantos 2px, borda tracejada → sólida azul no hover)
- **Autoplay 7s**, pausa/reset ao navegar manualmente

### Transição entre slides: "Reveal" (aprovada entre 5 opções)

- **Saída**: 120ms ease-in — texto em fade, máquina fade + drift lateral -18px·direção + scale 0.99
- **Entrada do texto**: cascata por máscara — cada bloco (lockup, linha 1 do h1, linha 2, descrição, placa, whats) vive num recorte `overflow: hidden` e sobe de `translateY(112%)` a 0 em 520ms, curva `cubic-bezier(0.19, 1, 0.22, 1)`, delays 0/40/80/120/160/200ms
- **Entrada da máquina**: crossfade + drift de +26px·direção e scale 1.03 → 1 em 420ms, mesma curva
- **Ping do radar** dispara junto com a entrada
- Total percebido: ~700ms; navegação nunca trava (lock `animando` até assentar)

### Conteúdo dos slides (aprovado)

**Slide 1 — Linha TP** (`/maquinas/1`)

- Lockup: "Linha TP" · "Envasadora de sachês"
- H1: "Precisão de dosagem," / "sachê após sachê" (linha 2 em azul)
- Desc: "Polpas, laticínios, molhos e outros líquidos ou secos, envasados com dosagem temporizada, volumétrica ou por bomba positiva."
- Specs: até 3.000 un/h (Produção) · 85-300 mm (Largura do filme) · Inox 304 (Estrutura)
- Imagens: `lib/images/novasImagens/maquinasEmbalagens/maquinas/TP85.png` + `sache-linha-tp-azul.png`
- CTA "Conhecer" → `/maquinas/1`

**Slide 2 — Linha TC4s** (`/maquinas/2`)

- Lockup: "Linha TC4s" · "Sachê 4 soldas" (aqui a categoria É o produto; aprovado)
- H1: "Quatro soldas," / "acabamento de gôndola"
- Desc: "Envase em uma via com alto controle de dosagem, para líquidos e secos. Datação por alto relevo, inkjet ou hotstamping."
- Specs: até 2.000 un/h · 120-360 mm · Inox 304
- Imagens: `maquinas/TC 4S 200-1.png` + `sache-4-soldas-1-via.png`
- CTA "Conhecer" → `/maquinas/2`

Estrutura em array tipado: adicionar uma linha nova = adicionar um item (imagens, copy, specs, rota). Escopo desta entrega: **apenas estes 2 slides**.

### Responsividade (validada em 1024/768/414 via QA de iframes)

- ≤1180px: colunas mais justas, fontes e placa escalam, palco `min(70vh, 640px)`
- ≤900px: empilha (texto acima, palco abaixo ~48vh), some o "A seguir", uma árvore só — sem `md:hidden`/duas árvores
- ≤560px: placa vira coluna (dados em wrap por unidade + CTA vira barra full-width embaixo), headline escala por vw mantendo as 2 linhas controladas
- Invariantes: dado técnico nunca dobra linha; headline nunca quebra no meio da frase; navbar nunca corta a máquina

### Acessibilidade e performance

- `useReducedMotion` → sem autoplay, sem anéis girando/pulsando, sem cascata (conteúdo estático visível); padrão do repo
- Setas com `aria-label`; conteúdo do slide ativo acessível como texto real (não imagem)
- Semântica de heading: o headline do slide 1 é o `h1` da página (SSR); slides seguintes renderizam `h2` para não duplicar `h1`
- Imagens via import estático (`lib/images/...`) com `next/image`; `priority` no slide 1
- Animações só com transform/opacity (anéis, cascata, drift); nada de layout properties

### Implementação (direção para o plano)

- Componente novo em `app/(site)/(home)/_components/` substituindo `scrollExpansionHero.tsx` no `page.tsx` da home
- **motion/react** (`AnimatePresence` + variants para a cascata) — SEM embla: a transição aprovada não é deslize de track, é orquestração de máscaras
- Copy hardcoded no componente (padrão do repo), array `const SLIDES` no topo
- Fonte de dados das imagens: mesmos imports estáticos usados em `maquinasData.ts`
- Testes: substituir a suíte `__tests__/scrollExpansionHero.test.tsx` por testes do carrossel (render dos 2 slides, avanço por seta, autoplay com timers fake, reduced-motion estático, aria)

### Fora de escopo

- Outras linhas além de TP e TC4s
- WhatsApp flutuante global do site
- Remoção física dos assets de vídeo/3D do repo
- Mudanças no restante da home
