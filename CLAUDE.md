# Profills Brasil — site institucional

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · motion (Framer Motion) · @google/model-viewer · Bun · Vitest.

## Comandos

- `bun dev` — dev server (Turbopack)
- `bun run test` — Vitest (jsdom + Testing Library, setup em `vitest.setup.ts`)
- `bun run lint` / `bun run lint:fix` — Oxlint type-aware com a config em `.oxlintrc.json`; cada regra desligada leva o motivo num comentário ali
- `bun run format` — Prettier (ordena classes Tailwind e imports automaticamente)
- Pre-commit (lefthook, instalado pelo `prepare` no `bun install`) roda oxlint e `prettier --check` só nos arquivos staged
- Atualizar o anti-slop: seguir `references/update.md` da skill `install-anti-slop` do upstream (comparar numa pasta temporária, nunca rodar o instalador sobre `tools/oxlint/anti-slop/`) e registrar o commit novo no `UPSTREAM.md` dela

## Mapa do repositório

```
app/
├── layout.tsx            ← fonts Geist (next/font), metadata/SEO global, Toaster
├── globals.css           ← tokens do tema (@theme, oklch), keyframes CSS — Tailwind v4 não tem tailwind.config
├── (site)/               ← páginas com navbar + footer (layout do grupo injeta a casca)
│   └── <rota>/_components/   ← componentes privados da rota (o _ tira do roteamento)
├── (standalone)/         ← páginas sem casca (landings, ex.: sorteio-fispal-2026)
│   └── admin/blog/       ← admin do blog: lista, novo e [slug] (editor); só existe no `bun dev`, sem login; rotas com sufixo `.dev.tsx` (o `pageExtensions` do next.config só as inclui no `next dev`); grava pela Server Action `gravarPost` (acoes.ts) e imagem por [slug]/imagem/route.dev.ts
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
types/                    ← declarações globais (model-viewer.d.ts, css-variaveis.d.ts para `--var` no style)
tools/oxlint/profills/    ← plugin local do Oxlint: regras de carregamento (sizes, eager, vídeo, opacity de scroll, 3D)
tools/oxlint/anti-slop/   ← plugin anti-slop vendorizado de dmmulroy/anti-slop; não editar à mão, origem e desvios no UPSTREAM.md
docs/superpowers/         ← specs/ e plans/ do fluxo de trabalho
docs/adr/                 ← decisões de arquitetura (0001 indicação por cookie, 0002 analytics da indicação, 0003 blog no Postgres)
docs/agents/              ← config das skills de engenharia: issue tracker, labels de triagem e docs do domínio
docs/indicacao-verificacao.md ← guia: como testar a Indicação em produção e onde ler os números no GA4 e no Meta

proxy.ts                  ← captura ?ref, grava o cookie de Indicação e redireciona para a URL limpa (spec 2026-09-02)
lib/crm/                  ← cliente server-only da API do CRM (referral code)
lib/indicacao/            ← cookie assinado, tipos e destinatário do lead
components/indicacao/     ← IndicacaoProvider, useContatoComercial, BotaoEspecialista
lib/data/contatos.ts      ← fonte única dos contatos padrão (vendas, suporte, compras)
lib/blog/                 ← tipos, regras.ts (transição e conflito de versão, puro), repositorio.ts (SQL); as portas são admin.ts (escrita) e leitura.ts (publicados)
lib/banco/                ← conexão (pg ou PGlite), migrar.mjs e migracoes/*.sql; só lib/blog e scripts/ importam (regra profills/sem-banco-direto)
lib/armazem/              ← Armazem (gravar, ler) em disco; o bucket entra depois
scripts/banco-migrar.mjs  ← pre-deploy da Railway: aplica as migrações pendentes por node
.dados/                   ← fora do Git: o PGlite do bun dev (.dados/pglite)
public/blog/<slug>/       ← imagens enviadas pelo admin do blog
lib/analytics/            ← eventos de GA4 e Meta (só código do vendedor, nunca dado pessoal)
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
| Post do blog               | Pelo admin em `/admin/blog` no `bun dev`; o post vive no banco (tabela `blog_posts`)                                                                                   |
| Mudança no banco           | Arquivo novo em `lib/banco/migracoes/` (`NNNN_nome.sql`), só aditivo; nunca editar uma migração já aplicada                                                            |
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
- `skills-lock.json` — skills de repo instaladas (magic-ui, shadcn, ui-sdk, unslop, vercel-react-best-practices).
- UI SDK (`@ui-sdk/react` e `@ui-sdk/core`, da `vercel-labs/ui`) está em beta (0.1.0-beta.3): a API sai da skill `ui-sdk`, de `node_modules/@ui-sdk/react/docs/llms.txt` e dos `.d.ts` do pacote instalado, nunca de memória. O `@layer ui-sdk;` no topo do `globals.css` deixa as classes do site vencerem o CSS que ela injeta.
- `.env.example` — as env vars dos forms, downloads, Indicação e banco (`GMAIL_*`, `SITE_URL`, `CATALOG_TOKEN_SECRET`, `CRM_BASE_URL`, `CRM_EXTERNAL_API_KEY`, `INDICACAO_COOKIE_SECRET`, `DATABASE_URL`); copiar para `.env` local. Sem `DATABASE_URL`, o `bun dev` usa o PGlite.
- `GLOSSARY.md` — glossário do domínio (Indicação, Vendedor, Contato comercial…); usar esses termos em código e docs.

## Agent skills

### Issue tracker

As issues ficam no GitHub deste repo, pelo `gh`. Ver `docs/agents/issue-tracker.md`.

### Triage labels

Cinco labels de triagem com o nome padrão (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). Ver `docs/agents/triage-labels.md`.

### Domain docs

Contexto único: `GLOSSARY.md` e `docs/adr/` na raiz. Ver `docs/agents/domain.md`.

## Armadilhas não-óbvias

- Package manager é **Bun** (`bun.lock`) — não npm/pnpm.
- Motion importa de `'motion/react'` (pacote `motion`), não `framer-motion`.
- Animação scroll-driven de **opacity** usa `useTransform(() => ...)` em forma de função — a forma de array descarrega para ScrollTimeline nativa e o progresso renderiza invertido (spec: `docs/superpowers/specs/2026-05-19-hero-video-viewtimeline-bug-design.md`).
- Toda animação nova respeita `useReducedMotion` — padrão do repo é fallback estático.
- Componentes 3D/WebGL (`CaixaHome3d`, `OptimizedEmbalagem3d`, globe) sempre entram via `dynamic(() => import(...), { ssr: false })` — padrão consistente nos 4 usos existentes.
- Hero mobile e desktop são duas árvores montadas alternadas por CSS (`md:hidden` / `hidden md:block`) — código eager (3D, observers) checa `getClientRects()` para ignorar a árvore invisível.
- Produção roda na Railway (projeto `site-profills-brasil`, serviço `site`, `next start` atrás de proxy, deploy a cada push na `main`). Em route handler o `request.url` traz o host interno (`localhost:8080`): redirect usa `Location` relativo, e URL absoluta sai de `SITE_URL`. O `profills.com` sem `www` ainda aponta para a Vercel, que só redireciona para o `www`; a KingHost não tem ALIAS para a raiz.
- Sem `.env` local, as rotas de e-mail/download falham — não é bug do seu código; ver `.env.example`.
- Blog no banco: sem `DATABASE_URL`, o `bun dev` abre um PGlite em `.dados/pglite` e migra sozinho; apagar a pasta volta aos 3 posts de exemplo. Fora do `bun dev`, a falta de `DATABASE_URL` é erro na primeira consulta, e o build nunca consulta o banco (`leitura.ts` chama `connection()`). O PGlite precisa estar em `serverExternalPackages`. Testes de banco usam `// @vitest-environment node` e `abrirPglite()` em memória (ADR 0003).
- Grid pattern de fundo: a implementação viva é `components/layout/gridPatternBg(Mobile).tsx` (usada em ~20 rotas). As variantes em `components/` raiz e `magicui/` (`grid-pattern`, `animated-grid-pattern`, `interactive-grid-pattern`) são código morto — candidatas a remoção, não usar.
- `text-animate` existe em `ui/` e `magicui/` — verificar qual variante a rota vizinha já usa antes de importar.
- Tema é light-mode único com seções dark (`bg-secondary`) — não há toggle dark/light.
- Conteúdo do site é em pt-BR.
- Eventos de Indicação só saem de `lib/analytics/`; nomes e parâmetros são contrato com o admin do GA4 (dimensões `codigo_vendedor`, `formulario`). O PageView do Pixel e o `page_view` do GA continuam em `components/layout/metaPixel.tsx` e no `GoogleAnalytics` do root layout.
- Verificar analytics em produção exige navegador comum: browser automatizado (`HeadlessChrome`) é descartado pelo Pixel antes de sair pela rede e cai na exclusão automática de bots do GA4 (o hit sai com 204 e não aparece no relatório); o Brave do dono bloqueia o `gtag.js` mesmo com Shields desligado. Detalhes em `docs/indicacao-verificacao.md`.
- Contato comercial (telefone, WhatsApp, e-mail de vendas) nunca é hardcoded: vem de `useContatoComercial()` no client ou de `CONTATO_PADRAO` no servidor, porque a Indicação (`?ref=`) troca esses valores por visitante. Suporte, Compras e JSON-LD usam sempre `CONTATO_PADRAO`.
