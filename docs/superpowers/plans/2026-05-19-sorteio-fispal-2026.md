# Rota /sorteio-fispal-2026 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a landing page isolada `/sorteio-fispal-2026` (sem navbar/footer, fundo azul escuro, noindex, CTA WhatsApp) e separar o chrome do site em route groups.

**Architecture:** O `app/layout.tsx` raiz passa a conter só o essencial global (`<html>/<body>`, fontes, skip-link, `<Toaster>`). Um route group `(site)` recebe o chrome (navbar + footer + `<main>`) e todas as rotas atuais. Um route group `(standalone)` hospeda a página do sorteio com layout mínimo, sem chrome. Route groups com parênteses não alteram URLs.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, Tailwind CSS, shadcn/ui.

**Nota sobre testes:** Esta feature é restruturação de layout + uma página estática. Não há lógica unitária a testar com Vitest. A verificação de cada task é `bun run build` + `bun run lint` + checagem manual de rotas, conforme o spec.

---

### Task 1: Separar o chrome em route groups

Mover todas as rotas atuais para um group `(site)` com o chrome, e enxugar o layout raiz. Sem isso a app não compila com a estrutura nova, então é um único task coeso.

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/(site)/layout.tsx`
- Create: `app/(standalone)/layout.tsx`
- Move (via `git mv`): `app/(home)`, `app/clientes`, `app/download`, `app/montar-fabrica`, `app/montar-maquina`, `app/projetos`, `app/servicos-personalizados`, `app/sobre`, `app/maquinas`, `app/catalogo.pdf` → para dentro de `app/(site)/`

- [ ] **Step 1: Criar a pasta dos route groups e mover as rotas**

Executar a partir da raiz do repo:

```bash
mkdir -p "app/(site)" "app/(standalone)"
git mv "app/(home)" "app/clientes" "app/download" "app/montar-fabrica" "app/montar-maquina" "app/projetos" "app/servicos-personalizados" "app/sobre" "app/maquinas" "app/catalogo.pdf" "app/(site)"
```

> Observação: o git não aceita `app/(site)` literal como destino de múltiplos `git mv` em alguns shells por causa dos parênteses. Se o comando acima falhar, mover uma por uma com aspas:
> `git mv "app/(home)" "app/(site)/(home)"` e assim por diante para cada pasta.
> NÃO mover: `app/api`, `app/globals.css`, `app/favicon.ico`, `app/not-found.tsx`, `app/layout.tsx`.

- [ ] **Step 2: Verificar que as rotas foram movidas**

Run: `ls "app/(site)"`
Expected: lista contendo `(home)`, `clientes`, `download`, `maquinas`, `montar-fabrica`, `montar-maquina`, `projetos`, `servicos-personalizados`, `sobre`, `catalogo.pdf`.

Run: `ls app`
Expected: contém `(site)`, `(standalone)`, `api`, `globals.css`, `favicon.ico`, `layout.tsx`, `not-found.tsx` — e NÃO contém mais `maquinas`, `sobre`, etc. soltos.

- [ ] **Step 3: Reescrever `app/layout.tsx` — só o essencial global**

Substituir o conteúdo de `app/layout.tsx` por (mantendo o bloco `metadata` existente intacto — só o componente `RootLayout` e os imports mudam):

```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

// >>> MANTER o bloco `export const metadata: Metadata = { ... }` existente
// exatamente como está. Não alterar título, descrição nem keywords.

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR' suppressHydrationWarning className='relative'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full w-full overflow-x-hidden antialiased`}
        suppressHydrationWarning>
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-lg'>
          Pular para o conteúdo
        </a>
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
```

Removido em relação ao original: imports de `Footer`, `NavbarDesktop`, `NavbarMobile`; os elementos `<NavbarDesktop />`, `<NavbarMobile />`, `<Footer />`; o wrapper `<main id='main-content'>`.

- [ ] **Step 4: Criar `app/(site)/layout.tsx` — o chrome**

```tsx
import Footer from '@/components/layout/footer';
import NavbarDesktop from '@/components/layout/navbarDesktop';
import NavbarMobile from '@/components/layout/navbarMobile';

export default function SiteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavbarDesktop />
      <NavbarMobile />
      <main id='main-content' className='relative h-full w-full'>
        {children}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Criar `app/(standalone)/layout.tsx` — layout mínimo sem chrome**

```tsx
export default function StandaloneLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main id='main-content' className='relative h-full w-full'>
      {children}
    </main>
  );
}
```

- [ ] **Step 6: Rodar lint e build**

Run: `bun run lint`
Expected: sem erros.

Run: `bun run build`
Expected: build conclui com sucesso. Na lista de rotas geradas devem aparecer `/`, `/maquinas`, `/sobre` etc. com as MESMAS URLs de antes (route groups não mudam path).

- [ ] **Step 7: Checar manualmente que o chrome continua nas rotas do site**

