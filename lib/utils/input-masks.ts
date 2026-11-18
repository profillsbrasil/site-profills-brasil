/**
 * Aplica máscara de telefone brasileiro
 */
export function applyPhoneMask(value: string) {
  const digits = value.replace(/\D/g, '');

  if (digits.length <= 10) {
    return digits.replace(
      /(\d{2})(\d{0,4})(\d{0,4})/,
      (_, ddd, first, second) => {
        if (second) {
          return `(${ddd}) ${first}-${second}`;
        }

        if (first) {
          return `(${ddd}) ${first}`;
        }

        if (ddd) {
          return `(${ddd}`;
        }

        return '';
      }
    );
  } else {
    return digits.replace(
      /(\d{2})(\d{0,5})(\d{0,4})/,
      (_, ddd, first, second) => {
        if (second) {
          return `(${ddd}) ${first}-${second}`;
        }

        if (first) {
          return `(${ddd}) ${first}`;
        }

        if (ddd) {
          return `(${ddd}`;
        }

        return '';
      }
    );
  }
}

/**
 * Aplica máscara de CEP
 */
export function applyCepMask(value: string) {
  const digits = value.replace(/\D/g, '');

  return digits.replace(/(\d{5})(\d{0,3})/, (_, first, second) => {
    if (second) {
      return `${first}-${second}`;
    }

    return first;
  });
}

/**
 * Remove todos os caracteres não numéricos
 */
export function removeNonDigits(value: string) {
  return value.replace(/\D/g, '');
}

/**
 * Valida se o telefone tem formato correto
 */
export function isValidPhoneFormat(phone: string) {
  return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(phone);
}

/**
 * Valida se o CEP tem formato correto
 */
export function isValidCepFormat(cep: string) {
  return /^\d{5}-\d{3}$/.test(cep);
}
