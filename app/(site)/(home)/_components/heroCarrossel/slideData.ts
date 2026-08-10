import type { StaticImageData } from 'next/image';

import maquinaTc4s from '@/lib/images/novasImagens/maquinasEmbalagens/maquinas/TC 4S 200-1.png';
import maquinaTp85 from '@/lib/images/novasImagens/maquinasEmbalagens/maquinas/TP85.png';
import embalagemTc4s from '@/lib/images/novasImagens/maquinasEmbalagens/sache-4-soldas-1-via.png';
import embalagemTp from '@/lib/images/novasImagens/maquinasEmbalagens/sache-linha-tp-azul.png';

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
    titulo: ['Precisão de dosagem,', 'sachê após sachê'],
    descricao:
      'Polpas, laticínios, molhos e outros líquidos ou secos, envasados com dosagem temporizada, volumétrica ou por bomba positiva.',
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
    nome: 'Linha TC4s',
    categoria: 'Sachê 4 soldas',
    titulo: ['Quatro soldas,', 'acabamento de gôndola'],
    descricao:
      'Envase em uma via com alto controle de dosagem, para líquidos e secos. Datação por alto relevo, inkjet ou hotstamping.',
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
    labelCurto: 'TC4s · Sachê 4 soldas'
  }
];
