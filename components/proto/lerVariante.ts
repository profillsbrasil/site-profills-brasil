export function lerVariante(v: string | string[] | undefined) {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isInteger(n) && n >= 0 && n <= 6 ? n : 0;
}

export const ROTULOS_D1 = [
  'atual (blur/opacity via JS)',
  'sem entrada',
  'só a imagem/fundo se move',
  'só transform em CSS',
  'fade CSS curto, sem JS',
  'máscara em CSS',
  'realce sobre texto visível'
];

export const ROTULOS_D2 = [
  'atual (16 em 3D ao rolar)',
  'poster, 3D no hover/toque',
  'poster + botão "Ver em 3D"',
  '3D só no card central',
  'poster, 3D num modal',
  'como hoje, poster ao carregar',
  'poster, 3D em idle'
];

export const ROTULOS_D3 = [
  'atual (three + react-globe.gl)',
  'globo atual em idle, poster antes',
  'globo leve com cobe',
  'mapa pontilhado SVG + CSS',
  'imagem estática do globo',
  'globo real ao clicar/hover',
  'globo real só na tela, pausa fora'
];
