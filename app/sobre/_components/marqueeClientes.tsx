import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";

import acaiAmazonas from "@/lib/images/logoClientes/acai-amazonas.png";
import agropecuariaLopes from "@/lib/images/logoClientes/agropecuaria-lopes.png";
import amazonPolpaEscrito from "@/lib/images/logoClientes/amazon-polpa-escrito.webp";
import amazonPolpa from "@/lib/images/logoClientes/amazon-polpa.png";
import ambev from "@/lib/images/logoClientes/ambev.png";
import apimigot from "@/lib/images/logoClientes/apimigot.png";
import arafruty from "@/lib/images/logoClientes/arafruty.jpg";
import bandolin from "@/lib/images/logoClientes/bandolin.png";
import basecolMix from "@/lib/images/logoClientes/basecol-mix.png";
import bonyAçaí from "@/lib/images/logoClientes/bony-acai.jpg";
import botanicBrasil from "@/lib/images/logoClientes/botanic-brasil.png";
import cVale from "@/lib/images/logoClientes/c-vale.jpg";
import cliente from "@/lib/images/logoClientes/cliente.png";
import confrariaDoSanduba from "@/lib/images/logoClientes/confraria-do-sanduba.jpg";
import cosmeticosTigo from "@/lib/images/logoClientes/cosmeticos-tigo.jpg";
import daimpério from "@/lib/images/logoClientes/daimperio.png";
import dentalClean from "@/lib/images/logoClientes/dental-clean.png";
import desfrut from "@/lib/images/logoClientes/desfrut.jpg";
import ecofrut from "@/lib/images/logoClientes/ecofrut.png";
import ecovix from "@/lib/images/logoClientes/ecovix.png";
import espacoHair from "@/lib/images/logoClientes/espaco-hair.png";
import fitFruit from "@/lib/images/logoClientes/fit-fruit.png";
import fpLanches from "@/lib/images/logoClientes/fp-lanches.jpg";
import frooty from "@/lib/images/logoClientes/frooty.png";
import frutinho from "@/lib/images/logoClientes/frutinho.jpg";
import ftwMelhor from "@/lib/images/logoClientes/ftw-melhor.jpg";
import futinhoSorvetes from "@/lib/images/logoClientes/futinho-sorvetes.jpg";
import gelauzinho from "@/lib/images/logoClientes/gelauzinho.jpg";
import geloTech from "@/lib/images/logoClientes/gelo-tech.jpg";
import grupoMacunaima from "@/lib/images/logoClientes/grupo-macunaima.jpg";
import guardia from "@/lib/images/logoClientes/guardia.webp";
import hotDogExpressoMove from "@/lib/images/logoClientes/hot-dog-expresso-move.png";
import imperador from "@/lib/images/logoClientes/imperador.png";
import jusitaLanches from "@/lib/images/logoClientes/jusita-lanches.jpg";
import kls from "@/lib/images/logoClientes/kls.png";
import lifeSucos from "@/lib/images/logoClientes/life-sucos.jpg";
import lscMelhor from "@/lib/images/logoClientes/lsc-melhor.png";
import maraPolpa from "@/lib/images/logoClientes/mara-polpa.png";
import maxMusclesMelhor from "@/lib/images/logoClientes/max-muscles-melhor.png";
import mixBebidas from "@/lib/images/logoClientes/mix-bebidas.png";
import nalaMix from "@/lib/images/logoClientes/nala-mix.jpg";
import nossaFrutaBrasil from "@/lib/images/logoClientes/nossa-fruta-brasil.png";
import petruz from "@/lib/images/logoClientes/petruz.png";
import pipolandia from "@/lib/images/logoClientes/pipolandia.jpg";
import polpaNorte from "@/lib/images/logoClientes/polpa-norte.png";
import polpasRioGrande from "@/lib/images/logoClientes/polpas-rio-grande.jpg";
import pontoDoAçaí from "@/lib/images/logoClientes/ponto-do-acai.jpg";
import quaay from "@/lib/images/logoClientes/quaay.png";
import qualifrut from "@/lib/images/logoClientes/qualifrut.jpg";

