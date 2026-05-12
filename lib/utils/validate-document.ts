const stripDigits = (raw: string) => raw.replace(/\D/g, '');

function calcCpfDigit(digits: string, factor: number): number {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += Number(digits[i]) * (factor - i);
  }
  const mod = sum % 11;
  return mod < 2 ? 0 : 11 - mod;
}

export function isValidCPF(raw: string): boolean {
  const cpf = stripDigits(raw);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  const d1 = calcCpfDigit(cpf.slice(0, 9), 10);
  const d2 = calcCpfDigit(cpf.slice(0, 9) + d1, 11);
  return cpf.endsWith(`${d1}${d2}`);
}

const CNPJ_W1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_W2 = [6, ...CNPJ_W1];

function calcCnpjDigit(digits: string, weights: number[]): number {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += Number(digits[i]) * weights[i];
  }
  const mod = sum % 11;
  return mod < 2 ? 0 : 11 - mod;
}

export function isValidCNPJ(raw: string): boolean {
  const cnpj = stripDigits(raw);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  const d1 = calcCnpjDigit(cnpj.slice(0, 12), CNPJ_W1);
  const d2 = calcCnpjDigit(cnpj.slice(0, 12) + d1, CNPJ_W2);
  return cnpj.endsWith(`${d1}${d2}`);
}

export function validateDocument(raw: string): boolean {
  const digits = stripDigits(raw);
  if (digits.length === 11) return isValidCPF(digits);
  if (digits.length === 14) return isValidCNPJ(digits);
  return false;
}
