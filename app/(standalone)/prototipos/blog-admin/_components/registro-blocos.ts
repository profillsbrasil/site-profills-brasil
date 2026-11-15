import type { BlocoDoTipo, TipoBloco } from './tipos';
import {
  Download,
  Factory,
  Heading2,
  ImageIcon,
  Link,
  List,
  type LucideIcon,
  Pilcrow,
  Quote,
  Table,
  TriangleAlert,
  Video
} from 'lucide-react';

type DefinicaoBloco<T extends TipoBloco> = {
  tipo: T;
  nome: string;
  descricao: string;
  Icone: LucideIcon;
  criar: (id: string) => BlocoDoTipo<T>;
};

type RegistroBlocos = { [T in TipoBloco]: DefinicaoBloco<T> };

export const registroBlocos: RegistroBlocos = {
  titulo: {
    tipo: 'titulo',
    nome: 'Título de seção',
    descricao: 'Divide o texto em partes',
    Icone: Heading2,
    criar: (id) => ({ id, tipo: 'titulo', texto: '' })
  },
  paragrafo: {
    tipo: 'paragrafo',
    nome: 'Parágrafo',
    descricao: 'Texto corrido',
    Icone: Pilcrow,
    criar: (id) => ({ id, tipo: 'paragrafo', texto: '' })
  },
  imagem: {
    tipo: 'imagem',
    nome: 'Imagem',
    descricao: 'Uma foto com legenda',
    Icone: ImageIcon,
    criar: (id) => ({ id, tipo: 'imagem', src: null, legenda: '' })
  },
  lista: {
    tipo: 'lista',
    nome: 'Lista',
    descricao: 'Itens com marcador',
    Icone: List,
    criar: (id) => ({ id, tipo: 'lista', itens: [''] })
  },
  citacao: {
    tipo: 'citacao',
    nome: 'Citação',
    descricao: 'Fala de alguém, em destaque',
    Icone: Quote,
    criar: (id) => ({ id, tipo: 'citacao', texto: '', autor: '' })
  },
  tabela: {
    tipo: 'tabela',
    nome: 'Tabela',
    descricao: 'Comparação em linhas e colunas',
    Icone: Table,
    criar: (id) => ({
      id,
      tipo: 'tabela',
      linhas: [
        ['Item', 'Antes', 'Agora'],
        ['', '', '']
      ]
    })
  },
  video: {
    tipo: 'video',
    nome: 'Vídeo',
    descricao: 'Vídeo do YouTube dentro do post',
    Icone: Video,
    criar: (id) => ({ id, tipo: 'video', url: '', legenda: '' })
  },
  link: {
    tipo: 'link',
    nome: 'Link externo',
    descricao: 'Cartão que leva a outro site',
    Icone: Link,
    criar: (id) => ({ id, tipo: 'link', titulo: '', url: '' })
  },
  aviso: {
    tipo: 'aviso',
    nome: 'Aviso em destaque',
    descricao: 'Caixa azul para algo importante',
    Icone: TriangleAlert,
    criar: (id) => ({ id, tipo: 'aviso', titulo: '', texto: '' })
  },
  maquina: {
    tipo: 'maquina',
    nome: 'Cartão de máquina',
    descricao: 'Leva à página da máquina',
    Icone: Factory,
    criar: (id) => ({ id, tipo: 'maquina', slug: 'envasadora-gable-top-gt' })
  },
  download: {
    tipo: 'download',
    nome: 'Download',
    descricao: 'Arquivo para baixar, como o catálogo',
    Icone: Download,
    criar: (id) => ({ id, tipo: 'download', titulo: '', arquivo: 'PDF' })
  }
};

export const definicoesBlocos = Object.values(registroBlocos);
