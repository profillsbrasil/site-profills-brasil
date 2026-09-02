# Indicação de vendedor via link (`?ref=`) — design

Data: 2026-09-02 · Issue: #28 · Branch: `issue-28-e`
Glossário: `CONTEXT.md` (seção Indicação, Contatos, Leads). Este documento usa os termos de lá.

## 1. Objetivo

O Vendedor divulga um Link de indicação (qualquer URL do site com `?ref=CODIGO`). Quem entra por ele vira Visitante indicado por 30 dias: todos os Contatos comerciais do site passam a mostrar o telefone, WhatsApp e e-mail do Vendedor, e todo Lead que ele enviar vai só para o e-mail do Vendedor. Contatos de suporte não mudam. A troca é silenciosa: nenhum card, rótulo ou aviso novo.

## 2. Decisões de produto (fechadas em 2026-09-02)

| #   | Decisão                | Escolha                                                                                                                                                                                    |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Validade da Indicação  | Cookie de 30 dias; um Link de indicação novo substitui o anterior (último clique vence)                                                                                                    |
| 2   | Destino do Lead        | Só o e-mail do Vendedor; Caixa padrão quando o código não resolve no envio                                                                                                                 |
| 3   | Visibilidade           | Troca totalmente silenciosa, sem card nem nome do Vendedor na UI                                                                                                                           |
| 4   | Vendedor sem telefone  | Telefone e WhatsApp padrão da Profills, e-mail do Vendedor                                                                                                                                 |
| 5   | Rotas do link          | `?ref` vale em qualquer rota do site                                                                                                                                                       |
| 6   | O que troca            | Footer "Vendas/Peças" (WhatsApp e e-mail), botão do hero da home, os 2 CTAs da ficha de máquina, destinatário dos 5 formulários                                                            |
| 7   | O que não troca        | Footer "Suporte e Assistência Técnica", footer "Compras (Fornecedores)", JSON-LD (`Organization.contactPoint`), landing `sorteio-fispal-2026`, botão do FAQ em Sobre (segue TODO sem link) |
| 8   | Arquitetura            | Páginas continuam estáticas; o Vendedor chega ao browser por cookie e React Context, não por `cookies()` no servidor                                                                       |
| 9   | Intervalo até resolver | Com cookie presente e antes da hidratação, o número fica oculto; nunca mostra o padrão para quem tem Indicação                                                                             |
| 10  | Quem resolve o código  | `proxy.ts` consulta o CRM e grava os dados no cookie assinado; não existe endpoint público de consulta                                                                                     |
| 11  | LGPD                   | Sem banner; cookie funcional de primeira parte com dados do Vendedor, não do visitante; mencionar na política de privacidade se ela existir                                                |

Substitui a seção 9 da issue #28: não há card do consultor, e a opção A/B da seção 4.3 da issue cai (a home não lê `searchParams`).

## 3. Fatos que o design respeita

Levantados em 2026-09-02 por leitura do repo e da doc oficial do Next.js.

- Next 16.2.6, sem `cacheComponents`. `cookies()` ou `searchParams` em layout ou page torna a rota dinâmica; hoje só `/download` é dinâmica e a issue #30 protegeu `/maquinas` disso.
- `middleware.ts` foi renomeado para `proxy.ts` no Next 16, runtime Node por padrão; lê `request.nextUrl.searchParams` e grava cookie com `response.cookies.set`.
- Não existe `proxy.ts`, nem uso de `cookies()`/`headers()` no repo.
- O número comercial `5541997851998` vive em 4 lugares que não se importam: `lib/seo/site.ts` (`TELEFONE_VENDAS`, com `+`), `lib/utils/whatsapp.ts` (`WHATSAPP_VENDAS`), `components/layout/footer.tsx` (3 constantes locais, Vendas/Suporte/Compras com o mesmo número e um TODO) e `app/(site)/(home)/_components/heroCarrossel/heroSlideCopy.tsx` (inline).
- Os 5 formulários (`/api/contact`, `/api/download-catalog`, `/api/montar-maquina`, `/api/monte-fabrica`, `/api/specifications`) enviam para `process.env.GMAIL_USER_RECEIVER`; nenhum schema tem campo de origem.
- `jose` já é dependência (usada em `lib/utils/jwt-catalog.ts`); `server-only` não é.
- `app/sitemap.ts` não gera querystrings; `robots.ts` permite `?ref` em qualquer rota.

