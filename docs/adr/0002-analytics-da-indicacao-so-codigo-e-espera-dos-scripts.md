# 0002. Analytics da Indicação: só o código do vendedor, evento customizado e espera pelos scripts

Data: 2026-09-02 · Status: aceito · Spec: `docs/superpowers/specs/2026-09-02-indicacao-vendedor-design.md` (seções 8 e 9) · PRs #33 e #34

## Contexto

Depois da Indicação (ADR 0001), o comercial quer saber, por vendedor, quantas visitas o link trouxe e quantas viraram lead. GA4 e Meta Pixel já estavam no site, só com `page_view`/`PageView`. O `?ref` nunca chega ao browser (o proxy redireciona antes), então nenhum parâmetro de URL vira dimensão sozinho; o dado tem que sair como evento. Os nomes de evento e de parâmetro viram contrato com dimensões personalizadas no admin do GA4, que não se renomeiam sem perder histórico.

## Decisão

1. Dois eventos com os mesmos parâmetros nos dois lados: `indicacao_chegada`/`IndicacaoChegada` com `codigo_vendedor`, e `indicacao_lead`/`IndicacaoLead` com `codigo_vendedor` e `formulario`. Nada além disso sai para Google ou Meta: nem nome, e-mail ou telefone do vendedor, nem dado do lead.
2. No Meta só `fbq('trackCustom')`; o evento padrão `Lead` fica de fora até a Profills querer otimizar anúncio por lead.
3. A chegada conta uma vez por aba (`sessionStorage`), enquanto o cookie de 30 dias existir. É "sessão com indicação", não "clique no link".
4. O lead conta só quando o handler mandou o e-mail ao vendedor: os cinco handlers devolvem `indicacao: { codigo } | null` e os formulários disparam com esse valor; sem indicação sai `nenhum`.
5. O disparo espera `window.gtag` com `dataLayer` (GA) e `window.fbq` (Meta) existirem, com tentativa síncrona e polling de 250 ms por cerca de 10 s, cada lado independente, desistindo em silêncio. `sendGAEvent` do `@next/third-parties` descarta com aviso quando o `dataLayer` não existe; a ordem entre o efeito do Provider e os scripts `afterInteractive` só é garantida na hidratação normal.
6. O código passa pelo formato do CRM antes de virar parâmetro; fora do formato não vira chegada e vira `nenhum` no lead.

## Alternativas rejeitadas

- **Contar clique no link** (proxy sinaliza a entrada com um cookie de uso único): número mais preciso, mas o dono do produto preferiu a semântica por sessão. Fica como mudança pequena e separada se o número precisar mudar.
- **Evento padrão `Lead` do Meta**: útil para otimizar campanha, mas muda o que o Pixel reporta hoje sem que haja anúncio rodando.
- **Disparo pelo servidor** (Measurement Protocol e Conversions API): imune a bloqueador e com atribuição exata, mas exige segredos novos, reconstruir `client_id`/`fbp` e deduplicação; custo alto para relatório interno.
- **Código e nome do vendedor** nos parâmetros: relatório mais legível, mas nome de funcionário vira dado pessoal no Google e na Meta.

## Consequências

- Relatórios por vendedor leem códigos; o CRM traduz código em pessoa. Vendedor que troca de código divide o histórico.
- Um visitante indicado que volta dias depois sem clicar em link conta chegada de novo; o cookie renova a cada 24 h de uso, então a janela desliza.
- Páginas do grupo `(standalone)` não disparam chegada (não têm o Provider).
- Os dois eventos existem no admin do GA4 como dimensões `codigo_vendedor` e `formulario` de escopo de evento, criadas em 2026-09-02; renomear evento ou parâmetro quebra o histórico.
- Se o GA ou o Pixel demorarem mais que a janela de espera, o evento se perde e a aba já ficou marcada; é aceito.
