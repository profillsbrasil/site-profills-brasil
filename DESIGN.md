---
name: Profills Brasil
description: Site institucional de máquinas envasadoras — navy blueprint industrial
colors:
  navy-base: "oklch(0.2084 0.0417 266.3592)"
  navy-faixa: "oklch(0.2380 0.0430 266)"
  navy-card: "oklch(0.2503 0.0417 266.3592)"
  navy-muted: "oklch(0.2734 0.0428 266.3592)"
  navy-recuo: "rgba(15, 23, 42, 0.6)"
  azul-acao: "oklch(0.6207 0.1894 259.9358)"
  azul-claro-texto: "oklch(0.8206 0.0417 262)"
  tracejado: "rgba(148, 178, 235, 0.3)"
  tracejado-sutil: "rgba(148, 178, 235, 0.22)"
  branco: "#ffffff"
  tinta-clara: "oklch(0.2138 0.0019 286.2347)"
typography:
  display:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui"
    fontSize: "clamp(1.9rem, 3.9vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  data:
    fontFamily: "Geist Mono, ui-monospace"
    fontSize: "1.35rem"
    fontWeight: 600
    lineHeight: 1.2
  label:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui"
    fontSize: "0.68rem"
    fontWeight: 400
    letterSpacing: "0.05em"
rounded:
  xs: "2px"
spacing:
  sm: "0.75rem"
  md: "1.25rem"
  lg: "2rem"
components:
  placa-tecnica:
    backgroundColor: "{colors.navy-recuo}"
    textColor: "{colors.azul-claro-texto}"
    rounded: "{rounded.xs}"
    padding: "24px"
  botao-solido:
    backgroundColor: "{colors.branco}"
    textColor: "#0f172a"
    rounded: "{rounded.xs}"
  botao-acao:
    backgroundColor: "{colors.azul-acao}"
    textColor: "{colors.branco}"
    rounded: "{rounded.xs}"
  chip-marca:
    backgroundColor: "{colors.navy-card}"
    rounded: "{rounded.xs}"
    padding: "12px"
---

# Design System: Profills Brasil

## Overview

**Creative North Star: "A Prancheta Industrial"**

O site é um desenho técnico vivo. Sobre o navy profundo corre um grid de blueprint; o conteúdo se organiza em placas técnicas, molduras de cota com cantoneiras, réguas tracejadas e specs em fonte mono — como se cada seção tivesse saído da prancheta de um engenheiro da Profills. Nada é decorativo: o tracejado marca fronteira, a cantoneira marca medida, o mono marca dado.

A página respira autoridade industrial sem frieza: as máquinas de inox são as protagonistas (fotos e modelos 3D flutuam direto no navy, emoldurados, nunca engaiolados em caixas brancas), e o azul de ação aparece com parcimônia — hover, CTA, destaque de palavra — para que cada aparição conte.

**Key Characteristics:**

- Fundo navy blueprint com grid pattern; superfícies elevadas por tom, nunca por sombra
- Fronteiras sempre tracejadas; hover promove tracejado → sólido no azul de ação
- Pontas quadradas (2px) em tudo — a estética de precisão da marca
- Dados técnicos em Geist Mono; rótulos uppercase espaçados
- Movimento funcional e discreto, sempre com fallback para `prefers-reduced-motion`

## Colors

Paleta navy monocromática com um único azul de ação — a raridade do accent é o que dá força a ele.

### Primary

