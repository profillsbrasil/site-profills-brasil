# Profills Brasil — site institucional

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · motion (Framer Motion) · @google/model-viewer · Bun · Vitest.

## Comandos

- `bun dev` — dev server (Turbopack)
- `bun run test` — Vitest (jsdom + Testing Library, setup em `vitest.setup.ts`)
- `bun run lint` / `bun run format` — ESLint flat config / Prettier (ordena classes Tailwind e imports automaticamente)

## Mapa do repositório

```
app/
├── layout.tsx            ← fonts Geist (next/font), metadata/SEO global, Toaster
├── globals.css           ← tokens do tema (@theme, oklch), keyframes CSS — Tailwind v4 não tem tailwind.config
├── (site)/               ← páginas com navbar + footer (layout do grupo injeta a casca)
│   └── <rota>/_components/   ← componentes privados da rota (o _ tira do roteamento)
├── (standalone)/         ← páginas sem casca (landings, ex.: sorteio-fispal-2026)
└── api/                  ← form handlers (zod + e-mail); exceção: download/[token] serve arquivo via JWT

components/
├── (raiz)                ← wrappers genéricos usados em todo o site (AnimatedContainer, cardGrid, carouselHome)
├── ui/                   ← primitivos shadcn (new-york, base stone, ícones lucide)
├── magicui/              ← efeitos visuais Magic UI (registry @magicui no components.json)
├── blocks/               ← blocos compostos reutilizáveis (scrollHint, progress-indicator…)
├── layout/               ← navbarDesktop/Mobile, footer, gridPatternBg(Mobile), socialLinks
└── modelo3d/             ← domínio 3D: caixaHome3d, embalagem3d, WebGLFallback, hooks/

lib/
├── utils.ts              ← cn() (alias shadcn @/lib/utils)
├── utils/                ← input-masks, cep, validate-document, jwt-catalog, logger
├── schemas/              ← schemas zod dos forms — compartilhados entre client e route.ts
├── emails/<form>/        ← template + envio nodemailer; _shared/ tem transporter e template-engine
├── data/                 ← dados estruturados de conteúdo (listaClientes); data/maquinas/ é a fonte única das máquinas — registry por slug, 1 arquivo por máquina
└── images/<categoria>/   ← imagens importadas no código (catalogo2026, projetos, logoClientes…)

public/                   ← só o que precisa de URL direta: videos/, embalagens-3d/*.glb, logos, geojson
private/downloads/        ← arquivos NÃO públicos (catálogo 77MB), servidos via api/download/[token] com JWT
types/                    ← declarações globais (model-viewer.d.ts)
docs/superpowers/         ← specs/ e plans/ do fluxo de trabalho
```

## Onde colocar cada coisa

| Vou adicionar…             | Vai em…                                                                                                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Componente shadcn          | `bunx shadcn@latest add <nome>` → `components/ui/`                                                                                                                     |
| Componente Magic UI        | `bunx shadcn@latest add @magicui/<nome>` → `components/magicui/`                                                                                                       |
| Componente de uma rota só  | `app/(site)/<rota>/_components/` (forms complexos ganham subpasta com `components/` interno)                                                                           |
| Componente reutilizável    | Wrapper genérico → `components/` raiz (padrão: `AnimatedContainer`) · bloco composto → `blocks/` · casca → `layout/`                                                   |
| Imagem usada em componente | `lib/images/<categoria>/` + import estático (`import img from '@/lib/images/...'`) — nunca string de path. Exceções legadas em `public/images/` (`gt3000.png`)         |
| Imagem/asset com URL fixa  | `public/` (og-image, favicon, logo referenciado por URL)                                                                                                               |
| Vídeo                      | `public/videos/`. Padrão de referência (hero): trio webm + mp4 + poster webp, `preload='metadata'`. Há exceção legada com mp4 único (`servico-personalizado.mp4`)      |
| Modelo 3D                  | `public/embalagens-3d/*.glb`, < 2MB (exceção legada: `caixa-teste-3d.glb` na raiz de `public/`) — renderizar via `components/modelo3d/`, nunca `<model-viewer>` direto |
| Texto/copy de página       | Hardcoded no componente da rota (arrays `const` no topo); listas grandes → `lib/data/`                                                                                 |
| Formulário novo            | Schema zod em `lib/schemas/` + `app/api/<nome>/route.ts` + template em `lib/emails/<nome>/` (usar `_shared/`)                                                          |
| Util/helper                | `lib/utils/` com teste `.test.ts` ao lado                                                                                                                              |
| Tipos globais/declarações  | `types/*.d.ts`                                                                                                                                                         |
| Arquivo para download      | Público → `public/`; controlado → `private/downloads/` + token (`lib/utils/jwt-catalog.ts`)                                                                            |

