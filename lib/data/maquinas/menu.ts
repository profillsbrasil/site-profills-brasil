import type { StaticImageData } from 'next/image';

import { maquinasCatalogo } from './index';
import { type CategoriaCatalogo, categoriasCatalogo } from './types';

// O que o popout de Máquinas da navbar mostra de uma máquina.
export interface VitrineMenu {
  slug: string;
  nome: string;
  subtitulo: string;
  imagem: StaticImageData;
}

// `todas` é o item "Todas as máquinas". Categoria só de engenharia (sem
// fotos) fica null: a vitrine mostra o placeholder, nunca máquina de outra
// categoria.
export type VitrinesDoMenu = Record<
  CategoriaCatalogo | 'todas',
  VitrineMenu | null
>;

// Primeira máquina com foto da categoria, na ordem do registry.
function vitrineDe(categoria: CategoriaCatalogo | null): VitrineMenu | null {
  const maquina = maquinasCatalogo.find(
    (m) => m.imagens && (categoria === null || m.categoria === categoria)
  );
  if (!maquina?.imagens) return null;
  return {
    slug: maquina.slug,
    nome: maquina.nome,
    subtitulo: maquina.nomeCompleto.split(' - ')[1] ?? maquina.categoria,
    imagem: maquina.imagens.maquina
  };
}

// Roda no servidor (layout do grupo (site)): a navbar recebe só este
// registro, sem o catálogo completo no bundle de toda rota.
export function montarVitrinesDoMenu(): VitrinesDoMenu {
  const vitrines = { todas: vitrineDe(null) } as VitrinesDoMenu;
  for (const categoria of categoriasCatalogo) {
    vitrines[categoria] = vitrineDe(categoria);
  }
  return vitrines;
}
