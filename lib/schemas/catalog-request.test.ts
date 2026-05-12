import { catalogRequestSchema } from './catalog-request';

const valid = {
  name: 'Cliente Teste',
  document: '529.982.247-25',
  phone: '(11) 91234-5678',
  email: 'cliente@exemplo.com'
};

describe('catalogRequestSchema', () => {
  it('aceita payload válido', () => {
    expect(() => catalogRequestSchema.parse(valid)).not.toThrow();
  });

  it('rejeita name com menos de 2 caracteres', () => {
    expect(() =>
      catalogRequestSchema.parse({ ...valid, name: 'X' })
    ).toThrow();
  });

  it('rejeita document inválido (CPF/CNPJ malformado)', () => {
    expect(() =>
      catalogRequestSchema.parse({ ...valid, document: '111.111.111-11' })
    ).toThrow();
  });

  it('aceita CNPJ válido como document', () => {
    expect(() =>
      catalogRequestSchema.parse({ ...valid, document: '11.222.333/0001-81' })
    ).not.toThrow();
  });

  it('rejeita phone fora do formato (00) 00000-0000', () => {
    expect(() =>
      catalogRequestSchema.parse({ ...valid, phone: '11912345678' })
    ).toThrow();
  });

  it('rejeita email inválido', () => {
    expect(() =>
      catalogRequestSchema.parse({ ...valid, email: 'nao-eh-email' })
    ).toThrow();
  });
});
