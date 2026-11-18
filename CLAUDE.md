# Profills Brasil — site institucional

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · motion (Framer Motion) · @google/model-viewer · Bun · Vitest.

## Comandos

- `bun dev` — dev server (Turbopack)
- `bun run test` — Vitest (jsdom + Testing Library, setup em `vitest.setup.ts`)
- `bun run tipos` gera o `next-env.d.ts` com `next typegen` e roda `tsc --noEmit`
- `bun run lint` / `bun run lint:fix` — Oxlint type-aware com a config em `.oxlintrc.json`; cada regra desligada leva o motivo num comentário ali, e diretiva de disable que não silencia nada reprova o lint
- `bun run format` — Prettier (ordena classes Tailwind e imports automaticamente)
- Pre-commit (lefthook, instalado pelo `prepare` no `bun install`) roda oxlint e `prettier --check` só nos arquivos staged
- Pre-push (lefthook) roda `bun run tipos` e depois `bun run test`, em sequência
- Atualizar o anti-slop: seguir `references/update.md` da skill `install-anti-slop` do upstream (comparar numa pasta temporária, nunca rodar o instalador sobre `tools/oxlint/anti-slop/`) e registrar o commit novo no `UPSTREAM.md` dela

## Mapa do repositório

```
app/
├── layout.tsx            ← fonts Geist (next/font), metadata/SEO global, Toaster
├── globals.css           ← tokens do tema (@theme, oklch), keyframes CSS — Tailwind v4 não tem tailwind.config
├── (site)/               ← páginas com navbar + footer (layout do grupo injeta a casca)
│   ├── <rota>/_components/   ← componentes privados da rota (o _ tira do roteamento)
│   └── blog/             ← listagem e leitura públicas, dinâmicas, por lib/blog/leitura.ts; not-found.tsx próprio dá 404 de verdade (ADR 0006)
├── (standalone)/         ← páginas sem casca (landings, ex.: sorteio-fispal-2026)
│   └── admin/            ← admin do blog atrás de login: entrar/ (login e sair), blog/ (lista, novo, [slug] com o editor, imagens/ com o uso de cada imagem do armazém e assuntos/ com os posts de cada assunto); toda página, action e route handler abre por `abrirAdminBlog()` (teste em admin/guarda.test.ts); grava pela Server Action `gravarPost`, apaga rascunho por `apagarRascunho` (as duas em blog/acoes.ts) e envia imagem por blog/[slug]/imagem/route.ts
└── api/                  ← form handlers (zod + e-mail); exceção: download/[token] serve arquivo via JWT

components/
├── (raiz)                ← wrappers genéricos usados em todo o site (AnimatedContainer, cardGrid, carouselHome)
├── ui/                   ← primitivos shadcn (new-york, base stone, ícones lucide)
├── magicui/              ← efeitos visuais Magic UI (registry @magicui no components.json)
├── blocks/               ← blocos compostos reutilizáveis (scrollHint, progress-indicator…)
├── blog/                 ← ConteudoPost: o renderizador único dos blocos do post, na leitura pública e na prévia do admin
├── layout/               ← navegacao.ts (fonte única dos itens das navbars; navbar.paridade.test.tsx trava desktop e mobile nela), navbarDesktop (placa flutuante, estado em placa.ts), navbarMobile (barra de abas no pé e folhas do vaul; abas em abasCelular.ts, estado em estadoCelular.ts), linkDaArvore, footer, gridPatternBg(Mobile), socialLinks
└── modelo3d/             ← domínio 3D: caixaHome3d, embalagem3d, WebGLFallback, hooks/

lib/
├── utils.ts              ← cn() (alias shadcn @/lib/utils)
├── utils/                ← input-masks, cep, validate-document, jwt-catalog, logger
├── schemas/              ← schemas zod dos forms — compartilhados entre client e route.ts
├── emails/<form>/        ← template + envio nodemailer; _shared/ tem transporter e template-engine
├── data/                 ← dados estruturados de conteúdo (listaClientes); data/maquinas/ é a fonte única das máquinas — registry por slug, 1 arquivo por máquina
└── images/<categoria>/   ← imagens importadas no código (catalogo2026, projetos, logoClientes…); blog/ guarda os sketches do fundo do blog, nunca capa de post

public/                   ← só o que precisa de URL direta: videos/, embalagens-3d/*.glb, logos, geojson
private/downloads/        ← arquivos NÃO públicos (catálogo 77MB), servidos via api/download/[token] com JWT
types/                    ← declarações globais (model-viewer.d.ts, css-variaveis.d.ts para `--var` no style)
tools/oxlint/profills/    ← plugin local do Oxlint: regras de carregamento (sizes, eager, vídeo, opacity de scroll, 3D)
tools/oxlint/anti-slop/   ← plugin anti-slop vendorizado de dmmulroy/anti-slop; não editar à mão, origem e desvios no UPSTREAM.md
tools/imagens/            ← recomprimir.ts (SSIM ≥ 0,99 nos derivados do Next) e orfas.ts; os testes ao lado travam o teto e a imagem órfã
docs/superpowers/         ← specs/ e plans/ do fluxo de trabalho
docs/adr/                 ← decisões de arquitetura (0001 indicação por cookie, 0002 analytics da indicação, 0003 blog no Postgres, 0004 login do admin, 0005 imagens no bucket, 0006 leitura pública do blog)
docs/agents/              ← config das skills de engenharia: issue tracker, labels de triagem e docs do domínio
docs/indicacao-verificacao.md ← guia: como testar a Indicação em produção e onde ler os números no GA4 e no Meta

proxy.ts                  ← captura ?ref, grava o cookie de Indicação e redireciona para a URL limpa (spec 2026-09-02)
lib/crm/                  ← cliente server-only da API do CRM (referral code)
lib/indicacao/            ← cookie assinado, tipos e destinatário do lead
components/indicacao/     ← IndicacaoProvider, useContatoComercial, BotaoEspecialista
lib/data/contatos.ts      ← fonte única dos contatos padrão (vendas, suporte, compras)
lib/blog/                 ← tipos (o registry `assuntos` dá plural, chamada e fim do post), regras.ts (transição, conflito de versão e slugs reservados, que a migração 0005 repete, puro), apresentacao.ts (listagem, data, minutos de leitura, uso das imagens, agrupamento por assunto, puro), repositorio.ts (SQL); as portas são admin.ts (escrita) e leitura.ts (publicados)
lib/banco/                ← conexão (pg ou PGlite), migrar.mjs e migracoes/*.sql; só lib/blog, lib/admin e scripts/ importam (regra profills/sem-banco-direto)
lib/admin/                ← login do admin: senha.mjs (scrypt, JS puro para o script) e sessao.ts (JWT no cookie, limite de tentativas, atalho de dev)
lib/armazem/              ← Armazem (gravar, ler por stream, listar por prefixo, apagar): S3 pelas AWS_*, disco em .dados/armazem só no bun dev sem elas (ADR 0005)
scripts/admin-gerar-hash.mjs ← gera o ADMIN_SENHA_HASH: lê a senha do terminal sem eco e escreve só o hash no stdout
scripts/banco-migrar.mjs  ← pre-deploy da Railway (`node scripts/banco-migrar.mjs` em deploy.preDeployCommand do serviço site): aplica as migrações pendentes
.dados/                   ← fora do Git: o PGlite (.dados/pglite) e as imagens (.dados/armazem) do bun dev
app/(site)/blog/[slug]/[arquivo]/route.ts ← serve as imagens do blog do armazém, sem banco, com cache imutável
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
| Imagem nova em lib/images  | Antes do commit: `node tools/imagens/recomprimir.ts --aplicar <arquivo>`. O `bun run test` reprova imagem sem import, acima de 3840 px ou de 5 MiB                     |
| Imagem/asset com URL fixa  | `public/` (og-image, favicon, logo referenciado por URL)                                                                                                               |
| Vídeo                      | `public/videos/`. Padrão de referência (hero): trio webm + mp4 + poster webp, `preload='metadata'`. Há exceção legada com mp4 único (`servico-personalizado.mp4`)      |
| Modelo 3D                  | `public/embalagens-3d/*.glb`, < 2MB (exceção legada: `caixa-teste-3d.glb` na raiz de `public/`) — renderizar via `components/modelo3d/`, nunca `<model-viewer>` direto |
| Texto/copy de página       | Hardcoded no componente da rota (arrays `const` no topo); listas grandes → `lib/data/`                                                                                 |
| Post do blog               | Pelo admin em `/admin/blog`, com login em `/admin/entrar`; o post vive no banco (tabela `blog_posts`)                                                                  |
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
- UI SDK (`@ui-sdk/react` e `@ui-sdk/core`, da `vercel-labs/ui`) está em beta (0.1.0-beta.10): a API sai da skill `ui-sdk`, de `node_modules/@ui-sdk/react/docs/llms.txt` e dos `.d.ts` do pacote instalado, nunca de memória. O `@layer ui-sdk;` no topo do `globals.css` deixa as classes do site vencerem o CSS que ela injeta.
- `.env.example` — as env vars dos forms, downloads, Indicação e banco (`GMAIL_*`, `SITE_URL`, `CATALOG_TOKEN_SECRET`, `CRM_BASE_URL`, `CRM_EXTERNAL_API_KEY`, `INDICACAO_COOKIE_SECRET`, `DATABASE_URL`, `ADMIN_*`); copiar para `.env` local. Sem `DATABASE_URL`, o `bun dev` usa o PGlite.
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
- Abaixo de 1024 px a navegação é a barra de abas de 64 px no pé e a faixa do logo de 48 px no topo, que recolhe ao rolar. O `globals.css` dá ao body a folga do pé sozinho; elemento sticky no topo do celular usa `top-(--topo-celular)`, que vira 0 com a faixa recolhida.
- Hero mobile e desktop são duas árvores montadas alternadas por CSS (`md:hidden` / `hidden md:block`) — código eager (3D, observers) checa `getClientRects()` para ignorar a árvore invisível.
- Produção roda na Railway (projeto `site-profills-brasil`, serviço `site`, `next start` atrás de proxy, deploy a cada push na `main`). Em route handler o `request.url` traz o host interno (`localhost:8080`): redirect usa `Location` relativo, e URL absoluta sai de `SITE_URL`. O `profills.com` sem `www` ainda aponta para a Vercel, que só redireciona para o `www`; a KingHost não tem ALIAS para a raiz.
- Sem `.env` local, as rotas de e-mail/download falham — não é bug do seu código; ver `.env.example`.
- Blog no banco: sem `DATABASE_URL`, o `bun dev` abre um PGlite em `.dados/pglite` e migra sozinho; apagar a pasta volta aos posts que as migrações gravam (3 de exemplo em rascunho e 8 do LinkedIn publicados). Fora do `bun dev`, a falta de `DATABASE_URL` é erro na primeira consulta, e o build nunca consulta o banco (`leitura.ts` chama `connection()`). O PGlite precisa estar em `serverExternalPackages`. Testes de banco usam `// @vitest-environment node` e `abrirPglite()` em memória (ADR 0003). Em produção, as migrações rodam no pre-deploy do serviço `site` na Railway com `node scripts/banco-migrar.mjs` (campo `deploy.preDeployCommand`, configurado no serviço e não no repo). Com `DATABASE_URL` no `.env` local, o admin do `bun dev` grava nesse banco: nunca pôr ali a URL de produção.
- Grid pattern de fundo: a implementação viva é `components/layout/gridPatternBg(Mobile).tsx` (usada em ~20 rotas). As variantes em `components/` raiz e `magicui/` (`grid-pattern`, `animated-grid-pattern`, `interactive-grid-pattern`) são código morto — candidatas a remoção, não usar.
- Admin do blog: login por `ADMIN_USUARIO`, `ADMIN_SENHA_HASH` (de `node scripts/admin-gerar-hash.mjs > arquivo`) e `ADMIN_SESSAO_SEGREDO` (32+ caracteres); faltando qualquer um, o login fica fechado (ADR 0004). Para testar a UI local sem senha: `ADMIN_DEV_SEM_LOGIN=1 bun dev` sem `DATABASE_URL`; com `DATABASE_URL`, ou fora do `next dev`, o atalho é ignorado. Mais de 10 tentativas em 15 minutos fecham o login para todos; para destravar antes, apague a linha `global` de `admin_tentativas_login`. O cookie `admin_sessao` é `sameSite: strict` em `path: /admin`: um link de fora para o admin chega sem cookie e cai no login. As Server Actions aceitam o Origin de `www.profills.com` e `profills.com` (`experimental.serverActions.allowedOrigins` no next.config), porque o Host atrás do proxy da Railway é interno.
- Imagens do blog: vivem no bucket da Railway (S3 privado, sem URL pública) e saem por `GET /blog/<slug>/<arquivo>`, nunca de `public/blog/`. O nome leva o hash do conteúdo, então reenviar o mesmo arquivo devolve o mesmo caminho e o cache é `immutable`. Sem `AWS_*` o `bun dev` grava em `.dados/armazem`; fora do dev, sem elas, o upload devolve o erro de configuração e a rota responde 503. `AWS_S3_URL_STYLE` aceita `virtual-hosted` (padrão) ou `path`. O `next/image` otimiza a imagem pela rota sem `localPatterns`. Apagar um rascunho apaga também as imagens da pasta dele que nenhum outro post usa; o resto dos órfãos fica no bucket e aparece como "Sem uso" na tela Imagens do admin (ADR 0005).
- `text-animate` existe em `ui/` e `magicui/` — verificar qual variante a rota vizinha já usa antes de importar.
- Tema é light-mode único com seções dark (`bg-secondary`) — não há toggle dark/light.
- Conteúdo do site é em pt-BR.
- Eventos de Indicação só saem de `lib/analytics/`; nomes e parâmetros são contrato com o admin do GA4 (dimensões `codigo_vendedor`, `formulario`). O PageView do Pixel e o `page_view` do GA continuam em `components/layout/metaPixel.tsx` e no `GoogleAnalytics` do root layout.
- Verificar analytics em produção exige navegador comum: browser automatizado (`HeadlessChrome`) é descartado pelo Pixel antes de sair pela rede e cai na exclusão automática de bots do GA4 (o hit sai com 204 e não aparece no relatório); o Brave do dono bloqueia o `gtag.js` mesmo com Shields desligado. Detalhes em `docs/indicacao-verificacao.md`.
- Contato comercial (telefone, WhatsApp, e-mail de vendas) nunca é hardcoded: vem de `useContatoComercial()` no client ou de `CONTATO_PADRAO` no servidor, porque a Indicação (`?ref=`) troca esses valores por visitante. Suporte, Compras e JSON-LD usam sempre `CONTATO_PADRAO`.
