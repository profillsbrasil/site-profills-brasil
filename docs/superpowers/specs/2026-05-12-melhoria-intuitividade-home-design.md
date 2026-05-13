# Melhoria de Intuitividade + Performance da Home — Design

**Data:** 2026-05-12
**Branch:** `feat/melhoria-intuitividade-home`
**Status:** Aprovado para implementação

## Contexto

Analytics e feedback qualitativo indicam que usuários entram em `/` (home) e não rolam para baixo. Causas identificadas:

1. **Falta de affordance de scroll.** O `DesktopHero` em `app/(home)/_components/scrollExpansionHero.tsx` é um sticky scroll-driven com `h-[300vh]`. Sem indicador visual, o usuário leigo (perfil do público industrial Profills, frequentemente menos técnico) não percebe que há conteúdo abaixo nem que o vídeo central só aparece com scroll.
2. **First paint pesado.**
   - `public/videos/videoCurto.mp4` = 56 MB com `autoplay` no hero desktop.
   - `public/embalagens-3d/bisnaga.glb` = 50 MB, parte de um grid de 16 GLBs (`listaEmbalagens.tsx`) que carrega sob demanda mas ainda assim impacta CPU/rede quando o usuário rola.
   - `app/(home)/loading.tsx` mostra apenas spinner em tela cheia, sem skeleton ou pré-render do hero. Em conexões médias, o usuário enxerga uma tela em branco antes do conteúdo aparecer.

O objetivo é resolver ambos os eixos numa única branch de teste, validar visualmente e medir impacto.

## Objetivos

- Adicionar indicador de scroll animado e acessível na home.
- Reduzir significativamente o payload do first paint (vídeo e GLBs).
- Trocar o loading genérico por um blur-up que comunica progresso real.
- Cobrir o novo componente com testes Vitest unitários e de integração.

## Não objetivos

- Redesign do hero ou do resto da home.
- Mudanças em rotas fora da home (`/maquinas`, `/clientes`, `/download` etc.).
- Pipeline automatizado de compressão de assets em CI (compressão é feita offline pelo desenvolvedor e commitada).
- Auditoria de imagens em `public/images/maquinas/` que só são usadas em rotas internas (ex.: `mq-tc-4s.png` 6.2 MB).

## Decisões

| Eixo | Decisão |
|------|---------|
| Comportamento da seta | Aparece após 2.5 s de idle, some no primeiro scroll, não reaparece |
| Visual desktop | Chevron triplo em cascata + label `Role para descobrir` |
| Visual mobile | Pill glass-morphism com label + chevron único |
| Reduced motion | Esconde a seta inteira (early return `null`) |
| `videoCurto.mp4` | Recomprimir para `.webm` (≤ 5 MB) + `.mp4` fallback ≤ 8 MB + poster `.webp` |
| GLBs do grid | Comprimir com Draco/Meshopt (target < 3 MB por modelo) + poster `.webp` por modelo |
| `caixaHome3d` hero | Blur-up: poster blurred → fade-in do `model-viewer` no `onLoad` |
| Estratégia de execução | Phased commits na mesma branch, assets pré-gerados e commitados |
| Testes | Unit do `ScrollHint` + integração com `ScrollExpandMedia` |

## Arquitetura

Duas frentes independentes, isoladas em arquivos distintos:

**Frente A — Intuitividade:** componente novo `components/blocks/scrollHint.tsx`, plugado uma única vez dentro de `MobileHero` e `DesktopHero` em `app/(home)/_components/scrollExpansionHero.tsx`.

**Frente B — Performance de assets:**
- Recompressão offline de `public/videos/videoCurto.mp4` (gera `.webm`, `.mp4` mais leve, e `.webp` poster).
- Recompressão offline dos 16 GLBs em `public/embalagens-3d/` (preserva nome, sobrescreve in-place após backup local).
- Geração de posters `.webp` em novo diretório `public/embalagens-3d/posters/`.
- `components/modelo3d/optimizedEmbalagem3d.tsx` ganha prop `posterSrc` e renderiza poster como placeholder de intersection.
- `components/modelo3d/caixaHome3d.tsx` ganha blur-up usando poster.
- `app/(home)/_components/listaEmbalagens.tsx` passa `posterSrc` para cada item.

