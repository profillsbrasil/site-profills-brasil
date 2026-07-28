# Footer — WhatsApp direto sem número visível

**Data:** 2026-07-28 · **Status:** aprovado (mockup validado no visual companion, desktop + mobile 390px)

## Decisão

Manter o footer atual **exatamente como está** (estrutura, grid, logos, BlurFade,
copiar CNPJ) e mudar apenas o bloco de contatos + 4 melhorias pontuais aprovadas.
Redesigns foram apresentados e descartados pelo usuário.

## O que muda

### 1. Contatos (`contacts` em `components/layout/footer.tsx`)

- **Nenhum número de telefone visível.** As linhas `tel:` somem.
- Cada um dos 3 setores ganha uma linha **"Conversar no WhatsApp"** no mesmo
  estilo visual das linhas de e-mail (ícone + texto, `text-xs md:text-sm`),
  inclusive **Suporte**, que hoje só tem e-mail — de quebra os 3 cards ficam da
  mesma altura (some o buraco do card do meio).
- Link: `https://wa.me/<NUMERO>?text=<MENSAGEM>` com mensagem pré-preenchida por
  setor, ex.: `Olá! Vim pelo site da Profills e quero falar com Vendas/Peças.`
- Números por setor em constantes no topo do arquivo (padrão já usado em
  `app/(standalone)/sorteio-fispal-2026/page.tsx`).

| Setor | Número | Mensagem pré-preenchida |
| --- | --- | --- |
| Vendas/Peças | **A CONFIRMAR** | Olá! Vim pelo site da Profills e quero falar com Vendas/Peças. |
| Suporte e Assistência Técnica | **A CONFIRMAR** | Olá! Vim pelo site da Profills e preciso de suporte técnico. |
| Compras (Fornecedores) | **A CONFIRMAR** | Olá! Vim pelo site da Profills e quero falar com Compras. |

### 2. Fade do grid no topo (1 linha)

`<GridPattern />` do footer ganha
`className='[mask-image:linear-gradient(to_bottom,transparent_0,black_80px,black_100%)]'`
— mesmo padrão já aplicado em `/sorteio-fispal-2026` (commit `c88841d`). Elimina
a emenda seca do grid contra a seção clara acima.

### 3. Link do Pro-Fills Cartons (1 linha)

`href='#'` (morto) → URL real do site Cartons. **URL A CONFIRMAR** (domínio
`profillscartons.com` existe mas pode ainda não estar anexado ao projeto Vercel —
verificar antes de apontar). `target='_blank' rel='noopener noreferrer'`.

### 4. Acessibilidade dos links de WhatsApp

Três links com texto idêntico são ambíguos pra leitor de tela:
- `aria-label='Conversar no WhatsApp com <setor>'` em cada um;
- `target='_blank' rel='noopener noreferrer'` (wa.me é externo).

### Ícone novo

`WhatsAppIcon` custom (path SVG `fill='currentColor'`), no mesmo padrão dos
ícones de `components/layout/socialLinks.tsx` — lucide ^1.16 não tem ícones de
marca. Atenção ao teste `components/layout/lucide-social-regression.test.ts` ao
adicionar.

## O que NÃO muda

- Estrutura/ordem das seções, logo, manifesto, divisor Cartons, bloco social,
  copyright + copiar CNPJ, animações BlurFade, responsividade existente.
- Ícones dos cabeçalhos dos cards (Phone/Mail/MapPin) — melhoria sugerida e
  **adiada** por decisão do usuário (reavaliar com o footer no ar).
- Navegação (sitemap) e endereço no footer — explorados no brainstorm e
  **descartados** nesta rodada.

## Verificação de pronto

1. **Funcional:** clique em cada linha WhatsApp abre `wa.me` do setor certo com a
   mensagem pré-preenchida; nenhum dígito de telefone renderizado no footer
   (grep no HTML renderizado).
2. **Perceptual:** screenshot desktop + mobile lado a lado com o mockup aprovado
   (`.superpowers/brainstorm/492668-1785254136/content/footer-real*.html`);
   cards com alturas iguais; fade do grid visível na emenda.
3. **Dados:** os 3 números conferidos com o usuário antes do commit.