## 4. Arquitetura

```
Link ?ref=CODIGO
   │
   ▼
proxy.ts (Node) ── código válido? ──► lib/crm/referral.ts ──► CRM (X-API-Key, cache 5 min, timeout 4 s)
   │                                        │
   │ grava cookie assinado (30 d)           │ 404/erro: não grava (ou apaga, na renovação)
   ▼
302 para a mesma URL sem ?ref
   │
   ▼
página estática (SSG) + IndicacaoProvider (client, lê o cookie na hidratação)
   │
   ├─► useContatoComercial() ──► footer Vendas/Peças, hero home, CTAs da máquina
   │
   └─► formulários enviam normalmente; o route handler lê o cookie da requisição,
       revalida o código no CRM e escolhe o destinatário
```

### 4.1 `proxy.ts` (raiz do projeto)

- `matcher`: todas as rotas de página, excluindo `/api`, `/_next`, arquivos estáticos (`.*\..*`), `sitemap.xml`, `robots.txt`, `opengraph-image`.
- Fluxo por requisição:
  1. `ref = normalizarCodigo(searchParams.get('ref'))`. Se a URL tem `?ref` (válido ou não): monta a URL sem o parâmetro `ref` (mantendo os demais) e responde 302 para ela. Se o código é válido, antes do redirect consulta o CRM; 200 grava o cookie, qualquer outro resultado não grava e não apaga um cookie anterior.
  2. Sem `?ref`: se há cookie válido com `consultadoEm` mais antigo que 24 h, consulta o CRM; 200 regrava o cookie com dados novos e validade renovada; 404 apaga o cookie; erro de rede/5xx mantém o cookie como está. Sem cookie, ou cookie recente: `NextResponse.next()` sem tocar em nada.
- Nunca bloqueia a página: qualquer exceção vira `NextResponse.next()` e um `logger.error` sem a chave.
- Consequência de SEO: o Google só vê URLs limpas; o canonical atual permanece correto.

### 4.2 Cookie `profills_indicacao`

- JWT HS256 assinado com `INDICACAO_COOKIE_SECRET` (mesmo padrão de `jwt-catalog.ts`, `jose`).
- Payload: `{ codigo, nome, email, contato: string | null, consultadoEm: ISO }`, `exp` = 30 dias.
- Atributos: `Path=/`, `Max-Age=2592000`, `SameSite=Lax`, `Secure` fora de `development`, **sem** `HttpOnly` (o browser precisa ler; nada no payload é segredo, é o que a UI mostra).
- Leitura no browser: `lib/indicacao/cookie-client.ts` decodifica o payload sem verificar assinatura (a verificação fica para o servidor); payload malformado = sem Indicação.
- Leitura no servidor (proxy e route handlers): `lib/indicacao/cookie-server.ts` verifica a assinatura com `jwtVerify`; assinatura inválida ou expirada = sem Indicação.

### 4.3 `lib/crm/referral.ts` (server-only)

O helper da issue #28 seção 4.1, com estes ajustes: `import 'server-only'` (adicionar a dependência), `logger` em vez de `console`, nunca loga a chave, e exporta `normalizarCodigo`, `buscarVendedorPorCodigo`, `formatarTelefoneBR`, `linkWhatsApp`. `fetch` com `cache: 'force-cache'`, `next: { revalidate: 300 }`, `AbortSignal.timeout(4000)`. Qualquer status diferente de 200 devolve `null`.

Nota: o `proxy.ts` roda fora do ciclo de página; se o Data Cache do `fetch` não se aplicar ali, o cache passa a ser um `Map` em memória por instância com TTL de 5 min dentro do helper. O plano de implementação verifica isso com um teste manual antes de decidir.

