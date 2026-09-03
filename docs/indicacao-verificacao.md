# Indicação de vendedor: como verificar e onde ler os dados

Guia operacional da Indicação (`?ref=CODIGO`) e do seu analytics. Design em `docs/superpowers/specs/2026-09-02-indicacao-vendedor-design.md`, decisões em `docs/adr/0001` e `docs/adr/0002`, glossário em `CONTEXT.md`.

## O que acontece quando alguém abre um link de vendedor

1. `proxy.ts` lê `?ref`, consulta o CRM com a chave do servidor, grava o cookie `profills_indicacao` (JWT assinado, 30 dias) e responde 302 para a mesma URL sem `?ref`.
2. O browser lê o cookie na hidratação; o card Vendas/Peças do rodapé, o link do hero e os dois botões "Falar com um especialista" das fichas de máquina passam a usar o e-mail e o WhatsApp do vendedor. Suporte, Compras, JSON-LD e a landing do sorteio não mudam.
3. Uma vez por aba, sai `indicacao_chegada` (GA4) e `IndicacaoChegada` (Meta) com `codigo_vendedor`.
4. Em qualquer um dos cinco formulários, o handler revalida o código no CRM, manda o e-mail só ao vendedor (com "Indicado por") e devolve `indicacao: { codigo } | null`; o browser dispara `indicacao_lead`/`IndicacaoLead` com `codigo_vendedor` e `formulario` (`nenhum` quando não há indicação).

## Teste manual em produção

Use um navegador comum, sem bloqueador de anúncios, e uma aba nova a cada teste (a chegada é marcada por aba em `sessionStorage`).

1. Abra `https://www.profills.com/?ref=<CODIGO>` com um código real de vendedor ativo. A URL perde o `?ref`.
2. Rodapé: Vendas/Peças mostra o e-mail do vendedor; Suporte segue `suporte@profillsdobrasil.com.br`. Nas fichas de máquina, os dois botões "Falar com um especialista" apontam para o WhatsApp do vendedor (conferido em desenvolvimento; em produção só o rodapé foi checado em 2026-09-02).
3. `?ref=NAO-EXISTE` em janela anônima: redireciona sem cookie e os contatos ficam os padrão.
4. Para o lead, envie um formulário com dados de teste; o e-mail chega ao vendedor do código.

Pelo terminal, sem browser:

```bash
curl -s -o /dev/null -D - "https://www.profills.com/sobre?ref=<CODIGO>" | grep -iE "^(HTTP|location|set-cookie)"
# 302, location: /sobre, set-cookie: profills_indicacao=...; Max-Age=2592000
```

## Onde ver os números no GA4

Conta do GA com acesso à propriedade `profills-do-brasil` (`G-31TMZCKJZM`).

**Ao vivo (30 minutos):** Relatórios → Tempo real, card "Contagem de eventos por Nome do evento". Clicar em `indicacao_chegada`, depois em `codigo_vendedor`, lista a contagem por código.

**Histórico:** Relatórios → Engajamento → Eventos. Na tabela, o "+" ao lado de "Nome do evento" adiciona as dimensões `codigo_vendedor` e `formulario`. Os valores aparecem de 24 a 48 h depois da criação das dimensões (feita em 2026-09-02). Exportação pelo ícone de compartilhar → Baixar arquivo.

**Tabela vendedor × chegadas × leads:** Explorar → Em branco; dimensões `Nome do evento`, `codigo_vendedor`, `formulario`; métrica `Contagem de eventos`; `codigo_vendedor` nas linhas, `Nome do evento` nas colunas, filtro "Nome do evento contém indicacao".

## Onde ver no Meta

Gerenciador de Eventos → pixel `1567963658356669`. A aba "Testar eventos" mostra `IndicacaoChegada` e `IndicacaoLead` ao vivo com os parâmetros; "Visão geral" dá a contagem por evento. A conferência no Gerenciador ainda não foi feita (2026-09-02). Em produção, os browsers automatizados de diagnóstico não emitiram nenhuma requisição `facebook.com/tr` (o `fbevents.js` descarta o beacon no cliente quando a UA é `HeadlessChrome`). No Brave do dono, com Shields desligado, o resource timing da página listou `facebook.com/tr?ev=IndicacaoChegada&cd[codigo_vendedor]=OTHAVIO`, o que indica o disparo, mas sem artefato guardado; em desenvolvimento a requisição foi capturada com pixel de teste. Falta a confirmação no Gerenciador.

## Armadilhas que custaram tempo em 2026-09-02

- **Browser automatizado não prova ingestão.** O `fbevents.js` traz um bloqueio de bots com `HeadlessChrome/` na lista e descarta o beacon no cliente: nenhuma requisição `facebook.com/tr` sai. No GA4 a requisição sai e o servidor responde 204, mas o tráfego conhecido de bot cai na exclusão automática dos relatórios, que o Google não deixa inspecionar. Só um navegador real conta.
- **Brave bloqueia o `gtag.js` mesmo com Shields desligado** para o site; nesse browser nem o `page_view` chega. Teste no Chrome, no celular ou em outro navegador.
- **`debug_mode` no DebugView.** Medido: um segundo `gtag('config', ..., { debug_mode: true })` depois do carregamento não marca os hits com `_dbg=1`, e `debug_mode` dentro dos parâmetros do evento vira só `ep.debug_mode`. O caminho que a doc do Google indica é o `debug_mode` no primeiro `config` (prop `debugMode` do `<GoogleAnalytics>`), não exercitado aqui.
- **Ordem dos scripts.** Na hidratação normal o efeito do Provider cai depois dos scripts inline de GA e Meta; quando a hidratação falha e o React refaz a página no cliente, cai antes, e `sendGAEvent` descarta o evento com um aviso. Por isso `lib/analytics/indicacao.ts` espera `gtag`/`dataLayer` e `fbq` existirem.
- **`sessionStorage` é por aba**, não por navegador: reabrir o link na mesma aba não conta; aba nova conta.
- **Sem browser, veja o `dataLayer` e a rede.** Com o site aberto, no console: `window.dataLayer` deve ter `config` antes de `event | indicacao_chegada`; em Network, filtro `collect`, a requisição traz `en=indicacao_chegada&ep.codigo_vendedor=<CODIGO>`.

## Envs e chaves

`CRM_BASE_URL`, `CRM_EXTERNAL_API_KEY`, `INDICACAO_COOKIE_SECRET` na Vercel (Production e Preview). `GMAIL_USER_RECEIVER` só existe em Production; um smoke de formulário em Preview precisa dela. A chave do CRM circulou em chat durante o desenvolvimento e o dono decidiu não rotacionar.

## Pendências

- Conferir `IndicacaoChegada` e `IndicacaoLead` no Gerenciador de Eventos do Meta.
- Decidir se o HTML estático deve trazer o contato padrão antes da hidratação (hoje sai sem `href`, decisão 9 da spec, contestada em revisão).
- Rate limit para `?ref` fica no CRM ou no firewall da Vercel, se um dia preocupar.
