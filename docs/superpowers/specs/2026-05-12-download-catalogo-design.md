# Design Spec — Rota `/download` com Envio de Catálogo por Email

**Data:** 2026-05-12
**Status:** Aprovado para implementação
**Autor:** Sessão de brainstorming colaborativa

---

## 1. Contexto e Objetivo

O site Profills hospeda um PDF de catálogo (`/public/downloads/Catalogo_ProfillsCompany.pdf`, **77.3 MB**) acessível como arquivo estático. Hoje qualquer visitante pode baixá-lo diretamente, o que impede a captura do lead.

**Objetivo:** criar uma rota `/download` que exige preenchimento de um formulário (nome, CPF/CNPJ, telefone, email) antes de liberar o catálogo. O catálogo **não é anexado** — em vez disso é enviado um **link único assinado** por email, válido por 7 dias, permitindo múltiplos downloads dentro do prazo. A Profills também recebe uma notificação interna do lead.

### Por que não anexar o PDF
O Gmail (transporter atual) tem limite de 25 MB por anexo. 77.3 MB falha. Comprimir o PDF de catálogo degradaria as imagens de produto. Hospedagem externa adiciona dependência operacional. **Link assinado mantém o PDF no controle do repositório e contorna o limite.**

### Por que JWT em vez de token persistido
O projeto não possui banco de dados. JWT assinado com HMAC é **stateless** — toda a informação necessária (email do cliente, expiração) vive na payload, validada pela assinatura. Zero migração, zero storage, zero acoplamento a infra adicional.

### Por que 7 dias, múltiplos downloads
Decisão do dono: cliente real frequentemente reabre o link para revisar/compartilhar internamente. Sete dias cobre a janela típica de avaliação inicial. Single-use foi rejeitado para não frustrar o uso legítimo. Compartilhamento eterno é mitigado pela expiração curta.

---

## 2. Arquitetura

### Árvore de arquivos (apenas novos / alterados)

```
app/
  download/
    page.tsx                                  [novo] server component
    _components/catalog-form/
      CatalogForm.tsx                         [novo] client container
      components/
        CatalogFields.tsx                     [novo] inputs do form
        SuccessPanel.tsx                      [novo] painel pós-envio
        ExpiredBanner.tsx                     [novo] banner topo se ?error=
      hooks/
        useCatalogForm.ts                     [novo] form state + submit
  api/
    download-catalog/route.ts                 [novo] POST: form → JWT → emails
    download/[token]/route.ts                 [novo] GET: valida JWT → stream PDF

lib/
  emails/catalog-request/
    email-catalog.ts                          [novo] sendClientEmail + sendLeadNotification
    email-template-client.html                [novo] HTML cliente
    email-template-internal.html              [novo] HTML Profills
  schemas/catalog-request.ts                  [novo] zod schema
  utils/validate-document.ts                  [novo] CPF/CNPJ algorithm
  utils/jwt-catalog.ts                        [novo] sign/verify wrappers (jose)

.env.example                                  [alterado] adiciona CATALOG_TOKEN_SECRET
package.json                                  [alterado] adiciona dependência `jose`
```

### Stack adicionado

- **`jose`** (~50KB) — biblioteca JWT moderna, Web Crypto nativa, ESM-only, compatível com Edge/Node. Substitui `jsonwebtoken` (legado, CJS, dependente de Node crypto).
- Validação CPF/CNPJ — implementada inline (~40 linhas), sem dependência adicional.

### Env vars

| Variável | Status | Uso |
|---|---|---|
| `CATALOG_TOKEN_SECRET` | **novo** | HMAC secret p/ JWT, mínimo 32 bytes random |
| `GMAIL_USER_SENDER` | existe | remetente dos emails |
| `GMAIL_APP_PASSWORD` | existe | App password Gmail |
| `GMAIL_USER_RECEIVER` | existe | destinatário notificação interna |
| `SITE_URL` | existe | base p/ montar link absoluto (`${SITE_URL}/api/download/{token}`) |

---

## 3. Data Flow

### 3.1 Submit do form

