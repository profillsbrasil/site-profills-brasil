# Resiliência de WebGL nos modelos 3D — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Detectar a ausência de WebGL e degradar os componentes 3D para um fallback estático, eliminando na raiz os erros de contexto WebGL e o `unhandledRejection` do three.js.

**Architecture:** Um util `isWebGLAvailable()` detecta suporte a WebGL criando um contexto descartável. O hook `useOptimized3DModel` expõe `webglSupported`; quando `false`, não importa `@google/model-viewer` nem renderiza `<model-viewer>`. Os componentes passam a tratar três estados (carregando / carregado / indisponível) e exibem um componente compartilhado `WebGLFallback` no estado indisponível.

**Tech Stack:** Next.js 16, React 19, TypeScript, `@google/model-viewer`, Vitest + Testing Library, Tailwind v4, lucide-react.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `components/modelo3d/hooks/webglSupport.ts` (novo) | Detecção memoizada de suporte a WebGL |
| `components/modelo3d/hooks/webglSupport.test.ts` (novo) | Testes do util |
| `components/modelo3d/hooks/useOptimized3DModel.ts` | Expõe `webglSupported`, gate do import |
| `components/modelo3d/hooks/useOptimized3DModel.test.ts` (novo) | Testa propagação de `webglSupported` |
| `components/modelo3d/WebGLFallback.tsx` (novo) | Placeholder compartilhado de indisponibilidade |
| `components/modelo3d/WebGLFallback.test.tsx` (novo) | Testes do fallback |
| `components/modelo3d/caixaHome3d.tsx` | Wire do fallback (variante dark) |
| `components/modelo3d/caixaHome3d.test.tsx` | Atualiza mock + caso WebGL indisponível |
| `components/modelo3d/optimizedEmbalagem3d.tsx` | Wire do fallback (variante light) |
| `components/modelo3d/optimizedEmbalagem3d.test.tsx` (novo) | Testes de render do fallback |
| `vitest.setup.ts` | Stub global de `IntersectionObserver` |
| `components/layout/navbarDesktop.tsx` | `priority` no logo (fix LCP) |
| `components/layout/navbarMobile.tsx` | `priority` no logo (fix LCP) |

---

## Task 1: Util de detecção de WebGL

**Files:**
- Create: `components/modelo3d/hooks/webglSupport.ts`
- Test: `components/modelo3d/hooks/webglSupport.test.ts`

- [ ] **Step 1: Escrever os testes que falham**

Em `components/modelo3d/hooks/webglSupport.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';

import { isWebGLAvailable, resetWebGLCache } from './webglSupport';

afterEach(() => {
  resetWebGLCache();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('isWebGLAvailable', () => {
  it('retorna true quando o canvas fornece um contexto webgl', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as unknown as WebGL2RenderingContext
    );
    expect(isWebGLAvailable()).toBe(true);
  });

  it('retorna false quando nenhum contexto webgl é criado', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    expect(isWebGLAvailable()).toBe(false);
  });

  it('retorna false quando getContext lança', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () => {
        throw new Error('webgl disabled');
      }
    );
    expect(isWebGLAvailable()).toBe(false);
  });

  it('assume true em ambiente sem window (SSR)', () => {
    vi.stubGlobal('window', undefined);
    expect(isWebGLAvailable()).toBe(true);
  });
});
```

- [ ] **Step 2: Rodar os testes para confirmar que falham**

Run: `bun run test webglSupport`
Expected: FAIL — `Failed to resolve import "./webglSupport"`.

- [ ] **Step 3: Implementar o util**

Em `components/modelo3d/hooks/webglSupport.ts`:

```ts
let cached: boolean | null = null;

/**
 * Detecta suporte a WebGL criando um contexto descartável.
 * Resultado memoizado por sessão (no client).
 */
export function isWebGLAvailable(): boolean {
  if (cached !== null) return cached;

  // SSR: assume suporte; a detecção real roda no client e não é memoizada aqui.
  if (typeof window === 'undefined') return true;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    cached = gl !== null;
  } catch {
    // getContext pode lançar quando WebGL está bloqueado — isso significa indisponível.
    cached = false;
  }

  return cached;
}

/** Apenas para testes: limpa o resultado memoizado. */
export function resetWebGLCache(): void {
  cached = null;
}
```

