-- O autor aprovou os 8 posts da 0003 em 16/11/2026. A versão sobe 1, como numa publicação pelo admin.
-- Um post que já saiu do rascunho fica como está. As datas, um minuto à parte, fixam a ordem da listagem.

update blog_posts
set estado = 'publicado',
  versao = versao + 1,
  publicado_em = '2026-11-16T22:30:00.000Z',
  atualizado_em = '2026-11-16T22:30:00.000Z'
where slug = 'nata-no-stand-up-pouch-de-300-g-com-bico-no-lugar-do-pote'
  and estado = 'rascunho';

update blog_posts
set estado = 'publicado',
  versao = versao + 1,
  publicado_em = '2026-11-16T22:29:00.000Z',
  atualizado_em = '2026-11-16T22:29:00.000Z'
where slug = 'geleia-em-stick-no-lugar-do-pote-de-vidro'
  and estado = 'rascunho';

update blog_posts
set estado = 'publicado',
  versao = versao + 1,
  publicado_em = '2026-11-16T22:28:00.000Z',
  atualizado_em = '2026-11-16T22:28:00.000Z'
where slug = 'molho-de-tomate-em-stand-up-pouch-com-envase-mecanico'
  and estado = 'rascunho';

update blog_posts
set estado = 'publicado',
  versao = versao + 1,
  publicado_em = '2026-11-16T22:27:00.000Z',
  atualizado_em = '2026-11-16T22:27:00.000Z'
where slug = 'formar-o-pouch-na-maquina-ou-comprar-pre-formado'
  and estado = 'rascunho';

update blog_posts
set estado = 'publicado',
  versao = versao + 1,
  publicado_em = '2026-11-16T22:26:00.000Z',
  atualizado_em = '2026-11-16T22:26:00.000Z'
where slug = 'embalagem-gable-top-para-liquidos-e-secos-sem-aluminio'
  and estado = 'rascunho';

update blog_posts
set estado = 'publicado',
  versao = versao + 1,
  publicado_em = '2026-11-16T22:25:00.000Z',
  atualizado_em = '2026-11-16T22:25:00.000Z'
where slug = 'a-embalagem-certa-para-o-cafe'
  and estado = 'rascunho';

update blog_posts
set estado = 'publicado',
  versao = versao + 1,
  publicado_em = '2026-11-16T22:24:00.000Z',
  atualizado_em = '2026-11-16T22:24:00.000Z'
where slug = 'acordo-ue-mercosul-e-a-modernizacao-da-fabrica-em-2026'
  and estado = 'rascunho';

update blog_posts
set estado = 'publicado',
  versao = versao + 1,
  publicado_em = '2026-11-16T22:23:00.000Z',
  atualizado_em = '2026-11-16T22:23:00.000Z'
where slug = 'vagas-no-comercial-da-profills-em-curitiba'
  and estado = 'rascunho';
