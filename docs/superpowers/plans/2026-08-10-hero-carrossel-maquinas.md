# Hero-carrossel de máquinas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o hero scroll-driven da home (vídeo + 3D + sticky 200vh) por um carrossel de máquinas full-viewport com transição "Reveal", conforme spec aprovada.

**Architecture:** Componente novo `heroCarrossel/` em `app/(site)/(home)/_components/`, uma árvore só responsiva (sem duplicação mobile/desktop). Estado React simples (índice + direção), transição orquestrada com `motion/react` (`AnimatePresence mode='wait'` + variants com stagger para a cascata de máscaras). Anéis e flutuações em CSS keyframes (`globals.css`), dados dos slides em array tipado.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, motion (`'motion/react'`), Vitest + Testing Library (jsdom), Bun.

**Spec:** `docs/superpowers/specs/2026-08-10-hero-carrossel-maquinas-design.md`

## Global Constraints

- Package manager é **Bun**: `bun run test`, `bunx`, nunca npm/pnpm.
- Motion importa de `'motion/react'`, nunca `framer-motion`.
- Commits: Conventional Commits em PT, subject ≤50 chars. ZERO atribuição de AI.
- Toda animação respeita `useReducedMotion` → versão estática, sem autoplay.
- Imagens de componente: import estático de `@/lib/images/...`, nunca string de path.
- Cantos `rounded-xs` (2px); caixas de dados com borda tracejada (motivo do site).
- Produção sempre com "até" (`até 3.000 un/h`); dado técnico nunca dobra linha (`whitespace-nowrap`); headline com quebra controlada (2 blocos `whitespace-nowrap`).
- Máquina em **posição absoluta** no palco (a largura natural do PNG não pode participar do cálculo do grid).
- Navbar (h-16 fixa) nunca corta conteúdo: seção `min-h-screen` + `pt-16`.
- Prettier ordena classes/imports — rodar `bun run format` antes de cada commit se o hook não cobrir.

---

### Task 1: Dados dos slides (`slideData.ts`)

**Files:**

- Create: `app/(site)/(home)/_components/heroCarrossel/slideData.ts`
- Test: `app/(site)/(home)/_components/heroCarrossel/__tests__/slideData.test.ts`

**Interfaces:**

- Consumes: PNGs existentes em `lib/images/novasImagens/maquinasEmbalagens/` (mesmos imports de `maquinasData.ts`).
- Produces: `interface SlideMaquina` e `const SLIDES: SlideMaquina[]` (2 itens) e `const AUTOPLAY_MS = 7000` — consumidos pelas Tasks 3, 4 e 5. Campos exatos: `id: string`, `nome: string`, `categoria: string`, `titulo: [string, string]`, `descricao: string`, `specs: { valor: string; unidade: string; label: string; prefixo?: string }[]`, `imgMaquina: StaticImageData`, `imgEmbalagem: StaticImageData`, `embalagemAltura: string`, `embalagemEsquerda: string`, `rota: string`, `labelCurto: string`.

- [ ] **Step 1: Write the failing test**

```ts
// app/(site)/(home)/_components/heroCarrossel/__tests__/slideData.test.ts
import { AUTOPLAY_MS, SLIDES } from '../slideData';
import { describe, expect, it } from 'vitest';

describe('SLIDES do hero-carrossel', () => {
  it('tem exatamente os 2 slides aprovados, na ordem TP → TC4s', () => {
    expect(SLIDES).toHaveLength(2);
    expect(SLIDES[0].nome).toBe('Linha TP');
    expect(SLIDES[1].nome).toBe('Linha TC4s');
  });

  it('produção sempre leva prefixo "até" (capacidade varia por embalagem)', () => {
    for (const slide of SLIDES) {
      const producao = slide.specs.find((s) => s.label === 'Produção');
      expect(producao?.prefixo).toBe('até');
    }
  });

  it('cada slide aponta para a rota da sua máquina', () => {
    expect(SLIDES[0].rota).toBe('/maquinas/1');
    expect(SLIDES[1].rota).toBe('/maquinas/2');
  });

  it('títulos têm exatamente 2 linhas (quebra controlada)', () => {
    for (const slide of SLIDES) {
      expect(slide.titulo).toHaveLength(2);
    }
  });

  it('autoplay é 7s', () => {
    expect(AUTOPLAY_MS).toBe(7000);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test slideData`
Expected: FAIL — `Cannot find module '../slideData'`

- [ ] **Step 3: Write minimal implementation**

