# 0001. Indicação resolvida no proxy e gravada em cookie assinado; troca de contatos no client

Data: 2026-09-02 · Status: aceito · Spec: `docs/superpowers/specs/2026-09-02-indicacao-vendedor-design.md`

## Contexto

O site precisa mostrar os contatos do Vendedor para quem entrou por `?ref=CODIGO`, em todas as páginas, por 30 dias. O Vendedor vem de uma API do CRM protegida por chave, que não pode chegar ao browser. Todas as páginas do grupo (site) são estáticas hoje, e ler `cookies()` ou `searchParams` no servidor tornaria a rota inteira dinâmica (Next 16.2.6 sem `cacheComponents`). A issue #30 já protegeu `/maquinas` desse efeito.

## Decisão

1. Um `proxy.ts` captura `?ref`, consulta o CRM no servidor, grava um cookie JWT assinado com nome, e-mail, telefone e código do Vendedor, e redireciona para a URL sem `?ref`. Renova os dados a cada 24 h e apaga o cookie quando o CRM responde 404.
2. O browser lê o cookie na hidratação e distribui o Vendedor por React Context; os componentes de contato comercial trocam o número e o e-mail no client. Nenhuma página passa a ser dinâmica.
3. Não existe endpoint público de consulta por código além do próprio `?ref=`; um código conhecido continua resolvendo para nome, e-mail e telefone (é a natureza de um link de indicação), mas o cookie assinado evita um segundo endpoint enumerável e mantém a chave do CRM no servidor.

## Alternativas rejeitadas

- **`cookies()` no layout do (site)**: sem intervalo até o número aparecer, mas todas as páginas viram SSR.
- **Route Handler público `/api/referral`**: dados sempre frescos a cada visita, contra um cookie renovado a cada 24 h; em troca, um fetch a mais por visita.
- **`cacheComponents` (PPR)**: casca estática com buraco dinâmico, mas troca o modelo de cache do site inteiro por uma feature pequena.

## Consequências

- O proxy roda em toda requisição de página; sem `?ref` e sem cookie vencido ele retorna imediatamente.
- O visitante com cookie vê o número oculto por um instante até a hidratação.
- Um Vendedor desligado pode continuar aparecendo por até 24 h; os Leads não sofrem, porque cada envio revalida o código no CRM.
- Quem quiser trocar a arquitetura depois precisa mexer no proxy, no provider e nos 5 route handlers.
- Enumeração de códigos via `?ref` é possível; o teto do cache limita memória, e rate limit fica fora de escopo (spec §7).
