import type { CategoriaCatalogo } from '@/lib/data/maquinas';

import {
  Box,
  Boxes,
  Droplets,
  Factory,
  type LucideIcon,
  Milk,
  Package,
  PackageCheck,
  PackageOpen
} from 'lucide-react';

/** Ícone por categoria do Catálogo 2026 — compartilhado entre as navbars. */
export const ICONE_CATEGORIA: Record<CategoriaCatalogo, LucideIcon> = {
  'Stand-up pouch': PackageOpen,
  'Embalagens cartonadas e especiais': Box,
  'Embalagens flexíveis': Package,
  'Fim de linha e embalagens flexíveis': PackageCheck,
  'Embalagens rígidas': Milk,
  'Embalagens rígidas e higienização': Droplets,
  'Fim de linha': Boxes,
  'Linhas completas e automação': Factory
};
