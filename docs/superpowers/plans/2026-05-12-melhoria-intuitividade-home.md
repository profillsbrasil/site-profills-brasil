# Melhoria de Intuitividade + Performance da Home — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar indicador de scroll animado na home (`ScrollHint`) e reduzir o payload do first paint comprimindo `videoCurto.mp4` (56 MB) e os 16 GLBs do grid de embalagens (bisnaga 50 MB) + posters `.webp` + blur-up no hero + skeleton no loading.

**Architecture:** Frente A (UX hint) = componente novo `components/blocks/scrollHint.tsx` plugado em `MobileHero` e `DesktopHero` de `scrollExpansionHero.tsx`. Frente B (perf) = recompressão offline de assets + props novas (`posterSrc`, `blurDataURL`) em `optimizedEmbalagem3d.tsx` e `caixaHome3d.tsx`. Sete commits sequenciais na branch `feat/melhoria-intuitividade-home` (já criada).

**Tech Stack:** Next.js 16, React 19, Tailwind 4, `motion/react` (Framer Motion successor), `@google/model-viewer`, Vitest + Testing Library + jsdom, `ffmpeg` (offline), `@gltf-transform/cli` (offline via `npx`).

**Spec:** `docs/superpowers/specs/2026-05-12-melhoria-intuitividade-home-design.md` (commit `c0b65d3`).

---

## File Structure

**Novos:**
- `components/blocks/scrollHint.tsx`
- `components/blocks/__tests__/scrollHint.test.tsx`
- `public/videos/videoCurto.webm`
- `public/videos/videoCurto-poster.webp`
- `public/embalagens-3d/posters/<16 modelos>.webp`
- `public/caixa-teste-3d-poster.webp`

**Modificados:**
- `app/(home)/_components/scrollExpansionHero.tsx` — monta `ScrollHint`, adiciona `<video poster>`, passa `posterSrc`/`blurDataURL` ao `caixaHome3d`
- `app/(home)/_components/__tests__/scrollExpansionHero.test.tsx` — extende mock de `motion/react` p/ permitir flip de `useReducedMotion`, novos testes de integração
- `app/(home)/_components/listaEmbalagens.tsx` — adiciona `posterSrc` por item
- `app/(home)/loading.tsx` — skeleton estático do hero
- `components/modelo3d/caixaHome3d.tsx` — props `posterSrc` + `blurDataURL`, cross-fade
- `components/modelo3d/optimizedEmbalagem3d.tsx` — prop `posterSrc`, renderiza `<Image>` poster
- `public/videos/videoCurto.mp4` — sobrescrito com versão comprimida
- `public/embalagens-3d/*.glb` — 16 modelos comprimidos in-place

---

## Task 1: Componente `ScrollHint` + unit tests

**Files:**
- Create: `components/blocks/scrollHint.tsx`
- Create: `components/blocks/__tests__/scrollHint.test.tsx`

- [ ] **Step 1.1: Criar arquivo do componente vazio (placeholder para o teste falhar com import resolvido)**

Cria `components/blocks/scrollHint.tsx`:

```tsx
'use client';

export function ScrollHint() {
  return null;
}
```

- [ ] **Step 1.2: Escrever teste unit (todos os casos)**

Cria `components/blocks/__tests__/scrollHint.test.tsx`:

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

