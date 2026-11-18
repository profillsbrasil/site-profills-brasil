import path from 'node:path';

const PACOTES_3D = ['three', 'react-globe.gl', '@google/model-viewer'];

/** Arquivos que podem tocar 3D direto; o resto do app entra por eles. */
export const DOMINIO_3D = [
  'components/modelo3d/',
  'components/magicui/globe.tsx'
];

export function ehPacote3d(fonte: string) {
  return PACOTES_3D.some((p) => fonte === p || fonte.startsWith(`${p}/`));
}

export function relativoARaiz(cwd: string, arquivo: string) {
  return path.relative(cwd, arquivo).split(path.sep).join('/');
}

export function noDominio3d(relativo: string) {
  return DOMINIO_3D.some((d) =>
    d.endsWith('/') ? relativo.startsWith(d) : relativo === d
  );
}

export function ehModulo3d(fonte: string, cwd: string, arquivo: string) {
  if (ehPacote3d(fonte)) return true;
  let relativo: string;

  if (fonte.startsWith('@/')) relativo = fonte.slice(2);
  else if (fonte.startsWith('.'))
    relativo = relativoARaiz(cwd, path.resolve(path.dirname(arquivo), fonte));
  else return false;

  return (
    relativo.startsWith('components/modelo3d/') ||
    relativo.replace(/\.tsx?$/, '') === 'components/magicui/globe'
  );
}