- **Azul de Ação** (`oklch(0.6207 0.1894 259.9358)` ≈ #3b80f6): CTAs sólidos (botão "Conhecer" do hero), bordas de hover, cantoneiras das molduras, ícones de spec, palavras destacadas em títulos. Contraste 4.76:1 sobre o navy base.

### Neutral

- **Navy Base** (`oklch(0.2084 0.0417 266.3592)` ≈ rgb(15,23,43)): fundo de toda a home (`.tema-navy`), hero, navbar e footer (`--secondary`).
- **Navy Faixa** (`oklch(0.2380 0.0430 266)`): faixas elevadas que criam o ritmo claro↔escuro entre seções.
- **Navy Card** (`oklch(0.2503 0.0417 266.3592)`): superfície de card elevada (`--card` sob `.tema-navy`), chips de marca.
- **Navy Recuo** (`rgba(15,23,42,0.6)` — `bg-slate-900/60`): fundo das placas técnicas, um passo *abaixo* da superfície onde estão; escurece para `/85` no hover.
- **Azul Claro de Texto** (`oklch(0.8206 0.0417 262)` ≈ #b6c5e2): todo texto secundário/descritivo sobre navy (`--muted-foreground` sob `.tema-navy`; literal `#b6c5e2` fora dela). Contraste 10:1.
- **Tracejado** (`rgba(148,178,235,0.3)` e sutil `0.22`): a cor de toda linha tracejada — bordas de placa, réguas, separadores de seção.
- **Branco** (#ffffff): títulos e nomes sobre navy; fundo do botão sólido.
- **Tinta Clara** (`oklch(0.2138 0.0019 286.2347)`): foreground das páginas internas claras (catálogo, formulários), que permanecem em light mode.

### Named Rules

**A Regra da Cor Explícita.** Dentro de `.tema-navy`, use os tokens semânticos (`text-muted-foreground`, `bg-card`, `border-border`). Fora dela — hero, navbar, footer, que vivem em `bg-secondary` — os tokens resolvem para o tema claro: use cores literais (`#b6c5e2`, `rgba(148,178,235,·)`), como o hero faz.

**A Regra do Accent Raro.** O Azul de Ação nunca vira fundo de seção nem cor de texto corrido. Ele pontua: um botão, uma borda acesa, uma palavra no título.

## Typography

**Display Font:** Geist Sans (via next/font, fallback ui-sans-serif)
**Body Font:** Geist Sans
**Label/Mono Font:** Geist Mono — exclusiva para dados técnicos, índices e medidas

**Character:** Geométrica e precisa sem ser fria; o extrabold apertado do display dá o peso industrial, o mono dá a credibilidade de instrumento.

### Hierarchy

- **Display** (800, `clamp(1.9rem, 3.9vw, 3.5rem)`, leading 1.06, tracking-tight): título do hero, duas linhas com a segunda em Azul de Ação. Variante compacta `clamp(1.5rem, 7cqi, 2.8rem)` via container query para títulos longos — nunca clipa.
- **Headline** (700, `text-2xl`/`text-3xl`): títulos de seção; palavra destacada recebe Azul de Ação ou sublinhado do Highlighter.
- **Title** (600–650, `text-sm`–`text-base`, branco): nomes de card/placa.
- **Body** (400, `text-sm`–`text-base`, leading relaxed, Azul Claro de Texto): descrições; máximo ~44ch no hero.
- **Data** (Geist Mono 600, `1.35rem`): valores de spec ("até 3.000 un/h"); unidades e prefixos em `text-xs` normal.
- **Label** (400, `0.68rem`, uppercase, tracking-wider, Azul Claro): rótulos de spec ("PRODUÇÃO", "LARGURA DO FILME").

### Named Rules

**A Regra do Leading Depois.** Em `cn()`, `leading-*` sempre *depois* de `text-[<tamanho arbitrário>]` — o tailwind-merge descarta um leading declarado antes do font-size (classificado como conflito de line-height). Bug real: o hero renderizou meses com leading 1.5 em vez de 1.06.

## Layout

Conteúdo em colunas centradas de `max-w-6xl` (seções) a `max-w-7xl` (mídia larga), `px-4` nas margens. A home alterna navy base e faixas elevadas delimitadas por réguas tracejadas horizontais — o ritmo é claro↔escuro por tom, não por espaçamento extra. Hero limitado a `min(100vh, 880px)` para a seção seguinte entrar no fold. Grids: bento 3×2 para máquinas em destaque, 2→4 colunas para embalagens; cards de uma mesma linha têm sempre a mesma altura (`h-full` + mídia `flex-1` + descrições `line-clamp-2 min-h-[2lh]`). Breakpoints especiais do hero: `min-[900px]` (duas colunas) e `max-[1180px]` (placa compacta).

## Elevation & Depth

**Sistema flat com camadas tonais — sombra zero sobre navy.** Profundidade vem exclusivamente de degraus de tom (base 0.208 → faixa 0.238 → card 0.250 → muted 0.273, e o recuo `slate-900/60` para dentro) mais bordas. Os tokens `--shadow-*` existem para as páginas internas claras; sobre navy são invisíveis e proibidos.

### Named Rules

**A Regra da Sombra Zero.** Nenhum `shadow-*`/`drop-shadow` em superfície dentro de tema escuro. Elevação = tom + borda. Se um card parece chapado, suba um degrau de tom — não invente sombra.

## Shapes

Pontas quadradas com quebra mínima: `rounded-xs` (2px) em absolutamente tudo — cards, botões, chips, molduras, imagens. Bordas de 1px; a *textura* da borda carrega significado: **tracejada** = fronteira em repouso, **sólida em Azul de Ação** = estado ativo/hover. Cantoneiras de cota (spans de 8×8px com borda accent em cantos opostos) assinam as molduras de mídia. A marca "+" em mono decora o canto das placas técnicas como marca de registro de prancheta.

## Components

### Placa Técnica (benefícios, argumentos, contatos)

- **Superfície:** `bg-slate-900/60`, borda tracejada `rgba(148,178,235,0.3)`, `rounded-xs`, "+" mono no canto superior direito.
- **Hover:** borda tracejada → **sólida** Azul de Ação; fundo escurece para `/85`. Transição `transition-colors duration-300`.
- **Conteúdo:** chip de ícone `bg-accent/10` com ícone accent + título branco; descrição em Azul Claro.
- Usada em: cards de "Como podemos ajudar", marquee GT-3000, contatos do footer, texto de Serviços Personalizados.

### Moldura Blueprint (produto clicável com mídia)

- **Quadro:** mídia (foto/carrossel/3D) direto sobre o navy, borda tracejada + cantoneiras accent em cantos opostos; hover clareia a borda para `rgba(148,178,235,0.55)`.
- **Rodapé:** única superfície (`bg-slate-900/60`, borda tracejada sutil sem topo), nome branco + descrição Azul Claro + specs com ícones accent.
- **Uniformidade:** card `flex h-full flex-col`, quadro `flex-1`, descrição `line-clamp-2 min-h-[2lh]`.
- Usada em: bento de Máquinas em Destaque, grid de Nossas Embalagens, foto de Serviços Personalizados.

### Botões

- **Sólido sobre navy:** `!bg-white !text-slate-900` explícitos, `rounded-xs`, `shadow-md`, hover `scale-[1.02]` com seta que desliza. Nunca tokens de background.
- **Ação (hero):** fundo Azul de Ação, texto branco, acoplado à placa de specs; hover `bg-accent/90`.
- **Setas de navegação:** quadrado 44px, borda tracejada, fundo `rgba(148,178,235,0.07)`; hover sólido accent.

### Chip de Marca

- `bg-card` + borda tracejada `0.25`, logo monocromática branca (`brightness-0 invert`) a 65% de opacidade → 100% no hover.
- **Hover automático:** overlay de borda accent + brilho pulsam em sequência (ciclo 16s, ~2s por chip, keyframes `marca-*-ativa`), sem bloquear o hover real.

### CTA "Monte sua fábrica" (assinatura)

Ilustração livre flutuando sobre o grid (mesmo gesto da embalagem do hero) ao lado de uma placa técnica híbrida: superfície e hover de placa + cantoneiras accent de moldura. Botão branco sólido ancorado no canto inferior direito, colado ao texto.

### Carrosséis de card (bento de máquinas)

Sem setas visíveis: cada card alterna máquina↔embalagem sozinho, em intervalos propositalmente diferentes (8–14s) para as trocas não acontecerem em uníssono. Autoplay desligado sob reduced motion.

### Navigation & Footer

Navbar e footer sobre Navy Base em todas as páginas. Footer: fronteira superior tracejada (sem fades de gradiente), contatos em placas técnicas, sociais em chips tracejados, divisores tracejados.

## Do's and Don'ts

### Do:

- **Do** separar seções e superfícies com linha tracejada `rgba(148,178,235,0.22–0.3)` — é a assinatura do sistema.
- **Do** usar o hover tracejado→sólido-accent como affordance padrão de interação (mesma gramática das setas do hero).
- **Do** dar fallback estático a toda animação (`useReducedMotion` em JS, `motion-reduce:` em CSS).
- **Do** importar imagens estaticamente (`lib/images/`) e logos de fornecedor com fundo transparente (tratamento `brightness-0 invert` exige).
- **Do** medir uniformidade de cards por linha ao criar grids novos (padrão `flex-1` + `min-h-[2lh]`).

### Don't:

- **Don't** usar `bg-background`/`bg-secondary` como superfície de card dentro de navy — vira card invisível (foi o defeito sistêmico que esta linguagem corrigiu).
- **Don't** usar sombras sobre navy, nem borda `border-black/*`.
- **Don't** usar texto branco translúcido (`text-white/60`, `secondary-foreground/50`) para hierarquia — o secundário é o Azul Claro `#b6c5e2`.
- **Don't** usar gradientes de fade como transição entre seções — fronteira aqui é linha, não névoa.
- **Don't** arredondar além de `rounded-xs` (2px); `rounded-lg`/`full` quebram a estética de prancheta.
- **Don't** declarar `leading-*` antes de `text-[...]` arbitrário dentro de `cn()` (A Regra do Leading Depois).