Sem novos providers, sem mudança em `next.config.ts`, sem hook de build.

## Componentes

### `components/blocks/scrollHint.tsx` (novo, client component)

```ts
type ScrollHintProps = {
  variant: 'desktop' | 'mobile';
  idleMs?: number; // default 2500
  targetRef?: React.RefObject<HTMLElement>; // null = window
  testId?: string;
};
```

Comportamento:
- Mount → `setTimeout` armado por `idleMs` → `setVisible(true)`.
- Listener `scroll` (passive) em `targetRef.current ?? window`.
- Primeiro evento de scroll → `clearTimeout` pendente + `setVisible(false)` + `removeEventListener`. One-shot.
- Unmount → cleanup de timer e listener.
- `useReducedMotion()` (já no stack via `motion`) `=== true` → retorna `null`, sem armar timer.
- Render envolvido em `motion.div` com `animate={{ opacity: visible ? 1 : 0 }}` e `transition={{ duration: 0.4 }}`.

Render `variant === 'desktop'`:
- 3 chevrons CSS-only com `animation-delay` escalonado (cascata).
- Label `Role para descobrir` em `text-xs uppercase tracking-wider text-white/70`.
- Container `fixed bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none`.
- `data-testid={testId ?? 'scroll-hint-desktop'}`.

Render `variant === 'mobile'`:
- Pill `bg-white/10 backdrop-blur border border-white/15 rounded-full px-4 py-2`.
- Texto `Role para descobrir` + chevron único pulsando.
- `fixed bottom-6 left-1/2 -translate-x-1/2 z-30`.
- Fallback CSS via `@supports not (backdrop-filter: blur(8px))` → `bg-white/20` sólido.
- `data-testid={testId ?? 'scroll-hint-mobile'}`.

### `components/modelo3d/optimizedEmbalagem3d.tsx` (modificar)

Adicionar prop opcional `posterSrc?: string`. Quando presente e `(!shouldRender || !isLoaded)`:

```tsx
<Image
  src={posterSrc}
  alt={alt}
  width={400}
  height={400}
  sizes="(max-width: 768px) 50vw, 25vw"
  className="..."
/>
```

Caso `posterSrc` ausente, mantém o placeholder textual atual (sem regressão).

### `components/modelo3d/caixaHome3d.tsx` (modificar)

Adicionar `posterSrc?: string` + `blurDataURL?: string`. Quando ambos presentes:
- Antes de `shouldRender && isLoaded`: renderiza `<Image placeholder="blur" blurDataURL={blurDataURL} src={posterSrc} ... />`.
- Cross-fade: poster `opacity-100` → `opacity-0`, model-viewer `opacity-0` → `opacity-100`, 200 ms cada, gatilho no `handleModelLoad`.
- Em `scrollExpansionHero.tsx` os dois usos (`MobileHero`, `DesktopHero`) recebem `posterSrc="/caixa-teste-3d-poster.webp"` e `blurDataURL` curto inline.

### `app/(home)/_components/listaEmbalagens.tsx` (modificar)

Cada item de `listaDeEmbalagens` ganha campo `posterSrc: '/embalagens-3d/posters/<slug>.webp'`. Passado adiante para `OptimizedEmbalagem3d`.

### `app/(home)/_components/scrollExpansionHero.tsx` (modificar)

- `MobileHero`: ao final do `<section>`, antes do fechamento, `<ScrollHint variant="mobile" />`.
- `DesktopHero`: dentro do `<div className="sticky top-0 ...">` em camada superior, `<ScrollHint variant="desktop" targetRef={heroRef} />`.
- Atualizar `data-testid` do hero para preservar testes existentes.

### `app/(home)/loading.tsx` (modificar)

Substituir o spinner full-page por um esqueleto estático do hero: bloco de texto à esquerda (2 linhas com `bg-white/10`) e bloco quadrado à direita representando o slot do `model-viewer`. Sem `ScrollHint` no loading (o componente real só monta após hidratação). O objetivo é evitar tela em branco e reduzir layout shift quando o `caixaHome3d` real assumir.

## Data flow

### `ScrollHint`

