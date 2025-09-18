import { Highlighter } from "@/components/magicui/highlighter";
import imgOds1 from "@/lib/images/projetos/sustentavel/1.png";
import imgOds10 from "@/lib/images/projetos/sustentavel/10.png";
import imgOds11 from "@/lib/images/projetos/sustentavel/11.png";
import imgOds12 from "@/lib/images/projetos/sustentavel/12.png";
import imgOds13 from "@/lib/images/projetos/sustentavel/13.png";
import imgOds14 from "@/lib/images/projetos/sustentavel/14.png";
import imgOds15 from "@/lib/images/projetos/sustentavel/15.png";
import imgOds16 from "@/lib/images/projetos/sustentavel/16.png";
import imgOds17 from "@/lib/images/projetos/sustentavel/17.png";
import imgOds2 from "@/lib/images/projetos/sustentavel/2.png";
import imgOds3 from "@/lib/images/projetos/sustentavel/3.png";
import imgOds4 from "@/lib/images/projetos/sustentavel/4.png";
import imgOds5 from "@/lib/images/projetos/sustentavel/5.png";
import imgOds6 from "@/lib/images/projetos/sustentavel/6.png";
import imgOds7 from "@/lib/images/projetos/sustentavel/7.png";
import imgOds8 from "@/lib/images/projetos/sustentavel/8.png";
import imgOds9 from "@/lib/images/projetos/sustentavel/9.png";
import { Target } from "lucide-react";
import Image from "next/image";

const odsImages = [
  imgOds1,
  imgOds2,
  imgOds3,
  imgOds4,
  imgOds5,
  imgOds6,
  imgOds7,
  imgOds8,
  imgOds9,
  imgOds10,
  imgOds11,
  imgOds12,
  imgOds13,
  imgOds14,
  imgOds15,
  imgOds16,
  imgOds17,
];

export default function ObjetivosODS() {
  return (
    <section
      aria-labelledby="titulo-ods"
      className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-12 py-10"
    >
      <div className="text-center">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-3xl font-bold"
        >
          <h2 id="titulo-ods">Objetivos do Desenvolvimento Sustentável</h2>
        </Highlighter>
        <div className="mx-auto mt-6 max-w-4xl">
          <p className="mb-4 text-lg text-gray-600">
            A{" "}
            <span className="font-semibold text-gray-800">
              Organização das Nações Unidas
            </span>{" "}
            lançou em 2015 os{" "}
            <span className="font-semibold text-gray-800">
              Objetivos do Desenvolvimento Sustentável (ODS)
            </span>
            , que constituem um apelo global para acabar com a miséria, proteger
            o meio ambiente e garantir que todas as pessoas possam ter paz e
            prosperidade.
          </p>
          <div className="flex items-center justify-center gap-3 rounded-md border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-100 p-4">
            <Target className="h-6 w-6 text-blue-600" />
            <p className="font-semibold text-blue-800">
              A Profills está engajada com os ODS e trabalha para contribuir com
              a Agenda 2030 no Brasil e no mundo.
            </p>
          </div>
        </div>
      </div>

      {/* ODS Grid - Simples e Limpo */}
      <div className="w-full">
        <div className="grid grid-cols-6 justify-items-center gap-4">
          {odsImages.map((ods, index) => (
            <div key={index + 1} className="flex items-center justify-center">
              <Image
                src={ods}
                alt={`ODS ${index + 1}`}
                className="h-auto w-full rounded-md shadow-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Estatísticas da Agenda 2030 */}
      <div className="w-full">
        <div className="rounded-md border border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
          <div className="mb-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-gray-800">
              Agenda 2030 - Nosso Compromisso
            </h3>
            <p className="mx-auto max-w-3xl text-lg text-gray-700">
              Até 2030, trabalhamos para contribuir significativamente com os
              Objetivos do Desenvolvimento Sustentável através de nossas
              soluções inovadoras e impacto social.
            </p>
          </div>

          <div className="grid grid-cols-5 gap-6">
            <div className="text-center">
              <div className="mb-3 text-3xl font-bold text-indigo-600">17</div>
              <div className="text-sm text-gray-600">Objetivos Globais</div>
            </div>
            <div className="text-center">
              <div className="mb-3 text-3xl font-bold text-purple-600">169</div>
              <div className="text-sm text-gray-600">Metas Específicas</div>
            </div>
            <div className="text-center">
              <div className="mb-3 text-3xl font-bold text-pink-600">2030</div>
              <div className="text-sm text-gray-600">
                Prazo para Implementação
              </div>
            </div>
            <div className="text-center">
              <div className="mb-3 text-3xl font-bold text-emerald-600">
                193
              </div>
              <div className="text-sm text-gray-600">Países Comprometidos</div>
            </div>
            <div className="text-center">
              <div className="mb-3 text-3xl font-bold text-orange-600">1</div>
              <div className="text-sm text-gray-600">
                Planeta para Cuidarmos
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