Testes vivem sempre ao lado do código (`*.test.tsx` ou `__tests__/`).

## Fluxo de trabalho (Superpowers)

O rastro do fluxo vive no repo:

- `docs/superpowers/specs/` — design docs aprovados (`YYYY-MM-DD-<topico>-design.md`)
- `docs/superpowers/plans/` — planos de implementação (`YYYY-MM-DD-<feature>.md`)

Antes de redesenhar qualquer coisa, procurar spec/plan existente sobre o tema — decisões do hero, resiliência WebGL e footer já estão documentadas lá.

## Fontes da verdade

- `PRODUCT.md` — design, voz da marca, paleta, anti-referências. Ler antes de qualquer decisão visual.
- `components/modelo3d/DocModelos3d.md` — como adicionar/otimizar modelos 3D e configurar câmera.
- `skills-lock.json` — skills de repo instaladas (magic-ui, shadcn, vercel-react-best-practices).
- `.env.example` — as 5 env vars dos forms/downloads (`GMAIL_*`, `SITE_URL`, `CATALOG_TOKEN_SECRET`); copiar para `.env` local.

## Armadilhas não-óbvias

- Package manager é **Bun** (`bun.lock`) — não npm/pnpm.
- Motion importa de `'motion/react'` (pacote `motion`), não `framer-motion`.
- Animação scroll-driven de **opacity** usa `useTransform(() => ...)` em forma de função — a forma de array descarrega para ScrollTimeline nativa e o progresso renderiza invertido (spec: `docs/superpowers/specs/2026-05-19-hero-video-viewtimeline-bug-design.md`).
- Toda animação nova respeita `useReducedMotion` — padrão do repo é fallback estático.
- Componentes 3D/WebGL (`CaixaHome3d`, `OptimizedEmbalagem3d`, globe) sempre entram via `dynamic(() => import(...), { ssr: false })` — padrão consistente nos 4 usos existentes.
- Hero mobile e desktop são duas árvores montadas alternadas por CSS (`md:hidden` / `hidden md:block`) — código eager (3D, observers) checa `getClientRects()` para ignorar a árvore invisível.
- Sem `.env` local, as rotas de e-mail/download falham — não é bug do seu código; ver `.env.example`.
- Grid pattern de fundo: a implementação viva é `components/layout/gridPatternBg(Mobile).tsx` (usada em ~20 rotas). As variantes em `components/` raiz e `magicui/` (`grid-pattern`, `animated-grid-pattern`, `interactive-grid-pattern`) são código morto — candidatas a remoção, não usar.
- `text-animate` existe em `ui/` e `magicui/` — verificar qual variante a rota vizinha já usa antes de importar.
- Testes que renderizam carrossel **embla** precisam de stubs `matchMedia`/`ResizeObserver` no arquivo de teste (pattern sancionado em `cardsGridMaquinas.test.tsx`); componentes portaled do vaul (`DrawerContent`) precisam da classe `tema-navy` explícita — o portal escapa do escopo do tema.
- Tema é light-mode único com seções dark (`bg-secondary`) — não há toggle dark/light.
- Conteúdo do site é em pt-BR.