```
mount
  ↓
useReducedMotion() ?
  ├─ true  → return null
  └─ false → setTimeout(idleMs) ─┐
                                 ↓
                       setVisible(true)
                                 ↓
                     listener.scroll (passive)
                                 ↓
                       primeiro scroll
                                 ↓
              clearTimeout (defensivo) + setVisible(false) + removeEventListener
                                 ↓
                            permanente OFF
```

### Cross-fade do hero

```
mount → poster <Image blur> visível, opacity-100
shouldRender (intersection ou eager) → model-viewer monta com opacity-0
model-viewer onLoad → handleModelLoad → setIsLoaded(true)
  → poster opacity-0 (200ms)
  → model-viewer opacity-100 (200ms)
```

### Grid embalagens (`optimizedEmbalagem3d`)

```
mount → poster <Image> (sempre)
intersection (rootMargin 100px) → shouldRender true
  → GLB download via model-viewer
  → onLoad → cross-fade poster → 3D
out-of-viewport → reduce opacity, mantém GLB em cache global (já existente)
```

## Error handling

- `ScrollHint` não tem branch de erro. Listeners + timers são tolerantes a falha; fallback é "seta não aparece", aceitável.
- `targetRef.current` null no primeiro render → listener attach em `window`.
- Falha de download do poster `.webp` → 404 silencioso (Next/Image renderiza fallback de alt). Ruidoso só em dev.
- Falha de GLB → caminho existente em `useOptimized3DModel.handleModelError` é preservado: poster fica visível indefinidamente.
- `<video>` com codec não suportado → atributo `poster` cobre fallback visual.
- `backdrop-filter` ausente (Firefox antigo) → `@supports not` aplica `bg-white/20` sólido.

Sem novo `ErrorBoundary`. Sem `try/catch` defensivo: falhas isoladas, não cascateiam.

## Testes

### Unit — `components/blocks/__tests__/scrollHint.test.tsx`

Cobre o componente isoladamente. Usa `vi.useFakeTimers()` para controlar `setTimeout`.

| Teste | Asserção |
|-------|----------|
| Não renderiza nada no mount inicial | `queryByText('Role para descobrir')` é null antes do timer expirar |
| Aparece após `idleMs` | Após `advanceTimersByTime(2500)`, label visível |
| Some no primeiro scroll | Após visível, `dispatchEvent(new Event('scroll'))` → opacity 0 |
| Não reaparece em scrolls seguintes | Após sumir, nenhum scroll reativa |
| Respeita `prefers-reduced-motion` | Mock `useReducedMotion` → true; componente retorna null, nenhum timer armado |
| Limpa timer e listener no unmount | Spy em `clearTimeout` e `removeEventListener` |
| Variant `mobile` renderiza pill com label | Query pelo `data-testid='scroll-hint-mobile'` |

### Integração — `app/(home)/_components/__tests__/scrollExpansionHero.test.tsx`

Estende o arquivo existente.

| Teste | Asserção |
|-------|----------|
| `DesktopHero` monta `ScrollHint` variant desktop | Query `data-testid='scroll-hint-desktop'` |
| `MobileHero` monta `ScrollHint` variant mobile | Viewport mock, query `data-testid='scroll-hint-mobile'` |
| Scroll no `heroRef` derruba a seta sem afetar `useScroll` | Mock `useScroll`, dispatch scroll no ref, verifica seta some e timeline do hero intacta |
| `useReducedMotion` true → hero estático + sem `ScrollHint` | Mock motion hook, asserção dupla |

### Fora do escopo de teste automatizado

- Compressão de assets (validado por `ls -lh` e visual QA local).
- Cross-fade real (jsdom não renderiza imagem nem GLB; visual QA em browser).
- Decodificação de poster `.webp` (jsdom limitação).

## Asset pipeline (offline, manual)

Comandos exatos que o desenvolvedor executa localmente. **Não entra no `package.json` nem CI.** Saídas commitadas em commits dedicados.

### Vídeo `videoCurto.mp4`

