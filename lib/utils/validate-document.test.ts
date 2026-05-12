import { isValidCNPJ, isValidCPF, validateDocument } from './validate-document';

describe('isValidCPF', () => {
  it('aceita CPF válido sem máscara', () => {
    expect(isValidCPF('52998224725')).toBe(true);
  });

  it('aceita CPF válido com máscara', () => {
    expect(isValidCPF('529.982.247-25')).toBe(true);
  });

  it('rejeita CPF com dígito verificador errado', () => {
    expect(isValidCPF('52998224726')).toBe(false);
  });

  it('rejeita CPF com todos dígitos iguais', () => {
    expect(isValidCPF('11111111111')).toBe(false);
    expect(isValidCPF('00000000000')).toBe(false);
  });

  it('rejeita CPF com length diferente de 11', () => {
    expect(isValidCPF('12345')).toBe(false);
    expect(isValidCPF('123456789012')).toBe(false);
  });
});

describe('isValidCNPJ', () => {
  it('aceita CNPJ válido sem máscara', () => {
    expect(isValidCNPJ('11222333000181')).toBe(true);
  });

  it('aceita CNPJ válido com máscara', () => {
    expect(isValidCNPJ('11.222.333/0001-81')).toBe(true);
  });

  it('rejeita CNPJ com dígito verificador errado', () => {
    expect(isValidCNPJ('11222333000182')).toBe(false);
  });

  it('rejeita CNPJ com todos dígitos iguais', () => {
    expect(isValidCNPJ('11111111111111')).toBe(false);
  });

  it('rejeita CNPJ com length diferente de 14', () => {
    expect(isValidCNPJ('1234567890')).toBe(false);
  });
});

describe('validateDocument', () => {
  it('detecta e valida CPF (11 dígitos)', () => {
    expect(validateDocument('529.982.247-25')).toBe(true);
    expect(validateDocument('52998224725')).toBe(true);
  });

  it('detecta e valida CNPJ (14 dígitos)', () => {
    expect(validateDocument('11.222.333/0001-81')).toBe(true);
    expect(validateDocument('11222333000181')).toBe(true);
  });

  it('rejeita string com tamanho fora do esperado', () => {
    expect(validateDocument('1234')).toBe(false);
    expect(validateDocument('123456789012345')).toBe(false);
    expect(validateDocument('')).toBe(false);
  });
});
