-- 'imagens' e 'assuntos' repetem SLUGS_RESERVADOS de lib/blog/regras.ts, como 'novo' na 0000; o teste do repositório confere os dois.
alter table blog_posts
  add constraint slug_rota_admin check (slug not in ('imagens', 'assuntos'));
