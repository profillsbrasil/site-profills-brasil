import { getBestMachineRecommendation } from '../combinacaoMaquinas';
import { describe, expect, it } from 'vitest';

describe('getBestMachineRecommendation', () => {
  const casos: Array<{
    embalagem: string;
    produto: string;
    embalagemEsperada: string;
  }> = [
    {
      embalagem: 'cartonada',
      produto: 'liquidos',
      embalagemEsperada: 'Cartonada'
    },
    { embalagem: 'pouch', produto: 'liquidos', embalagemEsperada: 'Pouch' },
    {
      embalagem: 'especiais',
      produto: 'pastoso',
      embalagemEsperada: 'Especiais'
    },
    { embalagem: 'sache', produto: 'po', embalagemEsperada: 'Sachê' },
    { embalagem: 'garrafa', produto: 'liquidos', embalagemEsperada: 'Garrafa' },
    { embalagem: 'frasco', produto: 'liquidos', embalagemEsperada: 'Frasco' },
    { embalagem: 'fardo', produto: 'solido', embalagemEsperada: 'Fardo' },
    { embalagem: 'pote', produto: 'pastoso', embalagemEsperada: 'Pote' },
    // cobre os 2 tipos de produto que faltavam no vocabulário da UI
    { embalagem: 'pouch', produto: 'viscoso', embalagemEsperada: 'Pouch' },
    { embalagem: 'sache', produto: 'granular', embalagemEsperada: 'Sachê' }
  ];

  it.each(casos)(
    'recomenda máquina de prateleira compatível para embalagem $embalagem + produto $produto',
    ({ embalagem, produto, embalagemEsperada }) => {
      const recomendacao = getBestMachineRecommendation(embalagem, produto);

      expect(recomendacao).not.toBeNull();
      expect(recomendacao?.machine.tipoPagina).not.toBe('engenharia');
      expect(recomendacao?.machine.embalagensCompativeis).toContain(
        embalagemEsperada
      );
    }
  );

  it('retorna null quando embalagem ou produto não existem no vocabulário', () => {
    expect(getBestMachineRecommendation('inexistente', 'liquidos')).toBeNull();
    expect(getBestMachineRecommendation('pouch', 'inexistente')).toBeNull();
    expect(getBestMachineRecommendation('', '')).toBeNull();
  });
});
