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
// fotos) tem vitrine null: o popout mostra o placeholder, nunca máquina de
// outra categoria. `total` é quantas máquinas a linha do popout leva.
export type VitrinesDoMenu = Record<
  CategoriaCatalogo | 'todas',
  { vitrine: VitrineMenu | null; total: number }
>;

// Primeira máquina com foto da categoria, na ordem do registry.
function vitrineDe(maquinas: typeof maquinasCatalogo): VitrineMenu | null {
  const maquina = maquinas.find((m) => m.imagens);

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
  // SAFETY: o laço abaixo grava toda chave de categoriasCatalogo antes do
  // return, então o objeto devolvido tem todas as chaves de VitrinesDoMenu.
  const vitrines = {
    todas: {
      vitrine: vitrineDe(maquinasCatalogo),
      total: maquinasCatalogo.length
    }
  } as VitrinesDoMenu;

  for (const categoria of categoriasCatalogo) {
    const daCategoria = maquinasCatalogo.filter(
      (m) => m.categoria === categoria
    );

    vitrines[categoria] = {
      vitrine: vitrineDe(daCategoria),
      total: daCategoria.length
    };
  }

  return vitrines;
}