Run: `bun run dev` (em background) e abrir `http://localhost:3000/maquinas`.
Expected: a página `/maquinas` renderiza COM navbar e footer, exatamente como antes. Conferir também `/` e `/sobre`. Encerrar o dev server depois.

- [ ] **Step 8: Commit**

```bash
git add app
git commit -m "refactor: separa chrome do site em route groups"
```

---

### Task 2: Criar a página /sorteio-fispal-2026

**Files:**
- Create: `app/(standalone)/sorteio-fispal-2026/page.tsx`

- [ ] **Step 1: Criar `app/(standalone)/sorteio-fispal-2026/page.tsx`**

Server Component estático. Constantes placeholder no topo, a serem preenchidas quando o folder do sorteio chegar. Fundo `bg-slate-900` + `<GridPattern />` igual a `app/maquinas/page.tsx`. `metadata.robots` com noindex.

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { Button } from '@/components/ui/button';

import logoProfills from '@/public/logo-branco.png';

// ===== Placeholders — preencher quando o folder do sorteio chegar =====
const WHATSAPP_NUMERO = '5519999999999'; // TODO: número real, formato internacional
const WHATSAPP_MENSAGEM =
  'Olá! Quero participar do Sorteio FISPAL 2026.'; // TODO: mensagem final
// ======================================================================

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
  WHATSAPP_MENSAGEM
)}`;

export const metadata: Metadata = {
  title: 'Sorteio FISPAL 2026 | Profills Brasil',
  description: 'Participe do sorteio da Profills Brasil na FISPAL 2026.',
  robots: { index: false, follow: false }
};

export default function SorteioFispal2026() {
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-slate-900 px-4 py-16'>
      <GridPattern />

      <Image
        src={logoProfills}
        alt='Logo Profills'
        priority
        className='z-10 h-auto w-40 md:w-48'
      />

      <h1 className='z-10 text-center text-2xl font-bold text-white md:text-4xl'>
        Sorteio FISPAL 2026
      </h1>

      {/* TODO: substituir o conteúdo deste card pelo folder/regras do sorteio */}
      <div className='border-border/20 z-10 flex w-full max-w-2xl flex-col items-center justify-center gap-3 rounded-xs border bg-slate-800 p-8 text-center text-white md:p-12'>
        <p className='text-lg font-semibold'>Regras em breve</p>
        <p className='text-sm text-slate-300'>
          As informações completas do sorteio serão publicadas aqui.
        </p>
      </div>

      <Button
        asChild
        className='z-10 bg-blue-600 text-white hover:bg-blue-700'>
        <a href={whatsappUrl} target='_blank' rel='noopener noreferrer'>
          Participar pelo WhatsApp
        </a>
      </Button>

      <p className='z-10 max-w-2xl text-center text-xs text-slate-400'>
        {/* TODO: nota legal do sorteio, se houver */}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Rodar lint e build**

Run: `bun run lint`
Expected: sem erros.

Run: `bun run build`
Expected: build conclui; na lista de rotas aparece `/sorteio-fispal-2026`.

- [ ] **Step 3: Checar a página manualmente**

Run: `bun run dev` (background) e abrir `http://localhost:3000/sorteio-fispal-2026`.
Expected:
- Página SEM navbar e SEM footer.
- Fundo azul escuro com o grid pattern visível.
- Logo, título "Sorteio FISPAL 2026", card "Regras em breve", botão "Participar pelo WhatsApp".
- Ver fonte da página (Ctrl+U) e confirmar `<meta name="robots" content="noindex,nofollow">`.

Encerrar o dev server depois.

- [ ] **Step 4: Commit**

```bash
git add "app/(standalone)/sorteio-fispal-2026"
git commit -m "feat: adiciona rota /sorteio-fispal-2026"
```

---

### Task 3: Verificação final

- [ ] **Step 1: Build + lint limpos**

Run: `bun run lint && bun run build`
Expected: ambos passam sem erro.

- [ ] **Step 2: Conferir matriz de rotas**

Na saída do `bun run build`, confirmar:
- `/`, `/maquinas`, `/sobre`, `/clientes`, `/projetos`, `/montar-fabrica`, `/montar-maquina`, `/servicos-personalizados`, `/download` — URLs inalteradas.
- `/sorteio-fispal-2026` — presente.

- [ ] **Step 3: Confirmar acabamento visual (opcional, /impeccable)**

Se desejado, aplicar o sub-comando `/impeccable polish` na página `/sorteio-fispal-2026` para alinhar espaçamento, tipografia e contraste ao PRODUCT.md, sem alterar a estrutura placeholder.

---

## Notas para o futuro

Quando o card/folder do sorteio chegar:
1. Preencher `WHATSAPP_NUMERO` e `WHATSAPP_MENSAGEM`.
2. Substituir o bloco `{/* TODO: ... */}` do card pelo conteúdo das regras.
3. Preencher a nota legal, se houver.