```ts
// app/(site)/(home)/_components/heroCarrossel/slideData.ts
import type { StaticImageData } from 'next/image';

import maquinaTc4s from '@/lib/images/novasImagens/maquinasEmbalagens/maquinas/TC 4S 200-1.png';
import maquinaTp85 from '@/lib/images/novasImagens/maquinasEmbalagens/maquinas/TP85.png';
import embalagemTc4s from '@/lib/images/novasImagens/maquinasEmbalagens/sache-4-soldas-1-via.png';
import embalagemTp from '@/lib/images/novasImagens/maquinasEmbalagens/sache-linha-tp-azul.png';

export interface SlideMaquina {
  id: string;
  nome: string;
  categoria: string;
  /** Duas linhas com quebra controlada — cada uma vira um bloco whitespace-nowrap */
  titulo: [string, string];
  descricao: string;
  specs: { valor: string; unidade: string; label: string; prefixo?: string }[];
  imgMaquina: StaticImageData;
  imgEmbalagem: StaticImageData;
  /** Altura da embalagem em % da altura do palco (varia por slide) */
  embalagemAltura: string;
  embalagemEsquerda: string;
  rota: string;
  /** Nome curto usado no "A seguir:" da navegação */
  labelCurto: string;
}

export const AUTOPLAY_MS = 7000;

export const SLIDES: SlideMaquina[] = [
  {
    id: 'linha-tp',
    nome: 'Linha TP',
    categoria: 'Envasadora de sachês',
    titulo: ['Precisão de dosagem,', 'sachê após sachê'],
    descricao:
      'Polpas, laticínios, molhos e outros líquidos ou secos, envasados com dosagem temporizada, volumétrica ou por bomba positiva.',
    specs: [
      { prefixo: 'até', valor: '3.000', unidade: 'un/h', label: 'Produção' },
      { valor: '85-300', unidade: 'mm', label: 'Largura do filme' },
      { valor: 'Inox', unidade: '304', label: 'Estrutura' }
    ],
    imgMaquina: maquinaTp85,
    imgEmbalagem: embalagemTp,
    embalagemAltura: '28%',
    embalagemEsquerda: '14%',
    rota: '/maquinas/1',
    labelCurto: 'TP · Sachês'
  },
  {
    id: 'linha-tc4s',
    nome: 'Linha TC4s',
    categoria: 'Sachê 4 soldas',
    titulo: ['Quatro soldas,', 'acabamento de gôndola'],
    descricao:
      'Envase em uma via com alto controle de dosagem, para líquidos e secos. Datação por alto relevo, inkjet ou hotstamping.',
    specs: [
      { prefixo: 'até', valor: '2.000', unidade: 'un/h', label: 'Produção' },
      { valor: '120-360', unidade: 'mm', label: 'Largura do filme' },
      { valor: 'Inox', unidade: '304', label: 'Estrutura' }
    ],
    imgMaquina: maquinaTc4s,
    imgEmbalagem: embalagemTc4s,
    embalagemAltura: '42%',
    embalagemEsquerda: '2%',
    rota: '/maquinas/2',
    labelCurto: 'TC4s · Sachê 4 soldas'
  }
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test slideData`
Expected: PASS (5 testes)

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/(home)/_components/heroCarrossel/slideData.ts" "app/(site)/(home)/_components/heroCarrossel/__tests__/slideData.test.ts"
git commit -m "feat: dados dos slides do hero-carrossel"
```

---

### Task 2: Keyframes CSS + anéis animados (`heroRings.tsx`)

**Files:**

- Modify: `app/globals.css` (acrescentar keyframes no fim do arquivo, junto dos keyframes existentes)
- Create: `app/(site)/(home)/_components/heroCarrossel/heroRings.tsx`
- Test: `app/(site)/(home)/_components/heroCarrossel/__tests__/heroRings.test.tsx`

**Interfaces:**

- Consumes: `cn()` de `@/lib/utils`.
- Produces: `function HeroRings({ estatico?: boolean; pingKey?: number }): JSX.Element` — consumida pela Task 5. `estatico` desliga todas as animações (reduced motion); `pingKey` remonta o anel de ping a cada troca de slide.
- Keyframes globais produzidos: `hero-spin`, `hero-pulso`, `hero-ping`, `hero-flutua`, `hero-track` (usados nas Tasks 4 e 5 via `animate-[...]`).

- [ ] **Step 1: Write the failing test**

```tsx
// app/(site)/(home)/_components/heroCarrossel/__tests__/heroRings.test.tsx
import { render, screen } from '@testing-library/react';

import { HeroRings } from '../heroRings';
import { describe, expect, it } from 'vitest';

