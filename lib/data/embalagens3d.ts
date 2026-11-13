import type { StaticImageData } from 'next/image';

import posterSoldasDuplo from '@/lib/images/embalagens3d/3-soldas-duplo.webp';
import posterBisnaga from '@/lib/images/embalagens3d/bisnaga.webp';
import posterFardo from '@/lib/images/embalagens3d/fardo.webp';
import posterFlowpack from '@/lib/images/embalagens3d/flowpack.webp';
import posterFrascosTubulares from '@/lib/images/embalagens3d/frascos-tubulares.webp';
import posterGableTop from '@/lib/images/embalagens3d/gable-top.webp';
import posterGalao from '@/lib/images/embalagens3d/galao.webp';
import posterGarrafa from '@/lib/images/embalagens3d/garrafas-02.webp';
import posterLataTinta from '@/lib/images/embalagens3d/lata-tinta.webp';
import posterPote from '@/lib/images/embalagens3d/pote02.webp';
import posterPouch from '@/lib/images/embalagens3d/pouch.webp';
import posterSache4Soldas from '@/lib/images/embalagens3d/sache-4-soldas.webp';
import posterSacheEspecial from '@/lib/images/embalagens3d/sache-especial.webp';
import posterSacheSaco from '@/lib/images/embalagens3d/sache-saco.webp';
import posterStick from '@/lib/images/embalagens3d/stick.webp';
import posterUht from '@/lib/images/embalagens3d/uht.webp';

/** O poster é o primeiro quadro do glb nesta cameraOrbit; mudar a órbita pede recapturar o poster */
export interface Embalagem3d {
  glb: string;
  cameraOrbit: string;
  poster: StaticImageData;
}

export const embalagens3d = {
  '3-soldas-duplo': {
    glb: '/embalagens-3d/3-soldas-duplo.glb',
    cameraOrbit: '38deg 72deg 100%',
    poster: posterSoldasDuplo
  },
  bisnaga: {
    glb: '/embalagens-3d/bisnaga.glb',
    cameraOrbit: '28deg 78deg 100%',
    poster: posterBisnaga
  },
  fardo: {
    glb: '/embalagens-3d/fardo.glb',
    cameraOrbit: '52deg 68deg 100%',
    poster: posterFardo
  },
  flowpack: {
    glb: '/embalagens-3d/flowpack.glb',
    cameraOrbit: '18deg 82deg 100%',
    poster: posterFlowpack
  },
  'frascos-tubulares': {
    glb: '/embalagens-3d/frascos-tubulares.glb',
    cameraOrbit: '43deg 77deg 100%',
    poster: posterFrascosTubulares
  },
  galao: {
    glb: '/embalagens-3d/galao.glb',
    cameraOrbit: '33deg 83deg 100%',
    poster: posterGalao
  },
  garrafa: {
    glb: '/embalagens-3d/garrafas-02.glb',
    cameraOrbit: '57deg 70deg 100%',
    poster: posterGarrafa
  },
  pote: {
    glb: '/embalagens-3d/pote02.glb',
    cameraOrbit: '270deg 40deg 100%',
    poster: posterPote
  },
  pouch: {
    glb: '/embalagens-3d/pouch.glb',
    cameraOrbit: '27deg 80deg 100%',
    poster: posterPouch
  },
  'sache-4-soldas': {
    glb: '/embalagens-3d/sache-4-soldas.glb',
    cameraOrbit: '32deg 86deg 100%',
    poster: posterSache4Soldas
  },
  'sache-especial': {
    glb: '/embalagens-3d/sache-especial.glb',
    cameraOrbit: '41deg 74deg 100%',
    poster: posterSacheEspecial
  },
  uht: {
    glb: '/embalagens-3d/uht.glb',
    cameraOrbit: '36deg 79deg 100%',
    poster: posterUht
  },
  'sache-saco': {
    glb: '/embalagens-3d/sache-saco.glb',
    cameraOrbit: '29deg 84deg 100%',
    poster: posterSacheSaco
  },
  stick: {
    glb: '/embalagens-3d/stick.glb',
    cameraOrbit: '20deg 120deg 100%',
    poster: posterStick
  },
  'gable-top': {
    glb: '/embalagens-3d/gable-top.glb',
    cameraOrbit: '45deg 75deg 100%',
    poster: posterGableTop
  },
  'lata-tinta': {
    glb: '/embalagens-3d/lata-tinta.glb',
    cameraOrbit: '190deg 66deg 100%',
    poster: posterLataTinta
  }
} as const satisfies Record<string, Embalagem3d>;