```
Browser
  └─ CatalogForm.onSubmit()
       └─ POST /api/download-catalog
            Body: { name, document, phone, email }
            ↓
            Server: app/api/download-catalog/route.ts
              1. catalogRequestSchema.parse(body)             → 400 se inválido
              2. token = signCatalogToken({ email, name }, '7d')
              3. downloadUrl = `${SITE_URL}/api/download/${token}`
              4. await Promise.all([
                   sendClientEmail({ email, name, downloadUrl }),
                   sendLeadNotification({ name, document, phone, email }),
                 ])                                            → 500 se nodemailer falhar
              5. return 200 { success: true }
       ↓
       Browser:
         - sucesso → setState('success'), AnimatePresence troca form por <SuccessPanel />
         - erro    → toast.error('Não foi possível enviar. Tente novamente.')
```

### 3.2 Click no link do email

```
Cliente clica botão "Baixar Catálogo" no email
  └─ GET /api/download/{token}
       ↓
       Server: app/api/download/[token]/route.ts
         1. payload = await verifyCatalogToken(token)
            ├─ ok    → continua
            ├─ expired → return Response.redirect('/download?error=expired', 302)
            └─ invalid → return Response.redirect('/download?error=invalid', 302)
         2. file = fs.createReadStream('public/downloads/Catalogo_ProfillsCompany.pdf')
                  ↳ se arquivo não existe → 500 + log
         3. return new Response(stream, headers: {
              Content-Type: 'application/pdf',
              Content-Disposition: 'attachment; filename="Catalogo_ProfillsCompany.pdf"',
              Content-Length: '<bytes>',
              Cache-Control: 'private, no-store',
            })
       ↓
       Browser: dispara download nativo
```

### 3.3 Re-acesso após expiração

```
Cliente abre link após 7 dias
  └─ /api/download/{token} → 302 → /download?error=expired
       ↓
       app/download/page.tsx lê searchParams.error
       <ExpiredBanner /> aparece no topo da tela com:
         "Seu link expirou. Solicite o catálogo novamente abaixo."
       Form aparece vazio, fluxo recomeça.
```

---

## 4. Schemas e Validação

### 4.1 `lib/schemas/catalog-request.ts`

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
    .min(1, 'CPF ou CNPJ obrigatório')
    .refine(validateDocument, 'CPF ou CNPJ inválido'),
  phone: z
    .string()
    .min(1, 'Telefone obrigatório')
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Formato: (00) 00000-0000'),
  email: z.email('Email inválido').max(180),
});

export type CatalogRequestData = z.infer<typeof catalogRequestSchema>;
```

### 4.2 `lib/utils/validate-document.ts`

```ts
const stripDigits = (raw: string) => raw.replace(/\D/g, '');

export function isValidCPF(raw: string): boolean {
  const cpf = stripDigits(raw);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;        // todos dígitos iguais
  // algoritmo dos dois dígitos verificadores
  // ...
}

export function isValidCNPJ(raw: string): boolean {
  const cnpj = stripDigits(raw);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  // algoritmo dos dois dígitos verificadores
  // ...
}

export function validateDocument(raw: string): boolean {
  const digits = stripDigits(raw);
  if (digits.length === 11) return isValidCPF(digits);
  if (digits.length === 14) return isValidCNPJ(digits);
  return false;
}
```

**Comportamento auto-detect:** o input usa máscara dinâmica via `react-imask`. À medida que o cliente digita, máscara troca entre `000.000.000-00` (até 11 dígitos) e `00.000.000/0000-00` (12–14 dígitos). Validação roda no submit; mensagens diferenciadas conforme tipo detectado.

### 4.3 `lib/utils/jwt-catalog.ts`

```ts
import { SignJWT, jwtVerify } from 'jose';

const getSecret = () => {
  const secret = process.env.CATALOG_TOKEN_SECRET;
  if (!secret) throw new Error('CATALOG_TOKEN_SECRET not set');
  return new TextEncoder().encode(secret);
};

export interface CatalogTokenPayload {
  email: string;
  name: string;
}

