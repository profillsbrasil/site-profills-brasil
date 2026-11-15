export const LIMITE_SLUG = 60;

export const PADRAO_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugValido = (slug: string) =>
  slug.length <= LIMITE_SLUG && PADRAO_SLUG.test(slug);

/** Minúsculas sem acento, com hífen no lugar de tudo que não é letra ou número. */
export const textoParaSlug = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const cortar = (slug: string, limite: number) =>
  slug.slice(0, limite).replace(/-+$/, '');

export function gerarSlug(titulo: string, ocupados: ReadonlySet<string>) {
  const base = cortar(textoParaSlug(titulo), LIMITE_SLUG) || 'sem-titulo';

  if (!ocupados.has(base)) return base;

  for (let n = 2; ; n++) {
    const sufixo = `-${n}`;
    const candidato = `${cortar(base, LIMITE_SLUG - sufixo.length)}${sufixo}`;

    if (!ocupados.has(candidato)) return candidato;
  }
}