describe('HeroRings', () => {
  it('renderiza o sistema de anéis com pulso, ping e satélite quando animado', () => {
    render(<HeroRings pingKey={0} />);
    expect(screen.getByTestId('hero-rings')).toBeInTheDocument();
    expect(screen.getAllByTestId('hero-ring-pulso')).toHaveLength(2);
    expect(screen.getByTestId('hero-ring-ping')).toBeInTheDocument();
    expect(screen.getByTestId('hero-ring-satelite')).toBeInTheDocument();
  });

  it('modo estático não renderiza pulso, ping nem satélite', () => {
    render(<HeroRings estatico />);
    expect(screen.getByTestId('hero-rings')).toBeInTheDocument();
    expect(screen.queryAllByTestId('hero-ring-pulso')).toHaveLength(0);
    expect(screen.queryByTestId('hero-ring-ping')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hero-ring-satelite')).not.toBeInTheDocument();
  });

  it('é decorativo: escondido de leitores de tela', () => {
    render(<HeroRings />);
    expect(screen.getByTestId('hero-rings')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test heroRings`
Expected: FAIL — `Cannot find module '../heroRings'`

- [ ] **Step 3: Add keyframes to globals.css**

Acrescentar no fim de `app/globals.css` (após os keyframes existentes, ex.: `scroll-hint-cascade`):

```css
/* ===== Hero-carrossel: anéis, flutuação e progresso ===== */
@keyframes hero-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes hero-pulso {
  0% {
    transform: scale(0.86);
    opacity: 0;
  }
  18% {
    opacity: 0.9;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes hero-ping {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  100% {
    transform: scale(1.45);
    opacity: 0;
  }
}

@keyframes hero-flutua {
  50% {
    transform: translateY(-10px);
  }
}

@keyframes hero-track {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
```

- [ ] **Step 4: Write minimal implementation**

```tsx
// app/(site)/(home)/_components/heroCarrossel/heroRings.tsx
import { cn } from '@/lib/utils';

interface HeroRingsProps {
  /** Reduced motion: só os anéis estáticos, sem giro/pulso/ping/satélite */
  estatico?: boolean;
  /** Incrementar a cada troca de slide remonta o ping (anima 1x) */
  pingKey?: number;
}

export function HeroRings({ estatico = false, pingKey = 0 }: HeroRingsProps) {
  return (
    <div
      aria-hidden='true'
      data-testid='hero-rings'
      className='absolute inset-0 grid place-items-center'>
      {/* glow central */}
      <span className='absolute aspect-square h-[66%] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16)_0%,transparent_65%)] blur-[8px]' />
      {/* anéis estáticos */}
      <span className='absolute aspect-square h-[104%] rounded-full border border-[rgba(148,178,235,0.06)]' />
      <span className='absolute aspect-square h-[86%] rounded-full border border-[rgba(148,178,235,0.14)]' />
      <span className='absolute aspect-square h-[64%] rounded-full border border-[rgba(148,178,235,0.10)]' />
      {/* anéis tracejados girando (ecoam as caixas tracejadas do site) */}
      <span
        className={cn(
          'absolute aspect-square h-[75%] rounded-full border border-dashed border-[rgba(96,148,246,0.35)]',
          !estatico && 'animate-[hero-spin_70s_linear_infinite]'
        )}
      />
      <span
        className={cn(
          'absolute aspect-square h-[96%] rounded-full border border-dashed border-[rgba(148,178,235,0.12)]',
          !estatico && 'animate-[hero-spin_110s_linear_infinite_reverse]'
        )}
      />
      {!estatico && (
        <>
          <span
            data-testid='hero-ring-pulso'
            className='absolute aspect-square h-[64%] animate-[hero-pulso_5.5s_cubic-bezier(0.16,1,0.3,1)_infinite] rounded-full border-[1.5px] border-[rgba(96,148,246,0.45)]'
          />
          <span
            data-testid='hero-ring-pulso'
            className='absolute aspect-square h-[64%] animate-[hero-pulso_5.5s_cubic-bezier(0.16,1,0.3,1)_2.75s_infinite] rounded-full border-[1.5px] border-[rgba(96,148,246,0.45)]'
          />
          <span
            key={pingKey}
            data-testid='hero-ring-ping'
            className='absolute aspect-square h-[64%] animate-[hero-ping_0.9s_cubic-bezier(0.16,1,0.3,1)_1] rounded-full border-2 border-[rgba(96,148,246,0.7)] opacity-0'
          />
          <span
            data-testid='hero-ring-satelite'
            className='absolute aspect-square h-[75%] animate-[hero-spin_26s_linear_infinite]'>
            <i className='absolute -top-[3px] left-1/2 block size-[7px] rounded-full bg-accent shadow-[0_0_12px_2px_rgba(59,130,246,0.7)]' />
          </span>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `bun run test heroRings`
Expected: PASS (3 testes)

- [ ] **Step 6: Commit**

```bash
git add app/globals.css "app/(site)/(home)/_components/heroCarrossel/heroRings.tsx" "app/(site)/(home)/_components/heroCarrossel/__tests__/heroRings.test.tsx"
git commit -m "feat: anéis animados do hero-carrossel"
```

---

### Task 3: Coluna de texto do slide (`heroSlideCopy.tsx`)

**Files:**

- Create: `app/(site)/(home)/_components/heroCarrossel/heroSlideCopy.tsx`
- Test: `app/(site)/(home)/_components/heroCarrossel/__tests__/heroSlideCopy.test.tsx`

**Interfaces:**

- Consumes: `SlideMaquina` e `SLIDES` da Task 1; `WhatsAppIcon` de `@/components/layout/socialLinks`.
- Produces: `function HeroSlideCopy({ slide: SlideMaquina; primeiro: boolean; estatico?: boolean }): JSX.Element` — consumida pela Task 5. `primeiro` → heading `h1` (senão `h2`); `estatico` → sem variants de animação. O componente de saída raiz é `motion.div` com `variants` (cascata via `staggerChildren: 0.04`) e `exit` fade 0.12s — a Task 5 o envolve em `AnimatePresence`.

- [ ] **Step 1: Write the failing test**

```tsx
// app/(site)/(home)/_components/heroCarrossel/__tests__/heroSlideCopy.test.tsx
import type { HTMLAttributes, ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

import { HeroSlideCopy } from '../heroSlideCopy';
import { SLIDES } from '../slideData';
import { describe, expect, it, vi } from 'vitest';

vi.mock('motion/react', () => ({
  motion: {
    div: ({
      children,
      variants: _v,
      initial: _i,
      animate: _a,
      exit: _e,
      ...props
    }: HTMLAttributes<HTMLDivElement> &
      Record<string, unknown> & { children?: ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    span: ({
      children,
      variants: _v,
      ...props
    }: HTMLAttributes<HTMLSpanElement> &
      Record<string, unknown> & { children?: ReactNode }) => (
      <span {...props}>{children}</span>
    )
  }
}));

describe('HeroSlideCopy', () => {
  it('renderiza lockup, headline em 2 linhas nowrap, descrição, specs com "até" e CTA', () => {
    render(<HeroSlideCopy slide={SLIDES[0]} primeiro />);

    expect(screen.getByText('Linha TP')).toBeInTheDocument();
    expect(screen.getByText('Envasadora de sachês')).toBeInTheDocument();

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Precisão de dosagem,');
    expect(h1).toHaveTextContent('sachê após sachê');
    expect(screen.getByText('Precisão de dosagem,')).toHaveClass(
      'whitespace-nowrap'
    );
    expect(screen.getByText('sachê após sachê')).toHaveClass(
      'whitespace-nowrap'
    );

    expect(screen.getByText(/polpas, laticínios, molhos/i)).toBeInTheDocument();
    expect(screen.getByText('até')).toBeInTheDocument();
    expect(screen.getByText('3.000')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /conhecer/i })).toHaveAttribute(
      'href',
      '/maquinas/1'
    );
  });

  it('link do WhatsApp abre wa.me em nova aba', () => {
    render(<HeroSlideCopy slide={SLIDES[0]} primeiro />);
    const whats = screen.getByRole('link', {
      name: /falar com um especialista/i
    });
    expect(whats).toHaveAttribute('href', expect.stringContaining('wa.me'));
    expect(whats).toHaveAttribute('target', '_blank');
  });

  it('slide que não é o primeiro usa h2 (um só h1 na página)', () => {
    render(<HeroSlideCopy slide={SLIDES[1]} primeiro={false} />);
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Quatro soldas,'
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test heroSlideCopy`
Expected: FAIL — `Cannot find module '../heroSlideCopy'`

- [ ] **Step 3: Write minimal implementation**

```tsx
// app/(site)/(home)/_components/heroCarrossel/heroSlideCopy.tsx
'use client';

import type { ReactNode } from 'react';

import Link from 'next/link';

import { WhatsAppIcon } from '@/components/layout/socialLinks';

import type { SlideMaquina } from './slideData';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const EASE_ENTRADA = [0.19, 1, 0.22, 1] as const;

const cascata = {
  entrar: { transition: { staggerChildren: 0.04 } }
};

const bloco = {
  inicial: { y: '112%' },
  entrar: { y: '0%', transition: { duration: 0.52, ease: EASE_ENTRADA } }
};

const WHATSAPP_URL = `https://wa.me/5541997851998?text=${encodeURIComponent(
  'Olá! Vim pelo site da Profills e quero falar com um especialista.'
)}`;

/* Máscara do Reveal: o bloco sobe de dentro de um recorte overflow-hidden */
function Mascara({ children }: { children: ReactNode }) {
  return (
    <span className='block overflow-hidden'>
      <motion.span variants={bloco} className='block'>
        {children}
      </motion.span>
    </span>
  );
}

interface HeroSlideCopyProps {
  slide: SlideMaquina;
  /** true só para o slide inicial: ele renderiza o h1 da página */
  primeiro: boolean;
  /** Reduced motion: render direto, sem variants */
  estatico?: boolean;
}

export function HeroSlideCopy({
  slide,
  primeiro,
  estatico = false
}: HeroSlideCopyProps) {
  const Titulo = primeiro ? 'h1' : 'h2';

  const conteudo = (
    <>
      <Mascara>
        <span className='inline-flex items-baseline gap-2.5'>
          <span className='text-2xl font-extrabold tracking-tight text-accent'>
            {slide.nome}
          </span>
          <span className='border-l border-dashed border-[rgba(148,178,235,0.3)] pl-2.5 font-mono text-xs tracking-widest text-[#b6c5e2] uppercase'>
            {slide.categoria}
          </span>
        </span>
      </Mascara>

      <Titulo className='mt-5 text-[clamp(2.1rem,3.9vw,3.5rem)] leading-[1.06] font-extrabold tracking-tight text-white'>
        <Mascara>
          <span className='block whitespace-nowrap'>{slide.titulo[0]}</span>
        </Mascara>
        <Mascara>
          <span className='block whitespace-nowrap text-accent'>
            {slide.titulo[1]}
          </span>
        </Mascara>
      </Titulo>

      <Mascara>
        <p className='mt-4 max-w-[44ch] text-base leading-relaxed text-[#b6c5e2]'>
          {slide.descricao}
        </p>
      </Mascara>

      <Mascara>
        <span className='mt-7 flex w-fit items-stretch rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-slate-900/60 max-[560px]:w-full max-[560px]:flex-col'>
          <span className='flex gap-6 px-6 py-4 max-[560px]:flex-wrap max-[560px]:gap-4'>
            {slide.specs.map((spec) => (
              <span key={spec.label} className='whitespace-nowrap'>
                <span className='block font-mono text-[1.35rem] font-semibold text-white'>
                  {spec.prefixo ? (
                    <span className='mr-1 text-xs font-normal text-[#b6c5e2]'>
                      {spec.prefixo}
                    </span>
                  ) : null}
                  {spec.valor}
                  <small className='ml-1 text-xs font-normal text-[#b6c5e2]'>
                    {spec.unidade}
                  </small>
                </span>
                <span className='mt-1 block text-[0.68rem] tracking-wider text-[#b6c5e2] uppercase'>
                  {spec.label}
                </span>
              </span>
            ))}
          </span>
          <Link
            href={slide.rota}
            className='flex items-center gap-2 rounded-r-xs bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent/90 max-[560px]:justify-center max-[560px]:rounded-b-xs max-[560px]:rounded-tr-none max-[560px]:py-3'>
            Conhecer <ArrowRight className='size-4' />
          </Link>
        </span>
      </Mascara>

      <Mascara>
        <a
          href={WHATSAPP_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#b6c5e2] transition-colors hover:text-white'>
          <WhatsAppIcon className='size-4 text-[#25d366]' />
          Falar com um especialista
        </a>
      </Mascara>
    </>
  );

  if (estatico) {
    return <div>{conteudo}</div>;
  }

  return (
    <motion.div
      variants={cascata}
      initial='inicial'
      animate='entrar'
      exit={{ opacity: 0, transition: { duration: 0.12 } }}>
      {conteudo}
    </motion.div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test heroSlideCopy`
Expected: PASS (3 testes)

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/(home)/_components/heroCarrossel/heroSlideCopy.tsx" "app/(site)/(home)/_components/heroCarrossel/__tests__/heroSlideCopy.test.tsx"
git commit -m "feat: coluna de texto do slide do hero"
```

---

### Task 4: Palco da máquina (`heroSlideStage.tsx`)

**Files:**

- Create: `app/(site)/(home)/_components/heroCarrossel/heroSlideStage.tsx`
- Test: `app/(site)/(home)/_components/heroCarrossel/__tests__/heroSlideStage.test.tsx`

**Interfaces:**

- Consumes: `SlideMaquina`/`SLIDES` da Task 1.
- Produces: `function HeroSlideStage({ slide: SlideMaquina; direcao: 1 | -1; primeiro: boolean; estatico?: boolean }): JSX.Element` — consumida pela Task 5. Raiz é `motion.div` com `initial`/`animate`/`exit` do drift aprovado (entrada 0.42s ease [0.19,1,0.22,1] com x `26*direcao`→0 e scale 1.03→1; saída 0.13s com x `-18*direcao` e scale 0.99) — a Task 5 o envolve em `AnimatePresence`.

- [ ] **Step 1: Write the failing test**

```tsx
// app/(site)/(home)/_components/heroCarrossel/__tests__/heroSlideStage.test.tsx
import type { HTMLAttributes, ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

import { HeroSlideStage } from '../heroSlideStage';
import { SLIDES } from '../slideData';
import { describe, expect, it, vi } from 'vitest';

vi.mock('motion/react', () => ({
  motion: {
    div: ({
      children,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      ...props
    }: HTMLAttributes<HTMLDivElement> &
      Record<string, unknown> & { children?: ReactNode }) => (
      <div {...props}>{children}</div>
    )
  }
}));

vi.mock('next/image', () => ({
  default: ({
    alt,
    className,
    style
  }: {
    alt: string;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img alt={alt} className={className} style={style} />
  )
}));

describe('HeroSlideStage', () => {
  it('máquina é absoluta (fora do fluxo do grid) com alt descritivo', () => {
    render(<HeroSlideStage slide={SLIDES[0]} direcao={1} primeiro />);
    const maquina = screen.getByAltText('Envasadora Linha TP');
    expect(maquina).toHaveClass('absolute');
    expect(maquina).toHaveClass('max-w-none');
  });

  it('embalagem usa altura e posição definidas pelo slide', () => {
    render(<HeroSlideStage slide={SLIDES[1]} direcao={1} primeiro={false} />);
    const embalagem = screen.getByAltText('Embalagem da Linha TC4s');
    expect(embalagem).toHaveStyle({ height: '42%', left: '2%' });
  });

  it('modo estático não aplica a flutuação da embalagem', () => {
    render(<HeroSlideStage slide={SLIDES[0]} direcao={1} primeiro estatico />);
    const embalagem = screen.getByAltText('Embalagem da Linha TP');
    expect(embalagem.className).not.toContain('hero-flutua');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test heroSlideStage`
Expected: FAIL — `Cannot find module '../heroSlideStage'`

- [ ] **Step 3: Write minimal implementation**

```tsx
// app/(site)/(home)/_components/heroCarrossel/heroSlideStage.tsx
'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

import type { SlideMaquina } from './slideData';
import { motion } from 'motion/react';

const EASE_ENTRADA = [0.19, 1, 0.22, 1] as const;

interface HeroSlideStageProps {
  slide: SlideMaquina;
  /** 1 = avançou, -1 = voltou; espelha o drift lateral */
  direcao: 1 | -1;
  /** Slide inicial carrega a imagem com priority */
  primeiro: boolean;
  /** Reduced motion: sem drift nem flutuação */
  estatico?: boolean;
}

export function HeroSlideStage({
  slide,
  direcao,
  primeiro,
  estatico = false
}: HeroSlideStageProps) {
  const conteudo = (
    <>
      {/* sombra elíptica no "chão" */}
      <span className='absolute bottom-[2%] left-1/2 h-7 w-[64%] -translate-x-1/2 bg-[radial-gradient(50%_100%_at_50%_50%,rgba(2,6,23,0.55),transparent_75%)]' />
      {/* Máquina ABSOLUTA: a largura natural do PNG não participa do cálculo
         do grid — sem isso a coluna de texto é esmagada (causa raiz mapeada no mockup) */}
      <Image
        src={slide.imgMaquina}
        alt={`Envasadora ${slide.nome}`}
        priority={primeiro}
        className='absolute top-1/2 left-1/2 z-[2] h-[106%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_30px_40px_rgba(2,6,23,0.65)]'
      />
      <Image
        src={slide.imgEmbalagem}
        alt={`Embalagem da ${slide.nome}`}
        style={{ height: slide.embalagemAltura, left: slide.embalagemEsquerda }}
        className={cn(
          'absolute bottom-[4%] z-[3] w-auto max-w-none object-contain drop-shadow-[0_18px_22px_rgba(2,6,23,0.6)]',
          !estatico && 'animate-[hero-flutua_7s_ease-in-out_infinite]'
        )}
      />
    </>
  );

  if (estatico) {
    return <div className='absolute inset-0'>{conteudo}</div>;
  }

  return (
    <motion.div
      className='absolute inset-0'
      initial={{ opacity: 0, x: 26 * direcao, scale: 1.03 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.42, ease: EASE_ENTRADA }
      }}
      exit={{
        opacity: 0,
        x: -18 * direcao,
        scale: 0.99,
        transition: { duration: 0.13 }
      }}>
      {conteudo}
    </motion.div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test heroSlideStage`
Expected: PASS (3 testes)

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/(home)/_components/heroCarrossel/heroSlideStage.tsx" "app/(site)/(home)/_components/heroCarrossel/__tests__/heroSlideStage.test.tsx"
git commit -m "feat: palco de máquina do hero-carrossel"
```

---

### Task 5: Orquestrador (`heroCarrossel.tsx`)

**Files:**

- Create: `app/(site)/(home)/_components/heroCarrossel/heroCarrossel.tsx`
- Test: `app/(site)/(home)/_components/heroCarrossel/__tests__/heroCarrossel.test.tsx`

**Interfaces:**

- Consumes: `SLIDES`, `AUTOPLAY_MS` (Task 1), `HeroRings` (Task 2), `HeroSlideCopy` (Task 3), `HeroSlideStage` (Task 4), `GridPattern` de `@/components/layout/gridPatternBg`, `useReducedMotion`/`AnimatePresence` de `'motion/react'`.
- Produces: `export default function HeroCarrossel(): JSX.Element` — consumido pela Task 6 (page da home). Seção `min-h-screen pt-16`, autoplay 7s (reset ao navegar), setas com `aria-label='Slide anterior'`/`'Próximo slide'`, índice `01 / 02`, "A seguir: {labelCurto}".

- [ ] **Step 1: Write the failing test**

```tsx
// app/(site)/(home)/_components/heroCarrossel/__tests__/heroCarrossel.test.tsx
import type { HTMLAttributes, ReactNode } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import HeroCarrossel from '../heroCarrossel';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const reducedMotionMock = vi.fn(() => false);

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    div: ({
      children,
      variants: _v,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      ...props
    }: HTMLAttributes<HTMLDivElement> &
      Record<string, unknown> & { children?: ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    span: ({
      children,
      variants: _v,
      ...props
    }: HTMLAttributes<HTMLSpanElement> &
      Record<string, unknown> & { children?: ReactNode }) => (
      <span {...props}>{children}</span>
    )
  },
  useReducedMotion: () => reducedMotionMock()
}));

vi.mock('next/image', () => ({
  default: ({
    alt,
    className,
    style
  }: {
    alt: string;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img alt={alt} className={className} style={style} />
  )
}));

vi.mock('@/components/layout/gridPatternBg', () => ({
  GridPattern: () => <div data-testid='grid-pattern' />
}));

describe('HeroCarrossel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    reducedMotionMock.mockReturnValue(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('abre no slide 1 (Linha TP) com h1, índice 01 e "A seguir" do TC4s', () => {
    render(<HeroCarrossel />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Precisão de dosagem,'
    );
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('TC4s · Sachê 4 soldas')).toBeInTheDocument();
    expect(screen.getByAltText('Envasadora Linha TP')).toBeInTheDocument();
  });

  it('seta próximo avança para o TC4s (h2, rota /maquinas/2, índice 02)', () => {
    render(<HeroCarrossel />);
    fireEvent.click(screen.getByRole('button', { name: 'Próximo slide' }));
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Quatro soldas,'
    );
    expect(screen.getByRole('link', { name: /conhecer/i })).toHaveAttribute(
      'href',
      '/maquinas/2'
    );
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('TP · Sachês')).toBeInTheDocument();
  });

  it('seta anterior faz o wrap para o último slide', () => {
    render(<HeroCarrossel />);
    fireEvent.click(screen.getByRole('button', { name: 'Slide anterior' }));
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Quatro soldas,'
    );
  });

  it('autoplay avança sozinho após 7s', () => {
    render(<HeroCarrossel />);
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Quatro soldas,'
    );
  });

  it('reduced motion: sem autoplay e anéis estáticos', () => {
    reducedMotionMock.mockReturnValue(true);
    render(<HeroCarrossel />);
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Precisão de dosagem,'
    );
    expect(screen.queryAllByTestId('hero-ring-pulso')).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test heroCarrossel.test`
Expected: FAIL — `Cannot find module '../heroCarrossel'`

- [ ] **Step 3: Write minimal implementation**

```tsx
// app/(site)/(home)/_components/heroCarrossel/heroCarrossel.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { cn } from '@/lib/utils';

import { HeroRings } from './heroRings';
import { HeroSlideCopy } from './heroSlideCopy';
import { HeroSlideStage } from './heroSlideStage';
import { AUTOPLAY_MS, SLIDES } from './slideData';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatePresence, useReducedMotion } from 'motion/react';

function indice(n: number) {
  return String(n).padStart(2, '0');
}

export default function HeroCarrossel() {
  const reduzirMovimento = useReducedMotion();
  const [atual, setAtual] = useState(0);
  const [direcao, setDirecao] = useState<1 | -1>(1);
  const [pingKey, setPingKey] = useState(0);

  const trocar = useCallback((dir: 1 | -1) => {
    setDirecao(dir);
    setAtual((i) => (i + dir + SLIDES.length) % SLIDES.length);
    setPingKey((k) => k + 1);
  }, []);

  // Autoplay: reinicia a cada troca (manual ou automática); desligado em reduced motion
  useEffect(() => {
    if (reduzirMovimento) return;
    const timer = setTimeout(() => trocar(1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [atual, reduzirMovimento, trocar]);

  const slide = SLIDES[atual];
  const proximo = SLIDES[(atual + 1) % SLIDES.length];
  const estatico = Boolean(reduzirMovimento);

  return (
    <section className='relative flex min-h-screen items-center overflow-hidden bg-secondary pt-16'>
      {/* fundo: gradiente radial navy + grid pattern mascarado */}
      <div className='absolute inset-0 bg-[radial-gradient(120%_90%_at_78%_40%,#1b2a4d_0%,#0f172a_46%,#0a1122_100%)]' />
      <div className='absolute inset-0 [mask-image:radial-gradient(85%_85%_at_60%_45%,black_30%,transparent_100%)]'>
        <GridPattern />
      </div>

      <div className='relative z-10 mx-auto grid w-[min(1280px,94vw)] grid-cols-1 items-center gap-2 pt-4 pb-24 min-[900px]:grid-cols-2 min-[900px]:pb-16'>
        {/* Coluna de texto */}
        <div>
          {estatico ? (
            <HeroSlideCopy slide={slide} primeiro={atual === 0} estatico />
          ) : (
            <AnimatePresence mode='wait'>
              <HeroSlideCopy
                key={slide.id}
                slide={slide}
                primeiro={atual === 0}
              />
            </AnimatePresence>
          )}
        </div>

        {/* Palco: anéis fixos, máquina troca */}
        <div className='relative mt-6 h-[min(48vh,460px)] min-[900px]:mt-0 min-[900px]:max-[1180px]:h-[min(70vh,640px)] min-[900px]:h-[min(76vh,700px)] min-[900px]:translate-x-[6%]'>
          <HeroRings estatico={estatico} pingKey={pingKey} />
          {estatico ? (
            <HeroSlideStage
              slide={slide}
              direcao={direcao}
              primeiro={atual === 0}
              estatico
            />
          ) : (
            <AnimatePresence mode='wait'>
              <HeroSlideStage
                key={slide.id}
                slide={slide}
                direcao={direcao}
                primeiro={atual === 0}
              />
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Navegação do carrossel */}
      <div className='absolute bottom-6 left-1/2 z-20 flex w-[min(1280px,94vw)] -translate-x-1/2 items-center justify-between min-[900px]:bottom-10'>
        <div className='flex items-center gap-4'>
          <span className='font-mono text-xs text-[#b6c5e2]'>
            <b className='font-semibold text-white'>{indice(atual + 1)}</b> /{' '}
            {indice(SLIDES.length)}
          </span>
          {!estatico && (
            <span className='h-0.5 w-[130px] overflow-hidden bg-[rgba(148,178,235,0.18)]'>
              <i
                key={atual}
                className='block h-full origin-left animate-[hero-track_7s_linear_1_forwards] bg-accent'
              />
            </span>
          )}
          <span className='text-xs text-[#b6c5e2] max-[900px]:hidden'>
            A seguir:{' '}
            <b className='font-semibold text-white'>{proximo.labelCurto}</b>
          </span>
        </div>
        <div className='flex gap-2'>
          <button
            type='button'
            aria-label='Slide anterior'
            onClick={() => trocar(-1)}
            className={cn(
              'grid size-11 place-items-center rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(148,178,235,0.07)] text-white transition-colors',
              'hover:border-solid hover:border-accent hover:bg-accent/15'
            )}>
            <ArrowLeft className='size-[18px]' />
          </button>
          <button
            type='button'
            aria-label='Próximo slide'
            onClick={() => trocar(1)}
            className={cn(
              'grid size-11 place-items-center rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(148,178,235,0.07)] text-white transition-colors',
              'hover:border-solid hover:border-accent hover:bg-accent/15'
            )}>
            <ArrowRight className='size-[18px]' />
          </button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test heroCarrossel.test`
Expected: PASS (5 testes)

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/(home)/_components/heroCarrossel/heroCarrossel.tsx" "app/(site)/(home)/_components/heroCarrossel/__tests__/heroCarrossel.test.tsx"
git commit -m "feat: carrossel de máquinas do hero"
```

---

### Task 6: Integrar na home e remover o hero antigo

**Files:**

- Modify: `app/(site)/(home)/page.tsx` (linhas 11 e 16-21: import e uso de `ScrollExpandMedia`)
- Delete: `app/(site)/(home)/_components/scrollExpansionHero.tsx`
- Delete: `app/(site)/(home)/_components/__tests__/scrollExpansionHero.test.tsx`
- Delete: `components/blocks/scrollHint.tsx` e `components/blocks/__tests__/scrollHint.test.tsx` (usados só pelo hero antigo — código morto após a troca)

**Interfaces:**

- Consumes: `HeroCarrossel` (Task 5).
- Produces: home renderizando `<HeroCarrossel />` seguido da seção branca com o conteúdo existente (a casca `<section class='relative z-20 min-h-screen bg-white pt-8'>` que vivia dentro do hero antigo passa para a page).

- [ ] **Step 1: Rewire da page**

Em `app/(site)/(home)/page.tsx`, trocar o import e o JSX:

```tsx
// remover:
// adicionar:
import HeroCarrossel from './_components/heroCarrossel/heroCarrossel';
import ScrollExpandMedia from './_components/scrollExpansionHero';
```

```tsx
export default function Home() {
  return (
    <div className='relative h-full w-full'>
      <HeroCarrossel />
      <section className='relative z-20 min-h-screen bg-white pt-8'>
        <HomeContent />
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Remover o hero antigo e o ScrollHint**

```bash
git rm "app/(site)/(home)/_components/scrollExpansionHero.tsx" "app/(site)/(home)/_components/__tests__/scrollExpansionHero.test.tsx" components/blocks/scrollHint.tsx "components/blocks/__tests__/scrollHint.test.tsx"
```

- [ ] **Step 3: Confirmar que nada mais referencia o que saiu**

Run: `grep -rn "scrollExpansionHero\|ScrollExpandMedia\|ScrollHint\|scroll-hint" app components --include='*.tsx' --include='*.ts'`
Expected: só ocorrências em `app/globals.css`? Não — o grep acima não cobre CSS; rodar também `grep -n "scroll-hint" app/globals.css` e **remover o bloco `@keyframes scroll-hint-cascade`** (e classes associadas) de `globals.css` se nada mais o usa.

- [ ] **Step 4: Suíte completa + lint**

Run: `bun run test && bun run lint`
Expected: todos os testes passam (os 4 arquivos novos + resto do repo); lint limpo.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: hero-carrossel substitui hero de scroll"
```

---

### Task 7: Verificação visual (sem commit)

Regra do repositório: "pronto" de UI = funcional + perceptual + dados reais renderizados.

- [ ] **Step 1: Servidor e aba**

Dev server já roda na porta 3003 (`/tmp/dev-up-3003.state`; se caiu, `/dev-up 3003`). Navegar a aba controlada para `http://localhost:3003`.

- [ ] **Step 2: Prova perceptual desktop**

Screenshot do hero e comparação com o mockup aprovado (`.superpowers/brainstorm/4037057-1786382371/content/transicoes-v4.html`, servível em `http://localhost:58600/transicoes-v4.html`). Conferir: navbar não corta a máquina; headline em 2 linhas exatas; placa em 1 linha com CTA acoplado; anéis girando; sachê TP em 28%/14% e TC4s em 42%/2%.

- [ ] **Step 3: Prova funcional no browser**

Clicar na seta "Próximo slide": cascata Reveal + troca para TC4s (até 2.000 un/h, 120-360 mm). Esperar 7s parado: autoplay troca sozinho e a barrinha reinicia. Console sem erros (`read_console_messages` com `onlyErrors: true`).

- [ ] **Step 4: Prova responsiva**

DevTools modo responsivo em 1024, 768, 414 e 360px: headline nunca quebra no meio da frase; nenhum spec dobra linha; ≤900px empilha; ≤560px o CTA vira barra full-width.

- [ ] **Step 5: Detector do impeccable**

Run: `node /home/othavio/.claude/skills/impeccable/scripts/detect.mjs --json "app/(site)/(home)/_components/heroCarrossel" app/globals.css "app/(site)/(home)/page.tsx"`
Tratar findings mecânicos que apontarem defeito real; reportar o restante.

- [ ] **Step 6: Reportar**

Screenshots + resultado dos testes no chat. Só então declarar concluído.