- [ ] **Step 4: Rodar os testes para confirmar que passam**

Run: `bun run test webglSupport`
Expected: PASS — 4 testes.

- [ ] **Step 5: Commit**

```bash
git add components/modelo3d/hooks/webglSupport.ts components/modelo3d/hooks/webglSupport.test.ts
git commit -m "feat: adiciona detecção de suporte a WebGL"
```

---

## Task 2: Expor `webglSupported` em `useOptimized3DModel`

**Files:**
- Modify: `vitest.setup.ts`
- Modify: `components/modelo3d/hooks/useOptimized3DModel.ts`
- Test: `components/modelo3d/hooks/useOptimized3DModel.test.ts`

- [ ] **Step 1: Adicionar stub de `IntersectionObserver` ao setup de testes**

O hook instancia `new IntersectionObserver(...)`, que jsdom não fornece. Substituir o conteúdo de `vitest.setup.ts` por:

```ts
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

class IntersectionObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '';
  thresholds = [];
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
```

- [ ] **Step 2: Escrever o teste que falha**

Em `components/modelo3d/hooks/useOptimized3DModel.test.ts`:

```ts
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('./webglSupport', () => ({
  isWebGLAvailable: vi.fn(),
}));

import { useOptimized3DModel } from './useOptimized3DModel';
import { isWebGLAvailable } from './webglSupport';

const mockedIsWebGLAvailable = vi.mocked(isWebGLAvailable);

afterEach(() => {
  vi.clearAllMocks();
});

describe('useOptimized3DModel', () => {
  it('expõe webglSupported=false quando WebGL não está disponível', async () => {
    mockedIsWebGLAvailable.mockReturnValue(false);

    const { result } = renderHook(() =>
      useOptimized3DModel({ src: '/modelo.glb' })
    );

    await waitFor(() => expect(result.current.webglSupported).toBe(false));
  });

  it('expõe webglSupported=true quando WebGL está disponível', async () => {
    mockedIsWebGLAvailable.mockReturnValue(true);

    const { result } = renderHook(() =>
      useOptimized3DModel({ src: '/modelo.glb' })
    );

    await waitFor(() => expect(result.current.webglSupported).toBe(true));
  });
});
```

- [ ] **Step 3: Rodar o teste para confirmar que falha**

Run: `bun run test useOptimized3DModel`
Expected: FAIL — `result.current.webglSupported` é `undefined`.

- [ ] **Step 4: Implementar `webglSupported` no hook**

Em `components/modelo3d/hooks/useOptimized3DModel.ts`:

4a. Adicionar o import no topo, junto aos imports existentes:

```ts
import { isWebGLAvailable } from './webglSupport';
```

4b. Adicionar o estado, logo após `const [hasBeenLoaded, setHasBeenLoaded] = useState(false);` (linha ~27):

```ts
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  // Detecta suporte a WebGL uma vez no client.
  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);
```

4c. Alterar a guarda da `useEffect` que importa o model-viewer (linha ~97). Trocar:

```ts
    if (!shouldRender || isLoaded) return;
```

por:

```ts
    if (!shouldRender || isLoaded || webglSupported !== true) return;
```

e incluir `webglSupported` no array de dependências dessa `useEffect` (linha ~113):

```ts
  }, [shouldRender, isLoaded, webglSupported]);
```

4d. Adicionar `webglSupported` ao objeto retornado (bloco `return { ... }`, linha ~186):

```ts
  return {
    containerRef,
    modelViewerRef,
    isVisible,
    isLoaded,
    shouldRender: shouldRender || hasBeenLoaded,
    hasBeenLoaded,
    webglSupported,
    handleModelLoad,
    handleModelError
  };
```

- [ ] **Step 5: Rodar o teste para confirmar que passa**

Run: `bun run test useOptimized3DModel`
Expected: PASS — 2 testes.

- [ ] **Step 6: Commit**

```bash
git add vitest.setup.ts components/modelo3d/hooks/useOptimized3DModel.ts components/modelo3d/hooks/useOptimized3DModel.test.ts
git commit -m "feat: expõe webglSupported no useOptimized3DModel"
```

---