const listaClientes = [
  {
    id: 1,
    name: "Açaí Amazonas",
    image: acaiAmazonas,
  },
  {
    id: 2,
    name: "Agropecuária Lopes",
    image: agropecuariaLopes,
  },
  {
    id: 3,
    name: "Amazon Polpa",
    image: amazonPolpa,
  },
  {
    id: 4,
    name: "Amazon Polpa",
    image: amazonPolpaEscrito,
  },
  { id: 5, name: "Ambev", image: ambev },
  { id: 6, name: "Apimigot", image: apimigot },
  { id: 7, name: "Arafruty", image: arafruty },
  { id: 8, name: "Bandolin", image: bandolin },
  {
    id: 9,
    name: "Basecol Mix",
    image: basecolMix,
  },
  {
    id: 10,
    name: "Bony Açaí",
    image: bonyAçaí,
  },
  {
    id: 11,
    name: "Botanic Brasil",
    image: botanicBrasil,
  },
  { id: 12, name: "C-Vale", image: cVale },
  { id: 13, name: "Cliente", image: cliente },
  {
    id: 14,
    name: "Confraria do Sanduba",
    image: confrariaDoSanduba,
  },
  {
    id: 15,
    name: "Cosméticos Tigo",
    image: cosmeticosTigo,
  },
  {
    id: 16,
    name: "Daimpério",
    image: daimpério,
  },
  {
    id: 17,
    name: "Dental Clean",
    image: dentalClean,
  },
  { id: 18, name: "Desfrut", image: desfrut },
  { id: 19, name: "Ecofrut", image: ecofrut },
  { id: 20, name: "Ecovix", image: ecovix },
  {
    id: 21,
    name: "Espaço Hair",
    image: espacoHair,
  },
  {
    id: 22,
    name: "Fit Fruit",
    image: fitFruit,
  },
  {
    id: 23,
    name: "FP Lanches",
    image: fpLanches,
  },
  { id: 24, name: "Frooty", image: frooty },
  { id: 25, name: "Frutinho", image: frutinho },
  { id: 26, name: "FTW", image: ftwMelhor },
  {
    id: 27,
    name: "Futinho Sorvetes",
    image: futinhoSorvetes,
  },
  {
    id: 28,
    name: "Gelauzinho",
    image: gelauzinho,
  },
  {
    id: 29,
    name: "Gelo Tech",
    image: geloTech,
  },
  {
    id: 30,
    name: "Grupo Macunaíma",
    image: grupoMacunaima,
  },
  { id: 31, name: "Guardiã", image: guardia },
  {
    id: 32,
    name: "Hot Dog Expresso Move",
    image: hotDogExpressoMove,
  },
  {
    id: 33,
    name: "Imperador",
    image: imperador,
  },
  {
    id: 34,
    name: "Jusita Lanches",
    image: jusitaLanches,
  },
  { id: 35, name: "KLS", image: kls },
  {
    id: 36,
    name: "Life Sucos",
    image: lifeSucos,
  },
  { id: 37, name: "LSC", image: lscMelhor },
  {
    id: 38,
    name: "Mara Polpa",
    image: maraPolpa,
  },
  {
    id: 39,
    name: "Max Muscles",
    image: maxMusclesMelhor,
  },
  {
    id: 40,
    name: "Mix Bebidas",
    image: mixBebidas,
  },
  { id: 41, name: "Nala Mix", image: nalaMix },
  {
    id: 42,
    name: "Nossa Fruta Brasil",
    image: nossaFrutaBrasil,
  },
  { id: 43, name: "Petruz", image: petruz },
  {
    id: 44,
    name: "Pipolândia",
    image: pipolandia,
  },
  {
    id: 45,
    name: "Polpa Norte",
    image: polpaNorte,
  },
  {
    id: 46,
    name: "Polpas Rio Grande",
    image: polpasRioGrande,
  },
  {
    id: 47,
    name: "Ponto do Açaí",
    image: pontoDoAçaí,
  },
  { id: 48, name: "Quaay", image: quaay },
  {
    id: 49,
    name: "Qualifrut",
    image: qualifrut,
  },
];

// Componente do card do cliente
const ClienteCard = ({ cliente }: { cliente: (typeof listaClientes)[0] }) => (
  <div className="group flex h-30 w-40 items-center justify-center py-1 transition-all duration-300 hover:scale-105">
    <Image
      src={cliente.image}
      alt={cliente.name}
      width={150}
      height={70}
      className="relative z-10 h-full w-auto object-contain"
    />
  </div>
);

export default function MarqueeClientes() {
  const grupo1 = listaClientes.slice(0, 17);
  const grupo2 = listaClientes.slice(17, 33);

  return (
    <section className="relative flex h-1/3 w-full flex-col items-center justify-start overflow-hidden py-5">
      {/* Primeiro carrossel - direção normal */}
      <div className="relative overflow-hidden">
        <Marquee pauseOnHover className="[--duration:50s]">
          {grupo1.map((cliente) => (
            <ClienteCard key={cliente.id} cliente={cliente} />
          ))}
        </Marquee>
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r to-transparent"></div>
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l to-transparent"></div>
      </div>

      {/* Segundo carrossel - direção reversa */}
      <div className="relative overflow-hidden">
        <Marquee reverse pauseOnHover className="[--duration:50s]">
          {grupo2.map((cliente) => (
            <ClienteCard key={cliente.id} cliente={cliente} />
          ))}
        </Marquee>
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r to-transparent"></div>
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l to-transparent"></div>
      </div>

      {/* Grid estático para telas menores */}
      <div className="block px-4 md:hidden">
        <div className="mx-auto mt-12 grid max-w-sm grid-cols-2 gap-4">
          {listaClientes.slice(0, 16).map((cliente) => (
            <div
              key={cliente.id}
              className="flex h-20 items-center justify-center rounded-sm border border-slate-200 bg-white/80 p-3 shadow-md shadow-slate-900/5 backdrop-blur-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg"
            >
              <Image
                src={cliente.image}
                alt={cliente.name}
                width={100}
                height={50}
                className="max-h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>

        {/* Indicador de mais clientes no mobile */}
        <div className="mt-6 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            + {listaClientes.length - 16} outros clientes
          </span>
        </div>
      </div>
    </section>
  );
}
