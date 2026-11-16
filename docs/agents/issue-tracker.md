# Issue tracker: GitHub

As issues e as specs deste repo ficam nas issues do GitHub (`profillsbrasil/site-profills-brasil`). Toda operação usa o `gh`.

## Convenções

- **Criar uma issue**: `gh issue create --title "..." --body "..."`. Corpo com várias linhas vai em heredoc.
- **Ler uma issue**: `gh issue view <número> --json number,title,body,labels,comments`.
- **Listar issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`, com os filtros `--label` e `--state` que couberem.
- **Tornar uma issue filha de outra**: `gh issue create --parent <pai> ...`, ou `gh issue edit <pai> --add-sub-issue <filha>` depois (`gh` 2.94 ou mais novo). No `gh` antigo: `gh api --method POST repos/<dono>/<repo>/issues/<pai>/sub_issues -F sub_issue_id=<id-de-banco-da-filha>`. Sem sub-issues, ponha `Parte de #<pai>` no topo do corpo da filha.
- **Comentar**: `gh issue comment <número> --body "..."`.
- **Pôr e tirar labels**: `gh issue edit <número> --add-label "..."` e `--remove-label "..."`.
- **Fechar**: `gh issue close <número> --comment "..."`.

O `gh` descobre o repo pelo `git remote` quando roda dentro do clone.

## Texto das issues

Título e corpo em pt-BR, com os termos do `GLOSSARY.md`. Nada publicado leva atribuição de IA.

## Pull requests como fila de triagem

**PRs como pedido externo: não.** O `/triage` lê esta linha. Troque para `sim` se o repo passar a tratar PR de fora como pedido de funcionalidade.

## Quando uma skill diz "publique no issue tracker"

Crie uma issue no GitHub.

## Quando uma skill diz "busque o ticket"

Leia a issue como em **Ler uma issue**.

## Operações do wayfinder

Usadas pelo `/wayfinder`. O **mapa** é uma issue, e as **filhas** são os tickets.

- **Mapa**: uma issue com a label `wayfinder:map`, com o corpo Notas, Decisões até aqui e Névoa. `gh issue create --label wayfinder:map`.
- **Ticket filho**: issue ligada ao mapa como sub-issue. Labels `wayfinder:<tipo>` (`research`, `prototype`, `grilling`, `task`). Quem assume o ticket fica como responsável.
- **Bloqueio**: dependência nativa do GitHub. `gh api --method POST repos/<dono>/<repo>/issues/<filha>/dependencies/blocked_by -F issue_id=<id-de-banco-da-bloqueadora>`, com o id numérico de banco (`gh api repos/<dono>/<repo>/issues/<n> --jq .id`), não o `#número`. Sem dependências, use a linha `Bloqueada por: #<n>, #<n>` no topo do corpo. O ticket fica livre quando todas as bloqueadoras fecham.
- **Fronteira**: liste as filhas abertas do mapa, tire as que têm bloqueadora aberta ou responsável; a primeira na ordem do mapa vence.
- **Assumir**: `gh issue edit <n> --add-assignee @me`.
- **Resolver**: `gh issue comment <n> --body "<resposta>"`, depois `gh issue close <n>`, e acrescente o ponteiro em Decisões até aqui do mapa.
