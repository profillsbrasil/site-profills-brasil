# Indicação de vendedor via link (`?ref=`) — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Quem entra no site por `?ref=CODIGO` passa 30 dias vendo os contatos comerciais do vendedor dono do código e tem seus formulários enviados só a ele; suporte, SEO e landings não mudam.

**Architecture:** `proxy.ts` captura `?ref`, consulta o CRM no servidor, grava um cookie JWT assinado com os dados do vendedor e redireciona para a URL limpa. Um Provider client lê o cookie na hidratação e distribui o vendedor por Context aos 4 pontos de UI; os 5 route handlers leem o cookie da requisição, revalidam no CRM e escolhem o destinatário. Nenhuma página deixa de ser estática.

**Tech Stack:** Next.js 16.2.6 (App Router, `proxy.ts`), React 19, TypeScript, `jose` (já instalado), `server-only` (novo), Vitest + Testing Library, Bun.

**Spec:** `docs/superpowers/specs/2026-09-02-indicacao-vendedor-design.md` · ADR: `docs/adr/0001-indicacao-por-cookie-assinado-no-proxy.md` · Glossário: `CONTEXT.md`

## Global Constraints

- Package manager é **Bun**: `bun add`, `bun run test`, `bun run lint`, `bun run format`.
- Testes ao lado do código (`*.test.ts` / `*.test.tsx`); testes que usam `NextRequest`, `jose` ou `fetch` levam `// @vitest-environment node` na primeira linha.
- A chave do CRM (`CRM_EXTERNAL_API_KEY`) nunca vai para o browser, para log, para teste ou para commit. Nada de `NEXT_PUBLIC_CRM_*`.
- Cookie: nome `profills_indicacao`, 30 dias, `Path=/`, `SameSite=Lax`, `Secure` fora de `development`, sem `HttpOnly`.
- Renovação dos dados do cookie: quando `consultadoEm` tem mais de 24 h.
- Formato do código: `^[A-Z0-9-]{3,20}$` depois de `trim` + `toUpperCase`.
- CRM: `GET {CRM_BASE_URL}/api/external/referral/{codigo}` com header `X-API-Key`; só 200 é vendedor; timeout 4 s; no máximo uma consulta por código a cada 5 min por instância.
- Nenhuma página passa a ler `cookies()`, `headers()` ou `searchParams` no servidor.
- Nomes em pt-BR, como o resto do repo. Commits em Conventional Commits, subject até 50 caracteres.
- Toda mudança de UI respeita o visual atual: mesmas classes, mesmos ícones. Não há card, rótulo ou texto novo para o visitante.
- Antes de cada commit: `bun run test` verde, `bun run lint` sem erro, `bun run format` só nos arquivos tocados (`bun run prettier --write <arquivos>`).

---

## Mapa de arquivos

| Arquivo                                                                                               | Responsabilidade                                                                                                 |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `lib/crm/referral.ts` (novo, server-only)                                                             | Normaliza o código e consulta o CRM com cache de 5 min; devolve `encontrado` / `nao-encontrado` / `indisponivel` |
| `lib/data/contatos.ts` (novo)                                                                         | Fonte única dos contatos padrão (vendas, suporte, compras)                                                       |
| `lib/utils/whatsapp.ts` (modificar)                                                                   | `WHATSAPP_VENDAS` passa a derivar de `contatos.ts`; `waLink` inalterado                                          |
| `lib/seo/site.ts` (modificar)                                                                         | `TELEFONE_VENDAS` e `EMAIL_COMERCIAL` derivam de `contatos.ts`                                                   |
| `lib/indicacao/tipos.ts` (novo)                                                                       | Tipos compartilhados client/server: `VendedorIndicacao`, `IndicacaoPayload`                                      |
| `lib/indicacao/cookie-server.ts` (novo)                                                               | Assina e verifica o cookie JWT (`jose`); regra de renovação                                                      |
| `lib/indicacao/cookie-client.ts` (novo)                                                               | Decodifica o payload do cookie no browser sem verificar assinatura                                               |
| `lib/indicacao/destinatario.ts` (novo, server-only)                                                   | Lê o cookie da requisição, revalida no CRM e escolhe o e-mail de destino                                         |
| `proxy.ts` (novo, raiz)                                                                               | Captura `?ref`, grava/renova/apaga o cookie, redireciona para URL limpa                                          |
| `components/indicacao/indicacaoProvider.tsx` (novo, client)                                           | Context com o estado da Indicação lido do cookie                                                                 |
| `components/indicacao/useContatoComercial.ts` (novo, client)                                          | Hook que resolve telefone, WhatsApp e e-mail comerciais                                                          |
| `components/indicacao/botaoEspecialista.tsx` (novo, client)                                           | Botão "Falar com um especialista" usado nas fichas de máquina                                                    |
| `app/(site)/layout.tsx` (modificar)                                                                   | Monta o Provider em volta de navbar, main e footer                                                               |
| `components/layout/footer.tsx` (modificar)                                                            | Card Vendas/Peças usa o hook; Suporte e Compras usam `contatos.ts`                                               |
| `app/(site)/(home)/_components/heroCarrossel/heroSlideCopy.tsx` (modificar)                           | Link do hero usa o hook                                                                                          |
| `app/(site)/maquinas/[slug]/page.tsx` e `_components/conversao.tsx` (modificar)                       | Trocam o `<a>` por `BotaoEspecialista`                                                                           |
| `lib/emails/*/email-*.ts` (5 arquivos, modificar)                                                     | Recebem `destinatario` e usam `to: destinatario.para`; template ganha "Indicado por"                             |
| `app/api/{contact,montar-maquina,monte-fabrica,specifications,download-catalog}/route.ts` (modificar) | Chamam `resolverDestinatario(request)` e passam ao envio                                                         |
| `.env.example`, `CLAUDE.md` (modificar)                                                               | Envs novas e mapa do repo                                                                                        |

---

### Task 1: Helper do CRM (`lib/crm/referral.ts`)

**Files:**

- Create: `lib/crm/referral.ts`
- Create: `lib/crm/referral.test.ts`
- Create: `lib/indicacao/tipos.ts`
- Modify: `.env.example`
- Modify: `package.json` (via `bun add server-only`)

**Interfaces:**

- Consumes: `logger` de `@/lib/utils/logger`.
- Produces:
  - `lib/indicacao/tipos.ts`: `type VendedorIndicacao = { nome: string; email: string; referral_code: string; contato: string | null }` e `type IndicacaoPayload = { codigo: string; nome: string; email: string; contato: string | null; consultadoEm: string }`.
  - `lib/crm/referral.ts`: `normalizarCodigo(valor: string | null | undefined): string | null`; `buscarVendedorPorCodigo(valor: string | null | undefined): Promise<ResultadoBusca>`; `type ResultadoBusca = { tipo: 'encontrado'; vendedor: VendedorIndicacao } | { tipo: 'nao-encontrado' } | { tipo: 'indisponivel' }`; `limparCacheReferral(): void` (só para testes); `formatarTelefoneBR(digitos: string | null): string`; `linkWhatsApp(digitos: string | null): string | null`.

- [ ] **Step 1: Instalar `server-only` e registrar as envs**

```bash
bun add server-only
```

Acrescentar ao fim de `.env.example`:

```bash
CRM_BASE_URL=""
CRM_EXTERNAL_API_KEY=""
INDICACAO_COOKIE_SECRET=""
```

- [ ] **Step 2: Criar os tipos compartilhados**

`lib/indicacao/tipos.ts`:

```ts
/** Resposta 200 do CRM em GET /api/external/referral/<code>. */
export type VendedorIndicacao = {
  nome: string;
  email: string;
  /** Sempre em maiúsculas; é o código canônico. */
  referral_code: string;
  /** Só dígitos (DDD + número, sem +55) ou null quando não há telefone. */
  contato: string | null;
};

/** Payload do cookie profills_indicacao. Não contém segredo: é o que a UI mostra. */
export type IndicacaoPayload = {
  codigo: string;
  nome: string;
  email: string;
  contato: string | null;
  /** ISO 8601 da última consulta ao CRM; renova depois de 24 h. */
  consultadoEm: string;
};
```

- [ ] **Step 3: Escrever o teste do helper**

`lib/crm/referral.test.ts`:

```ts
// @vitest-environment node
import {
  buscarVendedorPorCodigo,
  formatarTelefoneBR,
  limparCacheReferral,
  linkWhatsApp,
  normalizarCodigo
} from './referral';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/utils/logger', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() }
}));

const vendedor = {
  nome: 'Maria Silva',
  email: 'maria@profills.com.br',
  referral_code: 'MARIA-10',
  contato: '11987654321'
};

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body
  });
}

describe('normalizarCodigo', () => {
  it('normaliza para maiúsculas e aceita hífen', () => {
    expect(normalizarCodigo(' maria-10 ')).toBe('MARIA-10');
  });

  it('rejeita fora do formato', () => {
    for (const v of [
      'ab',
      'maria 10',
      'maria_10',
      'a'.repeat(21),
      '',
      null,
      undefined
    ]) {
      expect(normalizarCodigo(v)).toBeNull();
    }
  });
});

describe('buscarVendedorPorCodigo', () => {
  beforeEach(() => {
    limparCacheReferral();
    vi.stubEnv('CRM_BASE_URL', 'https://crm.test');
    vi.stubEnv('CRM_EXTERNAL_API_KEY', 'chave-teste');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('devolve encontrado no 200 e manda a chave no header', async () => {
    const fetchMock = mockFetch(200, vendedor);
    vi.stubGlobal('fetch', fetchMock);

    await expect(buscarVendedorPorCodigo('maria-10')).resolves.toEqual({
      tipo: 'encontrado',
      vendedor
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://crm.test/api/external/referral/MARIA-10');
    expect(init.headers['X-API-Key']).toBe('chave-teste');
  });

  it('devolve nao-encontrado no 404 e em código inválido, sem chamar o CRM no inválido', async () => {
    const fetchMock = mockFetch(404, { error: 'not_found' });
    vi.stubGlobal('fetch', fetchMock);
    await expect(buscarVendedorPorCodigo('MARIA-10')).resolves.toEqual({
      tipo: 'nao-encontrado'
    });
    await expect(buscarVendedorPorCodigo('ab')).resolves.toEqual({
      tipo: 'nao-encontrado'
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('devolve indisponivel em 401, 503, erro de rede e sem env', async () => {
    for (const status of [401, 503]) {
      limparCacheReferral();
      vi.stubGlobal('fetch', mockFetch(status, { error: 'x' }));
      await expect(buscarVendedorPorCodigo('MARIA-10')).resolves.toEqual({
        tipo: 'indisponivel'
      });
    }
    limparCacheReferral();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('rede')));
    await expect(buscarVendedorPorCodigo('MARIA-10')).resolves.toEqual({
      tipo: 'indisponivel'
    });

    limparCacheReferral();
    vi.stubEnv('CRM_EXTERNAL_API_KEY', '');
    const fetchMock = mockFetch(200, vendedor);
    vi.stubGlobal('fetch', fetchMock);
    await expect(buscarVendedorPorCodigo('MARIA-10')).resolves.toEqual({
      tipo: 'indisponivel'
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reusa a resposta por 5 minutos e consulta de novo depois', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-02T12:00:00Z'));
    const fetchMock = mockFetch(200, vendedor);
    vi.stubGlobal('fetch', fetchMock);

    await buscarVendedorPorCodigo('MARIA-10');
    await buscarVendedorPorCodigo('maria-10');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    vi.setSystemTime(new Date('2026-09-02T12:05:01Z'));
    await buscarVendedorPorCodigo('MARIA-10');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('não cacheia indisponivel', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('rede'));
    vi.stubGlobal('fetch', fetchMock);
    await buscarVendedorPorCodigo('MARIA-10');
    await buscarVendedorPorCodigo('MARIA-10');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('telefone', () => {
  it('formata 11 e 10 dígitos e monta o wa.me', () => {
    expect(formatarTelefoneBR('11987654321')).toBe('(11) 98765-4321');
    expect(formatarTelefoneBR('1133334444')).toBe('(11) 3333-4444');
    expect(formatarTelefoneBR('123')).toBe('123');
    expect(formatarTelefoneBR(null)).toBe('');
    expect(linkWhatsApp('11987654321')).toBe('https://wa.me/5511987654321');
    expect(linkWhatsApp(null)).toBeNull();
  });
});
```