```bash
# Poster (primeiro frame, ~50% scale, webp)
ffmpeg -i public/videos/videoCurto.mp4 -frames:v 1 -vf "scale=iw/2:ih/2" -q:v 75 public/videos/videoCurto-poster.webp

# Recompressão MP4 (H.264 720p, 1500kbps target, fastdecode)
ffmpeg -i public/videos/videoCurto.mp4 -c:v libx264 -profile:v main -preset slow -b:v 1500k -maxrate 1800k -bufsize 3000k -vf "scale=-2:720,format=yuv420p" -movflags +faststart -an public/videos/videoCurto.optimized.mp4

# WebM (VP9, alvo menor)
ffmpeg -i public/videos/videoCurto.mp4 -c:v libvpx-vp9 -b:v 1200k -vf "scale=-2:720" -row-mt 1 -an public/videos/videoCurto.webm

# Verificar tamanho final, depois substituir o original
ls -lh public/videos/videoCurto*
mv public/videos/videoCurto.optimized.mp4 public/videos/videoCurto.mp4
```

### GLBs do grid

```bash
# Instalar one-shot (não vai pra deps do projeto)
npx -y @gltf-transform/cli@latest --version

# Por modelo (exemplo bisnaga, repetir para os 16):
npx @gltf-transform/cli optimize public/embalagens-3d/bisnaga.glb public/embalagens-3d/bisnaga.glb \
  --texture-compress webp --texture-size 1024 --simplify true --simplify-ratio 0.5

# Posters (gerar via screenshot do model-viewer headless OU print do Blender; para o spec, usar gltf-transform thumbnail):
npx @gltf-transform/cli view public/embalagens-3d/bisnaga.glb --thumbnail public/embalagens-3d/posters/bisnaga.webp
```

(Comandos exatos de thumbnail podem variar entre versões do `gltf-transform`; o plano de implementação testará e fixará.)

### Caixa hero `caixa-teste-3d.glb`

```bash
# Poster blurred pequeno (base64 inline em blurDataURL)
ffmpeg -i public/caixa-teste-3d-frame.png -vf "scale=8:8" -q:v 5 - | base64 # inline no blurDataURL
# Poster real (maior, para Image src)
# (gerado por screenshot do model-viewer já presente; pode usar gltf-transform também)
```

## Plano de commits (executado pela skill writing-plans)

1. `feat(scroll-hint): adiciona componente ScrollHint + testes unit`
2. `feat(scroll-hint): integra ScrollHint em ScrollExpandMedia + testes integração`
3. `perf(video): comprime videoCurto.mp4 e adiciona poster + webm`
4. `perf(glb): comprime GLBs do grid e adiciona posters webp`
5. `feat(modelo3d): aceita posterSrc no optimizedEmbalagem3d`
6. `feat(modelo3d): blur-up no caixaHome3d`
7. `feat(loading): skeleton do hero em app/(home)/loading.tsx`

Cada commit deve passar `bun test` e `bun lint`.

## Critérios de aceitação

- [ ] `ScrollHint` aparece em desktop após ~2.5 s e some no primeiro scroll, mesmo dentro do sticky `300vh`.
- [ ] Variant mobile renderiza pill no `MobileHero`.
- [ ] `prefers-reduced-motion: reduce` esconde a seta completamente.
- [ ] `videoCurto.mp4` ≤ 8 MB (versão `.webm` opcional ≤ 5 MB).
- [ ] Todo GLB em `public/embalagens-3d/` ≤ 3 MB.
- [ ] Cada GLB tem poster `.webp` correspondente em `public/embalagens-3d/posters/`.
- [ ] Hero renderiza poster blurred antes do `model-viewer` carregar; cross-fade visível em network throttling 3G.
- [ ] `bun test` passa com os novos testes unit + integração.
- [ ] `bun lint` passa.
- [ ] Lighthouse mobile na home: LCP cai em pelo menos 30 % vs `main`.

## Fora do escopo

- Refactor do `ScrollExpandMedia` timeline.
- Mudanças em `globe.gl`, `carrosselProdutos`, `maquinasDestaque`, `servicosPersonalizados`.
- Otimização de `mq-tc-4s.png` (6.2 MB) — não é usado na home.
- Otimização de `lib/emails/` (separação já feita em PRs anteriores).
- Internacionalização de copy ("Role para descobrir").