## Task 3: Componente `WebGLFallback`

**Files:**
- Create: `components/modelo3d/WebGLFallback.tsx`
- Test: `components/modelo3d/WebGLFallback.test.tsx`

- [ ] **Step 1: Escrever os testes que falham**

Em `components/modelo3d/WebGLFallback.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { WebGLFallback } from './WebGLFallback';

describe('WebGLFallback', () => {
  it('renderiza a mensagem de indisponibilidade', () => {
    render(<WebGLFallback />);

    expect(screen.getByTestId('webgl-fallback')).toBeInTheDocument();
    expect(
      screen.getByText(/visualização 3d indisponível/i)
    ).toBeInTheDocument();
  });

  it('aplica o estilo da variante dark', () => {
    render(<WebGLFallback variant='dark' />);

    expect(screen.getByTestId('webgl-fallback')).toHaveClass('bg-white/5');
  });
});
```

- [ ] **Step 2: Rodar os testes para confirmar que falham**

Run: `bun run test WebGLFallback`
Expected: FAIL — `Failed to resolve import "./WebGLFallback"`.

- [ ] **Step 3: Implementar o componente**

Em `components/modelo3d/WebGLFallback.tsx`:

```tsx
import { Box } from 'lucide-react';

interface WebGLFallbackProps {
  className?: string;
  variant?: 'dark' | 'light';
}

const variantStyles = {
  dark: {
    card: 'border-white/10 bg-white/5',
    iconWrap: 'border-accent/30 bg-accent/10',
    icon: 'text-accent',
    title: 'text-white',
    text: 'text-white/60',
  },
  light: {
    card: 'border-border bg-muted',
    iconWrap: 'border-border bg-background',
    icon: 'text-muted-foreground',
    title: 'text-foreground',
    text: 'text-muted-foreground',
  },
} as const;

export function WebGLFallback({
  className = '',
  variant = 'light',
}: WebGLFallbackProps) {
  const s = variantStyles[variant];

  return (
    <div
      data-testid='webgl-fallback'
      className={`flex min-h-[220px] w-full max-w-sm flex-col items-center justify-center rounded-3xl border px-6 py-8 text-center backdrop-blur-sm ${s.card} ${className}`}>
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full border ${s.iconWrap}`}>
        <Box className={`h-7 w-7 ${s.icon}`} />
      </div>
      <span
        className={`mt-4 text-sm font-semibold tracking-wide ${s.title}`}>
        Visualização 3D indisponível
      </span>
      <span className={`mt-2 text-xs leading-relaxed ${s.text}`}>
        Seu dispositivo ou navegador não suporta a visualização interativa.
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Rodar os testes para confirmar que passam**

Run: `bun run test WebGLFallback`
Expected: PASS — 2 testes.

- [ ] **Step 5: Commit**

```bash
git add components/modelo3d/WebGLFallback.tsx components/modelo3d/WebGLFallback.test.tsx
git commit -m "feat: adiciona componente WebGLFallback"
```

---

## Task 4: Integrar o fallback no `CaixaHome3d`

**Files:**
- Modify: `components/modelo3d/caixaHome3d.tsx`
- Test: `components/modelo3d/caixaHome3d.test.tsx`

- [ ] **Step 1: Atualizar o mock existente e adicionar o teste que falha**

Em `components/modelo3d/caixaHome3d.test.tsx`:

1a. No `mockReturnValue` do teste já existente (`shows a visible loading placeholder...`), adicionar a propriedade `webglSupported: true` ao objeto retornado (a falta dela quebra o tipo após a Task 2).

1b. Adicionar este novo teste dentro do mesmo `describe`:

```tsx
  it('mostra o WebGLFallback quando WebGL não está disponível', () => {
    mockedUseOptimized3DModel.mockReturnValue({
      containerRef: { current: null },
      modelViewerRef: { current: null },
      isVisible: false,
      isLoaded: false,
      shouldRender: false,
      hasBeenLoaded: false,
      webglSupported: false,
      handleModelLoad: vi.fn(),
      handleModelError: vi.fn(),
    });

    render(<CaixaHome3d isMobile={true} />);

    expect(screen.getByTestId('webgl-fallback')).toBeInTheDocument();
    expect(screen.queryByText(/carregando modelo 3d/i)).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: Rodar os testes para confirmar que o novo falha**

Run: `bun run test caixaHome3d`
Expected: FAIL no novo teste — `webgl-fallback` não encontrado.

- [ ] **Step 3: Integrar o fallback no componente**

Em `components/modelo3d/caixaHome3d.tsx`:

3a. Adicionar o import (junto aos imports existentes):

```tsx
import { WebGLFallback } from '@/components/modelo3d/WebGLFallback';
```

3b. Adicionar `webglSupported` à desestruturação do hook (bloco `const { ... } = useOptimized3DModel(...)`):

```tsx
  const {
    containerRef,
    modelViewerRef,
    isVisible,
    isLoaded,
    shouldRender,
    webglSupported,
    handleModelLoad,
    handleModelError
  } = useOptimized3DModel({
```

3c. Alterar a guarda do `<model-viewer>`. Trocar a linha `{shouldRender && (` por:

```tsx
      {shouldRender && webglSupported !== false && (
```

3d. Alterar a guarda do placeholder de loading. Trocar:

```tsx
      {!posterSrc && (!shouldRender || !isLoaded) && (
```

por:

```tsx
      {!posterSrc && webglSupported !== false && (!shouldRender || !isLoaded) && (
```

3e. Adicionar o bloco de fallback imediatamente antes do fechamento do `</div>` externo (logo após o bloco do placeholder de loading):

```tsx
      {!posterSrc && webglSupported === false && (
        <WebGLFallback variant='dark' />
      )}
```

- [ ] **Step 4: Rodar os testes para confirmar que passam**

Run: `bun run test caixaHome3d`
Expected: PASS — 2 testes.

- [ ] **Step 5: Commit**

```bash
git add components/modelo3d/caixaHome3d.tsx components/modelo3d/caixaHome3d.test.tsx
git commit -m "feat: exibe WebGLFallback no CaixaHome3d sem WebGL"
```

---

## Task 5: Integrar o fallback no `OptimizedEmbalagem3d`

**Files:**
- Modify: `components/modelo3d/optimizedEmbalagem3d.tsx`
- Test: `components/modelo3d/optimizedEmbalagem3d.test.tsx`

- [ ] **Step 1: Escrever os testes que falham**

Em `components/modelo3d/optimizedEmbalagem3d.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { OptimizedEmbalagem3d } from './optimizedEmbalagem3d';
import { useOptimized3DModel } from './hooks/useOptimized3DModel';

vi.mock('./hooks/useOptimized3DModel', () => ({
  useOptimized3DModel: vi.fn(),
}));

const mockedUseOptimized3DModel = vi.mocked(useOptimized3DModel);

describe('OptimizedEmbalagem3d', () => {
  it('mostra o WebGLFallback quando WebGL não está disponível', () => {
    mockedUseOptimized3DModel.mockReturnValue({
      containerRef: { current: null },
      modelViewerRef: { current: null },
      isVisible: false,
      isLoaded: false,
      shouldRender: false,
      hasBeenLoaded: false,
      webglSupported: false,
      handleModelLoad: vi.fn(),
      handleModelError: vi.fn(),
    });

    render(<OptimizedEmbalagem3d />);

    expect(screen.getByTestId('webgl-fallback')).toBeInTheDocument();
  });

  it('mostra o placeholder de loading enquanto detecta WebGL', () => {
    mockedUseOptimized3DModel.mockReturnValue({
      containerRef: { current: null },
      modelViewerRef: { current: null },
      isVisible: true,
      isLoaded: false,
      shouldRender: false,
      hasBeenLoaded: false,
      webglSupported: null,
      handleModelLoad: vi.fn(),
      handleModelError: vi.fn(),
    });

    render(<OptimizedEmbalagem3d />);

    expect(screen.queryByTestId('webgl-fallback')).not.toBeInTheDocument();
    expect(screen.getByText(/carregando modelo 3d/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar os testes para confirmar que falham**

Run: `bun run test optimizedEmbalagem3d`
Expected: FAIL — `webgl-fallback` não encontrado / `webglSupported` ausente no tipo.

- [ ] **Step 3: Integrar o fallback no componente**

Em `components/modelo3d/optimizedEmbalagem3d.tsx`:

3a. Adicionar o import (junto aos imports existentes):

```tsx
import { WebGLFallback } from '@/components/modelo3d/WebGLFallback';
```

3b. Adicionar `webglSupported` à desestruturação do hook:

```tsx
  const {
    containerRef,
    modelViewerRef,
    isVisible,
    isLoaded,
    shouldRender,
    hasBeenLoaded,
    webglSupported,
    handleModelLoad,
    handleModelError
  } = useOptimized3DModel({
```

3c. Alterar a guarda do `<model-viewer>`. Trocar `{shouldRender && isLoaded && (` por:

```tsx
      {shouldRender && isLoaded && webglSupported !== false && (
```

3d. Alterar a guarda do bloco de placeholder. Trocar:

```tsx
      {(!shouldRender || !isLoaded) && (
```

por:

```tsx
      {webglSupported !== false && (!shouldRender || !isLoaded) && (
```

3e. Adicionar o bloco de fallback imediatamente após o bloco de placeholder (antes do fechamento do `</div>` externo):

```tsx
      {webglSupported === false && !posterSrc && (
        <WebGLFallback variant='light' />
      )}
```

- [ ] **Step 4: Rodar os testes para confirmar que passam**

Run: `bun run test optimizedEmbalagem3d`
Expected: PASS — 2 testes.

- [ ] **Step 5: Commit**

```bash
git add components/modelo3d/optimizedEmbalagem3d.tsx components/modelo3d/optimizedEmbalagem3d.test.tsx
git commit -m "feat: exibe WebGLFallback no OptimizedEmbalagem3d sem WebGL"
```

---

## Task 6: Fix do aviso de LCP no logo

O logo `logo-branco.png` é o LCP above the fold. `priority` no `next/image` aplica `loading="eager"` e `fetchpriority="high"`. Mudança trivial sem teste unitário — verificada via build/console.

**Files:**
- Modify: `components/layout/navbarDesktop.tsx:128`
- Modify: `components/layout/navbarMobile.tsx:176`

- [ ] **Step 1: Adicionar `priority` ao logo do navbar desktop**

Em `components/layout/navbarDesktop.tsx`, trocar a linha 128:

```tsx
            <Image src={logoProfills} alt='Logo Profills' className='h-full' />
```

por:

```tsx
            <Image
              src={logoProfills}
              alt='Logo Profills'
              priority
              className='h-full'
            />
```

- [ ] **Step 2: Adicionar `priority` ao logo do navbar mobile**

Em `components/layout/navbarMobile.tsx`, no `<Image>` que começa na linha ~176 (o logo dentro do `<Link href='/'>`, NÃO o que está dentro do `DrawerHeader`), adicionar a prop `priority`:

```tsx
          <Image
            src={logoProfills}
            alt='Logo Profills'
            priority
            className='h-8 w-auto object-contain'
          />
```

- [ ] **Step 3: Verificar o build**

Run: `bun run build`
Expected: build conclui sem erros.

- [ ] **Step 4: Commit**

```bash
git add components/layout/navbarDesktop.tsx components/layout/navbarMobile.tsx
git commit -m "perf: prioriza carregamento do logo (LCP)"
```

---

## Verificação final

- [ ] **Suite completa de testes**

Run: `bun run test`
Expected: todos os testes passam, incluindo os novos de `webglSupport`, `useOptimized3DModel`, `WebGLFallback`, `caixaHome3d` e `optimizedEmbalagem3d`.

- [ ] **Lint**

Run: `bun run lint`
Expected: sem erros.

- [ ] **Verificação manual (dev sem WebGL)**

Run: `bun dev` e abrir `http://localhost:3000` num navegador sem aceleração de GPU.
Expected: o terminal **não** mostra `THREE.WebGLRenderer: ... context could not be created` nem `unhandledRejection: ... isPresenting`. A página exibe o card "Visualização 3D indisponível" no lugar dos modelos 3D — sem spinner infinito.

- [ ] **Verificação manual (dev com WebGL)**

Run: `bun dev` num navegador com WebGL habilitado.
Expected: os modelos 3D carregam e rotacionam normalmente; nenhum regressão visual.
