# 0004. Login do admin do blog com senha, sessão em JWT e limite global de tentativas

Data: 2026-11-16 · Status: aceito · Issue: #44 · Emenda a consequência do ADR 0003 sobre o admin só no `bun dev`

## Contexto

Com os posts no Postgres (ADR 0003), o admin do blog precisa abrir em produção. Há um autor só. O `next start` roda na Railway atrás de proxy, e o `request.url` traz `localhost:8080`. Uma Server Action responde a POST direto, sem passar pela página, então cada action e route handler precisa conferir a sessão por conta própria.

## Decisão

1. Um usuário, configurado por env: `ADMIN_USUARIO`, `ADMIN_SENHA_HASH` e `ADMIN_SESSAO_SEGREDO`. Faltando um deles, o hash fora do formato ou o segredo com menos de 32 caracteres, o login fica fechado.
2. Senha com o scrypt do `node:crypto` (N = 2^15, r = 8, p = 1), no formato `scrypt:<N>:<r>:<p>:<sal>:<hash>` em base64url, sem `$`. O código fica em `lib/admin/senha.mjs`, JS puro, porque `scripts/admin-gerar-hash.mjs` roda por `node` sem build. O script lê a senha duas vezes do terminal sem eco, exige 16 caracteres, recusa argumento e stdout no terminal, e escreve só o hash.
3. Sessão sem estado: JWT HS256 (`jose`) no cookie `admin_sessao`, `httpOnly`, `sameSite: strict`, `path: /admin`, `secure` fora do `next dev`, 7 dias. A chave é o sha256 de segredo e hash juntos: trocar a senha derruba todas as sessões.
4. Limite global: a tabela `admin_tentativas_login` (migração 0002) soma cada tentativa num upsert atômico antes do scrypt. Mais de 10 em 15 minutos fecham o login até o fim da janela, até para a senha certa. Login certo zera a contagem. Banco fora fecha o login.
5. `abrirAdminBlog()` devolve o repositório só com sessão. Toda página, action e route handler do admin, fora de `entrar/`, chama a função; um teste importa cada página, route handler e arquivo com `'use server'` e confere que todo export recusa sem sessão e sem tocar no repositório. A página sem sessão redireciona para `/admin/entrar?volta=...` com endereço relativo; a volta só aceita `/admin/` com letras de slug. A action e a rota de imagem devolvem o motivo, sem redirect, para o editor não perder o texto.
6. Atalho de dev: `ADMIN_DEV_SEM_LOGIN=1` entra sem senha só com `NODE_ENV=development` e sem `DATABASE_URL`, isto é, num PGlite local. Um teste prova que ele é ignorado em `production`, em `test` e com `DATABASE_URL`.
7. As rotas do admin perdem o sufixo `.dev`, e o `pageExtensions` por fase sai do `next.config.ts`. `/admin/` entra no `disallow` do `robots.ts`. As Server Actions aceitam o Origin de `www.profills.com` e `profills.com` por `experimental.serverActions.allowedOrigins`.

## Alternativas rejeitadas

- **Sessão no banco**: revogar uma sessão isolada não paga a tabela e a limpeza com um autor só. Revogar tudo é trocar a senha.
- **Biblioteca de auth (Auth.js, better-auth)**: tabelas, provedores e config maiores que três funções para um usuário.
- **Limite por IP agora**: depende do cabeçalho que o proxy da Railway repassa, que ainda não foi medido. Fica como follow-up, não como recusa.
- **Checagem de login no `proxy.ts`**: a doc do Next pede só checagem otimista ali, e a action continuaria precisando da própria.
- **Entrar sem senha em qualquer `next dev`**: com `DATABASE_URL` no `.env` local o admin gravaria num Postgres de verdade sem senha.

## Consequências

- Qualquer um mantém o login fechado, até para o dono com a senha certa, mandando 11 requisições a cada janela de 15 minutos, sem fim. A sessão já aberta continua valendo pelos 7 dias. O limite por IP é o follow-up que resolve isso, depois de medir o cabeçalho de IP do proxy da Railway.
- O bloqueio sai no log como `error` uma vez por janela, na tentativa que fecha o login; as seguintes não escrevem (o logger de produção só escreve `error` sem `LOG_LEVEL`). Para destravar antes, apague a linha `global` de `admin_tentativas_login`.
- Um link de outro site para o admin chega sem o cookie `sameSite: strict` e cai no login.
- O que só a produção mede: se o proxy da Railway manda `X-Forwarded-Host` igual ao Origin (com o `allowedOrigins`, a action passa de qualquer jeito), se o cookie sai com `Secure` atrás do TLS do proxy, e qual cabeçalho traz o IP do visitante para o limite por IP.
- Sair do editor com mudança não salva pelo botão Sair descarta a mudança sem o aviso que os links da lateral dão.
