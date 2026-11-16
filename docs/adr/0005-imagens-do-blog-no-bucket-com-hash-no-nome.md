# 0005. Imagens do blog no bucket da Railway, com hash no nome e rota pública

Data: 2026-11-16 · Status: aceito · Issue: #44 · Emenda a consequência do ADR 0003 sobre as imagens em `public/blog/`

## Contexto

O admin do blog grava imagens em produção (ADR 0004). O disco do serviço `site` na Railway some a cada deploy, então `public/blog/` perderia as imagens. O bucket da Railway é S3 compatível e privado: não tem URL pública. O editor guarda no post o caminho `/blog/<slug>/<arquivo>`, que o `postSchema` valida pelo `PADRAO_CAMINHO_IMAGEM`.

## Decisão

1. Um `Armazem` mínimo em `lib/armazem/armazem.ts`: `gravar(chave, bytes, tipo)` e `ler(chave)`, que devolve stream e tamanho, `null` quando a chave não existe e lança quando o armazém não responde.
2. `escolherArmazem` decide pelo ambiente. Com qualquer uma das `AWS_*` (`AWS_ENDPOINT_URL`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME`, `AWS_DEFAULT_REGION`, `AWS_S3_URL_STYLE`), usa o S3 e valida o conjunto com zod. Sem nenhuma, o `bun dev` grava em `.dados/armazem`. Sem nenhuma fora do `bun dev`, ou com o conjunto incompleto, cada chamada falha com `ErroConfiguracao`, cuja mensagem cita só nomes de variável.
3. `AWS_S3_URL_STYLE` ignora caixa e separador: `virtual-hosted` (o padrão quando falta) usa o host do bucket, `path` ou `path-style` liga o `forcePathStyle`. Outro valor é erro de configuração.
4. O nome da imagem é `<nome-saneado>-<10 hex do sha256 do conteúdo>.<extensão pelos bytes>`, e a chave é o caminho sem a barra: `blog/<slug>/<arquivo>`. O mesmo arquivo dá o mesmo caminho, então o PUT é idempotente e não há corrida entre dois envios. Não existe tabela de imagens.
5. `GET /blog/[slug]/[arquivo]` (`app/(site)/blog/[slug]/[arquivo]/route.ts`) serve a imagem sem consultar o banco. Caminho fora do padrão dá 404 sem tocar no armazém; imagem ausente dá 404 com `max-age=60`; armazém fora dá 503 com `no-store`; a imagem sai com `Content-Type` pela extensão validada, `Content-Length`, `nosniff` e `public, max-age=31536000, immutable`.
6. O `next/image` otimiza a imagem pela rota sem `images.localPatterns`: no `next start` local, `/_next/image?url=%2Fblog%2F...&w=640&q=75` deu 200 com AVIF de 640 px.
7. A regra `profills/sem-banco-direto` também barra `@aws-sdk/client-s3` fora de `lib/armazem`, `lib/blog` e dos testes.

## Alternativas rejeitadas

- **URL assinada do bucket no HTML**: expira, quebra o cache do `next/image` e muda a cada render.
- **Bucket público ou CDN na frente**: o bucket da Railway não tem URL pública.
- **Nome livre com sufixo `-2`**: exigia ler o armazém antes de gravar e deixava corrida entre dois envios; o conteúdo de uma URL podia mudar, e o cache não podia ser `immutable`.
- **Imagens no Postgres**: o banco cresce com bytes que o bucket guarda mais barato, e cada imagem passaria pelo pool de 5 conexões.

## Consequências

- Imagem de rascunho responde a quem souber o caminho com hash. Não há listagem pública.
- Objetos órfãos ficam no bucket: trocar a capa ou apagar o bloco não apaga o arquivo. Não existe `apagar` nem limpeza nesta entrega.
- O backup do bucket não está configurado; junto do backup do Postgres (ADR 0003), precisa ser conferido antes de post de verdade.
- O dev sem `AWS_*` grava em `.dados/armazem`; com as `AWS_*` no `.env` local, o `bun dev` grava no bucket delas: nunca pôr ali as credenciais de produção.
- O teste de contrato roda o disco sempre e o S3 só com `TESTE_S3_ENDPOINT`, `TESTE_S3_CHAVE`, `TESTE_S3_SEGREDO` e `TESTE_S3_BUCKET` apontando para um S3 local descartável.
