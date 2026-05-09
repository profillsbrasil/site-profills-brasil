import type { StaticImageData } from 'next/image';

import acaiAmazonas from '@/lib/images/logoClientes/acai-amazonas.png';
import agropecuariaLopes from '@/lib/images/logoClientes/agropecuaria-lopes.png';
import amazonPolpa from '@/lib/images/logoClientes/amazon-polpa-escrito.webp';
import ambev from '@/lib/images/logoClientes/ambev.png';
import apimigot from '@/lib/images/logoClientes/apimigot.png';
import arafruty from '@/lib/images/logoClientes/arafruty.jpg';
import bandolin from '@/lib/images/logoClientes/bandolin.png';
import basecolMix from '@/lib/images/logoClientes/basecol-mix.png';
import bonyAcai from '@/lib/images/logoClientes/bony-acai.jpg';
import botanicBrasil from '@/lib/images/logoClientes/botanic-brasil.png';
import cVale from '@/lib/images/logoClientes/c-vale.png';
import cliente from '@/lib/images/logoClientes/cliente.png';
import confrariaDoSanduba from '@/lib/images/logoClientes/confraria-do-sanduba.jpg';
import cosmeticosTigo from '@/lib/images/logoClientes/cosmeticos-tigo.jpg';
import daimperio from '@/lib/images/logoClientes/daimperio.png';
import dentalClean from '@/lib/images/logoClientes/dental-clean.png';
import desfrut from '@/lib/images/logoClientes/desfrut.jpg';
import ecofrut from '@/lib/images/logoClientes/ecofrut.png';
import ecovix from '@/lib/images/logoClientes/ecovix.png';
import espacoHair from '@/lib/images/logoClientes/espaco-hair.png';
import fitFruit from '@/lib/images/logoClientes/fit-fruit.png';
import fpLanches from '@/lib/images/logoClientes/fp-lanches.jpg';
import frooty from '@/lib/images/logoClientes/frooty.png';
import frutinho from '@/lib/images/logoClientes/frutinho.jpg';
import ftw from '@/lib/images/logoClientes/ftw-melhor.jpg';
import futinhoSorvetes from '@/lib/images/logoClientes/futinho-sorvetes.jpg';
import gelauzinho from '@/lib/images/logoClientes/gelauzinho.png';
import geloTech from '@/lib/images/logoClientes/gelo-tech.jpg';
import grupoMacunaima from '@/lib/images/logoClientes/grupo-macunaima.jpg';
import guardia from '@/lib/images/logoClientes/guardia.webp';
import hotDogExpresso from '@/lib/images/logoClientes/hot-dog-expresso2-move.png';
import imperador from '@/lib/images/logoClientes/imperador.png';
import jusitaLanches from '@/lib/images/logoClientes/jusita-lanches.jpg';
import kls from '@/lib/images/logoClientes/kls2.png';
import lifeSucos from '@/lib/images/logoClientes/life-sucos.jpg';
import lsc from '@/lib/images/logoClientes/lsc-melhor.png';
import maraPolpa from '@/lib/images/logoClientes/mara-polpa.png';
import maxMuscles from '@/lib/images/logoClientes/max-muscles-melhor.png';
import mixBebidas from '@/lib/images/logoClientes/mix-bebidas.png';
import nalaMix from '@/lib/images/logoClientes/nala-mix.jpg';
import nossaFrutaBrasil from '@/lib/images/logoClientes/nossa-fruta-brasil.png';
import petruz from '@/lib/images/logoClientes/petruz.png';
import pipolandia from '@/lib/images/logoClientes/pipolandia.jpg';
import polpaNorte from '@/lib/images/logoClientes/polpa-norte.png';
import polpasRioGrande from '@/lib/images/logoClientes/polpas-rio-grande.jpg';
import pontoDoAcai from '@/lib/images/logoClientes/ponto-do-acai.jpg';
import quaay from '@/lib/images/logoClientes/quaay.png';
import qualifrut from '@/lib/images/logoClientes/qualifrut.jpg';
import raxsAcai from '@/lib/images/logoClientes/raxs-acai.jpg';
import saborDaRoca from '@/lib/images/logoClientes/sabor-da-roca.jpg';
import saborReal from '@/lib/images/logoClientes/sabor-real.jpg';
import sbProdutosNaturais from '@/lib/images/logoClientes/sb-produtos-naturais.png';
import snackout from '@/lib/images/logoClientes/snackout.png';
import sorvetesApaicere from '@/lib/images/logoClientes/sorvetes-apaicere.jpg';
import str from '@/lib/images/logoClientes/str.png';
import sucorrico from '@/lib/images/logoClientes/sucorrico.png';
import tambau from '@/lib/images/logoClientes/tambau.png';
import trk from '@/lib/images/logoClientes/trk.jpg';
import verduranet from '@/lib/images/logoClientes/verduranet.png';
import vitanatAcai from '@/lib/images/logoClientes/vitanat-acai.jpg';
import xinguFruit from '@/lib/images/logoClientes/xingu-fruit.png';
import zunn from '@/lib/images/logoClientes/zunn-vida-saudavel-melhor.jpg';

export type Cliente = {
  id: number;
  name: string;
  slug: string;
  image: StaticImageData;
};

