import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';
import { render } from '@testing-library/react';

import { Relacionadas } from '../relacionadas';
import { describe, expect, it } from 'vitest';

describe('Relacionadas', () => {
  it('não renderiza nada quando o registry só tem a própria máquina (fase 0)', () => {
    const { container } = render(<Relacionadas maquina={piloto} />);
    expect(container.innerHTML).toBe('');
  });
});