export async function signCatalogToken(
  payload: CatalogTokenPayload,
  exp = '7d'
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(getSecret());
}

export type VerifyResult =
  | { ok: true; payload: CatalogTokenPayload }
  | { ok: false; reason: 'expired' | 'invalid' };

export async function verifyCatalogToken(token: string): Promise<VerifyResult> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ['HS256'],
    });
    return {
      ok: true,
      payload: { email: payload.email as string, name: payload.name as string },
    };
  } catch (err: any) {
    if (err?.code === 'ERR_JWT_EXPIRED') return { ok: false, reason: 'expired' };
    return { ok: false, reason: 'invalid' };
  }
}
```

---

## 5. API Routes

### 5.1 `POST /api/download-catalog`

```ts
// app/api/download-catalog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { catalogRequestSchema } from '@/lib/schemas/catalog-request';
import { signCatalogToken } from '@/lib/utils/jwt-catalog';
import {
  sendClientCatalogEmail,
  sendLeadNotification,
} from '@/lib/emails/catalog-request/email-catalog';
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
      sendClientCatalogEmail({ ...data, downloadUrl }),
      sendLeadNotification(data),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logger.error('Erro ao processar solicitação de catálogo:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Dados inválidos', errors: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Erro ao enviar o catálogo. Tente novamente.' },
      { status: 500 }
    );
  }
}
```

### 5.2 `GET /api/download/[token]`

```ts
// app/api/download/[token]/route.ts
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

  return new Response(stream as any, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${PDF_FILENAME}"`,
      'Content-Length': String(stat.size),
      'Cache-Control': 'private, no-store',
    },
  });
}
```

> **Nota Next 16:** rota corre em runtime Node (default p/ rotas API que usam `fs`). Não declarar `runtime = 'edge'`.

---

## 6. Frontend — Tela `/download` (Layout B)

### 6.1 Estrutura

```tsx
// app/download/page.tsx
import Image from 'next/image';
import fabricaBg from '@/lib/images/extras/FabricaRemderNew.png';
import { CatalogForm } from './_components/catalog-form/CatalogForm';
import { ExpiredBanner } from './_components/catalog-form/components/ExpiredBanner';

export const metadata = {
  title: 'Solicitar Catálogo — Profills',
  description: 'Receba o catálogo completo da Profills por email.',
};

