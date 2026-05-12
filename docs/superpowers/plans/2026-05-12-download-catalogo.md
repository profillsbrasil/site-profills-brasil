# Rota `/download` — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar rota `/download` que captura dados do lead via form (nome, CPF/CNPJ, telefone, email) e envia o catálogo Profills através de link assinado (JWT, 7 dias) por email, com painel de sucesso na tela e notificação interna para a Profills.

**Architecture:** Next.js 16 App Router + React 19 + Server Components. Form client com `react-hook-form` + `zod` posta em `POST /api/download-catalog` que assina JWT com `jose`, monta URL absoluta e dispara dois emails via Nodemailer/Gmail. Rota `GET /api/download/[token]` verifica o token e stream do PDF estático (77 MB) como attachment.

**Tech Stack:** Next 16, React 19, TypeScript, react-hook-form, zod, react-imask, nodemailer (Gmail), `jose` (JWT), Vitest + Testing Library, Tailwind v4, motion/react, shadcn/ui, sonner.

**Spec:** `docs/superpowers/specs/2026-05-12-download-catalogo-design.md`

---

## File Structure

Mapa de todos os arquivos novos/alterados antes das tasks:

```
package.json                                          [modificar] +jose
.env.example                                          [modificar] +CATALOG_TOKEN_SECRET

lib/
  utils/
    validate-document.ts                              [novo]  CPF/CNPJ algorithm
    validate-document.test.ts                         [novo]  cobertura algoritmo
    jwt-catalog.ts                                    [novo]  sign/verify wrappers
    jwt-catalog.test.ts                               [novo]  round-trip + expirado + tampered
  schemas/
    catalog-request.ts                                [novo]  zod schema do form
    catalog-request.test.ts                           [novo]  validação por campo
  emails/
    _shared/
      transporter.ts                                  [novo]  createTransporter (extraído)
      template-engine.ts                              [novo]  readTemplate + renderTemplate (extraídos)
    contact-form/
      email-contact.ts                                [modificar] importar de _shared/
    catalog-request/
      email-catalog.ts                                [novo]  sendClientCatalogEmail + sendLeadNotification
      email-template-client.html                      [novo]  HTML email cliente
      email-template-internal.html                    [novo]  HTML email Profills

app/
  download/
    page.tsx                                          [novo]  server component + background
    _components/
      catalog-form/
        CatalogForm.tsx                               [novo]  container client
        hooks/
          useCatalogForm.ts                           [novo]  form state + submit
        components/
          CatalogFields.tsx                           [novo]  inputs
          SuccessPanel.tsx                            [novo]  pós-envio
          ExpiredBanner.tsx                           [novo]  topo se ?error=...
  api/
    download-catalog/
      route.ts                                        [novo]  POST: form → JWT → 2 emails
    download/
      [token]/
        route.ts                                      [novo]  GET: valida JWT → stream PDF
```

**Princípio de boundaries:** cada arquivo tem responsabilidade única. Validação de documento separada do JWT separada do schema separada do envio. UI quebrada em container + campos + estados (`SuccessPanel`, `ExpiredBanner`) para reduzir tamanho de cada arquivo.

---

## Convenções globais

- Testes co-localizados com o arquivo (`foo.ts` + `foo.test.ts`).
- Vitest com `globals: true` — não importar `describe/it/expect`.
- Imports absolutos via `@/*`.
- Português para mensagens visíveis ao usuário; inglês para identificadores.
- Sem comentários explicativos exceto onde o "porquê" não é óbvio.
- Após cada task, **commit pequeno** com Conventional Commits em PT.

---

## Task 1: Instalar `jose`

**Files:**
- Modify: `package.json` (via `bun add`)

- [ ] **Step 1: Adicionar dependência**

Run:
```bash
bun add jose
```

Expected: `jose` adicionado em `dependencies`, `bun.lock` atualizado.

- [ ] **Step 2: Verificar instalação**

Run:
```bash
bun pm ls jose
```

Expected: linha com `jose@<versão>`.

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: adiciona jose para assinatura JWT do catálogo"
```

---

## Task 2: Utilitário de validação CPF/CNPJ (TDD)

**Files:**
- Create: `lib/utils/validate-document.ts`
- Test: `lib/utils/validate-document.test.ts`

- [ ] **Step 1: Escrever testes que falham**

Create `lib/utils/validate-document.test.ts`:

```ts
import { isValidCNPJ, isValidCPF, validateDocument } from './validate-document';

describe('isValidCPF', () => {
  it('aceita CPF válido sem máscara', () => {
    expect(isValidCPF('52998224725')).toBe(true);
  });

  it('aceita CPF válido com máscara', () => {
    expect(isValidCPF('529.982.247-25')).toBe(true);
  });

  it('rejeita CPF com dígito verificador errado', () => {
    expect(isValidCPF('52998224726')).toBe(false);
  });

  it('rejeita CPF com todos dígitos iguais', () => {
    expect(isValidCPF('11111111111')).toBe(false);
    expect(isValidCPF('00000000000')).toBe(false);
  });

  it('rejeita CPF com length diferente de 11', () => {
    expect(isValidCPF('12345')).toBe(false);
    expect(isValidCPF('123456789012')).toBe(false);
  });
});

describe('isValidCNPJ', () => {
  it('aceita CNPJ válido sem máscara', () => {
    expect(isValidCNPJ('11222333000181')).toBe(true);
  });

  it('aceita CNPJ válido com máscara', () => {
    expect(isValidCNPJ('11.222.333/0001-81')).toBe(true);
  });

  it('rejeita CNPJ com dígito verificador errado', () => {
    expect(isValidCNPJ('11222333000182')).toBe(false);
  });

  it('rejeita CNPJ com todos dígitos iguais', () => {
    expect(isValidCNPJ('11111111111111')).toBe(false);
  });

  it('rejeita CNPJ com length diferente de 14', () => {
    expect(isValidCNPJ('1234567890')).toBe(false);
  });
});