- [ ] **Step 4: Rodar e ver falhar**

Run: `bun run test lib/crm/referral.test.ts`
Expected: FAIL, `Cannot find module './referral'`.

- [ ] **Step 5: Implementar o helper**

`lib/crm/referral.ts`:

```ts
import type { VendedorIndicacao } from '@/lib/indicacao/tipos';
import { logger } from '@/lib/utils/logger';

import 'server-only';

export type ResultadoBusca =
  | { tipo: 'encontrado'; vendedor: VendedorIndicacao }
  | { tipo: 'nao-encontrado' }
  | { tipo: 'indisponivel' };

/** Mesmo formato que o CRM aceita; validar aqui evita rede para lixo de querystring. */
const FORMATO_CODIGO = /^[A-Z0-9-]{3,20}$/;
const CACHE_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 4000;

type Cacheado =
  | { tipo: 'encontrado'; vendedor: VendedorIndicacao }
  | { tipo: 'nao-encontrado' };

/* Cache em memória por instância: o CRM roda num pool pequeno de conexões e
   não tem rate limit. Vale tanto no proxy quanto nos route handlers, onde o
   Data Cache do fetch pode não se aplicar. */
const cache = new Map<string, { ate: number; resultado: Cacheado }>();

export function limparCacheReferral() {
  cache.clear();
}

export function normalizarCodigo(
  valor: string | null | undefined
): string | null {
  const codigo = (valor ?? '').trim().toUpperCase();
  return FORMATO_CODIGO.test(codigo) ? codigo : null;
}

/**
 * Consulta o vendedor dono do código. Nunca lança: qualquer falha do CRM
 * vira `indisponivel`, e a página/handler segue sem Indicação.
 */
export async function buscarVendedorPorCodigo(
  valor: string | null | undefined
): Promise<ResultadoBusca> {
  const codigo = normalizarCodigo(valor);
  if (!codigo) return { tipo: 'nao-encontrado' };

  const agora = Date.now();
  const guardado = cache.get(codigo);
  if (guardado && guardado.ate > agora) return guardado.resultado;

  const base = process.env.CRM_BASE_URL;
  const chave = process.env.CRM_EXTERNAL_API_KEY;
  if (!base || !chave) {
    logger.warn('[crm-referral] CRM_BASE_URL ou CRM_EXTERNAL_API_KEY ausente');
    return { tipo: 'indisponivel' };
  }

  try {
    const resp = await fetch(
      `${base.replace(/\/$/, '')}/api/external/referral/${encodeURIComponent(codigo)}`,
      {
        headers: { 'X-API-Key': chave },
        cache: 'force-cache',
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(TIMEOUT_MS)
      }
    );

    if (resp.status === 404) {
      const resultado: Cacheado = { tipo: 'nao-encontrado' };
      cache.set(codigo, { ate: agora + CACHE_MS, resultado });
      return resultado;
    }
    if (!resp.ok) {
      logger.error(
        `[crm-referral] CRM respondeu ${resp.status} para ${codigo}`
      );
      return { tipo: 'indisponivel' };
    }

    const vendedor = (await resp.json()) as VendedorIndicacao;
    const resultado: Cacheado = { tipo: 'encontrado', vendedor };
    cache.set(codigo, { ate: agora + CACHE_MS, resultado });
    return resultado;
  } catch (erro) {
    logger.error('[crm-referral] falha ao consultar o CRM', erro);
    return { tipo: 'indisponivel' };
  }
}

export function formatarTelefoneBR(digitos: string | null): string {
  if (!digitos) return '';
  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }
  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return digitos;
}

export function linkWhatsApp(digitos: string | null): string | null {
  return digitos ? `https://wa.me/55${digitos}` : null;
}
```

- [ ] **Step 6: Rodar e ver passar**

Run: `bun run test lib/crm/referral.test.ts`
Expected: PASS (8 testes).

- [ ] **Step 7: Lint, format e commit**

```bash
bun run lint && bun run prettier --write lib/crm lib/indicacao/tipos.ts .env.example
git add lib/crm lib/indicacao/tipos.ts .env.example package.json bun.lock
git commit -m "feat(indicacao): helper server-only do CRM"
```

---

### Task 2: Fonte única de contatos (`lib/data/contatos.ts`)

**Files:**

- Create: `lib/data/contatos.ts`
- Create: `lib/data/contatos.test.ts`
- Modify: `lib/utils/whatsapp.ts:1`
- Modify: `lib/seo/site.ts:20-22`
- Modify: `components/layout/footer.tsx:16-24`
- Modify: `app/(site)/(home)/_components/heroCarrossel/heroSlideCopy.tsx:24-26`

**Interfaces:**

- Produces: `CONTATO_PADRAO = { vendas: { telefone, email }, suporte: { telefone, email }, compras: { telefone, email } }` com `telefone` só dígitos com DDI (`'5541997851998'`) e `email` string. Task 5 e Task 6 leem `CONTATO_PADRAO.vendas`.

- [ ] **Step 1: Escrever o teste**

`lib/data/contatos.test.ts`:

```ts
import { EMAIL_COMERCIAL, TELEFONE_VENDAS } from '@/lib/seo/site';
import { WHATSAPP_VENDAS } from '@/lib/utils/whatsapp';

import { CONTATO_PADRAO } from './contatos';
import { describe, expect, it } from 'vitest';

