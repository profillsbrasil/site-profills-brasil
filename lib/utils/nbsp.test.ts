import { describe, expect, it } from 'vitest';

import { compostosJuntos } from './nbsp';

const NBSP = '\u00a0';

describe('compostosJuntos', () => {
  it('troca espaços ao redor de " + " por NBSP', () => {
    expect(compostosJuntos('PET + PE; PET + PE + alumínio')).toBe(
      `PET${NBSP}+${NBSP}PE; PET${NBSP}+${NBSP}PE${NBSP}+${NBSP}alumínio`
    );
  });

  it('não altera valores sem " + "', () => {
    expect(compostosJuntos('220 V / 60 Hz')).toBe('220 V / 60 Hz');
    expect(compostosJuntos('temporizada · bomba · volumétrica')).toBe(
      'temporizada · bomba · volumétrica'
    );
  });

  it('não toca "+" colado (sem espaços)', () => {
    expect(compostosJuntos('A+B')).toBe('A+B');
  });
});