describe('ScrollHint', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    reducedMotionMock.mockReturnValue(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('não renderiza visível antes de idleMs', () => {
    render(<ScrollHint variant='desktop' idleMs={2500} />);
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '0');
  });

  it('fica visível após idleMs', () => {
    render(<ScrollHint variant='desktop' idleMs={2500} />);
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '1');
  });

  it('some no primeiro scroll após visível', () => {
    render(<ScrollHint variant='desktop' idleMs={2500} />);
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '0');
  });

  it('não reaparece em scrolls subsequentes', () => {
    render(<ScrollHint variant='desktop' idleMs={2500} />);
    act(() => {
      vi.advanceTimersByTime(2500);
      window.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(2500);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '0');
  });

  it('respeita prefers-reduced-motion (retorna null sem armar timer)', () => {
    reducedMotionMock.mockReturnValue(true);
    const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
    const { container } = render(<ScrollHint variant='desktop' idleMs={2500} />);
    expect(container.firstChild).toBeNull();
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });

  it('limpa listener no unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ScrollHint variant='desktop' idleMs={2500} />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('variant mobile renderiza pill com label', () => {
    render(<ScrollHint variant='mobile' idleMs={2500} />);
    const el = screen.getByTestId('scroll-hint-mobile');
    expect(el).toHaveTextContent(/role para descobrir/i);
  });

  it('variant desktop renderiza label', () => {
    render(<ScrollHint variant='desktop' idleMs={2500} />);
    expect(screen.getByText(/role para descobrir/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 1.3: Rodar testes e confirmar que falham**

```bash
bun run test components/blocks/__tests__/scrollHint.test.tsx
```

Expected: 8 failures, todas com "Cannot find name 'variant'" ou similar (o componente atual ignora props e retorna null).

- [ ] **Step 1.4: Implementar `ScrollHint` real**

Substitui o conteúdo de `components/blocks/scrollHint.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

import { motion, useReducedMotion } from 'motion/react';

type ScrollHintProps = {
  variant: 'desktop' | 'mobile';
  idleMs?: number;
  targetRef?: React.RefObject<HTMLElement | null>;
  testId?: string;
};

export function ScrollHint({
  variant,
  idleMs = 2500,
  targetRef,
  testId,
}: ScrollHintProps) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (reduceMotion) return;

    const timer = window.setTimeout(() => {
      if (!dismissedRef.current) setVisible(true);
    }, idleMs);

    const target: HTMLElement | Window = targetRef?.current ?? window;
    const onScroll = () => {
      dismissedRef.current = true;
      window.clearTimeout(timer);
      setVisible(false);
      target.removeEventListener('scroll', onScroll);
    };

    target.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      target.removeEventListener('scroll', onScroll);
    };
  }, [idleMs, reduceMotion, targetRef]);

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

- [ ] **Step 1.5: Adicionar estilos CSS em `app/globals.css`**

Acrescentar ao final de `app/globals.css`:

```css
@keyframes scroll-hint-cascade {
  0%, 80%, 100% { opacity: 0; transform: translateY(-2px); }
  40% { opacity: 1; transform: translateY(2px); }
}

@keyframes scroll-hint-nudge {
  0%, 100% { transform: rotate(45deg) translate(0, 0); }
  50% { transform: rotate(45deg) translate(2px, 2px); }
}

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

.scroll-hint-chevron-single {
  width: 10px;
  height: 10px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  animation: scroll-hint-nudge 1.6s ease-in-out infinite;
}

.scroll-hint-pill {
  background-color: rgb(255 255 255 / 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

@supports not (backdrop-filter: blur(8px)) {
  .scroll-hint-pill {
    background-color: rgb(255 255 255 / 0.2);
  }
}
```

- [ ] **Step 1.6: Rodar testes e confirmar que passam**

```bash
bun run test components/blocks/__tests__/scrollHint.test.tsx
```

Expected: 8 passes.

- [ ] **Step 1.7: Rodar lint**

```bash
bun lint
```

Expected: zero errors em arquivos modificados.

- [ ] **Step 1.8: Commit**

```bash
git add components/blocks/scrollHint.tsx components/blocks/__tests__/scrollHint.test.tsx app/globals.css
git commit -m "feat(scroll-hint): adiciona componente ScrollHint + testes unit"
```

---

## Task 2: Integrar `ScrollHint` em `ScrollExpandMedia` + testes integração

**Files:**
- Modify: `app/(home)/_components/scrollExpansionHero.tsx`
- Modify: `app/(home)/_components/__tests__/scrollExpansionHero.test.tsx`

- [ ] **Step 2.1: Estender o mock de `motion/react` no arquivo de teste para permitir flip de `useReducedMotion`**

Substitui o bloco `vi.mock('motion/react', ...)` em `app/(home)/_components/__tests__/scrollExpansionHero.test.tsx` (linhas 57-66) por:

```tsx
const reducedMotionMock = vi.fn(() => false);

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    div: ({
      children,
      animate: _animate,
      initial: _initial,
      transition: _transition,
      style: _style,
      ...props
    }: HTMLAttributes<HTMLDivElement> & {
      animate?: unknown;
      initial?: unknown;
      transition?: unknown;
      style?: React.CSSProperties;
    }) => <div {...props}>{children}</div>,
  },
  useMotionValueEvent: vi.fn(),
  useReducedMotion: () => reducedMotionMock(),
  useScroll: () => ({ scrollYProgress: {} }),
  useTransform: () => 0,
}));
```

E garante que `reducedMotionMock` é referenciado no escopo dos `describe`. Adiciona import de `React` se necessário (já existe via JSX).

- [ ] **Step 2.2: Escrever os novos testes de integração**

Adiciona ao final de `app/(home)/_components/__tests__/scrollExpansionHero.test.tsx`, dentro de um novo `describe`:

```tsx
describe('ScrollHint integration', () => {
  beforeEach(() => {
    reducedMotionMock.mockReturnValue(false);
  });

  it('DesktopHero monta ScrollHint variant desktop', () => {
    render(
      <ScrollExpandMedia>
        <div>Conteudo</div>
      </ScrollExpandMedia>
    );
    const desktopHero = screen.getByTestId('desktop-hero');
    expect(within(desktopHero).getByTestId('scroll-hint-desktop')).toBeInTheDocument();
  });

  it('MobileHero monta ScrollHint variant mobile', () => {
    render(
      <ScrollExpandMedia>
        <div>Conteudo</div>
      </ScrollExpandMedia>
    );
    const mobileHero = screen.getByTestId('mobile-hero');
    expect(within(mobileHero).getByTestId('scroll-hint-mobile')).toBeInTheDocument();
  });

  it('reduced-motion esconde ambas as variants', () => {
    reducedMotionMock.mockReturnValue(true);
    render(
      <ScrollExpandMedia>
        <div>Conteudo</div>
      </ScrollExpandMedia>
    );
    expect(screen.queryByTestId('scroll-hint-desktop')).not.toBeInTheDocument();
    expect(screen.queryByTestId('scroll-hint-mobile')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2.3: Rodar testes e confirmar que falham**

```bash
bun run test app/\(home\)/_components/__tests__/scrollExpansionHero.test.tsx
```

Expected: 3 falhas novas (`scroll-hint-desktop`/`scroll-hint-mobile` não encontrados).

- [ ] **Step 2.4: Importar `ScrollHint` em `scrollExpansionHero.tsx`**

No topo do `app/(home)/_components/scrollExpansionHero.tsx`, adiciona import:

```tsx
import { ScrollHint } from '@/components/blocks/scrollHint';
```

- [ ] **Step 2.5: Plugar `ScrollHint` no `MobileHero`**

Em `MobileHero`, adiciona como último filho do `<section>`, depois do `<BlurFade delay={0.3}>` que envolve o `CaixaHome3d`:

```tsx
<ScrollHint variant='mobile' />
```

Ou seja, dentro do `<section>...</section>` que retorna o mobile, antes do fechamento do section.

- [ ] **Step 2.6: Plugar `ScrollHint` no `DesktopHero`**

Em `DesktopHero`, dentro do `<div className='sticky top-0 ...'>`, adiciona como último filho:

```tsx
<ScrollHint variant='desktop' />
```

**Nota técnica (diverge da spec):** Não passar `targetRef={heroRef}`. O `heroRef` é um `<section>` com `h-[300vh]` que não gera evento `scroll` próprio (só `window` rola). Motion's `useScroll({ target })` usa observação interna do window; nosso `ScrollHint` precisa do evento DOM real, que é disparado em `window`. Deixar `targetRef` undefined → fallback `window`. A prop `targetRef` permanece exposta para uso futuro em containers com overflow próprio.

- [ ] **Step 2.7: Rodar testes e confirmar que passam (todos)**

```bash
bun run test app/\(home\)/_components/__tests__/scrollExpansionHero.test.tsx
```

Expected: todos os testes (existentes + novos) passam.

- [ ] **Step 2.8: Rodar lint**

```bash
bun lint
```

- [ ] **Step 2.9: Commit**

```bash
git add app/\(home\)/_components/scrollExpansionHero.tsx app/\(home\)/_components/__tests__/scrollExpansionHero.test.tsx
git commit -m "feat(scroll-hint): integra ScrollHint em ScrollExpandMedia + testes integracao"
```

---

## Task 3: Comprimir `videoCurto.mp4` + poster `.webp` + `.webm` fallback

**Files:**
- Modify: `public/videos/videoCurto.mp4` (sobrescreve)
- Create: `public/videos/videoCurto.webm`
- Create: `public/videos/videoCurto-poster.webp`
- Modify: `app/(home)/_components/scrollExpansionHero.tsx` (adiciona `<source>` webm + `poster`)

- [ ] **Step 3.1: Confirmar `ffmpeg` disponível**

```bash
ffmpeg -version | head -1
```

Expected: linha começando com `ffmpeg version ...`. Se ausente, instalar antes (`sudo pacman -S ffmpeg` em Arch) e retomar.

- [ ] **Step 3.2: Backup do MP4 original em `/tmp` (não commitado)**

```bash
cp public/videos/videoCurto.mp4 /tmp/videoCurto-original.mp4
ls -lh /tmp/videoCurto-original.mp4
```

Expected: 56 MB confirmado.

- [ ] **Step 3.3: Gerar poster `.webp` (primeiro frame)**

```bash
ffmpeg -y -i /tmp/videoCurto-original.mp4 -frames:v 1 -vf "scale=iw/2:ih/2" -q:v 75 public/videos/videoCurto-poster.webp
ls -lh public/videos/videoCurto-poster.webp
```

Expected: `.webp` < 200 KB.

- [ ] **Step 3.4: Gerar `videoCurto.webm` (VP9, 720p, sem áudio)**

```bash
ffmpeg -y -i /tmp/videoCurto-original.mp4 -c:v libvpx-vp9 -b:v 1200k -vf "scale=-2:720" -row-mt 1 -an public/videos/videoCurto.webm
ls -lh public/videos/videoCurto.webm
```

Expected: ≤ 5 MB. Se ficar acima, reduzir `-b:v` para `800k` e rerodar.

- [ ] **Step 3.5: Gerar MP4 otimizado (H.264 720p) e substituir o original**

```bash
ffmpeg -y -i /tmp/videoCurto-original.mp4 -c:v libx264 -profile:v main -preset slow -b:v 1500k -maxrate 1800k -bufsize 3000k -vf "scale=-2:720,format=yuv420p" -movflags +faststart -an public/videos/videoCurto.optimized.mp4
ls -lh public/videos/videoCurto.optimized.mp4
```

Expected: ≤ 8 MB.

```bash
mv public/videos/videoCurto.optimized.mp4 public/videos/videoCurto.mp4
ls -lh public/videos/videoCurto*
```

- [ ] **Step 3.6: Atualizar `<video>` em `scrollExpansionHero.tsx` para usar poster + source webm**

Em `DesktopHero`, dentro do `<motion.div>` que envolve o `<video>`, substituir:

```tsx
<video
  src='/videos/videoCurto.mp4'
  autoPlay
  loop
  muted
  playsInline
  preload='metadata'
  className='h-full max-h-[65vh] w-full max-w-[70vw] object-cover'
/>
```

por:

```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  preload='metadata'
  poster='/videos/videoCurto-poster.webp'
  className='h-full max-h-[65vh] w-full max-w-[70vw] object-cover'>
  <source src='/videos/videoCurto.webm' type='video/webm' />
  <source src='/videos/videoCurto.mp4' type='video/mp4' />
</video>
```

- [ ] **Step 3.7: Rodar suite completa**

```bash
bun run test
```

Expected: tudo verde (sem regressão).

- [ ] **Step 3.8: Smoke test manual (dev server)**

```bash
bun run dev
```

Abrir `http://localhost:3000` no browser, rolar até o hero animar, verificar que o vídeo central aparece sem flicker. Encerrar `dev` com Ctrl+C.

- [ ] **Step 3.9: Commit**

```bash
git add public/videos/videoCurto.mp4 public/videos/videoCurto.webm public/videos/videoCurto-poster.webp app/\(home\)/_components/scrollExpansionHero.tsx
git commit -m "perf(video): comprime videoCurto + poster + webm fallback"
```

---

## Task 4: Comprimir 16 GLBs do grid + gerar posters `.webp`

**Files:**
- Modify (16): `public/embalagens-3d/*.glb`
- Create (16): `public/embalagens-3d/posters/<slug>.webp`

- [ ] **Step 4.1: Criar diretório de posters e backup**

```bash
mkdir -p public/embalagens-3d/posters
mkdir -p /tmp/glb-backup
cp public/embalagens-3d/*.glb /tmp/glb-backup/
ls /tmp/glb-backup/ | wc -l
```

Expected: `16`.

- [ ] **Step 4.2: Confirmar `@gltf-transform/cli` acessível via `npx`**

```bash
npx -y @gltf-transform/cli@latest --version
```

Expected: imprime versão (ex.: `4.x.x`).

- [ ] **Step 4.3: Listar comandos disponíveis e inspecionar verbo `optimize`**

```bash
npx @gltf-transform/cli optimize --help | head -40
```

Expected: descrição do verbo. Anote se a flag `--texture-compress` existe nessa versão; se não, usar `--compress draco` (Draco) ou `meshopt` conforme suportado.

- [ ] **Step 4.4: Comprimir bisnaga.glb (outlier 50 MB) com configuração agressiva**

```bash
npx @gltf-transform/cli optimize /tmp/glb-backup/bisnaga.glb public/embalagens-3d/bisnaga.glb --compress meshopt --texture-compress webp --texture-size 1024
ls -lh public/embalagens-3d/bisnaga.glb
```

Expected: ≤ 3 MB. Se acima, reduzir `--texture-size 512` e rerodar. Se ainda acima, decimar mesh com `npx @gltf-transform/cli simplify ... --ratio 0.4`.

- [ ] **Step 4.5: Comprimir os outros 15 GLBs em loop**

```bash
for f in /tmp/glb-backup/*.glb; do
  name=$(basename "$f")
  if [ "$name" = "bisnaga.glb" ]; then continue; fi
  echo "==> $name"
  npx @gltf-transform/cli optimize "$f" "public/embalagens-3d/$name" --compress meshopt --texture-compress webp --texture-size 1024
done
ls -lh public/embalagens-3d/*.glb
```

Expected: todo GLB ≤ 3 MB.

- [ ] **Step 4.6: Gerar posters `.webp` (1 por GLB) com script Node headless usando `model-viewer`**

Em vez de depender de `gltf-transform thumbnail` (cuja sintaxe muda entre versões), usar um script one-shot em Node com Puppeteer ou `playwright` headless renderizando model-viewer e screenshotando. Mas para evitar nova dependência, alternativa: gerar posters manualmente via página utilitária temporária.

**Opção pragmática:** Criar `/tmp/generate-glb-posters.mjs` (one-shot, fora do repo) que:
1. Sobe `bun run dev`.
2. Para cada `slug` em `embalagens`, navega `playwright` para `http://localhost:3000/_dev/poster?src=/embalagens-3d/<slug>.glb` (rota dev que renderiza um único `<CaixaHome3d>` 800×800).
3. Aguarda `model-viewer` event `model-visibility` ou `load`.
4. Screenshot `.webp` salvo em `public/embalagens-3d/posters/<slug>.webp`.

Como a rota `_dev/poster` não existe, dois subpassos:

**4.6a — Criar rota dev temporária** `app/_dev/poster/page.tsx` (commitada depois removida):

```tsx
'use client';

import { useSearchParams } from 'next/navigation';

import { CaixaHome3d } from '@/components/modelo3d/caixaHome3d';

export default function PosterPage() {
  const params = useSearchParams();
  const src = params.get('src') ?? '/caixa-teste-3d.glb';
  return (
    <div style={{ width: 800, height: 800, background: 'transparent' }}>
      <CaixaHome3d modelSrc={src} eager autoRotate={false} className='h-[800px] w-[800px]' />
    </div>
  );
}
```

**4.6b — Script `/tmp/generate-glb-posters.mjs`** (one-shot, fora do repo):

```js
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const slugs = [
  '3-soldas-duplo','bisnaga','fardo','flowpack','frascos-tubulares','gable-top',
  'galao','garrafas-02','lata-tinta','pote02','pouch','sache-4-soldas',
  'sache-especial','sache-saco','stick','uht'
];

await mkdir('public/embalagens-3d/posters', { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 800, height: 800 } });
const page = await ctx.newPage();

for (const slug of slugs) {
  const url = `http://localhost:3000/_dev/poster?src=/embalagens-3d/${slug}.glb`;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500); // tempo para model-viewer renderizar
  await page.screenshot({
    path: `public/embalagens-3d/posters/${slug}.webp`,
    type: 'webp',
    quality: 80,
    omitBackground: true
  });
  console.log(`✔ ${slug}`);
}

await browser.close();
```

Executar:

```bash
bun run dev &
DEV_PID=$!
sleep 8
npx -y playwright@latest install chromium
node /tmp/generate-glb-posters.mjs
kill $DEV_PID
ls public/embalagens-3d/posters/
```

Expected: 16 `.webp` listados, cada um < 60 KB.

- [ ] **Step 4.7: Remover rota dev e script (one-shot, não vão para o repo)**

```bash
rm -rf app/_dev
rm -f /tmp/generate-glb-posters.mjs
```

(Apenas os posters em `public/embalagens-3d/posters/` ficam.)

- [ ] **Step 4.8: Verificar tamanhos finais**

```bash
echo "GLBs:" && du -sh public/embalagens-3d/*.glb
echo "Posters:" && du -sh public/embalagens-3d/posters/*.webp
```

Expected: todo GLB ≤ 3 MB; cada poster < 60 KB.

- [ ] **Step 4.9: Commit**

```bash
git add public/embalagens-3d/
git commit -m "perf(glb): comprime 16 GLBs e adiciona posters webp"
```

---

## Task 5: `posterSrc` prop em `optimizedEmbalagem3d` + wire em `listaEmbalagens`

**Files:**
- Modify: `components/modelo3d/optimizedEmbalagem3d.tsx`
- Modify: `app/(home)/_components/listaEmbalagens.tsx`

- [ ] **Step 5.1: Adicionar prop `posterSrc` + render condicional em `optimizedEmbalagem3d.tsx`**

Substituir interface `OptimizedEmbalagem3dProps` (linhas 5-12) por:

```tsx
import Image from 'next/image';

interface OptimizedEmbalagem3dProps {
  modelSrc?: string;
  alt?: string;
  className?: string;
  autoRotate?: boolean;
  cameraOrbit?: string;
  placeholder?: React.ReactNode;
  posterSrc?: string;
}
```

Substituir destructuring de props (linha 14-21) por:

```tsx
export function OptimizedEmbalagem3d({
  modelSrc = '/caixa-teste-3d.glb',
  alt = 'Modelo 3D - Embalagem',
  className = '',
  autoRotate = true,
  cameraOrbit = '40deg 75deg 105%',
  placeholder,
  posterSrc,
}: OptimizedEmbalagem3dProps) {
```

Substituir o bloco de placeholder (linhas 80-100, a partir do `{(!shouldRender || !isLoaded) && (`) por:

```tsx
      {(!shouldRender || !isLoaded) && (
        <div
          className='flex h-full w-full items-center justify-center'
          style={{ minHeight: '250px' }}>
          {placeholder ? (
            placeholder
          ) : posterSrc ? (
            <Image
              src={posterSrc}
              alt={alt}
              width={400}
              height={400}
              sizes='(max-width: 768px) 50vw, 25vw'
              className='h-auto w-full object-contain'
            />
          ) : (
            <div className='text-muted-foreground flex flex-col items-center justify-center space-y-2'>
              {isVisible && !hasBeenLoaded ? (
                <>
                  <div className='h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent'></div>
                  <span className='text-sm'>Carregando modelo 3D...</span>
                </>
              ) : (
                <div className='flex h-32 w-32 items-center justify-center rounded-xs bg-muted'>
                  <span className='text-xs text-muted-foreground'>Modelo 3D</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
```

- [ ] **Step 5.2: Passar `posterSrc` por item em `listaEmbalagens.tsx`**

Em cada objeto de `listaDeEmbalagens` (16 itens), adicionar campo `posterSrc` com o caminho `/embalagens-3d/posters/<slug>.webp` correspondente ao `modelSrc`. Exemplo aplicado ao primeiro item:

```tsx
{
  title: '3 Soldas Duplo',
  description: 'Embalagem plana, estável e ideal para doses por porção.',
  modelSrc: '/embalagens-3d/3-soldas-duplo.glb',
  cameraOrbit: '38deg 72deg 100%',
  posterSrc: '/embalagens-3d/posters/3-soldas-duplo.webp',
},
```

Aplicar o mesmo padrão (derivar `posterSrc` do nome do arquivo `.glb`) aos 15 itens restantes: bisnaga, fardo, flowpack, frascos-tubulares, galao, garrafas-02, pote02, pouch, sache-4-soldas, sache-especial, uht, sache-saco, stick, gable-top, lata-tinta.

Atualizar o tipo do array (se houver) e o JSX do `<OptimizedEmbalagem3d>` (próximo da linha 144) para passar a nova prop:

```tsx
<OptimizedEmbalagem3d
  modelSrc={card.modelSrc}
  posterSrc={card.posterSrc}
  alt={`Modelo 3D - ${card.title}`}
  cameraOrbit={card.cameraOrbit}
  autoRotate={true}
/>
```

- [ ] **Step 5.3: Rodar testes**

```bash
bun run test
```

Expected: tudo verde (sem regressão; nenhum teste novo nesta task).

- [ ] **Step 5.4: Rodar lint**

```bash
bun lint
```

- [ ] **Step 5.5: Smoke test manual**

```bash
bun run dev
```

Abrir `http://localhost:3000`, rolar até `ListaEmbalagens`. Cada card mostra poster `.webp` imediatamente; ao chegar no viewport, GLB hidrata e cross-fade ocorre. Encerrar dev.

- [ ] **Step 5.6: Commit**

```bash
git add components/modelo3d/optimizedEmbalagem3d.tsx app/\(home\)/_components/listaEmbalagens.tsx
git commit -m "feat(modelo3d): aceita posterSrc no optimizedEmbalagem3d"
```

---

## Task 6: Blur-up no `caixaHome3d` + poster do hero

**Files:**
- Create: `public/caixa-teste-3d-poster.webp`
- Modify: `components/modelo3d/caixaHome3d.tsx`
- Modify: `app/(home)/_components/scrollExpansionHero.tsx`

- [ ] **Step 6.1: Gerar poster do hero `caixa-teste-3d.glb`**

Reusar abordagem da Task 4 (rota dev + Playwright). Para apenas 1 modelo, simpler ad-hoc:

```bash
bun run dev &
DEV_PID=$!
sleep 8

cat > /tmp/poster-hero.mjs <<'EOF'
import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 800, height: 800 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
// O hero renderiza o modelo; aguarda model-viewer estabilizar
await page.waitForSelector('[data-testid="caixa-home-3d-placeholder"], model-viewer', { timeout: 15000 });
await page.waitForTimeout(3000);
const mv = await page.$('model-viewer');
if (!mv) { console.error('model-viewer não encontrado'); process.exit(1); }
await mv.screenshot({ path: 'public/caixa-teste-3d-poster.webp', type: 'webp', quality: 80, omitBackground: true });
console.log('OK');
await browser.close();
EOF

node /tmp/poster-hero.mjs
kill $DEV_PID
rm /tmp/poster-hero.mjs
ls -lh public/caixa-teste-3d-poster.webp
```

Expected: `.webp` 800×800, < 80 KB. Se o `model-viewer` não rendereou a tempo, aumentar `waitForTimeout` para 5000 ms.

- [ ] **Step 6.2: Gerar `blurDataURL` inline (base64 de versão 8×8)**

```bash
ffmpeg -y -i public/caixa-teste-3d-poster.webp -vf "scale=8:8" -q:v 5 /tmp/blur.webp
echo -n "data:image/webp;base64,"; base64 -w0 /tmp/blur.webp; echo
```

Copie a string completa (`data:image/webp;base64,...`) — será inline no JSX a seguir.

- [ ] **Step 6.3: Adicionar `posterSrc` + `blurDataURL` em `caixaHome3d.tsx`**

Substituir interface `CaixaHome3dProps` (linhas 5-14) por:

```tsx
import Image from 'next/image';

interface CaixaHome3dProps {
  modelSrc?: string;
  alt?: string;
  className?: string;
  autoRotate?: boolean;
  cameraOrbit?: string;
  eager?: boolean;
  placeholder?: React.ReactNode;
  isMobile?: boolean;
  posterSrc?: string;
  blurDataURL?: string;
}
```

Atualizar destructuring (linhas 16-25) adicionando `posterSrc` e `blurDataURL`:

```tsx
export function CaixaHome3d({
  modelSrc = '/caixa-teste-3d.glb',
  alt = 'Modelo 3D - Embalagem',
  className = '',
  autoRotate = true,
  cameraOrbit = '40deg 75deg 105%',
  eager = false,
  placeholder,
  isMobile = false,
  posterSrc,
  blurDataURL,
}: CaixaHome3dProps) {
```

Adicionar render de poster blur antes do bloco do `model-viewer`. Substituir o JSX retornado (a partir do `return (` até o final do componente) por:

```tsx
  return (
    <div
      ref={containerRef}
      className={`relative flex w-full items-center justify-center ${className}`}>
      {posterSrc && (
        <Image
          src={posterSrc}
          alt={alt}
          width={800}
          height={800}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          priority={eager}
          sizes={isMobile ? '320px' : '50vw'}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {shouldRender && (
        // @ts-expect-error model-viewer não tem tipos nativos
        <model-viewer
          ref={modelViewerRef}
          src={modelSrc}
          alt={alt}
          camera-controls
          camera-orbit={cameraOrbit}
          min-camera-orbit='auto auto 50%'
          max-camera-orbit='auto auto 200%'
          disable-pan={true}
          disable-zoom={true}
          auto-rotate={autoRotate && isVisible}
          auto-rotate-delay='500'
          environment-image='neutral'
          shadow-intensity='1'
          exposure='1'
          interaction-prompt='none'
          loading={eager ? 'eager' : 'lazy'}
          reveal='auto'
          onLoad={handleModelLoad}
          onError={handleModelError}
          style={{
            width: '100%',
            height: isMobile ? '420px' : '100%',
            backgroundColor: 'transparent',
            '--poster-color': 'transparent',
            opacity: isLoaded && isVisible ? 1 : 0,
            pointerEvents: isVisible ? 'auto' : 'none',
            transition: 'opacity 200ms',
          }}
          className={isVisible && !isMobile ? 'hover:scale-[1.02]' : ''}>
          {/* @ts-expect-error */}
        </model-viewer>
      )}

      {!posterSrc && (!shouldRender || !isLoaded) && (
        <div
          className='flex w-full items-center justify-center'
          style={{ height: isMobile ? '320px' : '100%' }}>
          {placeholder || (
            <div
              data-testid='caixa-home-3d-placeholder'
              className='flex min-h-[220px] w-full max-w-sm flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center shadow-[0_20px_80px_rgba(15,23,42,0.35)] backdrop-blur-sm'>
              <div className='relative flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent' />
              </div>
              <span className='mt-4 text-sm font-semibold tracking-wide text-white'>
                Carregando modelo 3D...
              </span>
              <span className='mt-2 text-xs leading-relaxed text-white/60'>
                Preparando a visualização interativa da embalagem.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6.4: Passar `posterSrc` + `blurDataURL` em ambos os usos do hero**

Em `app/(home)/_components/scrollExpansionHero.tsx`, declarar constantes de módulo no topo (após imports):

```tsx
const HERO_POSTER_SRC = '/caixa-teste-3d-poster.webp';
const HERO_BLUR_DATA_URL = 'data:image/webp;base64,COLAR_AQUI_A_STRING_DO_STEP_6.2';
```

Cole a string base64 obtida no Step 6.2 no lugar de `COLAR_AQUI_...`.

No `MobileHero`, atualizar a chamada `<CaixaHome3d ... />`:

```tsx
<CaixaHome3d
  alt='Modelo 3D - Linha de Produtos Profills'
  modelSrc='/caixa-teste-3d.glb'
  cameraOrbit='40deg 75deg 105%'
  autoRotate={true}
  eager={true}
  isMobile={true}
  posterSrc={HERO_POSTER_SRC}
  blurDataURL={HERO_BLUR_DATA_URL}
  className='h-[320px] w-full'
/>
```

No `DesktopHero`, atualizar a chamada análoga:

```tsx
<CaixaHome3d
  alt='Modelo 3D - Linha de Produtos Profills'
  modelSrc='/caixa-teste-3d.glb'
  cameraOrbit='40deg 75deg 105%'
  autoRotate={true}
  isMobile={false}
  posterSrc={HERO_POSTER_SRC}
  blurDataURL={HERO_BLUR_DATA_URL}
  className='relative flex h-[70vh] w-1/2 items-center justify-center overflow-hidden transition-opacity duration-200'
/>
```

- [ ] **Step 6.5: Atualizar o teste existente de `scrollExpansionHero.test.tsx` se quebrar**

O mock atual de `next/dynamic` produz `<div data-testid='caixa-home-3d' data-eager=... />`. A assertion `toHaveClass('h-[320px]')` continua válida (className é spread). Não precisa mudar.

Rodar suite:

```bash
bun run test
```

Expected: tudo verde.

- [ ] **Step 6.6: Rodar lint**

```bash
bun lint
```

- [ ] **Step 6.7: Smoke test manual**

```bash
bun run dev
```

Throttling Network → Slow 3G no DevTools, abrir `/`. Verifica:
- Poster blur aparece quase imediatamente.
- Quando `model-viewer` carrega, cross-fade 200 ms vai do poster para o 3D real sem flicker.

- [ ] **Step 6.8: Commit**

```bash
git add public/caixa-teste-3d-poster.webp components/modelo3d/caixaHome3d.tsx app/\(home\)/_components/scrollExpansionHero.tsx
git commit -m "feat(modelo3d): blur-up no caixaHome3d com poster do hero"
```

---

## Task 7: Skeleton do hero em `app/(home)/loading.tsx`

**Files:**
- Modify: `app/(home)/loading.tsx`

- [ ] **Step 7.1: Substituir conteúdo do `loading.tsx`**

Substituir o arquivo `app/(home)/loading.tsx` inteiro por:

```tsx
export default function Loading() {
  return (
    <div className='relative min-h-screen w-full bg-secondary'>
      {/* Mobile skeleton */}
      <div className='flex min-h-screen w-full flex-col justify-evenly px-6 py-16 md:hidden'>
        <div>
          <div className='h-8 w-3/4 animate-pulse rounded bg-white/10' />
          <div className='mt-3 h-5 w-1/2 animate-pulse rounded bg-white/10' />
          <div className='mt-6 h-12 w-2/3 animate-pulse rounded bg-white/10' />
        </div>
        <div className='mx-auto h-[320px] w-full animate-pulse rounded-xl bg-white/5' />
      </div>

      {/* Desktop skeleton */}
      <div className='hidden min-h-screen w-full items-center justify-center md:flex'>
        <div className='mx-auto flex w-full max-w-[70vw] flex-row items-center'>
          <div className='flex w-1/2 flex-col gap-4'>
            <div className='h-10 w-3/4 animate-pulse rounded bg-white/10' />
            <div className='h-6 w-1/2 animate-pulse rounded bg-white/10' />
            <div className='mt-4 h-16 w-2/3 animate-pulse rounded bg-white/10' />
          </div>
          <div className='flex w-1/2 items-center justify-center'>
            <div className='h-[70vh] w-1/2 animate-pulse rounded-xl bg-white/5' />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 7.2: Rodar testes**

```bash
bun run test
```

Expected: tudo verde.

- [ ] **Step 7.3: Rodar lint**

```bash
bun lint
```

- [ ] **Step 7.4: Smoke test manual**

```bash
bun run dev
```

Forçar reload com cache desabilitado (DevTools → Network → Disable cache). Inspecionar que durante hidratação, o skeleton dark com 2 blocos aparece em vez de spinner branco.

- [ ] **Step 7.5: Commit**

```bash
git add app/\(home\)/loading.tsx
git commit -m "feat(loading): skeleton estatico do hero em loading.tsx"
```

---

## Task 8: Validação final + critérios de aceitação

- [ ] **Step 8.1: Suite completa**

```bash
bun run test
```

Expected: todos os testes verdes.

- [ ] **Step 8.2: Lint completo**

```bash
bun lint
```

Expected: zero errors.

- [ ] **Step 8.3: Build de produção**

```bash
bun run build
```

Expected: build conclui sem erro.

- [ ] **Step 8.4: Verificar todos os critérios de aceitação da spec**

Abrir `http://localhost:3000` (dev) e cobrir cada item:

| Critério | Como validar |
|----------|--------------|
| `ScrollHint` desktop após 2.5s, some no scroll | Desktop, esperar, observar; rolar e confirmar fade |
| Pill mobile aparece | DevTools mobile emulation, mesmo fluxo |
| Reduced-motion esconde | DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`, reload |
| `videoCurto.mp4` ≤ 8 MB | `ls -lh public/videos/videoCurto.mp4` |
| GLBs ≤ 3 MB | `du -sh public/embalagens-3d/*.glb` |
| Posters `.webp` existem | `ls public/embalagens-3d/posters/` (16 arquivos) |
| Hero blur-up visível em 3G | DevTools throttling Slow 3G, observar cross-fade |
| Lighthouse LCP cai ≥30% | `npx -y lighthouse http://localhost:3000 --only-categories=performance --form-factor=mobile --output=json --output-path=/tmp/lh-branch.json`, comparar com `main` |

- [ ] **Step 8.5: Resumo final ao usuário**

Listar tamanhos antes/depois de cada asset (vídeo, bisnaga, outros GLBs), número de testes adicionados, hash de cada commit. Recomendar QA visual presencial antes de merge.

---

## Notas para o executor

- **Não pular hooks** (sem `--no-verify` em commits).
- **Não dar `git push`** sem aprovação explícita do usuário (regra `ask` ativa no `settings.json`).
- Se `ffmpeg` ou `playwright` faltarem, parar e solicitar instalação ao usuário com prefixo `! <cmd>` — não tentar workaround.
- Se um GLB não atingir 3 MB nem com decimação 0.4, reportar antes de prosseguir e perguntar se reduz mais a textura ou aceita exceção.
- Re-`Read` arquivos modificados antes de qualquer `Edit` adicional (harness invalidates file state após escrita).
- Após Task 4, o diretório `app/_dev/` deve estar removido e nenhum script auxiliar deve aparecer em `scripts/`. O script one-shot é gravado em `/tmp/` e descartado.