describe('CONTATO_PADRAO', () => {
  it('é a origem de site.ts e whatsapp.ts', () => {
    expect(WHATSAPP_VENDAS).toBe(CONTATO_PADRAO.vendas.telefone);
    expect(TELEFONE_VENDAS).toBe(`+${CONTATO_PADRAO.vendas.telefone}`);
    expect(EMAIL_COMERCIAL).toBe(CONTATO_PADRAO.vendas.email);
  });

  it('só tem dígitos com DDI nos telefones', () => {
    for (const setor of Object.values(CONTATO_PADRAO)) {
      expect(setor.telefone).toMatch(/^55\d{10,11}$/);
    }
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `bun run test lib/data/contatos.test.ts`
Expected: FAIL, `Cannot find module './contatos'`.

- [ ] **Step 3: Criar a fonte única e derivar as constantes existentes**

`lib/data/contatos.ts`:

```ts
/**
 * Contatos padrão da Profills, por setor. Única origem do número e do e-mail
 * usados em UI, SEO e e-mails. Telefones só com dígitos e DDI (formato wa.me).
 * TODO: trocar Suporte e Compras quando o comercial confirmar os números.
 */
export const CONTATO_PADRAO = {
  vendas: {
    telefone: '5541997851998',
    email: 'comercial@profillsdobrasil.com.br'
  },
  suporte: {
    telefone: '5541997851998',
    email: 'suporte@profillsdobrasil.com.br'
  },
  compras: {
    telefone: '5541997851998',
    email: 'compras@profillsdobrasil.com.br'
  }
} as const;
```

`lib/utils/whatsapp.ts` (arquivo inteiro):

```ts
import { CONTATO_PADRAO } from '@/lib/data/contatos';

export const WHATSAPP_VENDAS = CONTATO_PADRAO.vendas.telefone;

export function waLink(numero: string, mensagem: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
```

`lib/seo/site.ts`: adicionar `import { CONTATO_PADRAO } from '@/lib/data/contatos';` no topo e trocar as linhas 20 e 22 por:

```ts
export const TELEFONE_VENDAS = `+${CONTATO_PADRAO.vendas.telefone}`;

export const EMAIL_COMERCIAL = CONTATO_PADRAO.vendas.email;
```

`components/layout/footer.tsx`: apagar as linhas 16 a 24 (comentário, as três constantes e a função `waLink` local) e colocar no bloco de imports:

```ts
import { CONTATO_PADRAO } from '@/lib/data/contatos';
import { waLink } from '@/lib/utils/whatsapp';
```

No array `contacts`, trocar `WHATSAPP_VENDAS` por `CONTATO_PADRAO.vendas.telefone`, `WHATSAPP_SUPORTE` por `CONTATO_PADRAO.suporte.telefone`, `WHATSAPP_COMPRAS` por `CONTATO_PADRAO.compras.telefone`, e os três `href: 'mailto:...'` por `` href: `mailto:${CONTATO_PADRAO.vendas.email}` `` (idem `suporte` e `compras`), mantendo os `label` como estão. Task 5 reescreve o card Vendas; aqui só a origem muda.

`app/(site)/(home)/_components/heroCarrossel/heroSlideCopy.tsx`: trocar as linhas 24 a 26 por

```ts
const WHATSAPP_URL = waLink(
  WHATSAPP_VENDAS,
  'Olá! Vim pelo site da Profills e quero falar com um especialista.'
);
```

e adicionar `import { WHATSAPP_VENDAS, waLink } from '@/lib/utils/whatsapp';` aos imports.

- [ ] **Step 4: Rodar tudo e ver passar**

Run: `bun run test`
Expected: PASS, inclusive `lib/utils/whatsapp.test.ts` (o valor não mudou).

- [ ] **Step 5: Lint, format e commit**

```bash
bun run lint && bun run prettier --write lib/data/contatos.ts lib/data/contatos.test.ts lib/utils/whatsapp.ts lib/seo/site.ts components/layout/footer.tsx "app/(site)/(home)/_components/heroCarrossel/heroSlideCopy.tsx"
git add lib/data/contatos.ts lib/data/contatos.test.ts lib/utils/whatsapp.ts lib/seo/site.ts components/layout/footer.tsx "app/(site)/(home)/_components/heroCarrossel/heroSlideCopy.tsx"
git commit -m "refactor(contatos): fonte única dos contatos padrão"
```

---

### Task 3: Cookie assinado (`lib/indicacao/cookie-server.ts` e `cookie-client.ts`)

**Files:**

- Create: `lib/indicacao/cookie-server.ts`
- Create: `lib/indicacao/cookie-server.test.ts`
- Create: `lib/indicacao/cookie-client.ts`
- Create: `lib/indicacao/cookie-client.test.ts`

**Interfaces:**

- Consumes: `VendedorIndicacao`, `IndicacaoPayload` de `@/lib/indicacao/tipos`.
- Produces:
  - `cookie-server.ts`: `INDICACAO_COOKIE = 'profills_indicacao'`; `INDICACAO_MAX_AGE = 2592000` (segundos); `RENOVACAO_MS = 86400000`; `assinarIndicacao(vendedor: VendedorIndicacao, agora?: Date): Promise<string>`; `lerIndicacao(token: string | undefined): Promise<IndicacaoPayload | null>`; `precisaRenovar(payload: IndicacaoPayload, agora?: Date): boolean`; `opcoesCookieIndicacao(): { path: '/'; maxAge: number; sameSite: 'lax'; secure: boolean; httpOnly: false }`.
  - `cookie-client.ts`: `lerCookieIndicacaoDoBrowser(cookieHeader: string): IndicacaoPayload | null` (recebe `document.cookie`).

- [ ] **Step 1: Teste do lado servidor**

`lib/indicacao/cookie-server.test.ts`:

```ts
// @vitest-environment node
import {
  INDICACAO_COOKIE,
  INDICACAO_MAX_AGE,
  assinarIndicacao,
  lerIndicacao,
  opcoesCookieIndicacao,
  precisaRenovar
} from './cookie-server';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

const vendedor = {
  nome: 'Maria Silva',
  email: 'maria@profills.com.br',
  referral_code: 'MARIA-10',
  contato: null
};

beforeAll(() => {
  process.env.INDICACAO_COOKIE_SECRET =
    'segredo-de-teste-com-bytes-suficientes-para-hs256';
});

afterEach(() => {
  vi.useRealTimers();
});

describe('cookie-server', () => {
  it('faz round-trip do vendedor com consultadoEm', async () => {
    const agora = new Date('2026-09-02T12:00:00Z');
    const token = await assinarIndicacao(vendedor, agora);
    await expect(lerIndicacao(token)).resolves.toEqual({
      codigo: 'MARIA-10',
      nome: 'Maria Silva',
      email: 'maria@profills.com.br',
      contato: null,
      consultadoEm: '2026-09-02T12:00:00.000Z'
    });
  });

  it('devolve null para token adulterado, vazio ou undefined', async () => {
    const token = await assinarIndicacao(vendedor);
    await expect(lerIndicacao(token.slice(0, -2) + 'aa')).resolves.toBeNull();
    await expect(lerIndicacao('')).resolves.toBeNull();
    await expect(lerIndicacao(undefined)).resolves.toBeNull();
  });

  it('expira em 30 dias', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-02T12:00:00Z'));
    const token = await assinarIndicacao(vendedor, new Date());
    vi.setSystemTime(new Date('2026-10-02T12:00:01Z'));
    await expect(lerIndicacao(token)).resolves.toBeNull();
  });

  it('precisaRenovar só depois de 24 h', () => {
    const payload = {
      codigo: 'MARIA-10',
      nome: 'Maria',
      email: 'm@p.br',
      contato: null,
      consultadoEm: '2026-09-02T12:00:00.000Z'
    };
    expect(precisaRenovar(payload, new Date('2026-09-03T11:59:59Z'))).toBe(
      false
    );
    expect(precisaRenovar(payload, new Date('2026-09-03T12:00:01Z'))).toBe(
      true
    );
    expect(precisaRenovar({ ...payload, consultadoEm: 'lixo' })).toBe(true);
  });

  it('expõe nome, validade e atributos do cookie', () => {
    expect(INDICACAO_COOKIE).toBe('profills_indicacao');
    expect(INDICACAO_MAX_AGE).toBe(30 * 24 * 60 * 60);
    expect(opcoesCookieIndicacao()).toMatchObject({
      path: '/',
      maxAge: INDICACAO_MAX_AGE,
      sameSite: 'lax',
      httpOnly: false
    });
  });
});
```

- [ ] **Step 2: Teste do lado browser**

`lib/indicacao/cookie-client.test.ts`:

```ts
import { lerCookieIndicacaoDoBrowser } from './cookie-client';
import { describe, expect, it } from 'vitest';

function jwtFalso(payload: unknown) {
  const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64url');
  return `${b64('{"alg":"HS256"}')}.${b64(JSON.stringify(payload))}.assinatura`;
}

const payload = {
  codigo: 'MARIA-10',
  nome: 'Maria Conceição',
  email: 'maria@profills.com.br',
  contato: '11987654321',
  consultadoEm: '2026-09-02T12:00:00.000Z'
};

describe('lerCookieIndicacaoDoBrowser', () => {
  it('lê o payload do cookie, com acento, entre outros cookies', () => {
    const header = `_ga=abc; profills_indicacao=${jwtFalso(payload)}; outro=1`;
    expect(lerCookieIndicacaoDoBrowser(header)).toEqual(payload);
  });

  it('devolve null sem cookie, com payload ilegível ou sem os campos', () => {
    expect(lerCookieIndicacaoDoBrowser('')).toBeNull();
    expect(lerCookieIndicacaoDoBrowser('profills_indicacao=lixo')).toBeNull();
    expect(
      lerCookieIndicacaoDoBrowser(
        `profills_indicacao=${jwtFalso({ nome: 'x' })}`
      )
    ).toBeNull();
  });
});
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `bun run test lib/indicacao`
Expected: FAIL nos dois arquivos, módulos inexistentes.

- [ ] **Step 4: Implementar o lado servidor**

`lib/indicacao/cookie-server.ts`:

```ts
import type { IndicacaoPayload, VendedorIndicacao } from './tipos';
import { SignJWT, jwtVerify } from 'jose';

export const INDICACAO_COOKIE = 'profills_indicacao';
/** 30 dias, em segundos (Max-Age). */
export const INDICACAO_MAX_AGE = 30 * 24 * 60 * 60;
/** Renova os dados do vendedor pelo CRM depois de 24 h. */
export const RENOVACAO_MS = 24 * 60 * 60 * 1000;

function segredo() {
  const valor = process.env.INDICACAO_COOKIE_SECRET;
  if (!valor) throw new Error('INDICACAO_COOKIE_SECRET não está definido');
  return new TextEncoder().encode(valor);
}

export function opcoesCookieIndicacao() {
  return {
    path: '/' as const,
    maxAge: INDICACAO_MAX_AGE,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV !== 'development',
    /* O browser lê o payload para trocar os contatos; nada nele é segredo. */
    httpOnly: false as const
  };
}

export async function assinarIndicacao(
  vendedor: VendedorIndicacao,
  agora: Date = new Date()
): Promise<string> {
  const payload: IndicacaoPayload = {
    codigo: vendedor.referral_code,
    nome: vendedor.nome,
    email: vendedor.email,
    contato: vendedor.contato,
    consultadoEm: agora.toISOString()
  };
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(Math.floor(agora.getTime() / 1000))
    .setExpirationTime(Math.floor(agora.getTime() / 1000) + INDICACAO_MAX_AGE)
    .sign(segredo());
}

function ehPayload(valor: unknown): valor is IndicacaoPayload {
  if (!valor || typeof valor !== 'object') return false;
  const o = valor as Record<string, unknown>;
  return (
    typeof o.codigo === 'string' &&
    typeof o.nome === 'string' &&
    typeof o.email === 'string' &&
    (typeof o.contato === 'string' || o.contato === null) &&
    typeof o.consultadoEm === 'string'
  );
}

/** Verifica assinatura e validade; qualquer problema vira null. */
export async function lerIndicacao(
  token: string | undefined
): Promise<IndicacaoPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, segredo(), {
      algorithms: ['HS256']
    });
    if (!ehPayload(payload)) return null;
    const { codigo, nome, email, contato, consultadoEm } = payload;
    return { codigo, nome, email, contato, consultadoEm };
  } catch {
    return null;
  }
}

export function precisaRenovar(
  payload: IndicacaoPayload,
  agora: Date = new Date()
): boolean {
  const consultado = Date.parse(payload.consultadoEm);
  if (Number.isNaN(consultado)) return true;
  return agora.getTime() - consultado > RENOVACAO_MS;
}
```

- [ ] **Step 5: Implementar o lado browser**

`lib/indicacao/cookie-client.ts`:

```ts
import type { IndicacaoPayload } from './tipos';

const NOME = 'profills_indicacao';

function base64UrlParaTexto(b64url: string): string {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const preenchido = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(preenchido), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Decodifica o payload do cookie sem verificar a assinatura: o browser só
 * mostra o que está lá, e o servidor verifica antes de usar em qualquer envio.
 */
export function lerCookieIndicacaoDoBrowser(
  cookieHeader: string
): IndicacaoPayload | null {
  const par = cookieHeader
    .split(';')
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${NOME}=`));
  if (!par) return null;

  const token = par.slice(NOME.length + 1);
  const partes = token.split('.');
  if (partes.length !== 3) return null;

  try {
    const dados = JSON.parse(base64UrlParaTexto(partes[1])) as Record<
      string,
      unknown
    >;
    if (
      typeof dados.codigo !== 'string' ||
      typeof dados.nome !== 'string' ||
      typeof dados.email !== 'string' ||
      (typeof dados.contato !== 'string' && dados.contato !== null) ||
      typeof dados.consultadoEm !== 'string'
    ) {
      return null;
    }
    return {
      codigo: dados.codigo,
      nome: dados.nome,
      email: dados.email,
      contato: dados.contato as string | null,
      consultadoEm: dados.consultadoEm
    };
  } catch {
    return null;
  }
}
```

- [ ] **Step 6: Rodar e ver passar**

Run: `bun run test lib/indicacao`
Expected: PASS (7 testes).

- [ ] **Step 7: Lint, format e commit**

```bash
bun run lint && bun run prettier --write lib/indicacao
git add lib/indicacao
git commit -m "feat(indicacao): cookie JWT assinado"
```

---

### Task 4: `proxy.ts`

**Files:**

- Create: `proxy.ts` (raiz do projeto, ao lado de `next.config.ts`)
- Create: `proxy.test.ts`

**Interfaces:**

- Consumes: `buscarVendedorPorCodigo`, `normalizarCodigo` de `@/lib/crm/referral`; `INDICACAO_COOKIE`, `assinarIndicacao`, `lerIndicacao`, `opcoesCookieIndicacao`, `precisaRenovar` de `@/lib/indicacao/cookie-server`; `logger`.
- Produces: `export default async function proxy(request: NextRequest): Promise<NextResponse>` e `export const config = { matcher }`.

- [ ] **Step 1: Escrever o teste**

`proxy.test.ts`:

```ts
// @vitest-environment node
import { NextRequest } from 'next/server';

import { buscarVendedorPorCodigo } from '@/lib/crm/referral';
import {
  INDICACAO_COOKIE,
  assinarIndicacao,
  lerIndicacao
} from '@/lib/indicacao/cookie-server';

import proxy from './proxy';
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/utils/logger', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() }
}));
vi.mock('@/lib/crm/referral', async () => {
  const real =
    await vi.importActual<typeof import('@/lib/crm/referral')>(
      '@/lib/crm/referral'
    );
  return { ...real, buscarVendedorPorCodigo: vi.fn() };
});

const vendedor = {
  nome: 'Maria Silva',
  email: 'maria@profills.com.br',
  referral_code: 'MARIA-10',
  contato: '11987654321'
};

function req(url: string, cookie?: string) {
  return new NextRequest(url, {
    headers: cookie ? { cookie: `${INDICACAO_COOKIE}=${cookie}` } : {}
  });
}

beforeAll(() => {
  process.env.INDICACAO_COOKIE_SECRET =
    'segredo-de-teste-com-bytes-suficientes-para-hs256';
});

beforeEach(() => {
  vi.mocked(buscarVendedorPorCodigo).mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('proxy com ?ref', () => {
  it('grava o cookie e redireciona para a URL sem ref, mantendo os outros parâmetros', async () => {
    vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({
      tipo: 'encontrado',
      vendedor
    });
    const res = await proxy(
      req('http://localhost:3000/maquinas?q=pouch&ref=maria-10')
    );

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe(
      'http://localhost:3000/maquinas?q=pouch'
    );
    const payload = await lerIndicacao(
      res.cookies.get(INDICACAO_COOKIE)?.value
    );
    expect(payload).toMatchObject({
      codigo: 'MARIA-10',
      email: 'maria@profills.com.br'
    });
    expect(buscarVendedorPorCodigo).toHaveBeenCalledWith('MARIA-10');
  });

  it('código inválido: redireciona sem consultar e sem cookie', async () => {
    const res = await proxy(req('http://localhost:3000/?ref=ab'));
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('http://localhost:3000/');
    expect(res.cookies.get(INDICACAO_COOKIE)).toBeUndefined();
    expect(buscarVendedorPorCodigo).not.toHaveBeenCalled();
  });

  it('404 ou CRM indisponível: redireciona e não mexe no cookie anterior', async () => {
    for (const tipo of ['nao-encontrado', 'indisponivel'] as const) {
      vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({ tipo });
      const res = await proxy(
        req('http://localhost:3000/?ref=OUTRO-1', 'antigo')
      );
      expect(res.status).toBe(302);
      expect(res.cookies.get(INDICACAO_COOKIE)).toBeUndefined();
    }
  });
});

describe('proxy sem ?ref', () => {
  it('sem cookie: segue sem consultar', async () => {
    const res = await proxy(req('http://localhost:3000/sobre'));
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
    expect(buscarVendedorPorCodigo).not.toHaveBeenCalled();
  });

  it('cookie recente: segue sem consultar', async () => {
    const token = await assinarIndicacao(vendedor, new Date());
    const res = await proxy(req('http://localhost:3000/sobre', token));
    expect(res.status).toBe(200);
    expect(buscarVendedorPorCodigo).not.toHaveBeenCalled();
  });

  it('cookie com mais de 24 h: renova pelo CRM e regrava', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-02T12:00:00Z'));
    const token = await assinarIndicacao(
      vendedor,
      new Date('2026-09-01T11:00:00Z')
    );
    vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({
      tipo: 'encontrado',
      vendedor: { ...vendedor, contato: '11900000000' }
    });

    const res = await proxy(req('http://localhost:3000/sobre', token));

    expect(res.status).toBe(200);
    const payload = await lerIndicacao(
      res.cookies.get(INDICACAO_COOKIE)?.value
    );
    expect(payload).toMatchObject({
      contato: '11900000000',
      consultadoEm: '2026-09-02T12:00:00.000Z'
    });
  });

  it('renovação com 404 apaga o cookie; indisponível mantém', async () => {
    const token = await assinarIndicacao(
      vendedor,
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    );

    vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({
      tipo: 'nao-encontrado'
    });
    const apagado = await proxy(req('http://localhost:3000/sobre', token));
    expect(apagado.cookies.get(INDICACAO_COOKIE)?.value).toBe('');

    vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({
      tipo: 'indisponivel'
    });
    const mantido = await proxy(req('http://localhost:3000/sobre', token));
    expect(mantido.cookies.get(INDICACAO_COOKIE)).toBeUndefined();
  });

  it('cookie com assinatura inválida é apagado', async () => {
    const res = await proxy(
      req('http://localhost:3000/sobre', 'lixo.lixo.lixo')
    );
    expect(res.status).toBe(200);
    expect(res.cookies.get(INDICACAO_COOKIE)?.value).toBe('');
  });

  it('nunca bloqueia a página quando algo lança', async () => {
    const token = await assinarIndicacao(
      vendedor,
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    );
    vi.mocked(buscarVendedorPorCodigo).mockRejectedValue(new Error('boom'));
    const res = await proxy(req('http://localhost:3000/sobre', token));
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `bun run test proxy.test.ts`
Expected: FAIL, `Cannot find module './proxy'`.

- [ ] **Step 3: Implementar o proxy**

`proxy.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';

import { buscarVendedorPorCodigo, normalizarCodigo } from '@/lib/crm/referral';
import {
  INDICACAO_COOKIE,
  assinarIndicacao,
  lerIndicacao,
  opcoesCookieIndicacao,
  precisaRenovar
} from '@/lib/indicacao/cookie-server';
import { logger } from '@/lib/utils/logger';

/* Só rotas de página: API, assets do Next, arquivos com extensão, sitemap,
   robots e a imagem OG ficam de fora. */
export const config = {
  matcher: [
    '/((?!api|_next|sitemap\\.xml|robots\\.txt|opengraph-image|.*\\..*).*)'
  ]
};

async function entrarPorLink(request: NextRequest): Promise<NextResponse> {
  const limpa = request.nextUrl.clone();
  const codigo = normalizarCodigo(limpa.searchParams.get('ref'));
  limpa.searchParams.delete('ref');
  const res = NextResponse.redirect(limpa, 302);

  if (!codigo) return res;

  const busca = await buscarVendedorPorCodigo(codigo);
  if (busca.tipo === 'encontrado') {
    res.cookies.set(
      INDICACAO_COOKIE,
      await assinarIndicacao(busca.vendedor),
      opcoesCookieIndicacao()
    );
  }
  return res;
}

async function renovarSePreciso(request: NextRequest): Promise<NextResponse> {
  const bruto = request.cookies.get(INDICACAO_COOKIE)?.value;
  if (!bruto) return NextResponse.next();

  const atual = await lerIndicacao(bruto);
  if (!atual) {
    const res = NextResponse.next();
    res.cookies.delete(INDICACAO_COOKIE);
    return res;
  }
  if (!precisaRenovar(atual)) return NextResponse.next();

  const busca = await buscarVendedorPorCodigo(atual.codigo);
  const res = NextResponse.next();
  if (busca.tipo === 'encontrado') {
    res.cookies.set(
      INDICACAO_COOKIE,
      await assinarIndicacao(busca.vendedor),
      opcoesCookieIndicacao()
    );
  } else if (busca.tipo === 'nao-encontrado') {
    res.cookies.delete(INDICACAO_COOKIE);
  }
  /* indisponivel: mantém o cookie como está e tenta de novo na próxima. */
  return res;
}

export default async function proxy(request: NextRequest) {
  try {
    if (request.nextUrl.searchParams.has('ref')) {
      return await entrarPorLink(request);
    }
    return await renovarSePreciso(request);
  } catch (erro) {
    logger.error('[indicacao] proxy falhou; página segue sem Indicação', erro);
    return NextResponse.next();
  }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `bun run test proxy.test.ts`
Expected: PASS (9 testes). Se `res.cookies.delete` gravar `Max-Age=0` com valor vazio (comportamento do `ResponseCookies`), o teste `toBe('')` passa; se o Next da versão instalada devolver `undefined` no `get` após `delete`, trocar as duas asserções de "apagado" por `expect(res.headers.get('set-cookie')).toMatch(/profills_indicacao=;.*Max-Age=0/)`.

- [ ] **Step 5: Ver o proxy vivo no dev server**

Com `.env.local` contendo `INDICACAO_COOKIE_SECRET` (qualquer string longa) e `CRM_BASE_URL`/`CRM_EXTERNAL_API_KEY` reais (digitados por quem tem a chave, nunca colados no chat):

```bash
curl -s -o /dev/null -D - "http://localhost:3006/sobre?ref=ab" | grep -iE "^(HTTP|location|set-cookie)"
```

Expected: `HTTP/1.1 302`, `location: /sobre` (ou absoluta), sem `set-cookie`. Com um código real no lugar de `ab`, aparece `set-cookie: profills_indicacao=...; Path=/; Max-Age=2592000; SameSite=Lax`. Sem as envs do CRM, o comportamento é o mesmo do código inválido e o log mostra o aviso do helper.

- [ ] **Step 6: Lint, format e commit**

```bash
bun run lint && bun run prettier --write proxy.ts proxy.test.ts
git add proxy.ts proxy.test.ts
git commit -m "feat(indicacao): proxy captura ?ref e grava cookie"
```

---

### Task 5: Provider e hook de contato comercial

**Files:**

- Create: `components/indicacao/indicacaoProvider.tsx`
- Create: `components/indicacao/useContatoComercial.ts`
- Create: `components/indicacao/useContatoComercial.test.tsx`
- Modify: `app/(site)/layout.tsx`

**Interfaces:**

- Consumes: `lerCookieIndicacaoDoBrowser` de `@/lib/indicacao/cookie-client`; `CONTATO_PADRAO` de `@/lib/data/contatos`; `waLink` de `@/lib/utils/whatsapp`.
- Produces:
  - `IndicacaoProvider({ children })` (client) e `useIndicacao(): EstadoIndicacao` com `type EstadoIndicacao = { status: 'hidratando' } | { status: 'sem-indicacao' } | { status: 'indicado'; vendedor: IndicacaoPayload }`.
  - `useContatoComercial(): { pronto: boolean; email: string; telefone: string; whatsapp: (mensagem: string) => string }` — `telefone` no formato wa.me (só dígitos com DDI).

- [ ] **Step 1: Escrever o teste do hook**

`components/indicacao/useContatoComercial.test.tsx`:

```tsx
import type { ReactNode } from 'react';

import { renderHook } from '@testing-library/react';

import { IndicacaoProvider } from './indicacaoProvider';
import { useContatoComercial } from './useContatoComercial';
import { afterEach, describe, expect, it } from 'vitest';

function jwtFalso(payload: unknown) {
  const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64url');
  return `${b64('{"alg":"HS256"}')}.${b64(JSON.stringify(payload))}.x`;
}

function setCookie(payload: unknown) {
  document.cookie = `profills_indicacao=${jwtFalso(payload)}; path=/`;
}

function wrapper({ children }: { children: ReactNode }) {
  return <IndicacaoProvider>{children}</IndicacaoProvider>;
}

const base = {
  codigo: 'MARIA-10',
  nome: 'Maria Silva',
  email: 'maria@profills.com.br',
  consultadoEm: '2026-09-02T12:00:00.000Z'
};

afterEach(() => {
  document.cookie = 'profills_indicacao=; max-age=0; path=/';
});

describe('useContatoComercial', () => {
  it('sem cookie: contatos padrão, pronto', () => {
    const { result } = renderHook(() => useContatoComercial(), { wrapper });
    expect(result.current.pronto).toBe(true);
    expect(result.current.email).toBe('comercial@profillsdobrasil.com.br');
    expect(result.current.telefone).toBe('5541997851998');
    expect(result.current.whatsapp('Oi')).toBe(
      'https://wa.me/5541997851998?text=Oi'
    );
  });

  it('com cookie e telefone: tudo do vendedor', () => {
    setCookie({ ...base, contato: '11987654321' });
    const { result } = renderHook(() => useContatoComercial(), { wrapper });
    expect(result.current.pronto).toBe(true);
    expect(result.current.email).toBe('maria@profills.com.br');
    expect(result.current.telefone).toBe('5511987654321');
    expect(result.current.whatsapp('Oi')).toBe(
      'https://wa.me/5511987654321?text=Oi'
    );
  });

  it('com cookie sem telefone: e-mail do vendedor, telefone padrão', () => {
    setCookie({ ...base, contato: null });
    const { result } = renderHook(() => useContatoComercial(), { wrapper });
    expect(result.current.email).toBe('maria@profills.com.br');
    expect(result.current.telefone).toBe('5541997851998');
  });

  it('fora do provider: padrão, pronto (landings standalone)', () => {
    const { result } = renderHook(() => useContatoComercial());
    expect(result.current.pronto).toBe(true);
    expect(result.current.email).toBe('comercial@profillsdobrasil.com.br');
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `bun run test components/indicacao`
Expected: FAIL, módulos inexistentes.

- [ ] **Step 3: Implementar o Provider**

`components/indicacao/indicacaoProvider.tsx`:

```tsx
'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

import { lerCookieIndicacaoDoBrowser } from '@/lib/indicacao/cookie-client';
import type { IndicacaoPayload } from '@/lib/indicacao/tipos';

export type EstadoIndicacao =
  | { status: 'hidratando' }
  | { status: 'sem-indicacao' }
  | { status: 'indicado'; vendedor: IndicacaoPayload };

const HIDRATANDO: EstadoIndicacao = { status: 'hidratando' };
const SEM_INDICACAO: EstadoIndicacao = { status: 'sem-indicacao' };

const IndicacaoContext = createContext<EstadoIndicacao>(SEM_INDICACAO);

/* useSyncExternalStore exige snapshot estável: cacheia por string do cookie. */
let ultimoCookie: string | null = null;
let ultimoEstado: EstadoIndicacao = SEM_INDICACAO;

function lerEstado(): EstadoIndicacao {
  const cookie = document.cookie;
  if (cookie === ultimoCookie) return ultimoEstado;
  const vendedor = lerCookieIndicacaoDoBrowser(cookie);
  ultimoCookie = cookie;
  ultimoEstado = vendedor ? { status: 'indicado', vendedor } : SEM_INDICACAO;
  return ultimoEstado;
}

/* O cookie só muda por navegação completa (o proxy redireciona), então não
   há evento para assinar: o snapshot é relido a cada render. */
function assinar() {
  return () => {};
}

function estadoServidor() {
  return HIDRATANDO;
}

export function IndicacaoProvider({ children }: { children: ReactNode }) {
  const estado = useSyncExternalStore(assinar, lerEstado, estadoServidor);
  return (
    <IndicacaoContext.Provider value={estado}>
      {children}
    </IndicacaoContext.Provider>
  );
}

/** Fora do Provider (grupo standalone) devolve sem-indicacao. */
export function useIndicacao(): EstadoIndicacao {
  return useContext(IndicacaoContext);
}
```

- [ ] **Step 4: Implementar o hook**

`components/indicacao/useContatoComercial.ts`:

```ts
'use client';

import { CONTATO_PADRAO } from '@/lib/data/contatos';
import { waLink } from '@/lib/utils/whatsapp';

import { useIndicacao } from './indicacaoProvider';

export type ContatoComercial = {
  /** false só enquanto o browser ainda não leu o cookie (hidratação). */
  pronto: boolean;
  email: string;
  /** Só dígitos com DDI, pronto para wa.me. */
  telefone: string;
  whatsapp: (mensagem: string) => string;
};

/**
 * Contato comercial a exibir: o do vendedor quando há Indicação, o padrão
 * caso contrário. Vendedor sem telefone usa o telefone padrão.
 */
export function useContatoComercial(): ContatoComercial {
  const estado = useIndicacao();

  let email: string = CONTATO_PADRAO.vendas.email;
  let telefone: string = CONTATO_PADRAO.vendas.telefone;

  if (estado.status === 'indicado') {
    email = estado.vendedor.email;
    if (estado.vendedor.contato) telefone = `55${estado.vendedor.contato}`;
  }

  return {
    pronto: estado.status !== 'hidratando',
    email,
    telefone,
    whatsapp: (mensagem: string) => waLink(telefone, mensagem)
  };
}
```

- [ ] **Step 5: Montar o Provider no layout do (site)**

`app/(site)/layout.tsx` (arquivo inteiro):

```tsx
import { IndicacaoProvider } from '@/components/indicacao/indicacaoProvider';
import Footer from '@/components/layout/footer';
import NavbarDesktop from '@/components/layout/navbarDesktop';
import NavbarMobile from '@/components/layout/navbarMobile';

export default function SiteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <IndicacaoProvider>
      <NavbarDesktop />
      <NavbarMobile />
      <main id='main-content' className='relative h-full w-full'>
        {children}
      </main>
      <Footer />
    </IndicacaoProvider>
  );
}
```

- [ ] **Step 6: Rodar e ver passar**

Run: `bun run test components/indicacao`
Expected: PASS (4 testes). Em jsdom, `renderHook` já hidrata no cliente, então o primeiro `result.current` vem do snapshot do cliente.

- [ ] **Step 7: Lint, format e commit**

```bash
bun run lint && bun run prettier --write components/indicacao "app/(site)/layout.tsx"
git add components/indicacao "app/(site)/layout.tsx"
git commit -m "feat(indicacao): provider e hook de contato"
```

---

### Task 6: Footer e hero usam o contato comercial

**Files:**

- Modify: `components/layout/footer.tsx`
- Create: `components/layout/footer.test.tsx`
- Modify: `app/(site)/(home)/_components/heroCarrossel/heroSlideCopy.tsx`

**Interfaces:**

- Consumes: `useContatoComercial` de `@/components/indicacao/useContatoComercial`; `IndicacaoProvider` (só no teste).

- [ ] **Step 1: Escrever o teste do footer**

`components/layout/footer.test.tsx`:

```tsx
import { IndicacaoProvider } from '@/components/indicacao/indicacaoProvider';
import { render, screen } from '@testing-library/react';

import Footer from './footer';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/ui/blur-fade', () => ({
  BlurFade: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));
