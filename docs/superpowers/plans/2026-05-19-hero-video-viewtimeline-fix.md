# Hero Video ViewTimeline Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir o vídeo do `DesktopHero` que desbota até `opacity:0` no hold (e o grid que nunca some), causado pelo offload das `opacity` ligadas a scroll para uma `ViewTimeline` nativa bugada, e encurtar a seção para `200vh`.

**Architecture:** O framer-motion (`motion/react`) descarrega MotionValues de `opacity` ligados a scroll para animações WAAPI presas a uma `ViewTimeline` nativa, cujo mapeamento de progresso diverge do `useScroll` (rAF). A forma de função do `useTransform` (`useTransform(() => ...)`) não pode ser expressa como keyframes nativos, então o framer mantém o valor no rAF — onde funciona. A correção converte as três `opacity` (`videoOpacity`, `cardsOpacity`, `gridOpacity`) para a forma de função. Transforms (`x`, `scale`) não sofrem o offload e ficam inalterados.

**Tech Stack:** Next.js (App Router), React, `motion/react`, Tailwind CSS, Vitest.

---

### Task 1: Converter opacity para forma de função e encurtar a seção

**Files:**
- Modify: `app/(site)/(home)/_components/scrollExpansionHero.tsx` (função `DesktopHero`)
- Test: `app/(site)/(home)/_components/__tests__/scrollExpansionHero.test.tsx` (sem alteração — só executar)

Nota: o repo pode já conter uma conversão parcial de teste do `videoOpacity` (sem commit). Os passos abaixo descrevem o estado final desejado independentemente disso — aplique o que faltar para chegar nesse estado.

- [ ] **Step 1: Confirmar baseline dos testes**

Run: `npm test -- scrollExpansionHero`
Expected: PASS (4 testes verdes). Os testes mockam `useTransform` e não dependem da forma do argumento.

- [ ] **Step 2: Converter `cardsOpacity` para forma de função**

Trocar a linha:

```tsx
  const cardsOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
```

por:

```tsx
  const cardsOpacity = useTransform(() => {
    const p = scrollYProgress.get();
    if (p >= 0.06) return 0;
    return 1 - p / 0.06;
  });
```

- [ ] **Step 3: Garantir `videoOpacity` na forma de função**

A declaração de `videoOpacity` deve ser exatamente:

```tsx
  // Vídeo entra em 0.04 com leve sobreposição ao fim do fade dos cards (0.06) — crossfade intencional
  const videoOpacity = useTransform(() => {
    const p = scrollYProgress.get();
    if (p <= 0.04) return 0;
    if (p >= 0.12) return 1;
    return (p - 0.04) / 0.08;
  });
```

Se já estiver assim, nenhuma mudança neste passo.

- [ ] **Step 4: Converter `gridOpacity` para forma de função**

Trocar a linha:

```tsx
  const gridOpacity = useTransform(scrollYProgress, [0.05, 0.3], [1, 0]);
```

por:

```tsx
  const gridOpacity = useTransform(() => {
    const p = scrollYProgress.get();
    if (p <= 0.05) return 1;
    if (p >= 0.3) return 0;
    return 1 - (p - 0.05) / 0.25;
  });
```

`leftX`, `rightX` e `videoScale` permanecem inalterados (são transforms, funcionam).

- [ ] **Step 5: Encurtar a seção e atualizar o comentário da timeline**

Trocar o comentário das três linhas:

```tsx
  // Timeline (300vh = 200vh de scroll real ≈ 2 voltas de roda):
  // Cards saem cedo, vídeo entra e fica fixo (opacity:1) por ~175vh de hold,
  // até a section sticky desgrudar e revelar o conteúdo.
```

por:

```tsx
  // Timeline (200vh = 100vh de scroll real ≈ 1 volta de roda):
  // Cards saem cedo, vídeo entra e fica fixo (opacity:1) por ~85vh de hold,
  // até a section sticky desgrudar e revelar o conteúdo.
```

E trocar:

```tsx
    <section ref={heroRef} className='relative h-[300vh]'>
```

por:

```tsx
    <section ref={heroRef} className='relative h-[200vh]'>
```

- [ ] **Step 6: Rodar os testes**

Run: `npm test -- scrollExpansionHero`
Expected: PASS (4 testes verdes).

- [ ] **Step 7: Lint (informativo)**

Run: `npm run lint`
Expected: pode falhar com `TypeError: ... react/display-name ... getFilename is not a function` — incompatibilidade pré-existente entre `eslint-plugin-react` e ESLint 10, fora do escopo. Nenhum erro novo deve surgir em `scrollExpansionHero.tsx`.

- [ ] **Step 8: Verificação visual no browser**

Run: `npm run dev` e abrir a home em viewport desktop (≥768px).
Expected: o vídeo abre após ~1 scroll, fica em `opacity:1` por todo o hold (não desbota), o grid some conforme o vídeo entra, e o conteúdo é revelado ao fim. Confirmação técnica: `document.querySelector('video').closest('div').getAnimations()` deve retornar vazio (sem `ViewTimeline`).

- [ ] **Step 9: Commit**

```bash
git add "app/(site)/(home)/_components/scrollExpansionHero.tsx"
git commit -m "fix: corrige offload de opacity para ViewTimeline no hero"
```
