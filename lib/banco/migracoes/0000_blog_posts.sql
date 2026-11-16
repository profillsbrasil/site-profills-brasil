-- 'novo' repete SLUGS_RESERVADOS de lib/blog/regras.ts; o teste do repositório confere os dois.
create table blog_posts (
  slug text primary key
    constraint slug_formato check (
      slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
      and char_length(slug) <= 60
      and slug <> 'novo'
    ),
  estado text not null
    constraint estado_conhecido check (estado in ('rascunho', 'publicado')),
  versao integer not null
    constraint versao_positiva check (versao > 0),
  criado_em timestamptz not null,
  atualizado_em timestamptz not null,
  publicado_em timestamptz,
  conteudo jsonb not null
    constraint conteudo_objeto check (jsonb_typeof(conteudo) = 'object'),
  constraint publicado_tem_data check ((estado = 'publicado') = (publicado_em is not null))
);

create index blog_posts_publicados on blog_posts (publicado_em desc)
  where estado = 'publicado';
