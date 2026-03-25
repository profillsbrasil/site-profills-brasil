'use client';

import { OptimizedEmbalagem3d } from '@/components/modelo3d/optimizedEmbalagem3d';

// Mantido por compatibilidade com imports legados.
export function Embalagem3d() {
  return (
    <OptimizedEmbalagem3d
      modelSrc='/caixa-teste-3d.glb'
      alt='Modelo 3D - Tudo na caixa'
      cameraOrbit='40deg 75deg 105%'
      autoRotate={true}
      priority={false}
    />
  );
}
