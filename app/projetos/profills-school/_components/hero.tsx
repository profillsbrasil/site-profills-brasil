import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import imgSchool from "@/lib/images/projetos/School.jpg";
import { BookOpen, GraduationCap, Users, Zap } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      aria-labelledby="titulo-profills-school"
      className="flex min-h-[93vh] w-full max-w-6xl flex-col items-center justify-evenly"
    >
      <AnimatedContainer className="w-full">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Image
            src={imgSchool}
            alt="Profills School - Educação Técnica de Qualidade"
            className="z-10 h-full w-full rounded-md object-contain shadow-xl"
            loading="eager"
          />
        </div>
      </AnimatedContainer>

      <div className="flex h-full w-full flex-col items-center gap-10">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-4xl font-bold"
        >
          <h1 id="titulo-profills-school">Profills School</h1>
        </Highlighter>

        <div className="flex flex-col gap-4 text-lg leading-relaxed">
          <p>
            Quando se fala em educação, existem{" "}
            <span className="text-accent font-semibold">
              muitas possibilidades de atuação
            </span>
            . A Profills do Brasil planeja contribuir com seus clientes e
            parceiros transmitindo seus{" "}
            <span className="text-accent font-semibold">
              conhecimentos técnicos nas diversas áreas
            </span>{" "}
            em que atua.
          </p>

          <p>
            Na visão da Profills, a{" "}
            <span className="text-accent font-semibold">
              educação é um meio de grande impacto na sociedade
            </span>
            . Logo, acreditamos que podemos e devemos contribuir com nossos
            funcionários, clientes e futuros parceiros, para que tenham cada vez
            mais{" "}
            <span className="text-accent font-semibold">
              acesso às informações úteis e necessárias
            </span>
            , de forma prática e facilitada.
          </p>
        </div>

        {/* Features Cards */}
        <AnimatedContainer className="w-full">
          <div className="grid w-full grid-cols-4 gap-5">
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <BookOpen className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Cursos Online</h3>
                <p className="text-xs text-gray-600">Educação à distância</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <GraduationCap className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Formação Técnica</h3>
                <p className="text-xs text-gray-600">Know-how especializado</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Users className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Impacto Social</h3>
                <p className="text-xs text-gray-600">Juventude e baixa renda</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Zap className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Inovação</h3>
                <p className="text-xs text-gray-600">Cenários futuros</p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
