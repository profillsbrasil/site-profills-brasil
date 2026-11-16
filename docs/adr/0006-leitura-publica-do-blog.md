# 0006. Leitura pública do blog: dinâmica, 404 de verdade e um renderizador só

Data: 2026-11-16 · Status: aceito · Issue: #44

## Contexto

O blog já tinha banco (ADR 0003), admin com login (ADR 0004) e imagens no bucket (ADR 0005). Faltava o visitante ler, sem mudar o endereço dos posts (`/blog/<slug>`). O visual saiu do protótipo aprovado em 15/11/2026: listagem D, fundo de sketches em paralaxe, traço de linha fina e leitura 3 (capa larga e texto numa folha).

## Decisão

1. `/blog` e `/blog/[slug]` leem só por `lib/blog/leitura.ts`, que chama `connection()`: as duas páginas são dinâmicas, sem cache de dados, e o build não abre o banco. O `cache()` do React na leitura só junta a consulta do `generateMetadata` e a da página na mesma requisição.
2. `app/(site)/blog/not-found.tsx` responde ao `notFound()` de rascunho e de slug inexistente. O `app/not-found.tsx` da raiz redireciona para a home, e post despublicado precisa dar 404 para sair do índice do Google.
3. O sitemap junta os posts publicados num `try`. Banco fora loga o erro e devolve as páginas fixas e as máquinas. O `unstable_rethrow` repassa o sinal de rota dinâmica do `connection()`, que o `catch` engoliria no build.
4. Um renderizador só, `components/blog/conteudo-post.tsx`, com dois modos. `publico` tira o bloco sem conteúdo e transforma cartão em link. `previa` mostra o que falta e não navega, para o editor sujo não perder texto.
5. O fim do post sai do registry `assuntos` (`fim`): máquina leva à máquina citada no post e ao especialista, aviso leva ao suporte e a vendas, e todo assunto mostra até 3 outros posts.
6. O bloco `download` não guarda arquivo, só nome e tipo. Na página, ele leva a `/download`, o único caminho do site que entrega arquivo (catálogo com token).
7. O bloco `video` aceita só endereço do YouTube. O iframe do `youtube-nocookie.com` entra depois do clique.
8. O aviso mais novo fica fixado no topo da listagem por 30 dias depois de publicado.

## Alternativas rejeitadas

- **ISR ou `use cache` na listagem**: o post publicado no admin apareceria só depois da revalidação, e a issue #44 deixou cache de dados para depois.
- **Mudar o `app/not-found.tsx` da raiz**: muda o comportamento de todas as rotas, e a decisão do redirect é de outra frente.
- **Dois renderizadores, um no admin e outro na página**: a prévia deixaria de mostrar o que o visitante vê no primeiro bloco novo.

## Consequências

- Cada visita a `/blog` e a `/blog/<slug>` faz uma consulta ao Postgres. Com tráfego alto, o próximo passo é cache com revalidação no gravar do admin.
- Os sketches do fundo vivem em `lib/images/blog/` por import estático, decorativos (`aria-hidden`) e parados com `prefers-reduced-motion`.
- O link "Blog" entrou no footer. A navbar continua sem ele até a decisão do user.
