# Fix de bugs do ScrollHint + dead zone do hero — Design

**Data:** 2026-05-13
**Branch:** `feat/melhoria-intuitividade-home` (continuação)
**Status:** Aprovado para implementação

## Contexto

Após o merge inicial de `feat/melhoria-intuitividade-home` (commits `16fa1c7` em diante), o usuário identificou 3 problemas em QA visual:

1. **Chevron animado com aparência "L"** em vez de "v" pointing down. Causa raiz: o `@keyframes scroll-hint-cascade` define `transform: translateY(...)` que sobrescreve o `transform: rotate(45deg)` da regra `.scroll-hint-chevron`. Durante a animação, a rotação some e o elemento mostra os borders `right` + `bottom` de um retângulo 18×8 axis-aligned — uma quina "L" no canto inferior-direito, com o lado direito curto (8px) aparecendo cortado.
2. **Delay de 2.5 s indesejado.** O componente espera idle para aparecer e some no primeiro scroll de forma permanente. O usuário quer: aparecer imediatamente no load, sumir ao scrollar, e **reaparecer** quando voltar ao topo da página.
3. **Frame vazio no final do hero.** O `DesktopHero` tem `h-[300vh]` (3 viewport heights de scroll). A última animação termina em `progress 0.85` (`lightBgOpacity: [0.6, 0.85]`). Entre 0.85 e 1.0 (~45vh de scroll real) nada anima — o usuário percebe uma zona estática vazia antes da próxima seção tomar conta.

## Objetivos

- Chevron renderizar corretamente como "v" durante toda a animação.
- `ScrollHint` virar state machine reativa: visível enquanto `scrollY < 50px`, oculto acima, reaparece ao voltar ao topo.
- Eliminar a dead zone do final do hero scroll-driven.

## Não objetivos

- Redesign do hero, do componente ou do label.
- Mudança no comportamento de `prefers-reduced-motion` (continua escondendo a seta).
- Refator do `ScrollExpandMedia` ou de seus consumidores fora dos pontos elencados.

## Decisões

| Eixo | Decisão |
|------|---------|
| Visual do chevron | Square 16×16, border 2.5px, rotate dentro do keyframe |
| Threshold de visibilidade | `scrollY < 50px` (tolerante a microscroll) |
| Comportamento | Reativo, não one-shot. Listener persiste até unmount |
| Hero altura | `h-[300vh]` → `h-[200vh]` |
| `lightBgOpacity` range | `[0.6, 0.85]` → `[0.6, 1.0]` (ocupa todo o final) |
| Prop `idleMs` | **Remover** do tipo `ScrollHintProps` (não mais usada) |

## Arquitetura

3 mudanças cirúrgicas, em arquivos distintos, sem novos componentes:

**Frente A — Chevron visual:** edita `app/globals.css` (regra `.scroll-hint-chevron` + `@keyframes scroll-hint-cascade`).

**Frente B — State machine:** edita `components/blocks/scrollHint.tsx`. Remove `useState dismissedRef`, `setTimeout`, prop `idleMs`. Adiciona handler de scroll que computa `scrollY < 50`.

**Frente C — Hero dead zone:** edita `app/(home)/_components/scrollExpansionHero.tsx`. Altera classe do `<section ref={heroRef}>` para `h-[200vh]` e o range do `lightBgOpacity` para `[0.6, 1.0]`.

Sem novo provider, sem novo arquivo, sem dependência nova.

## Componentes

### `app/globals.css` — fix CSS do chevron

Substituir bloco existente (linhas ~184-200):

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

**O bloco `.scroll-hint-chevron-single` (mobile) já tem `rotate(45deg)` dentro de `@keyframes scroll-hint-nudge`** — verificar e manter como está, sem mudança.

### `components/blocks/scrollHint.tsx` — state machine reativa

Substituir tipo:

```ts
type ScrollHintProps = {
  variant: 'desktop' | 'mobile';
  targetRef?: React.RefObject<HTMLElement | null>;
  testId?: string;
};
```

(Remove `idleMs`.)

Substituir o `useEffect`:

```tsx
const HIDE_THRESHOLD_PX = 50;

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
```

Estado inicial `visible = false` no `useState` — o `checkPosition()` síncrono no mount ajusta antes do primeiro paint visível (effect roda após mount; o usuário vê opacity 0 → animate para 1 em ~400 ms quando arranca no topo). Aceito.

Remover `dismissedRef`. Remover `idleMs` da destructuring.

### `app/(home)/_components/scrollExpansionHero.tsx` — dead zone

Substituir linha 145:

```tsx
<section ref={heroRef} className='relative h-[200vh]'>
```

Substituir linha 123:

```tsx
const lightBgOpacity = useTransform(scrollYProgress, [0.6, 1.0], [0, 1]);
```

