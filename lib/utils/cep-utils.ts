export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

/**
 * Busca endereço através do CEP usando a API do ViaCEP
 */
export async function fetchAddressByCep(
  cep: string,
): Promise<ViaCepResponse | null> {
  const cleanCep = cep.replace(/\D/g, "");

  if (cleanCep.length !== 8) {
    throw new Error("CEP deve ter 8 dígitos");
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

    if (!response.ok) {
      throw new Error("Erro ao buscar CEP");
    }

    const data: ViaCepResponse = await response.json();

    if (data.erro) {
      throw new Error("CEP não encontrado");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro ao buscar CEP");
  }
}

/**
 * Formata CEP para o padrão brasileiro (00000-000)
 */
export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/(\d{5})(\d{0,3})/, (_, first, second) => {
    if (second) {
      return `${first}-${second}`;
    }
    return first;
  });
}