### 4.4 Fonte única de contatos: `lib/data/contatos.ts`

```ts
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

`lib/seo/site.ts` (`TELEFONE_VENDAS`, `EMAIL_COMERCIAL`), `lib/utils/whatsapp.ts` (`WHATSAPP_VENDAS`), `footer.tsx` e `heroSlideCopy.tsx` passam a derivar daqui. O TODO do footer (números de suporte e compras) continua, agora num único lugar.

### 4.5 `IndicacaoProvider` e `useContatoComercial()` (client)

- `components/indicacao/indicacaoProvider.tsx`: Client Component montado em `app/(site)/layout.tsx` envolvendo navbar, main e footer. Estado `{ status: 'hidratando' | 'sem-indicacao' | 'indicado', vendedor }`. Na hidratação lê o cookie; `useSyncExternalStore` com snapshot do servidor = `'hidratando'` para não divergir do HTML estático.
- `useContatoComercial()` devolve `{ pronto: boolean, telefone: string, whatsapp: (mensagem) => string, email: string }`:
  - `sem-indicacao`: dados de `CONTATO_PADRAO.vendas`, `pronto = true`.
  - `indicado`: e-mail do Vendedor; telefone e WhatsApp do Vendedor quando `contato` existe, senão os padrão; `pronto = true`.
  - `hidratando`: dados padrão e `pronto = false`. O componente esconde o texto do número e desabilita o link enquanto `pronto` for falso. Todo visitante fica em `hidratando` até a hidratação; a decisão 9 aceita esse intervalo.
- O grupo `(standalone)` não recebe o provider.

### 4.6 Pontos de UI

| Ponto                       | Arquivo                                         | Mudança                                                                                                                              |
| --------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Footer Vendas/Peças         | `components/layout/footer.tsx`                  | Usa `useContatoComercial()`; Suporte e Compras usam `CONTATO_PADRAO`                                                                 |
| Hero da home                | `.../heroCarrossel/heroSlideCopy.tsx`           | Usa `useContatoComercial().whatsapp(mensagem)`                                                                                       |
| CTA do hero da máquina      | `app/(site)/maquinas/[slug]/page.tsx`           | O `<a>` vira `BotaoEspecialista` (client) que recebe a mensagem por prop; a página segue Server Component com `generateStaticParams` |
| CTA de conversão da máquina | `.../maquinas/[slug]/_components/conversao.tsx` | Mesmo `BotaoEspecialista`                                                                                                            |

`BotaoEspecialista` vive em `components/indicacao/botaoEspecialista.tsx`, preserva classes e ícones atuais, e respeita `pronto` (sem href e com o número oculto enquanto resolve).

### 4.7 Leads

- Cada `app/api/*/route.ts` chama `resolverDestinatario(request)` de `lib/indicacao/destinatario.ts`: lê e verifica o cookie da requisição, revalida o código com `buscarVendedorPorCodigo`, e devolve `{ para: string, vendedor: VendedorIndicacao | null }`. Sem cookie, cookie inválido ou CRM sem 200: `para = GMAIL_USER_RECEIVER`, `vendedor = null`.
- As 5 funções de envio recebem `destinatario` como parâmetro adicional e usam `to: destinatario.para`. O e-mail ao cliente do catálogo (`sendClientCatalogEmail`) não muda.
- Templates internos ganham uma linha "Indicado por: {{nome}} ({{codigo}})" só quando `vendedor` existe.
- Nenhum schema zod muda: o código nunca vem no body, só no cookie.

### 4.8 Variáveis de ambiente

`.env.example` ganha, vazias: `CRM_BASE_URL`, `CRM_EXTERNAL_API_KEY`, `INDICACAO_COOKIE_SECRET`. Na Vercel: Production e Preview. Sem `CRM_*`, o helper devolve `null` e o site funciona sem Indicação; sem `INDICACAO_COOKIE_SECRET`, o proxy não grava cookie e loga um aviso uma vez.

## 5. Tratamento de erro

| Cenário                                       | Resultado                                                                     |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| `?ref` fora do formato                        | Redirect para URL limpa, sem cookie                                           |
| Código desconhecido ou Vendedor inativo (404) | Redirect sem cookie; na renovação, cookie apagado                             |
| CRM lento, 5xx, 401, 503, rede                | Redirect sem cookie; na renovação, cookie mantido; `logger.error` sem a chave |
| Cookie com assinatura inválida                | Ignorado no servidor; no browser, payload ilegível = sem Indicação            |
| Vendedor sem `contato`                        | E-mail do Vendedor, telefone padrão                                           |
| Lead com cookie cujo código já não resolve    | Caixa padrão, sem "Indicado por"                                              |
| Envs ausentes                                 | Site normal, sem Indicação                                                    |
| Segredo do cookie ausente                     | Proxy não grava nem apaga cookie; `?ref` ainda é removido da URL              |

## 6. Testes

- `lib/crm/referral.test.ts`: os casos da issue seção 4.2.
- `lib/indicacao/cookie-server.test.ts` e `cookie-client.test.ts`: assina, verifica, expira, rejeita assinatura errada, decodifica no browser.
- `proxy.test.ts`: `?ref` válido grava cookie e redireciona; inválido só redireciona; renovação após 24 h; 404 na renovação apaga; sem `?ref` e cookie recente não chama o CRM.
- `hooks/useContatoComercial.test.tsx`: os três estados e o caso sem telefone.
- `app/api/__tests__/`: cada handler envia para o Vendedor com cookie válido e para a Caixa padrão sem cookie ou com 404.
- Smoke em Preview: abrir `/maquinas/<slug>?ref=<código real>`, conferir redirect, cookie, número no footer e no CTA, enviar um formulário de teste e ver o destinatário.

## 7. Fora de escopo

Card do consultor, banner de cookies, rate limit no CRM, `cacheComponents`, números reais de Suporte e Compras (TODO existente), link do botão do FAQ.

## 8. Analytics (2026-09-02)

Duas coisas são medidas por vendedor: a chegada pelo link `?ref=` e o lead atribuído a ele.

| Onde | Chegada                                   | Lead                                               |
| ---- | ----------------------------------------- | -------------------------------------------------- |
| GA4  | `indicacao_chegada` `{ codigo_vendedor }` | `indicacao_lead` `{ codigo_vendedor, formulario }` |
| Meta | `IndicacaoChegada` `{ codigo_vendedor }`  | `IndicacaoLead` `{ codigo_vendedor, formulario }`  |

`formulario` é um de `contato`, `catalogo`, `montar-maquina`, `monte-fabrica`, `especificacoes`.

Decisões fechadas com o dono do produto:

1. Registrar duas coisas por vendedor: chegada pelo link e lead atribuído.
2. Só o código do vendedor vai para GA e Meta. Nunca nome, e-mail, telefone do vendedor nem dado do lead.
3. Meta: só eventos customizados (`fbq('trackCustom', ...)`); o evento padrão `Lead` não é disparado.
4. A chegada conta uma vez por sessão do navegador, marcada em `sessionStorage` na chave `indicacao_registrada:<CODIGO>`.
5. O lead conta só quando o handler de fato mandou o e-mail ao vendedor; o handler devolve `indicacao: { codigo } | null` no JSON de sucesso.
6. Lead sem indicação também dispara, com `codigo_vendedor: 'nenhum'`.

O disparo vive em `lib/analytics/indicacao.ts`: GA ou Pixel ausentes viram no-op, analytics nunca quebra a página. A chegada sai do `IndicacaoProvider` (efeito de cliente, depois da hidratação); o lead sai de cada hook de formulário, no caminho de sucesso.

`codigo_vendedor` e `formulario` precisam ser registrados como dimensões personalizadas de escopo de evento no admin do GA4; depois disso os relatórios levam de 24 a 48 h para mostrar os valores.