export default async function DownloadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: 'expired' | 'invalid' }>;
}) {
  const { error } = await searchParams;
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
      <div className='absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/85' />
      <div className='relative z-10 flex w-full flex-col items-center px-4 py-12'>
        {error && <ExpiredBanner reason={error} />}
        <CatalogForm />
      </div>
    </main>
  );
}
```

### 6.2 Tokens visuais (card glass)

```
container:   bg-white/8 backdrop-blur-xl
border:      border border-white/15
radius:      rounded-2xl
padding:     p-6 sm:p-10
max-width:   max-w-md w-full
text:        text-slate-100 (titles), text-slate-300 (subtitle)
input bg:    bg-white/5 border-white/15 text-slate-100 placeholder:text-slate-400
input focus: ring-2 ring-blue-400/40
cta:         bg-blue-600 hover:bg-blue-500 text-white disabled:bg-white/10
animation:   motion.div fade-in entrada, AnimatePresence swap form↔success
```

### 6.3 Estados

| Estado | Apresentação |
|---|---|
| `idle` | form preenchível, CTA desabilitado até `formState.isValid` |
| `submitting` | CTA mostra spinner + label "Enviando..." |
| `success` | form some, `<SuccessPanel />` aparece (check icon, "Catálogo enviado para {email}", dica spam, link "Solicitar outro") |
| `error` (rede / 500) | toast Sonner "Erro ao enviar. Tente novamente." form mantém valores |
| `?error=expired` | banner topo "⏰ Seu link expirou. Solicite novamente." |
| `?error=invalid` | banner topo "⚠ Link inválido. Solicite um novo catálogo." |

### 6.4 Otimização de imagem

A imagem `FabricaRemderNew.png` (1.7 MB PNG) é importada estaticamente. Next/Image gera variantes responsivas em AVIF/WebP automaticamente em build/runtime. `placeholder='blur'` produz blur low-res automaticamente. `priority` evita LCP penalty. `sizes='100vw'` informa o resolver de variantes.

---

## 7. Emails

### 7.1 Cliente — `email-template-client.html`

Reusa o pattern visual do `lib/emails/contact-form/email-template.html` (header dark, card content, CTA centralizado). Substituições:

```
{{subject}}        → "Seu catálogo Profills está pronto"
{{preheader}}      → "Acesse o catálogo completo da Profills"
{{name}}           → nome do cliente
{{downloadUrl}}    → URL assinada
{{validityNotice}} → "⏰ Link válido por 7 dias"
{{siteUrl}}        → SITE_URL
{{logoUrl}}        → ${siteUrl}/logo-branco.png
```

Estrutura do corpo:
1. Saudação "Olá, {{name}}!"
2. Texto "Obrigado pelo interesse na Profills. Seu catálogo completo está disponível abaixo."
3. **Botão CTA grande** (azul Profills) "Baixar Catálogo" → `{{downloadUrl}}`
4. Bloco aviso destacado "{{validityNotice}}. Após esse período, solicite novamente em [profills.com.br/download]({{siteUrl}}/download)."
5. Disclaimer "Não encontrou na inbox? Verifique a pasta de spam."
6. Footer Profills (logo + dados).

### 7.2 Profills (interno) — `email-template-internal.html`

Notificação minimal:
```
Subject:  Nova solicitação de catálogo — {{name}}
Header:   "Nova solicitação de catálogo"
Tabela:
  Nome      | {{name}}
  Documento | {{document}}
  Telefone  | {{phone}}
  Email     | {{email}}
  Data/Hora | {{timestamp}} (America/Sao_Paulo)
```

Sem CTA. Apenas registro do lead.

### 7.3 `email-catalog.ts`

```ts
export async function sendClientCatalogEmail(data: {
  name: string;
  email: string;
  downloadUrl: string;
}) {
  const transporter = createTransporter();
  const html = renderTemplate(readTemplate('email-template-client.html'), {
    subject: 'Seu catálogo Profills está pronto',
    preheader: 'Acesse o catálogo completo da Profills',
    name: data.name,
    downloadUrl: data.downloadUrl,
    validityNotice: '⏰ Link válido por 7 dias',
    siteUrl: process.env.SITE_URL!,
    logoUrl: `${process.env.SITE_URL}/logo-branco.png`,
  });

  await transporter.sendMail({
    from: { name: 'Profills Brasil', address: process.env.GMAIL_USER_SENDER! },
    to: data.email,
    subject: 'Seu catálogo Profills está pronto',
    html,
    text: `Olá, ${data.name}!\n\nBaixe seu catálogo aqui: ${data.downloadUrl}\nLink válido por 7 dias.\n\nProfills Brasil`,
  });
}

export async function sendLeadNotification(data: CatalogRequestData) {
  // semelhante, com email-template-internal.html, to: GMAIL_USER_RECEIVER
}
```

Reaproveita `createTransporter` e `renderTemplate` do módulo `contact-form/email-contact.ts`. **Refatorar:** extrair `createTransporter` e `renderTemplate` para `lib/emails/_shared/` p/ não duplicar.

---

## 8. Refatoração mínima escopo-aderente

Como o spec adiciona um segundo fluxo de email, é o momento natural de extrair as utilidades compartilhadas. Não é refactor especulativo — é necessário p/ não duplicar `createTransporter` e `renderTemplate`.

```
lib/emails/_shared/
  transporter.ts         [novo] createTransporter()
  template-engine.ts     [novo] renderTemplate() e readTemplate()
