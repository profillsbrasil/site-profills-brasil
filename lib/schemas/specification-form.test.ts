import { specificationFormSchema } from './specification-form';
import { describe, expect, it } from 'vitest';

const valido = {
  nome: '  Ana  ',
  email: ' ana@exemplo.com ',
  telefone: '(11)   99999-9999 ',
  empresa: '  Profills ',
  maquinaSlug: ' tc4s ',
  maquinaNome: ' TC4s ',
  observacoes: '   '
};

function mensagens(entrada: Record<string, string | number | null>) {
  const resultado = specificationFormSchema.safeParse(entrada);

  return resultado.success
    ? []
    : resultado.error.issues.map((issue) => issue.message);
}

describe('specificationFormSchema', () => {
  it('apara os textos e transforma opcional em branco em undefined', () => {
    expect(specificationFormSchema.parse(valido)).toEqual({
      nome: 'Ana',
      email: 'ana@exemplo.com',
      telefone: '(11) 99999-9999',
      empresa: 'Profills',
      maquinaSlug: 'tc4s',
      maquinaNome: 'TC4s',
      observacoes: undefined
    });
  });

  it('trata campo ausente ou fora de texto como vazio', () => {
    expect(mensagens({ empresa: 42, observacoes: null })).toEqual([
      'Nome é obrigatório',
      'Nome deve ter pelo menos 2 caracteres',
      'E-mail é obrigatório',
      'E-mail inválido',
      'Telefone é obrigatório',
      'ex. (11) 99999-9999',
      'Slug da máquina é obrigatório',
      'Nome da máquina é obrigatório'
    ]);
  });

  it('descarta opcional fora de texto', () => {
    const dados = specificationFormSchema.parse({
      ...valido,
      empresa: 42,
      observacoes: null
    });

    expect(dados.empresa).toBeUndefined();
    expect(dados.observacoes).toBeUndefined();
  });
});
