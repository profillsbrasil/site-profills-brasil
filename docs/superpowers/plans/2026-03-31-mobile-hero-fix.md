# Mobile Hero Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir o `MobileHero` para mostrar o modelo 3D com altura real e reutilizar o mesmo conteúdo textual/showcase do desktop.

**Architecture:** A correção fica concentrada em `app/(home)/_components/scrollExpansionHero.tsx`, preservando `DesktopHero`, scroll e animações já existentes. Como o repositório não tem harness de testes, a implementação começa adicionando Vitest + Testing Library com um teste de regressão que valida o conteúdo mobile e a presença do container 3D com altura explícita.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library, jsdom.

---

### Task 1: Adicionar harness de testes para regressão do hero mobile

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `app/(home)/_components/__tests__/scrollExpansionHero.test.tsx`

- [ ] **Step 1: Adicionar scripts e dependências de teste**

Em `package.json`, incluir:

```json
{
  "scripts": {
    "test": "vitest run"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.8.0",
    "@testing-library/react": "^16.3.0",
    "jsdom": "^26.1.0",
    "vitest": "^2.1.9"
  }
}
```

- [ ] **Step 2: Criar configuração do Vitest**

Criar `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 3: Criar setup do Testing Library**

Criar `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Escrever o teste de regressão primeiro**

Criar `app/(home)/_components/__tests__/scrollExpansionHero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ScrollExpandMedia from '../scrollExpansionHero';

vi.mock('next/dynamic', () => ({
  default: () => {
    return function MockDynamicComponent(props: Record<string, unknown>) {
      return <div data-testid='caixa-home-3d' {...props} />;
    };
  },
}));

vi.mock('@/components/layout/gridPatternBg', () => ({
  GridPattern: () => <div data-testid='grid-pattern' />,
}));

vi.mock('@/components/layout/gridPatternBgMobile', () => ({
  GridPatternMobile: () => <div data-testid='grid-pattern-mobile' />,
}));

vi.mock('@/components/ui/blur-fade', () => ({
  BlurFade: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
  useMotionValueEvent: vi.fn(),
  useReducedMotion: () => false,
  useScroll: () => ({ scrollYProgress: {} }),
  useTransform: () => 0,
}));

describe('ScrollExpandMedia mobile hero', () => {
  beforeEach(() => {
    window.innerWidth = 390;
    window.dispatchEvent(new Event('resize'));
  });

  it('renders the updated mobile copy, showcase and explicit 3D height', () => {
    render(
      <ScrollExpandMedia>
        <div>Conteudo</div>
      </ScrollExpandMedia>
    );

    expect(screen.getByRole('heading', { name: /tudo para seu negocio!/i })).toBeInTheDocument();
    expect(screen.getByText(/inovacao a cada embalagem/i)).toBeInTheDocument();
    expect(screen.getByText(/maquinas envasadoras/i)).toBeInTheDocument();

    const model = screen.getByTestId('caixa-home-3d');
    expect(model).toHaveClass('h-[260px]');
    expect(model).toHaveClass('w-full');
  });
});
```

- [ ] **Step 5: Rodar o teste para validar RED**

Run: `npm test -- scrollExpansionHero.test.tsx`
Expected: FAIL porque o `MobileHero` ainda mostra `Soluções para o seu negócio!`, não renderiza `HeroShowcase` e mantém o container antigo do modelo.

- [ ] **Step 6: Commit**

```bash
git add package.json vitest.config.ts vitest.setup.ts app/(home)/_components/__tests__/scrollExpansionHero.test.tsx
git commit -m "test: adicionar regressao do hero mobile"
```

### Task 2: Corrigir o `MobileHero` para seguir o spec aprovado

**Files:**
- Modify: `app/(home)/_components/scrollExpansionHero.tsx`
- Test: `app/(home)/_components/__tests__/scrollExpansionHero.test.tsx`

- [ ] **Step 1: Remover imports obsoletos**

Substituir:

```tsx
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
```

e:

```tsx
import { CircleCheckBig } from 'lucide-react';
```

por:

```tsx
import { BlurFade } from '@/components/ui/blur-fade';
```

- [ ] **Step 2: Reescrever `MobileHero` com layout vertical flexível**

Atualizar `MobileHero` para:

```tsx
function MobileHero({ children }: { children?: ReactNode }) {
  return (
    <div className='relative min-h-[calc(100vh-5rem)] bg-linear-to-br from-slate-900 via-slate-800 to-slate-900'>
      <GridPatternMobile />

      <div className='relative z-10 flex min-h-[calc(100vh-5rem)] w-full flex-col items-start justify-center gap-8 px-6 py-16'>
        <BlurFade delay={0.1} inView>
          <div className='flex w-full flex-col'>
            <h1 className='text-4xl font-bold leading-tight tracking-tight text-secondary-foreground select-none'>
              Tudo Para
              <br />
              Seu Negócio!
            </h1>
            <h2 className='mt-1 text-lg text-accent'>Inovação a cada embalagem</h2>
            <HeroShowcase />
          </div>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <div className='flex w-full items-center justify-center'>
            <CaixaHome3d
              alt='Modelo 3D - Linha de Produtos Profills'
              modelSrc='/caixa-teste-3d.glb'
              cameraOrbit='40deg 75deg 105%'
              autoRotate={true}
              isMobile={true}
              className='h-[260px] w-full'
            />
          </div>
        </BlurFade>
      </div>

      <section className='relative z-20 min-h-screen bg-white pt-8'>
        {children}
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Rodar o teste para validar GREEN**

Run: `npm test -- scrollExpansionHero.test.tsx`
Expected: PASS com 1 teste verde.

- [ ] **Step 4: Rodar checagem do arquivo alterado**

Run: `npm run lint -- app/(home)/_components/scrollExpansionHero.tsx vitest.config.ts vitest.setup.ts app/(home)/_components/__tests__/scrollExpansionHero.test.tsx`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add package.json vitest.config.ts vitest.setup.ts app/(home)/_components/scrollExpansionHero.tsx app/(home)/_components/__tests__/scrollExpansionHero.test.tsx
git commit -m "fix: corrigir hero mobile e exibir modelo 3d"
```