export const listaClientes: Cliente[] = [
  { id: 1, name: 'Açaí Amazonas', slug: 'acai-amazonas', image: acaiAmazonas },
  { id: 2, name: 'Agropecuária Lopes', slug: 'agropecuaria-lopes', image: agropecuariaLopes },
  { id: 3, name: 'Amazon Polpa', slug: 'amazon-polpa', image: amazonPolpa },
  { id: 4, name: 'Ambev', slug: 'ambev', image: ambev },
  { id: 5, name: 'Apimigot', slug: 'apimigot', image: apimigot },
  { id: 6, name: 'Arafruty', slug: 'arafruty', image: arafruty },
  { id: 7, name: 'Bandolin', slug: 'bandolin', image: bandolin },
  { id: 8, name: 'Basecol Mix', slug: 'basecol-mix', image: basecolMix },
  { id: 9, name: 'Bony Açaí', slug: 'bony-acai', image: bonyAcai },
  { id: 10, name: 'Botanic Brasil', slug: 'botanic-brasil', image: botanicBrasil },
  { id: 11, name: 'C-Vale', slug: 'c-vale', image: cVale },
  { id: 12, name: 'Cliente', slug: 'cliente', image: cliente },
  { id: 13, name: 'Confraria do Sanduba', slug: 'confraria-do-sanduba', image: confrariaDoSanduba },
  { id: 14, name: 'Cosméticos Tigo', slug: 'cosmeticos-tigo', image: cosmeticosTigo },
  { id: 15, name: 'Daimpério', slug: 'daimperio', image: daimperio },
  { id: 16, name: 'Dental Clean', slug: 'dental-clean', image: dentalClean },
  { id: 17, name: 'Desfrut', slug: 'desfrut', image: desfrut },
  { id: 18, name: 'Ecofrut', slug: 'ecofrut', image: ecofrut },
  { id: 19, name: 'Ecovix', slug: 'ecovix', image: ecovix },
  { id: 20, name: 'Espaço Hair', slug: 'espaco-hair', image: espacoHair },
  { id: 21, name: 'Fit Fruit', slug: 'fit-fruit', image: fitFruit },
  { id: 22, name: 'FP Lanches', slug: 'fp-lanches', image: fpLanches },
  { id: 23, name: 'Frooty', slug: 'frooty', image: frooty },
  { id: 24, name: 'Frutinho', slug: 'frutinho', image: frutinho },
  { id: 25, name: 'FTW', slug: 'ftw', image: ftw },
  { id: 26, name: 'Futinho Sorvetes', slug: 'futinho-sorvetes', image: futinhoSorvetes },
  { id: 27, name: 'Gelauzinho', slug: 'gelauzinho', image: gelauzinho },
  { id: 28, name: 'Gelo Tech', slug: 'gelo-tech', image: geloTech },
  { id: 29, name: 'Grupo Macunaíma', slug: 'grupo-macunaima', image: grupoMacunaima },
  { id: 30, name: 'Guardiã', slug: 'guardia', image: guardia },
  { id: 31, name: 'Hot Dog Expresso Move', slug: 'hot-dog-expresso-move', image: hotDogExpresso },
  { id: 32, name: 'Imperador', slug: 'imperador', image: imperador },
  { id: 33, name: 'Jusita Lanches', slug: 'jusita-lanches', image: jusitaLanches },
  { id: 34, name: 'KLS', slug: 'kls', image: kls },
  { id: 35, name: 'Life Sucos', slug: 'life-sucos', image: lifeSucos },
  { id: 36, name: 'LSC', slug: 'lsc', image: lsc },
  { id: 37, name: 'Mara Polpa', slug: 'mara-polpa', image: maraPolpa },
  { id: 38, name: 'Max Muscles', slug: 'max-muscles', image: maxMuscles },
  { id: 39, name: 'Mix Bebidas', slug: 'mix-bebidas', image: mixBebidas },
  { id: 40, name: 'Nala Mix', slug: 'nala-mix', image: nalaMix },
  { id: 41, name: 'Nossa Fruta Brasil', slug: 'nossa-fruta-brasil', image: nossaFrutaBrasil },
  { id: 42, name: 'Petruz', slug: 'petruz', image: petruz },
  { id: 43, name: 'Pipolândia', slug: 'pipolandia', image: pipolandia },
  { id: 44, name: 'Polpa Norte', slug: 'polpa-norte', image: polpaNorte },
  { id: 45, name: 'Polpas Rio Grande', slug: 'polpas-rio-grande', image: polpasRioGrande },
  { id: 46, name: 'Ponto do Açaí', slug: 'ponto-do-acai', image: pontoDoAcai },
  { id: 47, name: 'Quaay', slug: 'quaay', image: quaay },
  { id: 48, name: 'Qualifrut', slug: 'qualifrut', image: qualifrut },
  { id: 49, name: 'Raxs Açaí', slug: 'raxs-acai', image: raxsAcai },
  { id: 50, name: 'Sabor da Roça', slug: 'sabor-da-roca', image: saborDaRoca },
  { id: 51, name: 'Sabor Real', slug: 'sabor-real', image: saborReal },
  { id: 52, name: 'SB Produtos Naturais', slug: 'sb-produtos-naturais', image: sbProdutosNaturais },
  { id: 53, name: 'Snackout', slug: 'snackout', image: snackout },
  { id: 54, name: 'Sorvetes Apaicere', slug: 'sorvetes-apaicere', image: sorvetesApaicere },
  { id: 55, name: 'STR', slug: 'str', image: str },
  { id: 56, name: 'Sucorrico', slug: 'sucorrico', image: sucorrico },
  { id: 57, name: 'Tambaú', slug: 'tambau', image: tambau },
  { id: 58, name: 'TRK', slug: 'trk', image: trk },
  { id: 59, name: 'Verduranet', slug: 'verduranet', image: verduranet },
  { id: 60, name: 'Vitanat Açaí', slug: 'vitanat-acai', image: vitanatAcai },
  { id: 61, name: 'Xingu Fruit', slug: 'xingu-fruit', image: xinguFruit },
  { id: 62, name: 'Zunn Vida Saudável', slug: 'zunn-vida-saudavel', image: zunn }
];

export function normalizeQuery(input: string): string {
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}