vi.mock('./gridPatternBg', () => ({ GridPattern: () => null }));

function jwtFalso(payload: unknown) {
  const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64url');
  return `${b64('{"alg":"HS256"}')}.${b64(JSON.stringify(payload))}.x`;
}

afterEach(() => {
  document.cookie = 'profills_indicacao=; max-age=0; path=/';
});

function renderFooter() {
  return render(
    <IndicacaoProvider>
      <Footer />
    </IndicacaoProvider>
  );
}

describe('Footer', () => {
  it('sem Indicação mostra os contatos padrão nos três cards', () => {
    renderFooter();
    expect(
      screen.getByText('comercial@profillsdobrasil.com.br')
    ).toBeInTheDocument();
    expect(
      screen.getByText('suporte@profillsdobrasil.com.br')
    ).toBeInTheDocument();
    const vendas = screen.getByLabelText(
      'Conversar no WhatsApp com Vendas/Peças'
    );
    expect(vendas).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me/5541997851998')
    );
  });

  it('com Indicação troca só o card Vendas/Peças', () => {
    document.cookie = `profills_indicacao=${jwtFalso({
      codigo: 'MARIA-10',
      nome: 'Maria Silva',
      email: 'maria@profills.com.br',
      contato: '11987654321',
      consultadoEm: '2026-09-02T12:00:00.000Z'
    })}; path=/`;
    renderFooter();

    expect(screen.getByText('maria@profills.com.br')).toHaveAttribute(
      'href',
      'mailto:maria@profills.com.br'
    );
    expect(screen.queryByText('comercial@profillsdobrasil.com.br')).toBeNull();
    expect(
      screen.getByLabelText('Conversar no WhatsApp com Vendas/Peças')
    ).toHaveAttribute('href', expect.stringContaining('wa.me/5511987654321'));
    expect(
      screen.getByLabelText(
        'Conversar no WhatsApp com Suporte e Assistência Técnica'
      )
    ).toHaveAttribute('href', expect.stringContaining('wa.me/5541997851998'));
    expect(
      screen.getByText('suporte@profillsdobrasil.com.br')
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `bun run test components/layout/footer.test.tsx`
Expected: o segundo teste FALHA (`maria@profills.com.br` não aparece).

- [ ] **Step 3: Reescrever o card Vendas/Peças no footer**

Em `components/layout/footer.tsx`:

1. Adicionar `import { useContatoComercial } from '@/components/indicacao/useContatoComercial';`.
2. Remover o objeto `Vendas/Peças` do array `contacts` (o array fica só com Suporte e Compras) e renomear o array para `contatosFixos`.
3. Dentro de `Footer()`, logo após os hooks existentes, adicionar:

```tsx
const comercial = useContatoComercial();
const cardVendas = {
  title: 'Vendas/Peças',
  icon: Phone,
  links: [
    {
      href: `mailto:${comercial.email}`,
      icon: Mail,
      label: comercial.email
    },
    {
      href: comercial.whatsapp(
        'Olá! Vim pelo site da Profills e quero falar com Vendas/Peças.'
      ),
      icon: WhatsAppIcon,
      label: 'Conversar no WhatsApp',
      ariaLabel: 'Conversar no WhatsApp com Vendas/Peças',
      external: true
    }
  ]
};
const contacts = [cardVendas, ...contatosFixos];
```

4. No `map` dos links do card, trocar o `<Link key={href} href={href} ...>` por um `<a>` que respeita `comercial.pronto` só no card de Vendas. Substituir o bloco `contact.links.map(...)` inteiro por:

```tsx
{
  contact.links.map(({ href, icon: LinkIcon, label, ariaLabel, external }) => {
    const aguardando = contact.title === 'Vendas/Peças' && !comercial.pronto;
    return (
      <a
        key={ariaLabel ?? label}
        href={aguardando ? undefined : href}
        aria-label={ariaLabel}
        aria-disabled={aguardando || undefined}
        {...(external &&
          !aguardando && {
            target: '_blank',
            rel: 'noopener noreferrer'
          })}
        className='group/link flex items-center gap-2 text-[#b6c5e2] transition-colors hover:text-accent md:gap-3'>
        <LinkIcon className='h-4 w-4 text-accent/60 transition-colors group-hover/link:text-accent md:h-4 md:w-4' />
        <span className='min-h-4 text-xs font-medium md:text-sm'>
          {aguardando && label.includes('@') ? '' : label}
        </span>
      </a>
    );
  });
}
```

5. Remover o import de `Link` se ele ficar sem uso nos cards (ele continua usado no logo e no "Conheça também", então fica).

- [ ] **Step 4: Trocar o link do hero**

Em `app/(site)/(home)/_components/heroCarrossel/heroSlideCopy.tsx`:

1. Remover a constante `WHATSAPP_URL` e o import de `WHATSAPP_VENDAS`/`waLink` adicionados na Task 2.
2. Adicionar `import { useContatoComercial } from '@/components/indicacao/useContatoComercial';`.
3. Dentro do componente `HeroSlideCopy`, antes de montar `conteudo`, adicionar:

```tsx
const comercial = useContatoComercial();
const whatsappUrl = comercial.whatsapp(
  'Olá! Vim pelo site da Profills e quero falar com um especialista.'
);
```

4. Trocar o `<a href={WHATSAPP_URL} ...>` por:

```tsx
<a
  href={comercial.pronto ? whatsappUrl : undefined}
  aria-disabled={!comercial.pronto || undefined}
  {...(comercial.pronto && {
    target: '_blank',
    rel: 'noopener noreferrer'
  })}
  className='mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#b6c5e2] transition-colors hover:text-white'>
  <WhatsAppIcon className='size-4 text-[#25d366]' />
  Falar com um especialista
</a>
```

- [ ] **Step 5: Rodar tudo e ver passar**

Run: `bun run test`
Expected: PASS. Se algum teste existente do hero renderizar `HeroSlideCopy` fora do Provider, ele continua passando: fora do Provider o hook devolve o padrão com `pronto = true`.

- [ ] **Step 6: Conferir no browser**

Com o dev server na porta 3006: abrir `http://localhost:3006/` sem cookie e confirmar no rodapé `comercial@profillsdobrasil.com.br` e o link do WhatsApp com `5541997851998`. Depois, no DevTools > Application > Cookies, criar `profills_indicacao` com o valor de um JWT falso (mesmo formato do teste, gerado com `node -e` a partir do `jwtFalso` acima) e recarregar: o card Vendas/Peças mostra o e-mail do vendedor e o `href` do WhatsApp muda; Suporte e Compras seguem iguais; o link do hero aponta para o número do vendedor.

- [ ] **Step 7: Lint, format e commit**

```bash
bun run lint && bun run prettier --write components/layout/footer.tsx components/layout/footer.test.tsx "app/(site)/(home)/_components/heroCarrossel/heroSlideCopy.tsx"
git add components/layout/footer.tsx components/layout/footer.test.tsx "app/(site)/(home)/_components/heroCarrossel/heroSlideCopy.tsx"
git commit -m "feat(indicacao): footer e hero usam contato do vendedor"
```

---

### Task 7: `BotaoEspecialista` nas fichas de máquina

**Files:**

- Create: `components/indicacao/botaoEspecialista.tsx`
- Create: `components/indicacao/botaoEspecialista.test.tsx`
- Modify: `app/(site)/maquinas/[slug]/page.tsx:9,118-127`
- Modify: `app/(site)/maquinas/[slug]/_components/conversao.tsx:3,24-30`

**Interfaces:**

- Consumes: `useContatoComercial`.
- Produces: `BotaoEspecialista({ mensagem, className }: { mensagem: string; className: string })` (client), renderiza `<a>` com o texto "Falar com um especialista".

- [ ] **Step 1: Escrever o teste**

`components/indicacao/botaoEspecialista.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';

import { BotaoEspecialista } from './botaoEspecialista';
import { IndicacaoProvider } from './indicacaoProvider';
import { afterEach, describe, expect, it } from 'vitest';

function jwtFalso(payload: unknown) {
  const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64url');
  return `${b64('{"alg":"HS256"}')}.${b64(JSON.stringify(payload))}.x`;
}

afterEach(() => {
  document.cookie = 'profills_indicacao=; max-age=0; path=/';
});

describe('BotaoEspecialista', () => {
  it('sem Indicação aponta para o número padrão com a mensagem', () => {
    render(
      <IndicacaoProvider>
        <BotaoEspecialista
          mensagem='Olá! Tenho interesse na X.'
          className='btn'
        />
      </IndicacaoProvider>
    );
    const link = screen.getByRole('link', {
      name: 'Falar com um especialista'
    });
    expect(link).toHaveAttribute(
      'href',
      'https://wa.me/5541997851998?text=Ol%C3%A1!%20Tenho%20interesse%20na%20X.'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveClass('btn');
  });

  it('com Indicação aponta para o vendedor', () => {
    document.cookie = `profills_indicacao=${jwtFalso({
      codigo: 'MARIA-10',
      nome: 'Maria',
      email: 'maria@profills.com.br',
      contato: '11987654321',
      consultadoEm: '2026-09-02T12:00:00.000Z'
    })}; path=/`;
    render(
      <IndicacaoProvider>
        <BotaoEspecialista mensagem='Oi' className='btn' />
      </IndicacaoProvider>
    );
    expect(
      screen.getByRole('link', { name: 'Falar com um especialista' })
    ).toHaveAttribute('href', 'https://wa.me/5511987654321?text=Oi');
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `bun run test components/indicacao/botaoEspecialista.test.tsx`
Expected: FAIL, módulo inexistente.

- [ ] **Step 3: Implementar o botão**

`components/indicacao/botaoEspecialista.tsx`:

```tsx
'use client';

import { useContatoComercial } from './useContatoComercial';

/**
 * "Falar com um especialista" das fichas de máquina. Client Component para
 * que a página (SSG) continue estática e só este link troque com a Indicação.
 */
export function BotaoEspecialista({
  mensagem,
  className
}: {
  mensagem: string;
  className: string;
}) {
  const comercial = useContatoComercial();

  return (
    <a
      href={comercial.pronto ? comercial.whatsapp(mensagem) : undefined}
      aria-disabled={!comercial.pronto || undefined}
      {...(comercial.pronto && {
        target: '_blank',
        rel: 'noopener noreferrer'
      })}
      className={className}>
      Falar com um especialista
    </a>
  );
}
```

- [ ] **Step 4: Usar nas duas fichas**

`app/(site)/maquinas/[slug]/page.tsx`: trocar `import { WHATSAPP_VENDAS, waLink } from '@/lib/utils/whatsapp';` por `import { BotaoEspecialista } from '@/components/indicacao/botaoEspecialista';` e substituir o bloco

```tsx
<a
  href={waLink(WHATSAPP_VENDAS, `Olá! Tenho interesse na ${maquina.nome}.`)}
  target='_blank'
  rel='noopener noreferrer'
  className='text-muted-foreground hover:text-foreground inline-flex h-12 items-center rounded-xs border border-[rgba(148,178,235,0.4)] px-6 text-sm font-semibold transition-colors'>
  Falar com um especialista
</a>
```

por

```tsx
<BotaoEspecialista
  mensagem={`Olá! Tenho interesse na ${maquina.nome}.`}
  className='text-muted-foreground hover:text-foreground inline-flex h-12 items-center rounded-xs border border-[rgba(148,178,235,0.4)] px-6 text-sm font-semibold transition-colors'
/>
```

`app/(site)/maquinas/[slug]/_components/conversao.tsx`: trocar o import de `@/lib/utils/whatsapp` por `import { BotaoEspecialista } from '@/components/indicacao/botaoEspecialista';` e substituir o `<a href={waLink(WHATSAPP_VENDAS, mensagem)} ...>Falar com um especialista</a>` por

```tsx
<BotaoEspecialista
  mensagem={mensagem}
  className='text-muted-foreground hover:text-foreground inline-flex h-12 items-center rounded-xs border border-[rgba(148,178,235,0.4)] px-6 font-semibold transition-colors'
/>
```

- [ ] **Step 5: Rodar tudo, e conferir que a ficha segue estática**

Run: `bun run test`
Expected: PASS.

Run: `bun run build 2>&1 | grep -E "maquinas/\[slug\]|○|●|ƒ" | head`
Expected: a rota `/maquinas/[slug]` continua marcada como estática (`●` SSG), não `ƒ` dinâmica.

- [ ] **Step 6: Lint, format e commit**

```bash
bun run lint && bun run prettier --write components/indicacao "app/(site)/maquinas/[slug]/page.tsx" "app/(site)/maquinas/[slug]/_components/conversao.tsx"
git add components/indicacao "app/(site)/maquinas/[slug]/page.tsx" "app/(site)/maquinas/[slug]/_components/conversao.tsx"
git commit -m "feat(indicacao): CTA das máquinas usa o vendedor"
```

---

### Task 8: `resolverDestinatario` (server)

**Files:**

- Create: `lib/indicacao/destinatario.ts`
- Create: `lib/indicacao/destinatario.test.ts`

**Interfaces:**

- Consumes: `lerIndicacao`, `INDICACAO_COOKIE` de `./cookie-server`; `buscarVendedorPorCodigo` de `@/lib/crm/referral`.
- Produces: `type Destinatario = { para: string; vendedor: VendedorIndicacao | null }` e `resolverDestinatario(request: NextRequest): Promise<Destinatario>`. Task 9 e Task 10 dependem exatamente desses nomes.

- [ ] **Step 1: Escrever o teste**

`lib/indicacao/destinatario.test.ts`:

```ts
// @vitest-environment node
import { NextRequest } from 'next/server';

import { buscarVendedorPorCodigo } from '@/lib/crm/referral';

import { INDICACAO_COOKIE, assinarIndicacao } from './cookie-server';
import { resolverDestinatario } from './destinatario';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/utils/logger', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() }
}));
vi.mock('@/lib/crm/referral', () => ({ buscarVendedorPorCodigo: vi.fn() }));

const vendedor = {
  nome: 'Maria Silva',
  email: 'maria@profills.com.br',
  referral_code: 'MARIA-10',
  contato: '11987654321'
};

function req(cookie?: string) {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: cookie ? { cookie: `${INDICACAO_COOKIE}=${cookie}` } : {}
  });
}

