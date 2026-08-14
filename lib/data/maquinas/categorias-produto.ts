import type { StaticImageData } from 'next/image';

import imgGraos from '@/lib/images/catalogo2026/produtos/graos.webp';
import imgLiquidos from '@/lib/images/catalogo2026/produtos/liquidos.webp';
import imgPastosos from '@/lib/images/catalogo2026/produtos/pastosos.webp';
import imgPos from '@/lib/images/catalogo2026/produtos/pos.webp';
import imgSolidos from '@/lib/images/catalogo2026/produtos/solidos.webp';

import type { CategoriaProduto } from './types';

export const categoriasProdutoInfo: Record<
  CategoriaProduto,
  { rotulo: string; img: StaticImageData }
> = {
  liquidos: { rotulo: 'Líquidos', img: imgLiquidos },
  pastosos: { rotulo: 'Pastosos', img: imgPastosos },
  pos: { rotulo: 'Pós', img: imgPos },
  graos: { rotulo: 'Grãos', img: imgGraos },
  solidos: { rotulo: 'Sólidos', img: imgSolidos }
};