describe('validateDocument', () => {
  it('detecta e valida CPF (11 dígitos)', () => {
    expect(validateDocument('529.982.247-25')).toBe(true);
    expect(validateDocument('52998224725')).toBe(true);
  });

  it('detecta e valida CNPJ (14 dígitos)', () => {
    expect(validateDocument('11.222.333/0001-81')).toBe(true);
    expect(validateDocument('11222333000181')).toBe(true);
  });

  it('rejeita string com tamanho fora do esperado', () => {
    expect(validateDocument('1234')).toBe(false);
    expect(validateDocument('123456789012345')).toBe(false);
    expect(validateDocument('')).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar teste para confirmar falha**

Run:
```bash
bun test lib/utils/validate-document.test.ts
```

Expected: FAIL com erro de import — arquivo `validate-document.ts` ainda não existe.

- [ ] **Step 3: Implementar `validate-document.ts`**

Create `lib/utils/validate-document.ts`:

```ts
const stripDigits = (raw: string) => raw.replace(/\D/g, '');

function calcCpfDigit(digits: string, factor: number): number {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += Number(digits[i]) * (factor - i);
  }
  const mod = sum % 11;
  return mod < 2 ? 0 : 11 - mod;
}

export function isValidCPF(raw: string): boolean {
  const cpf = stripDigits(raw);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  const d1 = calcCpfDigit(cpf.slice(0, 9), 10);
  const d2 = calcCpfDigit(cpf.slice(0, 9) + d1, 11);
  return cpf.endsWith(`${d1}${d2}`);
}

function calcCnpjDigit(digits: string, weights: number[]): number {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += Number(digits[i]) * weights[i];
  }
  const mod = sum % 11;
  return mod < 2 ? 0 : 11 - mod;
}

const CNPJ_W1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_W2 = [6, ...CNPJ_W1];

export function isValidCNPJ(raw: string): boolean {
  const cnpj = stripDigits(raw);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  const d1 = calcCnpjDigit(cnpj.slice(0, 12), CNPJ_W1);
  const d2 = calcCnpjDigit(cnpj.slice(0, 12) + d1, CNPJ_W2);
  return cnpj.endsWith(`${d1}${d2}`);
}

export function validateDocument(raw: string): boolean {
  const digits = stripDigits(raw);
  if (digits.length === 11) return isValidCPF(digits);
  if (digits.length === 14) return isValidCNPJ(digits);
  return false;
}
```

- [ ] **Step 4: Rodar testes para confirmar passagem**

Run:
```bash
bun test lib/utils/validate-document.test.ts
```

Expected: PASS — todos os blocos `describe` verdes.

- [ ] **Step 5: Commit**

```bash
git add lib/utils/validate-document.ts lib/utils/validate-document.test.ts
git commit -m "feat: adiciona validação de CPF e CNPJ"
```

---

## Task 3: Wrappers JWT com `jose` (TDD)

**Files:**
- Create: `lib/utils/jwt-catalog.ts`
- Test: `lib/utils/jwt-catalog.test.ts`

- [ ] **Step 1: Escrever testes que falham**

Create `lib/utils/jwt-catalog.test.ts`:

```ts
import { beforeAll } from 'vitest';

import { signCatalogToken, verifyCatalogToken } from './jwt-catalog';

beforeAll(() => {
  process.env.CATALOG_TOKEN_SECRET =
    'test-secret-with-enough-bytes-for-hmac-256-algorithm';
});

describe('jwt-catalog', () => {
  it('faz round-trip de payload válido', async () => {
    const token = await signCatalogToken(
      { email: 'cliente@exemplo.com', name: 'Cliente Teste' },
      '7d'
    );
    const result = await verifyCatalogToken(token);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.payload.email).toBe('cliente@exemplo.com');
      expect(result.payload.name).toBe('Cliente Teste');
    }
  });

  it('retorna reason="expired" para token vencido', async () => {
    const token = await signCatalogToken(
      { email: 'a@b.com', name: 'X' },
      '0s'
    );
    await new Promise((r) => setTimeout(r, 50));
    const result = await verifyCatalogToken(token);
    expect(result).toEqual({ ok: false, reason: 'expired' });
  });

  it('retorna reason="invalid" para token adulterado', async () => {
    const token = await signCatalogToken(
      { email: 'a@b.com', name: 'X' },
      '7d'
    );
    const tampered = token.slice(0, -2) + 'aa';
    const result = await verifyCatalogToken(tampered);
    expect(result).toEqual({ ok: false, reason: 'invalid' });
  });

  it('retorna reason="invalid" para string que não é JWT', async () => {
    const result = await verifyCatalogToken('lorem-ipsum');
    expect(result).toEqual({ ok: false, reason: 'invalid' });
  });
});
```

- [ ] **Step 2: Rodar teste para confirmar falha**

Run:
```bash
bun test lib/utils/jwt-catalog.test.ts
```

Expected: FAIL — arquivo `jwt-catalog.ts` não existe.

- [ ] **Step 3: Implementar `jwt-catalog.ts`**

Create `lib/utils/jwt-catalog.ts`:

```ts
import { SignJWT, errors, jwtVerify } from 'jose';

const getSecret = () => {
  const secret = process.env.CATALOG_TOKEN_SECRET;
  if (!secret) {
    throw new Error('CATALOG_TOKEN_SECRET não está definido');
  }
  return new TextEncoder().encode(secret);
};

export interface CatalogTokenPayload {
  email: string;
  name: string;
}

export async function signCatalogToken(
  payload: CatalogTokenPayload,
  exp: string = '7d'
): Promise<string> {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(getSecret());
}

export type VerifyResult =
  | { ok: true; payload: CatalogTokenPayload }
  | { ok: false; reason: 'expired' | 'invalid' };

export async function verifyCatalogToken(
  token: string
): Promise<VerifyResult> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ['HS256']
    });
    return {
      ok: true,
      payload: {
        email: String(payload.email),
        name: String(payload.name)
      }
    };
  } catch (err) {
    if (err instanceof errors.JWTExpired) {
      return { ok: false, reason: 'expired' };
    }
    return { ok: false, reason: 'invalid' };
  }
}
```

- [ ] **Step 4: Rodar testes para confirmar passagem**

Run:
```bash
bun test lib/utils/jwt-catalog.test.ts
```

Expected: PASS — round-trip, expirado, tampered, malformado todos cobertos.

- [ ] **Step 5: Commit**

```bash
git add lib/utils/jwt-catalog.ts lib/utils/jwt-catalog.test.ts
git commit -m "feat: adiciona assinatura JWT do catálogo via jose"
```

---

## Task 4: Extrair `lib/emails/_shared/` (refactor mínimo)

**Files:**
- Create: `lib/emails/_shared/transporter.ts`
- Create: `lib/emails/_shared/template-engine.ts`
- Modify: `lib/emails/contact-form/email-contact.ts`

- [ ] **Step 1: Criar `lib/emails/_shared/transporter.ts`**

Create the file:

```ts
import nodemailer from 'nodemailer';

export const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER_SENDER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};
```

- [ ] **Step 2: Criar `lib/emails/_shared/template-engine.ts`**

Create the file:

```ts
import fs from 'fs';
import path from 'path';

export const readTemplate = (relativePath: string): string => {
  const templatePath = path.join(process.cwd(), relativePath);
  return fs.readFileSync(templatePath, 'utf-8');
};

export const renderTemplate = (
  template: string,
  data: Record<string, string | string[] | undefined>
): string => {
  let rendered = template;

  const eachRegex = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  rendered = rendered.replace(eachRegex, (_, arrayName, content) => {
    const array = data[arrayName];
    if (Array.isArray(array) && array.length > 0) {
      return array
        .map((item) => content.replace(/\{\{this\}\}/g, item))
        .join('');
    }
    return '';
  });

  const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  rendered = rendered.replace(ifRegex, (_, condition, content) => {
    const value = data[condition];
    if (Array.isArray(value)) return value.length > 0 ? content : '';
    return value !== undefined && value !== null && String(value).trim() !== ''
      ? content
      : '';
  });

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    const value = data[key];
    if (Array.isArray(value)) {
      rendered = rendered.replace(regex, value.join(', '));
    } else {
      rendered = rendered.replace(regex, String(value ?? ''));
    }
  });

  rendered = rendered.replace(/\{\{#each\s+\w+\}\}/g, '');
  rendered = rendered.replace(/\{\{\/each\}\}/g, '');
  rendered = rendered.replace(/\{\{#if\s+\w+\}\}/g, '');
  rendered = rendered.replace(/\{\{\/if\}\}/g, '');
  rendered = rendered.replace(/\{\{this\}\}/g, '');

  return rendered;
};
```

- [ ] **Step 3: Migrar `email-contact.ts` para usar `_shared`**

Modify `lib/emails/contact-form/email-contact.ts`:

Substituir o bloco do topo (imports + `createTransporter` + `readEmailTemplate` + `renderTemplate`) por:

```ts
import type { ContactFormData } from '@/lib/schemas/contact-form';
import { createTransporter } from '@/lib/emails/_shared/transporter';
import {
  readTemplate,
  renderTemplate
} from '@/lib/emails/_shared/template-engine';
import { logger } from '@/lib/utils/logger';
```

Remover do arquivo:
- A função local `createTransporter` (linhas 7–14 originais)
- A função local `readEmailTemplate` (linhas 17–24 originais)
- A função local `renderTemplate` (linhas 27–82 originais)
- Os imports `import fs from 'fs'`, `import nodemailer from 'nodemailer'`, `import path from 'path'`.

Substituir a chamada `readEmailTemplate()` em `createContactEmailTemplate` por:

```ts
const htmlTemplate = readTemplate('lib/emails/contact-form/email-template.html');
```

- [ ] **Step 4: Rodar build TypeScript para validar refactor**

Run:
```bash
bun run lint && bunx tsc --noEmit
```

Expected: ambos comandos PASS sem erros novos.

- [ ] **Step 5: Smoke test — chamar API contact em desenvolvimento (opcional)**

Manual quick check: `bun dev`, abrir `/servicos-personalizados`, submeter o form de contato com email pessoal, confirmar que email continua chegando idêntico ao comportamento atual.

- [ ] **Step 6: Commit**

```bash
git add lib/emails/_shared/ lib/emails/contact-form/email-contact.ts
git commit -m "refactor: extrai transporter e template engine para emails/_shared"
```

---

## Task 5: Schema `catalog-request` (TDD)

**Files:**
- Create: `lib/schemas/catalog-request.ts`
- Test: `lib/schemas/catalog-request.test.ts`

- [ ] **Step 1: Escrever testes que falham**

Create `lib/schemas/catalog-request.test.ts`:

```ts
import { catalogRequestSchema } from './catalog-request';

const valid = {
  name: 'Cliente Teste',
  document: '529.982.247-25',
  phone: '(11) 91234-5678',
  email: 'cliente@exemplo.com'
};

describe('catalogRequestSchema', () => {
  it('aceita payload válido', () => {
    expect(() => catalogRequestSchema.parse(valid)).not.toThrow();
  });

  it('rejeita name com menos de 2 caracteres', () => {
    expect(() =>
      catalogRequestSchema.parse({ ...valid, name: 'X' })
    ).toThrow();
  });

  it('rejeita document inválido (CPF/CNPJ malformado)', () => {
    expect(() =>
      catalogRequestSchema.parse({ ...valid, document: '111.111.111-11' })
    ).toThrow();
  });

  it('aceita CNPJ válido como document', () => {
    expect(() =>
      catalogRequestSchema.parse({ ...valid, document: '11.222.333/0001-81' })
    ).not.toThrow();
  });

  it('rejeita phone fora do formato (00) 00000-0000', () => {
    expect(() =>
      catalogRequestSchema.parse({ ...valid, phone: '11912345678' })
    ).toThrow();
  });

  it('rejeita email inválido', () => {
    expect(() =>
      catalogRequestSchema.parse({ ...valid, email: 'nao-eh-email' })
    ).toThrow();
  });
});
```

- [ ] **Step 2: Rodar teste para confirmar falha**

Run:
```bash
bun test lib/schemas/catalog-request.test.ts
```

Expected: FAIL — schema ainda não existe.

- [ ] **Step 3: Implementar `catalog-request.ts`**

Create `lib/schemas/catalog-request.ts`:

```ts
import { z } from 'zod';

import { validateDocument } from '@/lib/utils/validate-document';

export const catalogRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(120, 'Nome muito longo'),
  document: z
    .string()
    .min(1, 'CPF ou CNPJ é obrigatório')
    .refine(validateDocument, 'CPF ou CNPJ inválido'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .regex(
      /^\(\d{2}\) \d{4,5}-\d{4}$/,
      'Telefone deve ter o formato (00) 00000-0000'
    ),
  email: z.email('E-mail inválido').max(180, 'E-mail muito longo')
});

export type CatalogRequestData = z.infer<typeof catalogRequestSchema>;
```

- [ ] **Step 4: Rodar testes para confirmar passagem**

Run:
```bash
bun test lib/schemas/catalog-request.test.ts
```

Expected: PASS — todos os casos validados.

- [ ] **Step 5: Commit**

```bash
git add lib/schemas/catalog-request.ts lib/schemas/catalog-request.test.ts
git commit -m "feat: adiciona schema de solicitação do catálogo"
```

---

## Task 6: Template HTML do email cliente

**Files:**
- Create: `lib/emails/catalog-request/email-template-client.html`

- [ ] **Step 1: Criar HTML do email cliente**

Create `lib/emails/catalog-request/email-template-client.html`:

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
    <title>{{subject}}</title>
    <style>
      html, body { margin: 0 !important; padding: 0 !important; height: 100% !important; width: 100% !important; }
      * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
      table { border-collapse: collapse !important; }
      img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; height: auto; display: block; }
      a { text-decoration: none; }
      .bg { background-color: #f5f5f5; }
      .wrap { width: 100%; max-width: 600px; margin: 0 auto; }
      .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08); }
      .header { background: #1f2937; color: #ffffff; text-align: center; padding: 32px 24px; }
      .h1 { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 22px; font-weight: 700; margin: 0; color: #ffffff; }
      .preheader { display: none; max-height: 0; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; }
      .content { padding: 32px 28px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; }
      .greeting { font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 12px 0; }
      .lead { font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 24px 0; }
      .cta-wrap { text-align: center; margin: 28px 0; }
      .cta { display: inline-block; background: #2563eb; color: #ffffff !important; font-weight: 700; font-size: 16px; padding: 14px 28px; border-radius: 10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
      .notice { background: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 16px; border-radius: 6px; font-size: 14px; color: #1e3a8a; margin: 24px 0; }
      .spam { font-size: 13px; color: #6b7280; margin: 24px 0 0 0; }
      .footer { background: #f9fafb; padding: 20px 24px; text-align: center; font-size: 12px; color: #6b7280; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
      .footer a { color: #2563eb; }
    </style>
  </head>
  <body class="bg">
    <span class="preheader">{{preheader}}</span>
    <div class="wrap">
      <div class="card">
        <div class="header">
          <h1 class="h1">{{subject}}</h1>
        </div>
        <div class="content">
          <p class="greeting">Olá, {{name}}!</p>
          <p class="lead">
            Obrigado pelo interesse na Profills. Seu catálogo completo está pronto.
            Clique no botão abaixo para baixar o arquivo PDF.
          </p>
          <div class="cta-wrap">
            <a class="cta" href="{{downloadUrl}}">Baixar Catálogo</a>
          </div>
          <div class="notice">
            ⏰ <strong>Link válido por 7 dias.</strong> Após esse período, solicite novamente em
            <a href="{{siteUrl}}/download">{{siteUrl}}/download</a>.
          </div>
          <p class="spam">
            Não encontrou na caixa de entrada? Verifique a pasta de spam.
          </p>
        </div>
        <div class="footer">
          Profills Brasil &nbsp;|&nbsp; <a href="{{siteUrl}}">{{siteUrl}}</a>
        </div>
      </div>
    </div>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add lib/emails/catalog-request/email-template-client.html
git commit -m "feat: adiciona template HTML do email cliente do catálogo"
```

---

## Task 7: Template HTML do email Profills (interno)

**Files:**
- Create: `lib/emails/catalog-request/email-template-internal.html`

- [ ] **Step 1: Criar HTML da notificação interna**

Create `lib/emails/catalog-request/email-template-internal.html`:

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
    <title>Nova solicitação de catálogo</title>
    <style>
      body { margin: 0; padding: 0; background: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
      .wrap { width: 100%; max-width: 600px; margin: 0 auto; }
      .card { background: #ffffff; border-radius: 12px; overflow: hidden; margin: 24px auto; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
      .header { background: #0f172a; color: #ffffff; padding: 20px 24px; }
      .h1 { font-size: 18px; font-weight: 700; margin: 0; }
      .content { padding: 24px; }
      table.info { width: 100%; border-collapse: collapse; }
      table.info td { padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #1f2937; vertical-align: top; }
      table.info td.label { width: 35%; color: #6b7280; font-weight: 600; }
      .footer { background: #f9fafb; padding: 14px 24px; text-align: center; font-size: 12px; color: #9ca3af; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <div class="header">
          <p class="h1">📥 Nova solicitação de catálogo</p>
        </div>
        <div class="content">
          <table class="info">
            <tr><td class="label">Nome</td><td>{{name}}</td></tr>
            <tr><td class="label">Documento</td><td>{{document}}</td></tr>
            <tr><td class="label">Telefone</td><td>{{phone}}</td></tr>
            <tr><td class="label">E-mail</td><td>{{email}}</td></tr>
            <tr><td class="label">Data/Hora</td><td>{{timestamp}}</td></tr>
          </table>
        </div>
        <div class="footer">Sistema Profills — registro automático de leads</div>
      </div>
    </div>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add lib/emails/catalog-request/email-template-internal.html
git commit -m "feat: adiciona template HTML da notificação interna do catálogo"
```

---

## Task 8: Módulo de envio `email-catalog.ts`

**Files:**
- Create: `lib/emails/catalog-request/email-catalog.ts`

- [ ] **Step 1: Implementar `email-catalog.ts`**

Create `lib/emails/catalog-request/email-catalog.ts`:

```ts
import type { CatalogRequestData } from '@/lib/schemas/catalog-request';
import { createTransporter } from '@/lib/emails/_shared/transporter';
import {
  readTemplate,
  renderTemplate
} from '@/lib/emails/_shared/template-engine';
import { logger } from '@/lib/utils/logger';

const getSiteUrl = () => process.env.SITE_URL || 'https://profills.com.br';

const nowSaoPaulo = () =>
  new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

export interface SendClientCatalogEmailInput {
  name: string;
  email: string;
  downloadUrl: string;
}

export async function sendClientCatalogEmail(
  input: SendClientCatalogEmailInput
) {
  const transporter = createTransporter();
  const siteUrl = getSiteUrl();
  const subject = 'Seu catálogo Profills está pronto';

  const html = renderTemplate(
    readTemplate('lib/emails/catalog-request/email-template-client.html'),
    {
      subject,
      preheader: 'Acesse o catálogo completo da Profills',
      name: input.name,
      downloadUrl: input.downloadUrl,
      siteUrl
    }
  );

  const text = [
    `Olá, ${input.name}!`,
    '',
    'Seu catálogo Profills está pronto. Baixe pelo link abaixo:',
    input.downloadUrl,
    '',
    'Link válido por 7 dias.',
    '',
    'Profills Brasil'
  ].join('\n');

  try {
    const result = await transporter.sendMail({
      from: {
        name: 'Profills Brasil',
        address: process.env.GMAIL_USER_SENDER!
      },
      to: input.email,
      subject,
      html,
      text
    });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('❌ Erro ao enviar email do catálogo (cliente):', error);
    throw new Error('Falha no envio do email do catálogo');
  }
}

export async function sendLeadNotification(data: CatalogRequestData) {
  const transporter = createTransporter();
  const subject = `Nova solicitação de catálogo — ${data.name}`;

  const html = renderTemplate(
    readTemplate('lib/emails/catalog-request/email-template-internal.html'),
    {
      name: data.name,
      document: data.document,
      phone: data.phone,
      email: data.email,
      timestamp: nowSaoPaulo()
    }
  );

  const text = [
    'Nova solicitação de catálogo',
    `Nome: ${data.name}`,
    `Documento: ${data.document}`,
    `Telefone: ${data.phone}`,
    `E-mail: ${data.email}`,
    `Data/Hora: ${nowSaoPaulo()}`
  ].join('\n');

  try {
    const result = await transporter.sendMail({
      from: {
        name: 'Site Profills',
        address: process.env.GMAIL_USER_SENDER!
      },
      to: process.env.GMAIL_USER_RECEIVER!,
      subject,
      html,
      text
    });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('❌ Erro ao enviar notificação interna do catálogo:', error);
    throw new Error('Falha no envio da notificação interna');
  }
}
```

- [ ] **Step 2: Type check**

Run:
```bash
bunx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add lib/emails/catalog-request/email-catalog.ts
git commit -m "feat: adiciona envio de email do catálogo e notificação de lead"
```

---

## Task 9: Atualizar `.env.example`

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Adicionar nova variável**

Modify `.env.example` para adicionar a linha:

```env
GMAIL_USER_SENDER=""
GMAIL_APP_PASSWORD=""
GMAIL_USER_RECEIVER=""
SITE_URL=""
CATALOG_TOKEN_SECRET=""
```

A nova linha é `CATALOG_TOKEN_SECRET=""`. Anote no momento de configurar dev: gerar via `openssl rand -base64 32`.

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: adiciona CATALOG_TOKEN_SECRET ao .env.example"
```

---

## Task 10: Rota `POST /api/download-catalog`

**Files:**
- Create: `app/api/download-catalog/route.ts`

- [ ] **Step 1: Implementar route handler**

Create `app/api/download-catalog/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';

import {
  sendClientCatalogEmail,
  sendLeadNotification
} from '@/lib/emails/catalog-request/email-catalog';
import { catalogRequestSchema } from '@/lib/schemas/catalog-request';
import { signCatalogToken } from '@/lib/utils/jwt-catalog';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = catalogRequestSchema.parse(body);

    const token = await signCatalogToken(
      { email: data.email, name: data.name },
      '7d'
    );
    const siteUrl = process.env.SITE_URL || 'https://profills.com.br';
    const downloadUrl = `${siteUrl}/api/download/${token}`;

    await Promise.all([
      sendClientCatalogEmail({
        name: data.name,
        email: data.email,
        downloadUrl
      }),
      sendLeadNotification(data)
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logger.error('Erro ao processar solicitação de catálogo:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Dados inválidos',
          errors: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao enviar o catálogo. Tente novamente.'
      },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Type check + lint**

Run:
```bash
bun run lint && bunx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/api/download-catalog/route.ts
git commit -m "feat: adiciona POST /api/download-catalog"
```

---

## Task 11: Rota `GET /api/download/[token]`

**Files:**
- Create: `app/api/download/[token]/route.ts`

- [ ] **Step 1: Implementar route handler**

Create `app/api/download/[token]/route.ts`:

```ts
import { NextRequest } from 'next/server';

import fs from 'node:fs';
import path from 'node:path';

import { verifyCatalogToken } from '@/lib/utils/jwt-catalog';
import { logger } from '@/lib/utils/logger';

const PDF_PATH = path.join(
  process.cwd(),
  'public/downloads/Catalogo_ProfillsCompany.pdf'
);
const PDF_FILENAME = 'Catalogo_ProfillsCompany.pdf';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const result = await verifyCatalogToken(token);

  if (!result.ok) {
    const url = new URL(`/download?error=${result.reason}`, request.url);
    return Response.redirect(url, 302);
  }

  if (!fs.existsSync(PDF_PATH)) {
    logger.error(`Catálogo PDF não encontrado em ${PDF_PATH}`);
    return new Response('Arquivo indisponível', { status: 500 });
  }

  const stat = fs.statSync(PDF_PATH);
  const stream = fs.createReadStream(PDF_PATH);

  return new Response(stream as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${PDF_FILENAME}"`,
      'Content-Length': String(stat.size),
      'Cache-Control': 'private, no-store'
    }
  });
}
```

- [ ] **Step 2: Type check + lint**

Run:
```bash
bun run lint && bunx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/api/download/[token]/route.ts
git commit -m "feat: adiciona GET /api/download/[token] com stream do PDF"
```

---

## Task 12: Componente `CatalogFields` (inputs)

**Files:**
- Create: `app/download/_components/catalog-form/components/CatalogFields.tsx`

- [ ] **Step 1: Implementar componente**

Create `app/download/_components/catalog-form/components/CatalogFields.tsx`:

```tsx
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type CatalogRequestData } from '@/lib/schemas/catalog-request';
import { cn } from '@/lib/utils';

import { motion } from 'motion/react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { IMaskInput } from 'react-imask';

interface CatalogFieldsProps {
  control: Control<CatalogRequestData>;
  errors: FieldErrors<CatalogRequestData>;
}

const fieldClass =
  '!bg-white/5 !border-white/15 !text-slate-100 placeholder:!text-slate-400 focus-visible:!ring-2 focus-visible:!ring-blue-400/40';

export function CatalogFields({ control, errors }: CatalogFieldsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className='w-full space-y-5'>
      <div className='space-y-2 text-center'>
        <h1 className='text-2xl font-bold text-white sm:text-3xl'>
          Catálogo Profills
        </h1>
        <p className='text-sm text-slate-300'>
          Preencha seus dados e receba o catálogo completo no seu email.
        </p>
      </div>

      <div className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='name' className='text-slate-200'>
            Nome ou Empresa *
          </Label>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id='name'
                placeholder='João Silva ou Indústria XYZ Ltda'
                className={cn(
                  fieldClass,
                  errors.name && '!border-red-400/70'
                )}
              />
            )}
          />
          {errors.name && (
            <p className='text-xs text-red-300'>{errors.name.message}</p>
          )}
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='document' className='text-slate-200'>
            CPF ou CNPJ *
          </Label>
          <Controller
            name='document'
            control={control}
            render={({ field }) => (
              <IMaskInput
                id='document'
                mask={[
                  { mask: '000.000.000-00', maxLength: 11 },
                  { mask: '00.000.000/0000-00' }
                ]}
                value={field.value as unknown as string}
                onAccept={(val: unknown) => field.onChange(String(val))}
                placeholder='000.000.000-00 ou 00.000.000/0000-00'
                inputMode='numeric'
                className={cn(
                  'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] md:text-sm',
                  fieldClass,
                  errors.document && '!border-red-400/70'
                )}
              />
            )}
          />
          {errors.document && (
            <p className='text-xs text-red-300'>{errors.document.message}</p>
          )}
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='phone' className='text-slate-200'>
            Telefone *
          </Label>
          <Controller
            name='phone'
            control={control}
            render={({ field }) => (
              <IMaskInput
                id='phone'
                mask={['(00) 0000-0000', '(00) 00000-0000']}
                value={field.value as unknown as string}
                onAccept={(val: unknown) => field.onChange(String(val))}
                placeholder='(11) 99999-9999'
                type='tel'
                inputMode='numeric'
                className={cn(
                  'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] md:text-sm',
                  fieldClass,
                  errors.phone && '!border-red-400/70'
                )}
              />
            )}
          />
          {errors.phone && (
            <p className='text-xs text-red-300'>{errors.phone.message}</p>
          )}
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='email' className='text-slate-200'>
            E-mail *
          </Label>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id='email'
                type='email'
                placeholder='seu@email.com'
                className={cn(
                  fieldClass,
                  errors.email && '!border-red-400/70'
                )}
              />
            )}
          />
          {errors.email && (
            <p className='text-xs text-red-300'>{errors.email.message}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/download/_components/catalog-form/components/CatalogFields.tsx
git commit -m "feat: adiciona campos do formulário de catálogo"
```

---

## Task 13: Componente `SuccessPanel`

**Files:**
- Create: `app/download/_components/catalog-form/components/SuccessPanel.tsx`

- [ ] **Step 1: Implementar painel de sucesso**

Create `app/download/_components/catalog-form/components/SuccessPanel.tsx`:

```tsx
'use client';

import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessPanelProps {
  email: string;
  onRestart: () => void;
}

export function SuccessPanel({ email, onRestart }: SuccessPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className='flex w-full flex-col items-center gap-5 text-center'>
      <div className='flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40'>
        <CheckCircle2
          className='h-9 w-9 text-emerald-300'
          strokeWidth={1.8}
        />
      </div>

      <div className='space-y-2'>
        <h2 className='text-2xl font-bold text-white sm:text-3xl'>
          Catálogo enviado!
        </h2>
        <p className='text-sm text-slate-200'>
          Enviamos o link de download para
          <br />
          <span className='font-semibold text-white'>{email}</span>.
        </p>
        <p className='text-xs text-slate-400'>
          Não encontrou na caixa de entrada? Verifique a pasta de spam. Link válido por 7 dias.
        </p>
      </div>

      <button
        type='button'
        onClick={onRestart}
        className='text-xs font-medium text-blue-300 underline-offset-4 hover:underline'>
        Solicitar para outro email
      </button>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/download/_components/catalog-form/components/SuccessPanel.tsx
git commit -m "feat: adiciona painel de sucesso do catálogo"
```

---

## Task 14: Componente `ExpiredBanner`

**Files:**
- Create: `app/download/_components/catalog-form/components/ExpiredBanner.tsx`

- [ ] **Step 1: Implementar banner topo**

Create `app/download/_components/catalog-form/components/ExpiredBanner.tsx`:

```tsx
import { AlertTriangle, Clock } from 'lucide-react';

interface ExpiredBannerProps {
  reason: 'expired' | 'invalid';
}

const COPY = {
  expired: {
    icon: Clock,
    title: 'Seu link expirou',
    description:
      'O link de download tem validade de 7 dias. Solicite o catálogo novamente abaixo.'
  },
  invalid: {
    icon: AlertTriangle,
    title: 'Link inválido',
    description:
      'Não conseguimos validar este link. Solicite um novo catálogo abaixo.'
  }
};

export function ExpiredBanner({ reason }: ExpiredBannerProps) {
  const { icon: Icon, title, description } = COPY[reason];
  return (
    <div className='mb-6 flex w-full max-w-md items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-amber-100 backdrop-blur-md'>
      <Icon className='mt-0.5 h-5 w-5 shrink-0 text-amber-300' />
      <div className='space-y-0.5'>
        <p className='text-sm font-semibold'>{title}</p>
        <p className='text-xs text-amber-100/85'>{description}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/download/_components/catalog-form/components/ExpiredBanner.tsx
git commit -m "feat: adiciona banner de link expirado/inválido"
```

---

## Task 15: Hook `useCatalogForm`

**Files:**
- Create: `app/download/_components/catalog-form/hooks/useCatalogForm.ts`

- [ ] **Step 1: Implementar hook**

Create `app/download/_components/catalog-form/hooks/useCatalogForm.ts`:

```ts
'use client';

import { useState } from 'react';

import {
  type CatalogRequestData,
  catalogRequestSchema
} from '@/lib/schemas/catalog-request';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Status = 'idle' | 'submitting' | 'success';

export function useCatalogForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [submittedEmail, setSubmittedEmail] = useState<string>('');

  const form = useForm<CatalogRequestData>({
    resolver: zodResolver(catalogRequestSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      document: '',
      phone: '',
      email: ''
    }
  });

  const onSubmit = async (values: CatalogRequestData) => {
    setStatus('submitting');
    try {
      const res = await fetch('/api/download-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(
          payload?.message || 'Não foi possível enviar. Tente novamente.'
        );
      }

      setSubmittedEmail(values.email);
      setStatus('success');
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Erro inesperado. Tente novamente em instantes.'
      );
      setStatus('idle');
    }
  };

  const restart = () => {
    form.reset();
    setSubmittedEmail('');
    setStatus('idle');
  };

  return { form, status, submittedEmail, onSubmit, restart };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/download/_components/catalog-form/hooks/useCatalogForm.ts
git commit -m "feat: adiciona hook useCatalogForm"
```

---

## Task 16: Container `CatalogForm`

**Files:**
- Create: `app/download/_components/catalog-form/CatalogForm.tsx`

- [ ] **Step 1: Implementar container client**

Create `app/download/_components/catalog-form/CatalogForm.tsx`:

```tsx
'use client';

import { Button } from '@/components/ui/button';

import { CatalogFields } from './components/CatalogFields';
import { SuccessPanel } from './components/SuccessPanel';
import { useCatalogForm } from './hooks/useCatalogForm';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';

export function CatalogForm() {
  const { form, status, submittedEmail, onSubmit, restart } = useCatalogForm();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = form;

  const submitting = status === 'submitting';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className='w-full max-w-md rounded-2xl border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-xl sm:p-10'>
      <AnimatePresence mode='wait'>
        {status === 'success' ? (
          <SuccessPanel
            key='success'
            email={submittedEmail}
            onRestart={restart}
          />
        ) : (
          <form
            key='form'
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
            noValidate>
            <CatalogFields control={control} errors={errors} />

            <Button
              type='submit'
              disabled={!isValid || submitting}
              className='h-11 w-full bg-blue-600 text-white hover:bg-blue-500 disabled:!bg-white/10 disabled:!text-slate-400'>
              {submitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Enviando...
                </>
              ) : (
                <>
                  Solicitar Catálogo
                  <ArrowRight className='ml-2 h-4 w-4' />
                </>
              )}
            </Button>
          </form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/download/_components/catalog-form/CatalogForm.tsx
git commit -m "feat: adiciona container CatalogForm"
```

---

## Task 17: Página `/download` (server component)

**Files:**
- Create: `app/download/page.tsx`

- [ ] **Step 1: Implementar a página**

Create `app/download/page.tsx`:

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';

import fabricaBg from '@/lib/images/extras/FabricaRemderNew.png';

import { CatalogForm } from './_components/catalog-form/CatalogForm';
import { ExpiredBanner } from './_components/catalog-form/components/ExpiredBanner';

export const metadata: Metadata = {
  title: 'Solicitar Catálogo — Profills Brasil',
  description:
    'Receba o catálogo completo da Profills no seu email. Máquinas envasadoras, embaladoras e linhas de produção industriais.'
};

type SearchParams = Promise<{ error?: 'expired' | 'invalid' }>;

export default async function DownloadPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;
  const validError = error === 'expired' || error === 'invalid' ? error : null;

  return (
    <main className='relative flex min-h-screen w-full items-center justify-center overflow-hidden'>
      <Image
        src={fabricaBg}
        alt=''
        fill
        priority
        placeholder='blur'
        sizes='100vw'
        className='object-cover'
      />
      <div className='absolute inset-0 bg-gradient-to-b from-slate-900/65 to-slate-950/85' />

      <div className='relative z-10 flex w-full flex-col items-center px-4 py-16 sm:py-24'>
        {validError && <ExpiredBanner reason={validError} />}
        <CatalogForm />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Type check + lint**

Run:
```bash
bun run lint && bunx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/download/page.tsx
git commit -m "feat: adiciona página /download com layout glass + background"
```

---

## Task 18: Verificação completa (build + lint + tests)

**Files:** nenhum modificado — apenas validação.

- [ ] **Step 1: Rodar suite de testes**

Run:
```bash
bun test
```

Expected: PASS — todos os testes (existentes + novos).

- [ ] **Step 2: Lint**

Run:
```bash
bun run lint
```

Expected: PASS sem warnings/erros.

- [ ] **Step 3: Type check**

Run:
```bash
bunx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 4: Build de produção**

Run:
```bash
bun run build
```

Expected: build conclui com `Route (app) /download` listada.

- [ ] **Step 5: Format**

Run:
```bash
bun run format
```

Expected: prettier reformata caso necessário, sem mudanças semânticas.

Se houve mudanças de formatação:

```bash
git add -u
git commit -m "style: format código do catálogo /download"
```

---

## Task 19: Verificação manual end-to-end

**Files:** nenhum — execução manual local.

- [ ] **Step 1: Configurar `.env.local`**

Garantir que `.env.local` contém:

```env
GMAIL_USER_SENDER="..."
GMAIL_APP_PASSWORD="..."
GMAIL_USER_RECEIVER="..."
SITE_URL="http://localhost:3000"
CATALOG_TOKEN_SECRET="$(openssl rand -base64 32)"
```

> Se ainda não tiver `CATALOG_TOKEN_SECRET`, gerar com `openssl rand -base64 32` no terminal e colar entre as aspas. Mínimo 32 bytes.

- [ ] **Step 2: Subir dev server**

Run:
```bash
bun dev
```

- [ ] **Step 3: Golden path**

Browser → `http://localhost:3000/download`. Validar visualmente:
1. Background `FabricaRemderNew` ocupando tela, overlay escuro, card glass centralizado.
2. CTA `Solicitar Catálogo` desabilitado.
3. Preencher form (CPF/CNPJ válido, telefone com máscara, email pessoal).
4. CTA habilita após zod validar tudo.
5. Click → spinner → painel de sucesso aparece com email confirmado.
6. Caixa pessoal recebe email com botão "Baixar Catálogo".
7. Caixa Profills (`GMAIL_USER_RECEIVER`) recebe notificação de lead.
8. Click no botão do email → browser baixa `Catalogo_ProfillsCompany.pdf` (77 MB).

- [ ] **Step 4: Edge cases**

1. Submeter form com CPF inválido (`111.111.111-11`) → erro inline "CPF ou CNPJ inválido", CTA mantém desabilitado.
2. Submeter form com email inválido → erro inline.
3. Adulterar última letra do token no link do email, abrir → redirect `/download?error=invalid` + `ExpiredBanner` no topo.
4. Acessar `/download?error=expired` direto → `ExpiredBanner` "Seu link expirou".

- [ ] **Step 5: Mobile responsivo**

DevTools → viewport 375px e 768px. Card mantém legibilidade, padding adapta, imagem cobre fundo sem cortar elementos críticos.

- [ ] **Step 6: Commit final (se algum ajuste de tuning visual surgir)**

Caso ajustes pequenos sejam necessários após observação visual:

```bash
git add -u
git commit -m "fix: ajustes visuais finais da tela /download"
```

---

## Task 20: Atualizar README/docs (opcional)

**Files:** nenhum por padrão. Apenas se README mencionar rotas existentes.

- [ ] **Step 1: Verificar README**

Run:
```bash
cat README.md
```

Se houver seção listando rotas/features, adicionar entrada para `/download`. Caso contrário, pular.

---

## Self-Review (realizado pelo planejador)

**1. Spec coverage — checklist por seção do spec:**

| Spec §  | Requisito | Task |
|---|---|---|
| §2 árvore arquivos | `validate-document.ts` | Task 2 |
| §2 árvore arquivos | `jwt-catalog.ts` | Task 3 |
| §2 árvore arquivos | `_shared/` extraction | Task 4 |
| §2 árvore arquivos | `catalog-request.ts` schema | Task 5 |
| §2 árvore arquivos | templates HTML cliente+interno | Tasks 6, 7 |
| §2 árvore arquivos | `email-catalog.ts` | Task 8 |
| §2 árvore arquivos | `app/api/download-catalog/route.ts` | Task 10 |
| §2 árvore arquivos | `app/api/download/[token]/route.ts` | Task 11 |
| §2 árvore arquivos | `CatalogFields`, `SuccessPanel`, `ExpiredBanner` | Tasks 12–14 |
| §2 árvore arquivos | `useCatalogForm` | Task 15 |
| §2 árvore arquivos | `CatalogForm` | Task 16 |
| §2 árvore arquivos | `app/download/page.tsx` | Task 17 |
| §2 stack | `jose` instalado | Task 1 |
| §2 env vars | `CATALOG_TOKEN_SECRET` | Task 9 |
| §3 data flow submit | POST + JWT + 2 emails | Task 10 |
| §3 data flow download | GET + verify + stream | Task 11 |
| §3 re-acesso expirado | redirect + banner | Tasks 11, 14, 17 |
| §4 schemas + algoritmo | validate-document + zod refine | Tasks 2, 5 |
| §5 API routes | POST e GET implementados | Tasks 10, 11 |
| §6 layout B | full-bleed + glass card + states | Tasks 12–17 |
| §7 emails | templates + envio | Tasks 6–8 |
| §8 refactor _shared | utilities extraídas | Task 4 |
| §9 error handling | zod, nodemailer, JWT, PDF missing | Tasks 5, 8, 10, 11 |
| §10 testing | unit + integration (manual e2e) | Tasks 2, 3, 5, 18, 19 |
| §11 YAGNI | nada implementado | (intencionalmente) |
| §12 riscos | tratados no design | (informativo) |

**2. Placeholder scan:** Nenhum "TBD"/"TODO"/"...". Algoritmos CPF/CNPJ totalmente detalhados em Task 2. Refactor em Task 4 lista linhas a remover e imports a alterar explicitamente.

**3. Type consistency:**
- `CatalogTokenPayload { email, name }` — usado consistente em `signCatalogToken`, `verifyCatalogToken`, route POST, módulo de email.
- `CatalogRequestData` exportado do schema, importado em hook, módulo de email, route POST.
- `SuccessPanel.props.email` e `onRestart` consistente com `useCatalogForm.submittedEmail` e `restart`.
- `Status = 'idle' | 'submitting' | 'success'` consistente entre hook e container.
- `reason: 'expired' | 'invalid'` consistente entre `verifyCatalogToken`, route GET, `ExpiredBanner`, `DownloadPage.searchParams`.

Plano validado.
