# Hero Scroll Video Hold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir o `DesktopHero` para que o vídeo central abra após ~1 scroll e permaneça aberto por ~5 scrolls antes de revelar o conteúdo, em vez de sumir no 2º scroll.

**Architecture:** O `DesktopHero` usa o padrão sticky-scroll de `motion/react`: uma `<section>` alta com um `div sticky` interno; `scrollYProgress` (0→1) é mapeado sobre `altura − 100vh`. A correção aumenta a altura da section de `140vh` para `600vh` (500vh de scroll real) e re-cronometra os `useTransform` para criar um platô longo de `opacity:1` no vídeo. O overlay branco `lightBgOpacity` é removido.

**Tech Stack:** Next.js (App Router), React, `motion/react`, Tailwind CSS, Vitest.

---

### Task 1: Re-timing e altura do DesktopHero

**Files:**
- Modify: `app/(site)/(home)/_components/scrollExpansionHero.tsx` (função `DesktopHero`, linhas ~103-221)
- Test: `app/(site)/(home)/_components/__tests__/scrollExpansionHero.test.tsx` (sem alteração — só executar)

- [ ] **Step 1: Confirmar baseline dos testes**

Run: `npm test -- scrollExpansionHero`
Expected: PASS (4 testes verdes). Os testes mockam `useTransform`/`useScroll` e não dependem de thresholds.

- [ ] **Step 2: Atualizar o comentário stale e os `useTransform` (linhas ~113-125)**

Substituir o bloco de comentário + transforms por:

```tsx
  // Timeline (600vh = 500vh de scroll real ≈ 5 voltas de roda):
  // Cards saem cedo, vídeo entra e fica fixo (opacity:1) por ~440vh de hold,
  // até a section sticky desgrudar e revelar o conteúdo.
  const leftX = useTransform(scrollYProgress, [0, 0.1], [0, -300]);
  const rightX = useTransform(scrollYProgress, [0, 0.1], [0, 300]);
  const cardsOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  const videoOpacity = useTransform(scrollYProgress, [0.04, 0.12], [0, 1]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.05]);

  const gridOpacity = useTransform(scrollYProgress, [0.05, 0.3], [1, 0]);
```

Nota: a linha `const lightBgOpacity = useTransform(...)` é removida neste passo.

- [ ] **Step 3: Atualizar o threshold de `cardsHidden` (linha ~128-130)**

Trocar:

```tsx
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setCardsHidden(v > 0.03);
  });
```

por:

```tsx
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setCardsHidden(v > 0.1);
  });
```

- [ ] **Step 4: Aumentar a altura da section (linha ~145)**

Trocar `<section ref={heroRef} className='relative h-[140vh]'>` por:

```tsx
    <section ref={heroRef} className='relative h-[600vh]'>
```

- [ ] **Step 5: Remover o overlay branco `lightBgOpacity` (linhas ~150-154)**

Remover este bloco inteiro:

```tsx
        {/* Background claro (crossfade) */}
        <motion.div
          className='absolute inset-0 bg-white'
          style={{ opacity: lightBgOpacity }}
        />
```

Manter o `<div className='absolute inset-0 bg-secondary' />` (background escuro base) e o bloco `gridOpacity` logo abaixo.

- [ ] **Step 6: Rodar os testes**

Run: `npm test -- scrollExpansionHero`
Expected: PASS (4 testes verdes, sem regressão).

- [ ] **Step 7: Lint**

Run: `npm run lint`
Expected: sem erros (em particular, nenhum `lightBgOpacity` não-usado).

- [ ] **Step 8: Verificação visual**

Run: `npm run dev` e abrir a home em viewport desktop (≥768px).
Expected: ao rolar, os cards (texto + 3D) saem após ~1 scroll, o vídeo abre e permanece fixo por ~5 voltas de roda, e o conteúdo abaixo é revelado sem tela branca prematura.

- [ ] **Step 9: Commit**

```bash
git add app/(site)/(home)/_components/scrollExpansionHero.tsx
git commit -m "fix: hold do vídeo no hero scroll do desktop"
```