beforeAll(() => {
  process.env.INDICACAO_COOKIE_SECRET =
    'segredo-de-teste-com-bytes-suficientes-para-hs256';
  process.env.GMAIL_USER_RECEIVER = 'caixa@profills.test';
});

beforeEach(() => {
  vi.mocked(buscarVendedorPorCodigo).mockReset();
});

describe('resolverDestinatario', () => {
  it('sem cookie: caixa padrão, sem consultar o CRM', async () => {
    await expect(resolverDestinatario(req())).resolves.toEqual({
      para: 'caixa@profills.test',
      vendedor: null
    });
    expect(buscarVendedorPorCodigo).not.toHaveBeenCalled();
  });

  it('cookie válido e CRM 200: e-mail do vendedor', async () => {
    vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({
      tipo: 'encontrado',
      vendedor
    });
    const token = await assinarIndicacao(vendedor);
    await expect(resolverDestinatario(req(token))).resolves.toEqual({
      para: 'maria@profills.com.br',
      vendedor
    });
    expect(buscarVendedorPorCodigo).toHaveBeenCalledWith('MARIA-10');
  });

  it('cookie válido mas CRM 404 ou indisponível: caixa padrão', async () => {
    const token = await assinarIndicacao(vendedor);
    for (const tipo of ['nao-encontrado', 'indisponivel'] as const) {
      vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({ tipo });
      await expect(resolverDestinatario(req(token))).resolves.toEqual({
        para: 'caixa@profills.test',
        vendedor: null
      });
    }
  });

  it('cookie adulterado: caixa padrão, sem consultar', async () => {
    await expect(resolverDestinatario(req('a.b.c'))).resolves.toEqual({
      para: 'caixa@profills.test',
      vendedor: null
    });
    expect(buscarVendedorPorCodigo).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `bun run test lib/indicacao/destinatario.test.ts`
Expected: FAIL, módulo inexistente.

- [ ] **Step 3: Implementar**

`lib/indicacao/destinatario.ts`:

```ts
import type { NextRequest } from 'next/server';

import { buscarVendedorPorCodigo } from '@/lib/crm/referral';

import { INDICACAO_COOKIE, lerIndicacao } from './cookie-server';
import type { VendedorIndicacao } from './tipos';
import 'server-only';

export type Destinatario = {
  /** E-mail que recebe o Lead. */
  para: string;
  /** Vendedor da Indicação, ou null quando o Lead vai para a Caixa padrão. */
  vendedor: VendedorIndicacao | null;
};

/**
 * Decide para quem vai o Lead: o vendedor do cookie, revalidado no CRM, ou a
 * Caixa padrão (GMAIL_USER_RECEIVER) em qualquer outro caso.
 */
export async function resolverDestinatario(
  request: NextRequest
): Promise<Destinatario> {
  const padrao: Destinatario = {
    para: process.env.GMAIL_USER_RECEIVER!,
    vendedor: null
  };

  const payload = await lerIndicacao(
    request.cookies.get(INDICACAO_COOKIE)?.value
  );
  if (!payload) return padrao;

  const busca = await buscarVendedorPorCodigo(payload.codigo);
  if (busca.tipo !== 'encontrado') return padrao;

  return { para: busca.vendedor.email, vendedor: busca.vendedor };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `bun run test lib/indicacao/destinatario.test.ts`
Expected: PASS (4 testes).

- [ ] **Step 5: Lint, format e commit**

```bash
bun run lint && bun run prettier --write lib/indicacao/destinatario.ts lib/indicacao/destinatario.test.ts
git add lib/indicacao/destinatario.ts lib/indicacao/destinatario.test.ts
git commit -m "feat(indicacao): destinatário do lead pelo cookie"
```

---

### Task 9: Funções de envio recebem o destinatário

**Files:**

- Modify: `lib/emails/contact-form/email-contact.ts:90-141`
- Modify: `lib/emails/contact-form/email-template.ts` (após a linha do `{{timestamp}}`, ~301)
- Modify: `lib/emails/montar-maquina/email-montar-maquina.ts:104`, `lib/emails/montar-maquina/email-template.ts`
- Modify: `lib/emails/monte-fabrica/email-monte-fabrica.ts:114`, `lib/emails/monte-fabrica/email-template.ts`
- Modify: `lib/emails/solicitar-especificacoes/email-especificacoes.ts:102`, `lib/emails/solicitar-especificacoes/email-template.ts`
- Modify: `lib/emails/catalog-request/email-catalog.ts:66-95`, `lib/emails/catalog-request/email-template-internal.ts:33`
- Create: `lib/emails/destinatario.test.ts`

**Interfaces:**

- Consumes: `Destinatario` de `@/lib/indicacao/destinatario`.
- Produces: as cinco funções passam a ter um segundo parâmetro obrigatório:
  - `sendContactEmail(data: ContactFormData, destinatario: Destinatario)`
  - `sendMontarMaquinaEmail(data, destinatario: Destinatario)`
  - `sendMonteFabricaEmail(data, destinatario: Destinatario)`
  - `sendSpecificationEmail(data, destinatario: Destinatario)`
  - `sendLeadNotification(data: CatalogRequestData, destinatario: Destinatario)`
  - Cada uma usa `to: destinatario.para` e passa `indicadoPor` ao template (string vazia quando `vendedor` é null).

- [ ] **Step 1: Escrever o teste**

`lib/emails/destinatario.test.ts`:

```ts
// @vitest-environment node
import { sendLeadNotification } from '@/lib/emails/catalog-request/email-catalog';
import { sendContactEmail } from '@/lib/emails/contact-form/email-contact';
import { sendMontarMaquinaEmail } from '@/lib/emails/montar-maquina/email-montar-maquina';
import { sendMonteFabricaEmail } from '@/lib/emails/monte-fabrica/email-monte-fabrica';
import { sendSpecificationEmail } from '@/lib/emails/solicitar-especificacoes/email-especificacoes';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendMail = vi.fn().mockResolvedValue({ messageId: 'id' });

vi.mock('@/lib/emails/_shared/transporter', () => ({
  createTransporter: () => ({ sendMail })
}));
vi.mock('nodemailer', () => ({
  default: { createTransport: () => ({ sendMail }) },
  createTransport: () => ({ sendMail })
}));
vi.mock('@/lib/utils/logger', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() }
}));

const vendedor = {
  nome: 'Maria Silva',
  email: 'maria@profills.com.br',
  referral_code: 'MARIA-10',
  contato: null
};
const paraVendedor = { para: 'maria@profills.com.br', vendedor };
const paraCaixa = { para: 'caixa@profills.test', vendedor: null };

const casos = [
  {
    nome: 'contact',
    enviar: (d: typeof paraCaixa) =>
      sendContactEmail(
        {
          email: 'lead@x.com',
          phone: '(41) 99999-9999',
          cep: '80010-000',
          street: 'Rua',
          number: '1',
          complement: '',
          neighborhood: 'Centro',
          city: 'Curitiba',
          state: 'PR',
          material: 'aco-inox',
          service: 'corte',
          finish: 'polido',
          details: 'x'
        } as never,
        d
      )
  },
  {
    nome: 'montar-maquina',
    enviar: (d: typeof paraCaixa) =>
      sendMontarMaquinaEmail(
        {
          nome: 'Lead',
          email: 'lead@x.com',
          empresa: 'E',
          contato: '(41) 99999-9999',
          detalhes: 'x',
          selectedPackaging: 'Sachê',
          selectedProductType: 'Líquido'
        } as never,
        d
      )
  },
  {
    nome: 'monte-fabrica',
    enviar: (d: typeof paraCaixa) =>
      sendMonteFabricaEmail(
        {
          nome: 'Lead',
          email: 'lead@x.com',
          telefone: '(41) 99999-9999',
          empresa: 'E',
          mensagem: 'x'
        } as never,
        d
      )
  },
  {
    nome: 'specifications',
    enviar: (d: typeof paraCaixa) =>
      sendSpecificationEmail(
        {
          nome: 'Lead',
          email: 'lead@x.com',
          telefone: '(41) 99999-9999',
          empresa: 'E',
          maquinaSlug: 'x',
          maquinaNome: 'X',
          observacoes: ''
        } as never,
        d
      )
  },
  {
    nome: 'catalog',
    enviar: (d: typeof paraCaixa) =>
      sendLeadNotification(
        {
          name: 'Lead',
          document: '000',
          phone: '(41) 99999-9999',
          email: 'lead@x.com'
        } as never,
        d
      )
  }
];

beforeEach(() => {
  sendMail.mockClear();
  process.env.GMAIL_USER_SENDER = 'site@profills.test';
});

describe.each(casos)('envio $nome', ({ enviar }) => {
  it('manda para o vendedor e marca "Indicado por"', async () => {
    await enviar(paraVendedor);
    const opts = sendMail.mock.calls[0][0];
    expect(opts.to).toBe('maria@profills.com.br');
    expect(opts.html).toContain('Indicado por');
    expect(opts.html).toContain('Maria Silva (MARIA-10)');
    expect(opts.text).toContain('Indicado por: Maria Silva (MARIA-10)');
  });

  it('manda para a caixa padrão sem "Indicado por"', async () => {
    await enviar(paraCaixa);
    const opts = sendMail.mock.calls[0][0];
    expect(opts.to).toBe('caixa@profills.test');
    expect(opts.html).not.toContain('Indicado por');
    expect(opts.text).not.toContain('Indicado por');
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `bun run test lib/emails/destinatario.test.ts`
Expected: FAIL (`to` ainda vem de `GMAIL_USER_RECEIVER`, undefined no teste, e o HTML não tem "Indicado por"). Se algum módulo lançar por falta de env do Gmail no `import`, ler o `createTransporter` local daquele módulo e mockar `nodemailer` como acima já cobre.

- [ ] **Step 3: Alterar `sendContactEmail`**

Em `lib/emails/contact-form/email-contact.ts`:

1. `import type { Destinatario } from '@/lib/indicacao/destinatario';` (import de tipo, não puxa `server-only` para o teste).
2. `createContactEmailTemplate` recebe `(data: ContactFormData, indicadoPor = '')` e inclui `indicadoPor` em `templateData`.
3. `sendContactEmail` vira:

```ts
export const sendContactEmail = async (
  data: ContactFormData,
  destinatario: Destinatario
) => {
  const transporter = createTransporter();
  const projectDetails = formatProjectDetails(data);
  const indicadoPor = destinatario.vendedor
    ? `${destinatario.vendedor.nome} (${destinatario.vendedor.referral_code})`
    : '';

  const mailOptions = {
    from: { name: 'Site Profills', address: process.env.GMAIL_USER_SENDER! },
    to: destinatario.para,
    subject: `Orçamento - ${projectDetails.material[0]} (${projectDetails.service[0]}) - ${data.email}`,
    html: createContactEmailTemplate(data, indicadoPor),
    text: `
Nova Solicitação de Orçamento - Profills
${indicadoPor ? `\nIndicado por: ${indicadoPor}\n` : ''}
Data/Hora: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
… (resto do texto como está)
```

4. Em `lib/emails/contact-form/email-template.ts`, logo depois do bloco `{{#if timestamp}} … {{/if}}`, adicionar:

```html
{{#if indicadoPor}}
<div class="timestamp fallback-font">Indicado por: {{indicadoPor}}</div>
{{/if}}
```

- [ ] **Step 4: Repetir nos outros quatro envios**

Mesma mudança, com os nomes de cada arquivo:

`lib/emails/montar-maquina/email-montar-maquina.ts`: `sendMontarMaquinaEmail(data, destinatario: Destinatario)`; calcular `indicadoPor` como acima; `to: destinatario.para`; passar `indicadoPor` no objeto de dados do template (o `renderTemplate` local aceita chaves extras); no `text`, inserir `${indicadoPor ? `\nIndicado por: ${indicadoPor}\n` : ''}` logo após a primeira linha do título. Em `lib/emails/montar-maquina/email-template.ts`, adicionar o bloco `{{#if indicadoPor}}…{{/if}}` após o bloco do `{{timestamp}}`.

`lib/emails/monte-fabrica/email-monte-fabrica.ts` e `email-template.ts`: idem, na função `sendMonteFabricaEmail`.

`lib/emails/solicitar-especificacoes/email-especificacoes.ts` e `email-template.ts`: idem, na função `sendSpecificationEmail`.

`lib/emails/catalog-request/email-catalog.ts`: `sendLeadNotification(data: CatalogRequestData, destinatario: Destinatario)`; `to: destinatario.para`; passar `indicadoPor` ao template; no array de linhas do texto (linha ~83, onde está `` `Documento: ${data.document}` ``), acrescentar `...(indicadoPor ? [`Indicado por: ${indicadoPor}`] : [])`. Em `email-template-internal.ts`, depois da linha `<tr><td class="label">Data/Hora</td><td>{{timestamp}}</td></tr>`, adicionar:

```html
{{#if indicadoPor}}
<tr>
  <td class="label">Indicado por</td>
  <td>{{indicadoPor}}</td>
</tr>
{{/if}}
```

`sendClientCatalogEmail` não muda.

- [ ] **Step 5: Rodar e ver passar**

Run: `bun run test lib/emails/destinatario.test.ts`
Expected: PASS (10 testes). O TypeScript vai acusar os 5 route handlers, que ainda chamam as funções com um argumento; Task 10 corrige. Não rodar `bun run lint` com `tsc` aqui; o commit desta task é só de `lib/emails`.

- [ ] **Step 6: Format e commit**

```bash
bun run prettier --write lib/emails
git add lib/emails
git commit -m "feat(indicacao): envios recebem o destinatário"
```

---

### Task 10: Route handlers escolhem o destinatário

**Files:**

- Modify: `app/api/contact/route.ts:3-15`
- Modify: `app/api/montar-maquina/route.ts`
- Modify: `app/api/monte-fabrica/route.ts`
- Modify: `app/api/specifications/route.ts`
- Modify: `app/api/download-catalog/route.ts:184-191`
- Modify: `app/api/__tests__/rotas-email.test.ts`

**Interfaces:**

- Consumes: `resolverDestinatario(request)` de `@/lib/indicacao/destinatario`; as assinaturas novas da Task 9.

- [ ] **Step 1: Atualizar o teste das rotas**

Em `app/api/__tests__/rotas-email.test.ts`:

1. Adicionar o mock, junto dos outros:

```ts
vi.mock('@/lib/indicacao/destinatario', () => ({
  resolverDestinatario: vi.fn()
}));
```

2. Importar `import { resolverDestinatario } from '@/lib/indicacao/destinatario';`.
3. No `beforeEach`, adicionar:

```ts
vi.mocked(resolverDestinatario).mockReset();
vi.mocked(resolverDestinatario).mockResolvedValue({
  para: 'maria@profills.com.br',
  vendedor: {
    nome: 'Maria',
    email: 'maria@profills.com.br',
    referral_code: 'MARIA-10',
    contato: null
  }
});
```

4. No teste "responde 200 quando o e-mail é enviado", trocar `expect(sendMock).toHaveBeenCalledTimes(1);` por:

```ts
expect(sendMock).toHaveBeenCalledTimes(1);
expect(sendMock).toHaveBeenCalledWith(
  expect.objectContaining({ email: 'teste@example.com' }),
  expect.objectContaining({ para: 'maria@profills.com.br' })
);
```

5. Adicionar um teste novo para o catálogo no fim do arquivo:

```ts
import { sendLeadNotification } from '@/lib/emails/catalog-request/email-catalog';

import { POST as postCatalogo } from '../download-catalog/route';

vi.mock('@/lib/emails/catalog-request/email-catalog', () => ({
  sendClientCatalogEmail: vi.fn().mockResolvedValue(undefined),
  sendLeadNotification: vi.fn().mockResolvedValue(undefined)
}));
vi.mock('@/lib/utils/jwt-catalog', () => ({
  signCatalogToken: vi.fn().mockResolvedValue('token')
}));

describe('POST /api/download-catalog', () => {
  it('manda a notificação interna para o destinatário resolvido', async () => {
    const res = await postCatalogo(
      req({
        name: 'Teste',
        document: '12345678909',
        phone: '(41) 99999-9999',
        email: 'teste@example.com'
      })
    );
    expect(res.status).toBe(200);
    expect(sendLeadNotification).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'teste@example.com' }),
      expect.objectContaining({ para: 'maria@profills.com.br' })
    );
  });
});
```

(Os `vi.mock` são içados pelo Vitest, então podem ficar no fim do arquivo; se o `document` do payload for rejeitado pelo schema, usar um CPF válido gerado por `lib/utils/validate-document.test.ts`.)

- [ ] **Step 2: Rodar e ver falhar**

Run: `bun run test app/api/__tests__/rotas-email.test.ts`
Expected: FAIL nos `toHaveBeenCalledWith` (segundo argumento ausente).

- [ ] **Step 3: Alterar os quatro handlers de formulário**

Em cada um de `app/api/contact/route.ts`, `app/api/montar-maquina/route.ts`, `app/api/monte-fabrica/route.ts`, `app/api/specifications/route.ts`:

1. Adicionar `import { resolverDestinatario } from '@/lib/indicacao/destinatario';`.
2. Logo após o `schema.parse(body)`, adicionar `const destinatario = await resolverDestinatario(request);`.
3. Passar como segundo argumento: `await sendContactEmail(validatedData, destinatario);` (idem `sendMontarMaquinaEmail`, `sendMonteFabricaEmail`, `sendSpecificationEmail`).

Exemplo completo do trecho em `app/api/contact/route.ts`:

```ts
const body = await request.json();
const validatedData = contactFormSchema.parse(body);
const destinatario = await resolverDestinatario(request);

/* Sem try/catch aqui: falha de envio precisa virar 500 para o visitante
       ver o erro — engolir e responder sucesso perdia a solicitação em
       silêncio. O catch externo loga e responde. */
await sendContactEmail(validatedData, destinatario);
```

- [ ] **Step 4: Alterar o handler do catálogo**

Em `app/api/download-catalog/route.ts`, após `const data = catalogRequestSchema.parse(body);` adicionar `const destinatario = await resolverDestinatario(request);` e trocar `sendLeadNotification(data)` por `sendLeadNotification(data, destinatario)`.

- [ ] **Step 5: Rodar tudo, lint e ver passar**

Run: `bun run test && bun run lint && bunx tsc --noEmit`
Expected: PASS, sem erro de tipo.

- [ ] **Step 6: Conferir um envio real no dev server**

Com `.env.local` completo (Gmail e CRM), no browser com o cookie de um código real (entrar por `http://localhost:3006/?ref=<código>`), enviar o formulário de `/montar-fabrica` com dados de teste. Expected: o e-mail chega na caixa do vendedor com a linha "Indicado por: Nome (CÓDIGO)". Sem cookie, chega em `GMAIL_USER_RECEIVER` sem a linha.

- [ ] **Step 7: Format e commit**

```bash
bun run prettier --write app/api
git add app/api
git commit -m "feat(indicacao): leads vão para o vendedor"
```

---

### Task 11: Documentação, smoke em Preview e PR

**Files:**

- Modify: `CLAUDE.md` (mapa do repositório e tabela "Onde colocar cada coisa")
- Modify: `.env.example` (já feito na Task 1; conferir)

- [ ] **Step 1: Atualizar o CLAUDE.md**

No bloco do mapa, acrescentar:

```
proxy.ts                  ← captura ?ref, grava o cookie de Indicação e redireciona para a URL limpa (spec 2026-09-02)
lib/crm/                  ← cliente server-only da API do CRM (referral code)
lib/indicacao/            ← cookie assinado, tipos e destinatário do lead
components/indicacao/     ← IndicacaoProvider, useContatoComercial, BotaoEspecialista
lib/data/contatos.ts      ← fonte única dos contatos padrão (vendas, suporte, compras)
```

Na seção "Fontes da verdade", trocar a linha do `.env.example` por: "as 8 env vars dos forms, downloads e Indicação (`GMAIL_*`, `SITE_URL`, `CATALOG_TOKEN_SECRET`, `CRM_BASE_URL`, `CRM_EXTERNAL_API_KEY`, `INDICACAO_COOKIE_SECRET`)". Em "Armadilhas não-óbvias", acrescentar: "Contato comercial (telefone, WhatsApp, e-mail de vendas) nunca é hardcoded: vem de `useContatoComercial()` no client ou de `CONTATO_PADRAO` no servidor, porque a Indicação (`?ref=`) troca esses valores por visitante. Suporte, Compras e JSON-LD usam sempre `CONTATO_PADRAO`."

Acrescentar também `CONTEXT.md` na seção "Fontes da verdade": "`CONTEXT.md` — glossário do domínio (Indicação, Vendedor, Contato comercial…); usar esses termos em código e docs."

- [ ] **Step 2: Rodar a suíte completa, lint, tipos e build**

Run: `bun run test && bun run lint && bunx tsc --noEmit && bun run build`
Expected: tudo verde; no resumo do build, nenhuma rota do grupo (site) além de `/download` aparece como dinâmica (`ƒ`).

- [ ] **Step 3: Commit e push**

```bash
bun run prettier --write CLAUDE.md
git add CLAUDE.md
git commit -m "docs(indicacao): mapa do repo e envs"
git push -u origin issue-28-e
```

- [ ] **Step 4: Envs na Vercel e smoke em Preview**

Quem tem a chave cadastra na Vercel (Settings > Environment Variables, Production e Preview): `CRM_BASE_URL=https://www.crmprofills.com.br`, `CRM_EXTERNAL_API_KEY`, `INDICACAO_COOKIE_SECRET` (string aleatória longa, por exemplo `openssl rand -base64 48`). Depois do deploy de Preview:

1. Abrir `https://<preview>/maquinas/<slug>?ref=<código real>`: a URL fica sem `?ref`, o cookie `profills_indicacao` aparece em Application > Cookies, o botão "Falar com um especialista" aponta para o número do vendedor.
2. Navegar para a home e para `/sobre`: o rodapé mostra o e-mail do vendedor em Vendas/Peças e os padrões em Suporte e Compras.
3. Abrir `https://<preview>/?ref=NAO-EXISTE` numa janela anônima: redireciona sem cookie, contatos padrão.
4. Enviar `/montar-fabrica` com dados de teste com e sem cookie e conferir os dois destinos.
5. Capturar screenshot do rodapé com a Indicação ativa e guardar o caminho para o relatório.

- [ ] **Step 5: Abrir o PR**

```bash
gh pr create --base main --head issue-28-e --title "feat: indicação de vendedor via ?ref (#28)" --body-file /dev/stdin <<'EOF'
Fecha #28.

Quem entra por `?ref=CODIGO` passa 30 dias vendo os contatos comerciais do vendedor (footer Vendas/Peças, hero da home, CTAs das fichas de máquina) e tem os formulários enviados só para ele. Suporte, Compras, JSON-LD e a landing do sorteio não mudam.

Como: `proxy.ts` consulta o CRM, grava um cookie JWT assinado com os dados do vendedor e redireciona para a URL limpa; o browser lê o cookie e troca os contatos por Context; os route handlers revalidam o código no CRM antes de escolher o destinatário. Páginas continuam estáticas.

Spec: `docs/superpowers/specs/2026-09-02-indicacao-vendedor-design.md`. ADR: `docs/adr/0001-indicacao-por-cookie-assinado-no-proxy.md`.

Envs novas na Vercel (Production e Preview): `CRM_BASE_URL`, `CRM_EXTERNAL_API_KEY`, `INDICACAO_COOKIE_SECRET`.

Smoke em Preview: (preencher com o resultado do passo 4)
EOF
```

O merge em `main` faz deploy em produção: só com pedido explícito.

---

## Self-review

- **Cobertura da spec:** decisões 1 a 11 → Tasks 3/4 (cookie 30 d, último clique vence: o proxy sempre regrava no `?ref`), 8/10 (lead só ao vendedor com fallback), 5/6/7 (troca silenciosa, telefone padrão sem contato, oculto até hidratar), 4 (qualquer rota, redirect limpo), 2 (fonte única), 11 (sem banner, só doc). Seção 5 de erros → testes do proxy (Task 4) e do destinatário (Task 8). Seção 6 de testes → cada task. Nota da spec 4.3 sobre Data Cache no proxy → resolvida com o `Map` em memória na Task 1.
- **Placeholders:** nenhum "TBD"; o único "…" é dentro de um trecho que diz explicitamente "resto do texto como está" (Task 9, Step 3), com o conteúdo original visível no arquivo.
- **Consistência de nomes:** `buscarVendedorPorCodigo` devolve `ResultadoBusca` com `tipo` (`encontrado` / `nao-encontrado` / `indisponivel`) em Tasks 1, 4, 8; `assinarIndicacao(vendedor, agora?)`, `lerIndicacao(token)`, `precisaRenovar(payload, agora?)`, `opcoesCookieIndicacao()`, `INDICACAO_COOKIE` em Tasks 3, 4, 8; `Destinatario = { para, vendedor }` em Tasks 8, 9, 10; `useContatoComercial()` devolve `{ pronto, email, telefone, whatsapp }` em Tasks 5, 6, 7.
