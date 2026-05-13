# Fix de bugs do ScrollHint + dead zone do hero — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir 3 bugs reportados em QA visual da home: chevron animado aparece como "L" durante a animação, `ScrollHint` tem delay de 2.5 s e não reaparece ao voltar ao topo, e o hero scroll-driven tem dead zone (~45vh) sem animação no final.

**Architecture:** 3 mudanças cirúrgicas em arquivos distintos da branch `feat/melhoria-intuitividade-home`. Sem novos arquivos, sem novos componentes. Cada fix é um commit separado validado por `bun run test`.

**Tech Stack:** Next.js 16, React 19, Tailwind 4, motion/react, Vitest + Testing Library + jsdom.

**Spec:** `docs/superpowers/specs/2026-05-13-fix-scroll-hint-hero-gaps-design.md`

---

## File Structure

**Modificados:**
- `app/globals.css` — regra `.scroll-hint-chevron` (linhas 194-203) + `@keyframes scroll-hint-cascade` (linhas 184-187)
- `components/blocks/scrollHint.tsx` — remove `idleMs` + `dismissedRef`, substitui `useEffect` por state machine reativa
- `components/blocks/__tests__/scrollHint.test.tsx` — remove 3 testes obsoletos, adiciona 5 novos, ajusta setup
- `app/(home)/_components/scrollExpansionHero.tsx` — `h-[300vh]` → `h-[200vh]`, `lightBgOpacity` range `[0.6, 1.0]`

**Nenhum arquivo criado ou removido.**

---

## Task 1: Fix do CSS do chevron

**Files:**
- Modify: `app/globals.css:184-203`

- [ ] **Step 1.1: Substituir o `@keyframes scroll-hint-cascade` para incluir `rotate(45deg)` em todos os steps**

Em `app/globals.css`, substituir o bloco existente (linhas 184-187):

```css
@keyframes scroll-hint-cascade {
  0%, 80%, 100% { opacity: 0; transform: translateY(-2px); }
  40% { opacity: 1; transform: translateY(2px); }
}
```

por:

```css
@keyframes scroll-hint-cascade {
  0%, 80%, 100% {
    opacity: 0;
    transform: rotate(45deg) translate(-2px, -2px);
  }
  40% {
    opacity: 1;
    transform: rotate(45deg) translate(2px, 2px);
  }
}
```

- [ ] **Step 1.2: Atualizar `.scroll-hint-chevron` para 16×16 + border 2.5px + margin -8px**

Em `app/globals.css`, substituir o bloco existente (linhas 194-203):

```css
.scroll-hint-chevron {
  width: 18px;
  height: 8px;
  border-right: 2px solid rgb(255 255 255 / 0.85);
  border-bottom: 2px solid rgb(255 255 255 / 0.85);
  transform: rotate(45deg);
  margin-top: -3px;
  opacity: 0;
  animation: scroll-hint-cascade 1.8s ease-in-out infinite;
}
```

por:

```css
.scroll-hint-chevron {
  width: 16px;
  height: 16px;
  border-right: 2.5px solid rgb(255 255 255 / 0.85);
  border-bottom: 2.5px solid rgb(255 255 255 / 0.85);
  transform: rotate(45deg);
  margin-top: -8px;
  opacity: 0;
  animation: scroll-hint-cascade 1.8s ease-in-out infinite;
}
```

- [ ] **Step 1.3: Suite de testes (zero regressão)**

Rodar:

```bash
bun run test
```

Expected: 40 passes em 7 arquivos.

- [ ] **Step 1.4: Smoke visual manual (recomendado, não obrigatório)**

Rodar:

```bash
bun run dev
```

Abrir `http://localhost:3000`, observar a seta no DesktopHero. Cada chevron deve aparecer como "v" pointing down, sem corte do lado direito. Encerrar dev com Ctrl+C.

- [ ] **Step 1.5: Commit**

```bash
git add app/globals.css
git commit -m "fix(scroll-hint): chevron rotate dentro do keyframe"
```

---

## Task 2: State machine reativa no `ScrollHint`

**Files:**
- Modify: `components/blocks/__tests__/scrollHint.test.tsx`
- Modify: `components/blocks/scrollHint.tsx`

- [ ] **Step 2.1: Substituir o arquivo de teste inteiro**

Substituir o conteúdo completo de `components/blocks/__tests__/scrollHint.test.tsx` por:

```tsx
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ScrollHint } from '../scrollHint';

const reducedMotionMock = vi.fn();

vi.mock('motion/react', () => ({
  motion: {
    div: ({
      children,
      animate,
      initial: _initial,
      transition: _transition,
      ...props
    }: {
      children?: React.ReactNode;
      animate?: { opacity?: number };
      initial?: unknown;
      transition?: unknown;
    } & React.HTMLAttributes<HTMLDivElement>) => (
      <div
        {...props}
        data-opacity={animate && typeof animate.opacity === 'number' ? String(animate.opacity) : undefined}>
        {children}
      </div>
    ),
  },
  useReducedMotion: () => reducedMotionMock(),
}));

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value,
    writable: true,
  });
}

describe('ScrollHint', () => {
  beforeEach(() => {
    reducedMotionMock.mockReturnValue(false);
    setScrollY(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('inicia visível quando scrollY < 50', () => {
    setScrollY(0);
    render(<ScrollHint variant='desktop' />);
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '1');
  });

  it('inicia oculto quando scrollY >= 50', () => {
    setScrollY(100);
    render(<ScrollHint variant='desktop' />);
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '0');
  });

  it('some quando scrolla além do threshold', () => {
    setScrollY(0);
    render(<ScrollHint variant='desktop' />);
    act(() => {
      setScrollY(100);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '0');
  });

  it('reaparece quando volta ao topo', () => {
    setScrollY(200);
    render(<ScrollHint variant='desktop' />);
    act(() => {
      setScrollY(0);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '1');
  });

  it('respeita threshold de 50px no limite', () => {
    setScrollY(49);
    const { unmount } = render(<ScrollHint variant='desktop' testId='hint-49' />);
    expect(screen.getByTestId('hint-49')).toHaveAttribute('data-opacity', '1');
    unmount();

    setScrollY(50);
    render(<ScrollHint variant='desktop' testId='hint-50' />);
    expect(screen.getByTestId('hint-50')).toHaveAttribute('data-opacity', '0');
  });

  it('respeita prefers-reduced-motion (retorna null sem listener)', () => {
    reducedMotionMock.mockReturnValue(true);
    const addSpy = vi.spyOn(window, 'addEventListener');
    const { container } = render(<ScrollHint variant='desktop' />);
    expect(container.firstChild).toBeNull();
    expect(addSpy).not.toHaveBeenCalledWith('scroll', expect.any(Function), expect.anything());
  });

  it('limpa listener no unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ScrollHint variant='desktop' />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('variant mobile renderiza pill com label', () => {
    render(<ScrollHint variant='mobile' />);
    const el = screen.getByTestId('scroll-hint-mobile');
    expect(el).toHaveTextContent(/role para descobrir/i);
  });

  it('variant desktop renderiza label', () => {
    render(<ScrollHint variant='desktop' />);
    expect(screen.getByText(/role para descobrir/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2.2: Rodar testes e confirmar que falham**

```bash
bun run test components/blocks/__tests__/scrollHint.test.tsx
```

Expected: vários testes falham (componente atual usa `idleMs` + `dismissedRef`, novo comportamento ainda não implementado).

- [ ] **Step 2.3: Substituir o componente `ScrollHint` inteiro**

Substituir o conteúdo completo de `components/blocks/scrollHint.tsx` por:

```tsx
'use client';

import { useEffect, useState } from 'react';

import { motion, useReducedMotion } from 'motion/react';

const HIDE_THRESHOLD_PX = 50;

type ScrollHintProps = {
  variant: 'desktop' | 'mobile';
  targetRef?: React.RefObject<HTMLElement | null>;
  testId?: string;
};