```

`contact-form/email-contact.ts` e `catalog-request/email-catalog.ts` importam de `_shared/`. Migração do contact-form é só trocar imports — comportamento idêntico.

---

## 9. Error Handling (consolidado)

| Cenário | Camada | Resultado |
|---|---|---|
| Body inválido (zod) | API POST | 400 + `{ message, errors }` |
| Nodemailer falhou | API POST | 500 + `{ message }`; toast no client |
| `CATALOG_TOKEN_SECRET` ausente | startup/runtime | throw na primeira chamada `getSecret()` — erro visível em dev e logs em prod |
| JWT expirado | API GET | 302 → `/download?error=expired` |
| JWT assinatura inválida ou malformado | API GET | 302 → `/download?error=invalid` |
| PDF não encontrado | API GET | 500 + log; raro (arquivo em /public, deploy-time) |
| Rate / abuse | — | YAGNI, fora de escopo |

---

## 10. Testing

### 10.1 Unit (Vitest)

| Teste | Arquivo |
|---|---|
| `validate-document` | CPFs válidos, inválidos, todos iguais, length errado, com/sem máscara |
| `validate-document` | CNPJs válidos, inválidos, todos iguais |
| `jwt-catalog` | sign + verify round-trip |
| `jwt-catalog` | verify retorna `{ ok: false, reason: 'expired' }` para token vencido |
| `jwt-catalog` | verify retorna `{ ok: false, reason: 'invalid' }` para assinatura tampered |
| `catalog-request schema` | parse válido + falha por campo |

### 10.2 Integration

Test do route handler `/api/download/[token]` com token sintético assinado em runtime — verifica headers de resposta (status 200, Content-Type, Content-Disposition) e status 302 com Location esperado para tokens inválidos/expirados.

### 10.3 Manual (golden path)

1. `.env.local` com `CATALOG_TOKEN_SECRET`, `GMAIL_*`, `SITE_URL`.
2. `bun dev`.
3. Visitar `/download`, preencher form com email pessoal.
4. Submit → ver SuccessPanel.
5. Conferir 2 emails: cliente + caixa Profills.
6. Clicar botão no email → browser baixa PDF 77 MB.
7. Re-clicar mesmo link após algumas horas → ainda funciona (múltiplos downloads).
8. (manual time travel: usar token expirado pré-gerado em test) → redirect com banner expired.
9. Adulterar último char do token → redirect com banner invalid.

---

## 11. Out of scope (YAGNI explícito)

- Rate limiting por IP
- CAPTCHA / hCaptcha
- Persistência do lead em DB
- Audit log de downloads (decisão do dono: não logar)
- Single-use token
- Hotlink protection avançado / signed URLs com restrição de origem
- Tracking de cliques no email (open/click pixels)
- A/B test do form

Esses itens podem ser revisitados quando houver sinal real de abuso ou necessidade de analytics.

---

## 12. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Cliente compartilha link em grupos públicos | média | médio | Expiração 7 dias limita janela |
| PDF 77 MB causa timeout em conexões lentas | baixa | médio | Stream nativo (não buffer em memória), `Content-Length` correto |
| Gmail marca email como spam | média | alto | SPF/DKIM no domínio Profills, texto plano de fallback, sem links suspeitos |
| Bot enche caixa Profills de leads falsos | baixa-média | baixo | YAGNI inicial; adicionar rate limit / captcha se aparecer |
| `CATALOG_TOKEN_SECRET` vaza em logs | baixa | alto | Nunca logar `process.env`; carregamento via `getSecret()` lazy |

---

## 13. Checklist de implementação (alto nível)

1. `bun add jose`
2. Criar `lib/utils/validate-document.ts` + testes
3. Criar `lib/utils/jwt-catalog.ts` + testes
4. Extrair `lib/emails/_shared/{transporter,template-engine}.ts` e ajustar `contact-form/email-contact.ts`
5. Criar `lib/schemas/catalog-request.ts` + testes
6. Criar `lib/emails/catalog-request/{email-catalog.ts,email-template-client.html,email-template-internal.html}`
7. Criar `app/api/download-catalog/route.ts`
8. Criar `app/api/download/[token]/route.ts`
9. Criar `app/download/page.tsx` + `_components/catalog-form/*`
10. Adicionar `CATALOG_TOKEN_SECRET` em `.env.example`
11. Verificação manual completa (seção 10.3)
12. Lint + format + test
