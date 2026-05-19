# Hero: hold do vídeo no scroll (DesktopHero)

Data: 2026-05-19

## Problema

Na home (`app/(site)/(home)/`), o componente `ScrollExpandMedia` →
`DesktopHero` deveria: carregar com texto à esquerda e modelo 3D à direita;
após ~1 scroll abrir o vídeo central; e manter o vídeo aberto por ~5 scrolls
antes de revelar o conteúdo.

Comportamento atual (bug): no 2º scroll o vídeo já some e o usuário vê uma
tela branca.

## Causa raiz

`DesktopHero` usa o padrão sticky-scroll: a `<section>` é alta e um
`div sticky top-0 h-screen` fica fixo enquanto se rola. O `scrollYProgress`
(0→1) é mapeado sobre o trecho de rolagem extra = `altura da section − 100vh`.

A section está em `h-[140vh]` → apenas **40vh de scroll real** para a timeline
inteira. O comentário das linhas 113-114 ainda diz "300vh = 200vh de scroll
real": a altura foi reduzida e a timeline ficou espremida.

Consequência:

| Evento | Progress | Scroll real |
|---|---|---|
| Cards somem | `0 → 0.025` | ~1vh |
| Vídeo aparece | `0 → 0.035` | ~1.4vh |
| Fim da timeline / section desgruda | `1.0` | 40vh |

- 1º scroll → cards somem e vídeo abre quase instantaneamente.
- 2º scroll → passa-se dos 40vh, a section `sticky` solta e cai na seção
  `children` (`bg-white`) → tela branca.

Não é problema de transparência. Faltam: (1) section alta o suficiente para os
~5 scrolls de permanência; (2) re-timing dos `useTransform` com um platô longo
em `opacity:1` para o vídeo.

## Escopo

Apenas a função `DesktopHero` em
`app/(site)/(home)/_components/scrollExpansionHero.tsx`. `MobileHero` não muda.

## Solução

### 1. Altura da seção

`h-[140vh]` → `h-[600vh]` (500vh de trecho de scroll real ≈ 5 voltas de roda).
Atualizar o comentário stale das linhas 113-114.

### 2. Re-timing da timeline (`useTransform` sobre `scrollYProgress` 0→1 = 500vh)

| Elemento | Hoje | Novo |
|---|---|---|
| `cardsOpacity` | `[0, 0.025] → [1, 0]` | `[0, 0.06] → [1, 0]` |
| `leftX` / `rightX` | `[0, 0.5] → [0, ∓300]` | `[0, 0.1] → [0, ∓300]` |
| `cardsHidden` (useMotionValueEvent) | `v > 0.03` | `v > 0.1` |
| `videoOpacity` | `[0, 0.035] → [0, 1]` | `[0.04, 0.12] → [0, 1]` |
| `videoScale` | `[0, 0.5] → [0.8, 1.1]` | `[0, 1] → [0.8, 1.05]` |

Hold do vídeo: de `progress 0.12` até `1.0`, `videoOpacity` permanece 1 ≈
440vh de scroll com o vídeo fixo.

### 3. Final — "fica e solta no conteúdo"

O vídeo permanece em `opacity:1` até o fim. Em `progress 1.0` a section
`sticky` desgruda e a seção `children` (`bg-white`) aparece naturalmente. Sem
fade-out do vídeo.

Remover o overlay branco `lightBgOpacity` (linhas 123, 151-154) — o conteúdo
abaixo já é branco; o overlay não é mais necessário com "soltar direto".

`gridOpacity` é mantido (grid some conforme o vídeo abre).

## Testes

`scrollExpansionHero.test.tsx` mocka `useTransform`/`useScroll`/
`useMotionValueEvent` e não verifica thresholds — nenhuma alteração de teste é
necessária. Rodar a suíte para confirmar que continua verde.

## Verificação

- `npm test` (ou equivalente) — suíte passa.
- Verificação visual no browser: carregar a home em desktop, rolar e confirmar
  que o vídeo abre após ~1 scroll, fica fixo por ~5 scrolls e o conteúdo é
  revelado sem tela branca prematura.