export function ScrollHint({ variant, targetRef, testId }: ScrollHintProps) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    const target: HTMLElement | Window = targetRef?.current ?? window;

    const readPosition = () => {
      if (target === window) return window.scrollY;
      return (target as HTMLElement).scrollTop;
    };

    const checkPosition = () => {
      setVisible(readPosition() < HIDE_THRESHOLD_PX);
    };

    checkPosition();
    target.addEventListener('scroll', checkPosition, { passive: true });

    return () => {
      target.removeEventListener('scroll', checkPosition);
    };
  }, [reduceMotion, targetRef]);

  if (reduceMotion) return null;

  const resolvedTestId =
    testId ?? (variant === 'desktop' ? 'scroll-hint-desktop' : 'scroll-hint-mobile');

  if (variant === 'desktop') {
    return (
      <motion.div
        data-testid={resolvedTestId}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className='pointer-events-none fixed bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2'>
        <div className='flex flex-col items-center'>
          <span className='scroll-hint-chevron' style={{ animationDelay: '0s' }} />
          <span
            className='scroll-hint-chevron'
            style={{ animationDelay: '0.25s' }}
          />
          <span
            className='scroll-hint-chevron'
            style={{ animationDelay: '0.5s' }}
          />
        </div>
        <span className='text-xs uppercase tracking-wider text-white/70'>
          Role para descobrir
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      data-testid={resolvedTestId}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className='scroll-hint-pill pointer-events-none fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white/85'>
      <span>Role para descobrir</span>
      <span className='scroll-hint-chevron-single' />
    </motion.div>
  );
}
```

- [ ] **Step 2.4: Rodar testes do componente e confirmar 9 passes**

```bash
bun run test components/blocks/__tests__/scrollHint.test.tsx
```

Expected: 9 testes passando.

- [ ] **Step 2.5: Rodar suite completa (zero regressão)**

```bash
bun run test
```

Expected: tudo verde. O teste de integração `scrollExpansionHero.test.tsx` continua passando porque `ScrollHint` mantém os mesmos `data-testid` (`scroll-hint-desktop` e `scroll-hint-mobile`).

- [ ] **Step 2.6: Commit**

```bash
git add components/blocks/scrollHint.tsx components/blocks/__tests__/scrollHint.test.tsx
git commit -m "feat(scroll-hint): visibilidade reativa scrollY < 50"
```

---

## Task 3: Eliminar dead zone do hero

**Files:**
- Modify: `app/(home)/_components/scrollExpansionHero.tsx:123,145`

- [ ] **Step 3.1: Encurtar a altura do hero scroll-driven**

Em `app/(home)/_components/scrollExpansionHero.tsx`, localizar a linha 145:

```tsx
<section ref={heroRef} className='relative h-[300vh]'>
```

Substituir por:

```tsx
<section ref={heroRef} className='relative h-[200vh]'>
```

- [ ] **Step 3.2: Esticar o range do `lightBgOpacity` para ocupar até o final**

Na mesma função `DesktopHero`, localizar a linha 123:

```tsx
const lightBgOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);
```

Substituir por:

```tsx
const lightBgOpacity = useTransform(scrollYProgress, [0.6, 1.0], [0, 1]);
```

Os outros `useTransform` (`leftX`, `rightX`, `cardsOpacity`, `videoOpacity`, `videoScale`, `gridOpacity`) **permanecem inalterados** — todos usam frações de `scrollYProgress` que escalam proporcionalmente com a altura do container.

- [ ] **Step 3.3: Rodar suite completa**

```bash
bun run test
```

Expected: 40 passes (mesmo total). Teste existente em `scrollExpansionHero.test.tsx` não checa `h-[300vh]` direto, então não regride.

- [ ] **Step 3.4: Smoke visual manual (recomendado)**

```bash
bun run dev
```

Abrir `http://localhost:3000`. Scrollar lentamente pelo hero:

- Cards iniciais (texto + 3D) saem fade rápido.
- Vídeo central aparece e escala suave.
- Background transiciona de slate escuro para branco.
- Quando o background termina branco, a próxima seção (`HomeContent`) já deve estar entrando sem zona estática intermediária.

Encerrar dev com Ctrl+C.

- [ ] **Step 3.5: Commit**

```bash
git add app/\(home\)/_components/scrollExpansionHero.tsx
git commit -m "perf(hero): encurta h-200vh + elimina dead zone"
```

---

## Task 4: Validação final

- [ ] **Step 4.1: Suite completa**

```bash
bun run test
```

Expected: 40 passes em 7 arquivos.

- [ ] **Step 4.2: Build de produção**

```bash
bun run build
```

Expected: build conclui sem erro fatal. Nenhum warning novo introduzido por esta task.

- [ ] **Step 4.3: Verificar critérios de aceitação da spec**

Abrir `http://localhost:3000` em `bun run dev`. Validar visualmente:

| Critério | Como validar |
|----------|--------------|
| Chevron renderiza como "v" | Olhar a seta no DesktopHero — 3 chevrons cascading, formato "v" claro |
| Sem corte do lado direito do chevron | Mesmo passo acima — observar simetria horizontal |
| `ScrollHint` aparece imediato no load | Refresh da página — seta visível em ≤ 500 ms (transição opacity 400 ms) |
| Some ao scrollar 50px+ | Pequeno scroll — seta some |
| Reaparece ao voltar ao topo | Scroll up até `scrollY === 0` — seta reaparece |
| Reduced motion esconde | DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`, reload → sem seta |
| Sem dead zone no hero | Scroll lento até o fim do hero — transição direta para `HomeContent` sem zona estática |

- [ ] **Step 4.4: Resumo final ao usuário**

Listar os 3 commits e o estado da branch:

```bash
git log --oneline main..HEAD | head -5
```

Recomendar QA visual presencial antes de merge final.

---

## Notas para o executor

- **Use `bun run test`, NUNCA `bun test`.** `bun test` usa o runner próprio do Bun (sem jsdom) e os testes falham com `ReferenceError: window is not defined`. O script `package.json` define `"test": "vitest run"` — é o que precisamos.
- Não dar `git push` sem aprovação explícita do usuário (regra `ask` ativa).
- Não usar `--no-verify` em commits. Se um hook quebrar, investigar.
- O lint do projeto tem um crash pré-existente em `@eslint/eslintrc` ao processar `next/core-web-vitals`. **Não é introduzido por esta task** — pular Step de lint sem reportar como issue novo.
- Re-`Read` arquivos modificados antes de qualquer `Edit` adicional na mesma task (harness invalida file state após escrita).
