import {
  type MaquinaData,
  maquinasData
} from '@/app/(site)/maquinas/_components/cardMaquinas/maquinasData';

// Mapeamento dos tipos de produto da UI para os tipos das máquinas
const productTypeMapping: Record<string, string[]> = {
  liquidos: ['líquidos'],
  viscoso: ['líquidos'], // Viscoso é um tipo de líquido
  pastoso: ['pastosos', 'líquidos'], // Pastoso pode ser tratado como líquido em algumas máquinas
  po: ['pós', 'secos'],
  granular: ['sólidos', 'secos', 'pós'],
  solido: ['sólidos', 'secos']
};

// Mapeamento dos tipos de embalagem da UI para os tipos das máquinas
const packagingTypeMapping: Record<string, string[]> = {
  cartonada: ['Cartonada'],
  pouch: ['Pouch'],
  especiais: ['Especiais'],
  sache: ['Sachê'],
  garrafa: ['Garrafa'],
  frasco: ['Frasco'],
  fardo: ['Fardo'],
  pote: ['Pote']
};

export interface MachineRecommendation {
  machine: MaquinaData;
  compatibilityScore: number; // Score de compatibilidade (0-100)
}

export function findCompatibleMachines(
  selectedPackaging: string,
  selectedProductType: string
): MachineRecommendation[] {
  if (!selectedPackaging || !selectedProductType) {
    return [];
  }

  const productTypes = productTypeMapping[selectedProductType] || [];
  const packagingTypes = packagingTypeMapping[selectedPackaging] || [];

  const compatibleMachines: MachineRecommendation[] = [];

  // Buscar no catálogo JSON para validação adicional
  maquinasData.forEach((machine) => {
    // Verificar compatibilidade de embalagem
    const packagingMatch = machine.embalagensCompativeis.some((embalagem) =>
      packagingTypes.includes(embalagem)
    );

    if (packagingMatch) {
      // Para determinar compatibilidade de produto, vamos usar lógica baseada no tipo de máquina
      let productMatch = false;
      let compatibilityScore = 0;

      // Lógica específica por categoria de máquina
      switch (machine.categoria) {
        case 'Envasadoras':
          // Envasadoras geralmente aceitam líquidos, pós e sólidos
          if (
            productTypes.includes('líquidos') ||
            productTypes.includes('pós') ||
            productTypes.includes('secos') ||
            productTypes.includes('sólidos') ||
            productTypes.includes('pastosos')
          ) {
            productMatch = true;
            compatibilityScore = 90;
          }
          break;

        case 'Enfardadeiras':
          // Enfardadeiras trabalham com produtos já embalados
          if (
            productTypes.includes('sólidos') ||
            productTypes.includes('secos')
          ) {
            productMatch = true;
            compatibilityScore = 85;
          }
          break;

        case 'Embaladoras':
          // Embaladoras verticais geralmente para pós e sólidos
          if (
            productTypes.includes('pós') ||
            productTypes.includes('secos') ||
            productTypes.includes('sólidos')
          ) {
            productMatch = true;
            compatibilityScore = 88;
          }
          break;

        case 'Envolvedoras':
          // Envolvedoras para embalagem secundária
          productMatch = true;
          compatibilityScore = 70;
          break;

        case 'Outras':
          // Máquinas especiais - verificar caso a caso
          productMatch = true;
          compatibilityScore = 75;
          break;
      }

      // Ajustar score baseado no nome da máquina para casos específicos
      if (productMatch) {
        // Máquinas para líquidos específicos
        if (
          machine.name.toLowerCase().includes('líquidos') &&
          productTypes.includes('líquidos')
        ) {
          compatibilityScore = Math.min(100, compatibilityScore + 10);
        }

        // Máquinas para pós específicos
        if (
          machine.name.toLowerCase().includes('pós') &&
          productTypes.includes('pós')
        ) {
          compatibilityScore = Math.min(100, compatibilityScore + 10);
        }

        // Máquinas para sólidos específicos
        if (
          machine.name.toLowerCase().includes('sólidos') &&
          productTypes.includes('sólidos')
        ) {
          compatibilityScore = Math.min(100, compatibilityScore + 10);
        }

        compatibleMachines.push({
          machine,
          compatibilityScore
        });
      }
    }
  });

  // Ordenar por score de compatibilidade (maior primeiro)
  return compatibleMachines.sort(
    (a, b) => b.compatibilityScore - a.compatibilityScore
  );
}

export function getBestMachineRecommendation(
  selectedPackaging: string,
  selectedProductType: string
): MachineRecommendation | null {
  const compatibleMachines = findCompatibleMachines(
    selectedPackaging,
    selectedProductType
  );
  return compatibleMachines.length > 0 ? compatibleMachines[0] : null;
}

// Dados do formulário de contato quando não há máquina compatível
export interface ContactFormData {
  nome: string;
  email: string;
  empresa: string;
  contato: string;
  detalhes: string;
}

export const initialContactFormData: ContactFormData = {
  nome: '',
  email: '',
  empresa: '',
  contato: '',
  detalhes: ''
};
