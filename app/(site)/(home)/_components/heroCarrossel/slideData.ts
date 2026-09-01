import type { StaticImageData } from 'next/image';

import maquinaTc4s from '@/lib/images/novasImagens/maquinasEmbalagens/maquinas/TC 4S 200-1.png';
import maquinaTp85 from '@/lib/images/novasImagens/maquinasEmbalagens/maquinas/TP85.png';
import maquinaStick from '@/lib/images/novasImagens/maquinasEmbalagens/maquinas/tc-3sc-200-2.png';
import maquinaPouch from '@/lib/images/novasImagens/maquinasEmbalagens/pouch-render-maximo.png';
import embalagemPouch from '@/lib/images/novasImagens/maquinasEmbalagens/pouches.png';
import embalagemTc4s from '@/lib/images/novasImagens/maquinasEmbalagens/sache-4-soldas-1-via.png';
import embalagemTp from '@/lib/images/novasImagens/maquinasEmbalagens/sache-linha-tp-azul.png';
import embalagemStick from '@/lib/images/novasImagens/maquinasEmbalagens/stick.png';

export interface SlideMaquina {
  id: string;
  nome: string;
  categoria: string;
  /** Duas linhas com quebra controlada — cada uma vira um bloco whitespace-nowrap */
  titulo: [string, string];
  descricao: string;
  specs: { valor: string; unidade: string; label: string; prefixo?: string }[];
  imgMaquina: StaticImageData;
  imgEmbalagem: StaticImageData;
  /** Altura da embalagem em % da altura do palco (varia por slide) */
  embalagemAltura: string;
  embalagemEsquerda: string;
  /** Altura da máquina em % do palco — máquinas horizontais usam menos que o default 106% */
  maquinaAltura?: string;
  /** Títulos com linhas longas (25ch+) usam fonte fluida menor para nunca clipar */
  tituloCompacto?: boolean;
  rota: string;
  /** Nome curto usado no "A seguir:" da navegação */
  labelCurto: string;
}

export const AUTOPLAY_MS = 7000;

export const SLIDES: SlideMaquina[] = [
  {
    id: 'linha-tp',
    nome: 'Linha TP',
    categoria: 'Envasadora de sachês',
    titulo: ['Envase de sachês com', 'precisão e versatilidade'],
    descricao:
      'Envasa líquidos como polpas, laticínios, molhos e outros produtos em sachês.',
    specs: [
      { prefixo: 'até', valor: '3.000', unidade: 'un/h', label: 'Produção' },
      { valor: '85-300', unidade: 'mm', label: 'Largura do filme' },
      { valor: 'Inox', unidade: '304', label: 'Estrutura' }
    ],
    imgMaquina: maquinaTp85,
    imgEmbalagem: embalagemTp,
    embalagemAltura: '28%',
    embalagemEsquerda: '14%',
    rota: '/maquinas/1',
    labelCurto: 'TP · Sachês'
  },
  {
    id: 'linha-tc4s',
    nome: 'Linha TC',
    categoria: 'Sachê 4 soldas',
    titulo: ['Sachês com 4 soldas', 'e acabamento superior'],
    descricao:
      'Alta performance para produtos líquidos e secos, com formatos retangulares ou personalizados.',
    specs: [
      { prefixo: 'até', valor: '2.000', unidade: 'un/h', label: 'Produção' },
      { valor: '120-360', unidade: 'mm', label: 'Largura do filme' },
      { valor: 'Inox', unidade: '304', label: 'Estrutura' }
    ],
    imgMaquina: maquinaTc4s,
    imgEmbalagem: embalagemTc4s,
    embalagemAltura: '42%',
    embalagemEsquerda: '2%',
    rota: '/maquinas/2',
    labelCurto: 'TC · Sachê 4 soldas'
  },
  {
    id: 'linha-stick',
    nome: 'Linha Stick',
    categoria: 'Stick pack',
    titulo: ['Produção compacta', 'em até 4 vias simultâneas'],
    descricao:
      'Indicada para suplementos, condimentos, pós, géis e líquidos em embalagens stick práticas e resistentes.',
    specs: [
      { prefixo: 'até', valor: '4.000', unidade: 'un/h', label: 'Produção' },
      { valor: '200-360', unidade: 'mm', label: 'Largura do filme' },
      { valor: 'Inox', unidade: '304', label: 'Estrutura' }
    ],
    imgMaquina: maquinaStick,
    imgEmbalagem: embalagemStick,
    embalagemAltura: '30%',
    embalagemEsquerda: '6%',
    maquinaAltura: '96%',
    tituloCompacto: true,
    rota: '/maquinas/9',
    labelCurto: 'Stick · 1 a 4 vias'
  },
  {
    id: 'linha-pouch',
    nome: 'Linha Pouch',
    categoria: 'Stand-up pouch',
    titulo: ['Alta velocidade para', 'embalagens stand-up pouch'],
    descricao:
      'Linha automática para líquidos, pós, grãos e sólidos, indicada para operações de grande escala.',
    specs: [
      { prefixo: 'até', valor: '5.400', unidade: 'un/h', label: 'Produção' },
      { valor: '320-650', unidade: 'mm', label: 'Largura do filme' },
      { valor: '130-160', unidade: 'µm', label: 'Espessura do filme' }
    ],
    imgMaquina: maquinaPouch,
    imgEmbalagem: embalagemPouch,
    embalagemAltura: '34%',
    embalagemEsquerda: '2%',
    maquinaAltura: '84%',
    tituloCompacto: true,
    rota: '/maquinas/16',
    labelCurto: 'Pouch · Stand-up'
  }
];
