# Design — Rota `/sorteio-fispal-2026`

**Data:** 2026-05-19
**Status:** Aprovado

## Contexto

O site Profills Brasil (Next.js App Router) precisa de uma landing page isolada
para um sorteio na feira FISPAL 2026. Características pedidas:

- Acessada apenas via link fornecido (não faz parte da navegação do site).
- **Sem** navbar e **sem** footer.
- Visual no padrão do sistema, com fundo azul escuro igual à listagem de
  máquinas (`bg-slate-900` + `GridPattern`).
- O conteúdo real (card/folder com as regras) será fornecido depois — esta
  implementação entrega a **estrutura + placeholder**, pronta para receber o
  conteúdo sem retrabalho.
- CTA para participação via WhatsApp.

## Problema com o layout atual

`app/layout.tsx` (raiz) renderiza `NavbarDesktop`, `NavbarMobile` e `Footer`
para **todas** as rotas. Não há como uma rota filha "remover" o chrome do
layout pai. A solução idiomática no App Router é separar as rotas em route
groups, cada grupo com seu próprio layout.

## Arquitetura — Route Groups

### `app/layout.tsx` (raiz, modificado)

Mantém apenas o que é global a TODAS as rotas:

- `<html>` / `<body>`, fontes Geist (`geistSans`, `geistMono`).
- Skip-link "Pular para o conteúdo" (alvo `#main-content`).
- `<Toaster richColors />`.
- `{children}`.

**Remove:** `NavbarDesktop`, `NavbarMobile`, `Footer` e o wrapper
`<main id="main-content">`.

### `app/(site)/layout.tsx` (novo)

Reintroduz o chrome para as rotas normais do site:

```
<>
  <NavbarDesktop />
  <NavbarMobile />
  <main id="main-content" className="relative h-full w-full">{children}</main>
  <Footer />
</>
```

### `app/(standalone)/layout.tsx` (novo)

Layout mínimo, sem chrome, só com o `<main>` para o skip-link funcionar:

```
<main id="main-content" className="relative h-full w-full">{children}</main>
```

### Movimentação de arquivos

Mover para dentro de `app/(site)/` as pastas de rota atuais:

`(home)`, `clientes`, `download`, `montar-fabrica`, `montar-maquina`,
`projetos`, `servicos-personalizados`, `sobre`, `maquinas`, `catalogo.pdf`.

**Não mover:** `app/api/` (route handlers ignoram layouts),
`app/globals.css`, `app/favicon.ico`, `app/not-found.tsx`, `app/layout.tsx`.

> Route groups com parênteses **não alteram a URL**. `/maquinas` continua
> `/maquinas`, `/` continua `/`, etc.

### Nova rota

`app/(standalone)/sorteio-fispal-2026/page.tsx`

## A página `/sorteio-fispal-2026`

- **Server Component** estático. O único elemento interativo é o CTA do
  WhatsApp, que é apenas um `<a href>` — não exige `'use client'`.
- **`export const metadata`** com `robots: { index: false, follow: false }`
  → a página não é indexada pelo Google.
- **Fundo:** container `bg-slate-900` com `<GridPattern>` por baixo, mesmo
  tratamento de `app/maquinas/page.tsx`.
- **Estrutura (placeholder):**
  1. Logo Profills centralizado no topo.
  2. Título "Sorteio FISPAL 2026".
  3. **Card central** no estilo dos cards de máquina (`bg-slate-800`, borda
     `border-border/20`, cantos arredondados) contendo um placeholder
     "Regras em breve". A área é marcada com comentário `TODO` para receber
     o conteúdo do folder depois.
  4. **CTA** botão accent azul "Participar pelo WhatsApp" →
     `https://wa.me/<numero>?text=<mensagem>`.
  5. Nota legal pequena, opcional, no fim da página.
- Mobile-first, alinhado ao PRODUCT.md (industrial premium, accent azul,
  Geist Sans). O acabamento visual usa o /impeccable.

## Constantes placeholder

No topo de `page.tsx`, constantes a serem preenchidas quando os dados
chegarem:

- `WHATSAPP_NUMERO` — número no formato internacional (ex.: `5519999999999`).
- `WHATSAPP_MENSAGEM` — texto pré-preenchido da conversa.
- Bloco/área de regras — marcado com `TODO`, pronto para o conteúdo do folder.

## Verificação

- `bun run lint` sem erros.
- `bun run build` conclui com sucesso.
- `/maquinas`, `/sobre`, `/` (e demais rotas movidas) continuam renderizando
  com navbar e footer.
- `/sorteio-fispal-2026` renderiza sem navbar e sem footer, com fundo azul
  escuro e grid pattern.
- HTML da página do sorteio contém `<meta name="robots" content="noindex">`.

## Fora de escopo

- Conteúdo final das regras do sorteio (fornecido depois).
- Formulário de inscrição / persistência de participantes (CTA é só link
  WhatsApp).
- Qualquer refatoração não relacionada à separação de layouts.
