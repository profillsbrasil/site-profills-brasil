# Hero: vídeo desbota no fim — bug de ViewTimeline

Data: 2026-05-19

## Problema

No `DesktopHero` (`app/(site)/(home)/_components/scrollExpansionHero.tsx`), o
vídeo central abre normalmente mas **desbota até `opacity:0` ao longo do
hold**, em vez de ficar fixo até a seção rolar embora. O grid de fundo tem o
mesmo defeito ao contrário: nunca some — continua visível em `opacity:1` mesmo
em `progress 1.0`.

## Investigação

Medições ao vivo no browser (dev server, seção `h-[300vh]`, `progress 1.0` em
`scrollY=1278`):

- O `style.opacity` inline do wrapper do vídeo fica congelado em `0`, mas o
  `opacity` computado segue uma curva `1 → 0`.
- `getAnimations()` no wrapper revela uma animação WAAPI:
  - `timeline: ViewTimeline`
  - `keyframes: [{offset:0.04, opacity:0}, {offset:0.12, opacity:1}]`
- O wrapper do grid tem a mesma animação `ViewTimeline` e fica preso em
  `opacity:1`.
- `videoScale` (transform `scale`) e `leftX`/`rightX` (transform `x`) atualizam
  corretamente via `style` inline (rAF) — não são descarregados.

## Causa raiz

O framer-motion (`motion/react`) otimiza MotionValues de `opacity` ligados a
scroll descarregando-os para uma animação acelerada por hardware (WAAPI) presa
a uma `ViewTimeline` nativa do CSS. A `ViewTimeline` mapeia o progresso de
forma inconsistente com o `useScroll` baseado em rAF (`offset: ['start start',
'end end']`) — na prática, invertida. Resultado:

- `videoOpacity` (`useTransform([0.04, 0.12], [0, 1])`) renderiza a curva ao
  contrário → vídeo desbota.
- `gridOpacity` (`useTransform([0.05, 0.3], [1, 0])`) idem → grid nunca some.
- `cardsOpacity` (`useTransform([0, 0.06], [1, 0])`) — mesmo padrão.

Transforms (`x`, `scale`) não passam por esse caminho de offload, por isso
funcionam.

## Solução

### 1. Evitar o offload das três `opacity`

Converter `videoOpacity`, `gridOpacity` e `cardsOpacity` da forma de
input/output range para a **forma de função** do `useTransform`. O framer não
consegue expressar um callback como keyframes nativos, então mantém o valor no
rAF — onde funciona corretamente, como os transforms.

```tsx
const videoOpacity = useTransform(() => {
  const p = scrollYProgress.get();
  if (p <= 0.04) return 0;
  if (p >= 0.12) return 1;
  return (p - 0.04) / 0.08;
});

const cardsOpacity = useTransform(() => {
  const p = scrollYProgress.get();
  if (p >= 0.06) return 0;
  return 1 - p / 0.06;
});

const gridOpacity = useTransform(() => {
  const p = scrollYProgress.get();
  if (p <= 0.05) return 1;
  if (p >= 0.3) return 0;
  return 1 - (p - 0.05) / 0.25;
});
```

Verificado ao vivo: com `videoOpacity` na forma de função, a animação
`ViewTimeline` some (`getAnimations()` vazio) e a opacidade fica `1` do início
ao fim do hold.

`leftX`, `rightX` e `videoScale` permanecem inalterados — funcionam.

### 2. Encurtar a seção

`h-[300vh]` → `h-[200vh]` (~100vh de scroll real, hold ~85vh). Atualizar o
comentário da timeline para refletir 200vh.

## Testes

`scrollExpansionHero.test.tsx` mocka `useTransform` e não verifica thresholds
nem a forma do argumento — nenhuma alteração de teste é necessária. Rodar a
suíte para confirmar que continua verde.

## Verificação

- `npm test` — suíte passa.
- Verificação visual no browser: o vídeo abre após ~1 scroll, fica em
  `opacity:1` por todo o hold, o grid some conforme o vídeo entra, e o conteúdo
  é revelado ao fim sem o vídeo desbotar prematuramente.
