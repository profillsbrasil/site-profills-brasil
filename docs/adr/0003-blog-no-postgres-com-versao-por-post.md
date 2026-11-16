# 0003. Posts do blog no Postgres, com versão por post e migração no pre-deploy

Data: 2026-11-16 · Status: aceito · Issue: #44

## Contexto

O blog gravava cada post num JSON em `conteudo/blog/posts/`, e o admin só existia no `bun dev`. Para editar em produção, o post precisa de um lugar que sobreviva a deploy e que o `next start` da Railway alcance. A gravação em arquivo também perdia edição em silêncio: duas abas no mesmo post e a última vencia, e publicar fazia duas gravações seguidas.

## Decisão

1. Uma tabela `blog_posts`: colunas para identidade, estado, datas e `versao`; o `Post` inteiro num `jsonb` que o `postGuardadoSchema` valida na leitura. Um bloco novo no editor não pede migração.
2. SQL direto com `pg`, atrás do tipo `Consulta` (`lib/banco/tipos.ts`). Sem ORM.
3. Concorrência otimista: o editor devolve a `versao` que leu, e o `update ... where versao = $n` recusa a aba velha com a hora da outra gravação. Salvar, publicar e despublicar são uma instrução SQL só.
4. Migrador próprio em JS puro (`lib/banco/migrar.mjs`), com a tabela `banco_migracao` e `pg_advisory_lock`. Cada arquivo roda numa transação. `scripts/banco-migrar.mjs` roda no pre-deploy da Railway e sai 1 sem `DATABASE_URL`. O comando é `node scripts/banco-migrar.mjs`, no campo `deploy.preDeployCommand` do serviço `site`. Esse campo e a `DATABASE_URL` do serviço não vivem no repo: são ligados na Railway depois do merge do PR #61, e até lá nenhuma migração roda em produção.
5. A migração 0001 traz os 3 posts de exemplo, todos como rascunho. Depois dela `conteudo/blog/` saiu do repo.
6. Dev e testes rodam em PGlite: `bun dev` sem `DATABASE_URL` abre `.dados/pglite`, os testes abrem um em memória. Fora do `bun dev`, a falta de `DATABASE_URL` é erro na primeira consulta, nunca fallback.
7. Duas portas: `lib/blog/admin.ts` (`abrirAdminBlog`, escrita) e `lib/blog/leitura.ts` (posts publicados, com `connection()`, sem cache). A regra `profills/sem-banco-direto` barra o import de `lib/banco`, `lib/armazem` e `lib/blog/repositorio` fora delas.

## Alternativas rejeitadas

- **Drizzle**: tipos gerados e migrador pronto, mas dois pacotes e um tipo comum entre `pg` e PGlite para uma tabela com um `jsonb`.
- **Tabelas de linhas e blocos**: o editor lê e grava o post inteiro, e o union `Bloco` viraria uma terceira lista sincronizada à mão (TS, zod e SQL).
- **Manter o arquivo ao lado do banco**: versão otimista e slug único não têm implementação atômica em arquivo.
- **Script de importação rodado à mão contra produção**: exigiria credencial de produção na máquina local e a rede privada da Railway.
- **`railway.json` com `preDeployCommand`**: a skill `use-railway` marca o arquivo como deprecado e sem leitura a partir de 1º de dezembro de 2026. O pre-deploy vai no campo `deploy.preDeployCommand` do serviço.

## Consequências

- O admin continua só no `bun dev` até o login (B2, ADR 0004, que tirou essa restrição). As imagens continuam em `public/blog/` por uma interface `Armazem` mínima até o bucket (B3).
- O banco passa a ser a única cópia dos posts. O backup do Postgres da Railway precisa ser conferido antes de alguém escrever post de verdade.
- Migração só aditiva: durante o pre-deploy, o código antigo ainda roda contra o esquema novo.
- `'novo'` vive em `SLUGS_RESERVADOS` e no `check` do SQL; um teste insere cada slug reservado direto no banco e espera a recusa.
- O PGlite exige `serverExternalPackages` no `next.config.ts`; empacotado pelo Turbopack, o `next dev` quebra em `Can't resolve 'ws'`.