Demais `useTransform` mantidos (todos usam frações de progress que se proporcionalizam automaticamente).

## Data flow

```
mount ScrollHint
  ↓
useReducedMotion()
  ├─ true  → return null (sem listener)
  └─ false → useEffect:
              target = targetRef?.current ?? window
              checkPosition() síncrono
              setVisible(readPosition() < 50)
              addEventListener('scroll', checkPosition)
              ↓
        scroll evento → checkPosition → setVisible
              ↓
        scroll de volta ao topo → readPosition() < 50 → visible=true
              ↓
unmount → removeEventListener
```

Hero timeline (200vh):

```
0.000   0.025      0.06           0.3         0.6                    1.0
[──cards out──video in──video stays──grid fade end──BG light fade-in──]
```

Sem dead zone.

## Error handling

- `ScrollHint`: listener `passive`, falha silenciosa. Sem try/catch. Sem `ErrorBoundary` novo.
- SSR: componente é `'use client'`; `window` só acessado dentro de `useEffect`. Safe.
- `useReducedMotion` mudando em runtime (rare): dependência do effect re-roda, cleanup remove listener velho, attach novo.
- `useScroll({ target: heroRef })` com altura menor: motion normaliza `scrollYProgress` 0-1 relativo ao container. Mudança transparente para todos os consumidores.
- Telas muito baixas (≤ 600 px de altura): `h-[200vh]` ainda funciona (sticky inner `h-screen`).

## Testes

Stack: Vitest + Testing Library + jsdom.

### Unit — `components/blocks/__tests__/scrollHint.test.tsx`

**Remover do setup:** `vi.useFakeTimers()` global (não mais necessário).

**Remover testes:**
- `não renderiza visível antes de idleMs`
- `fica visível após idleMs` (substitui pelo de baixo)
- `não reaparece em scrolls subsequentes` (comportamento invertido)

**Manter testes:**
- `respeita prefers-reduced-motion` (returns null, sem listener)
- `limpa listener no unmount`
- `variant mobile renderiza pill com label`
- `variant desktop renderiza label`

**Adicionar testes novos:**

```tsx
it('inicia visível quando scrollY < 50', () => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0, writable: true });
  render(<ScrollHint variant='desktop' />);
  expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '1');
});

it('inicia oculto quando scrollY >= 50', () => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 100, writable: true });
  render(<ScrollHint variant='desktop' />);
  expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '0');
});

it('some quando scrolla além do threshold', () => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0, writable: true });
  render(<ScrollHint variant='desktop' />);
  act(() => {
    (window as { scrollY: number }).scrollY = 100;
    window.dispatchEvent(new Event('scroll'));
  });
  expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '0');
});

it('reaparece quando volta ao topo', () => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 200, writable: true });
  render(<ScrollHint variant='desktop' />);
  act(() => {
    (window as { scrollY: number }).scrollY = 0;
    window.dispatchEvent(new Event('scroll'));
  });
  expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '1');
});

it('respeita threshold de 50px no limite', () => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 49, writable: true });
  const { unmount: u1 } = render(<ScrollHint variant='desktop' testId='hint-49' />);
  expect(screen.getByTestId('hint-49')).toHaveAttribute('data-opacity', '1');
  u1();

  Object.defineProperty(window, 'scrollY', { configurable: true, value: 50, writable: true });
  render(<ScrollHint variant='desktop' testId='hint-50' />);
  expect(screen.getByTestId('hint-50')).toHaveAttribute('data-opacity', '0');
});
```

### Integração — `scrollExpansionHero.test.tsx`

Testes existentes não checam `h-[300vh]` direto — sem regressão esperada. Suite full deve continuar 40 passes.

### Fora do escopo automatizado

- Verificação visual do chevron como "v" (jsdom não renderiza CSS).
- Smoke do scroll dead zone removido (visual QA em browser).

## Plano de commits

1. `fix(scroll-hint): chevron rotate dentro do keyframe`
2. `feat(scroll-hint): visibilidade reativa scrollY < 50`
3. `perf(hero): encurta h-200vh + elimina dead zone`

Cada commit passa `bun run test` + visual smoke manual.

## Critérios de aceitação

- [ ] Chevron renderiza como "v" pointing down durante toda a animação cascade (verificado em browser).
- [ ] `ScrollHint` aparece imediatamente no load se `scrollY < 50`.
- [ ] `ScrollHint` some ao scrollar 50 px+.
- [ ] `ScrollHint` reaparece ao voltar ao topo (scroll up).
- [ ] `prefers-reduced-motion` continua escondendo (sem regressão).
- [ ] Hero scroll-driven sem dead zone visível no final (transição direta para próxima seção).
- [ ] `bun run test` passa.

## Fora do escopo

- Geração de posters dos GLBs (tracked separadamente).
- Lint crash pré-existente.
- Outros bugs visuais não reportados.
