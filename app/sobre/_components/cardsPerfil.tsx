import { Badge } from "@/components/ui/badge";
import logo from "@/public/logo.png";
import { Award, Cpu, MapPin, Settings, Shield, Users } from "lucide-react";
import Image from "next/image";

export default function CardsPerfil() {
  return (
    <div className="flex h-2/3 w-full max-w-7xl flex-col items-start justify-start">
      <div className="flex w-full flex-col items-center justify-start py-12">
        <Image src={logo} alt="Sobre" className="w-1/2 rounded-sm" />
      </div>

      <div className="flex w-full flex-col gap-6 md:flex-row">
        {/* Card 1 - Inovação e Tecnologia 4.0 */}
        <div className="group bg-background relative flex h-full w-full flex-col overflow-hidden border border-dashed border-black/40 p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:shadow-2xl md:w-1/3">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-slate-900" />
              <Badge
                variant="outline"
                className="border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
              >
                Indústria 4.0
              </Badge>
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-slate-900">
                Inovação Tecnológica
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Máquinas com{" "}
                <span className="text-accent font-semibold">
                  recursos avançados da Indústria 4.0
                </span>
                , interfaces touchscreen para controle total da produção e
                sistemas integrados de dosagem.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs text-slate-500">
              <Cpu className="mr-2 h-4 w-4" />
              Tecnologia de ponta
            </div>
          </div>
        </div>

        {/* Card 2 - Qualidade e Certificações Internacionais */}
        <div className="group bg-background relative flex h-full w-full flex-col overflow-hidden border border-dashed border-black/40 p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:shadow-2xl md:w-1/3">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-slate-900" />
              <Badge
                variant="outline"
                className="border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
              >
                ISO 9001:2015
              </Badge>
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-slate-900">
                Qualidade Certificada
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Certificações{" "}
                <span className="text-accent font-semibold">
                  ISO 9001, NR-12, NR-10 e selo CE
                </span>
                . Componentes dos melhores fabricantes mundiais com padrões
                internacionais rigorosos.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs text-slate-500">
              <Award className="mr-2 h-4 w-4" />
              Alemanha • Japão • Coreia
            </div>
          </div>
        </div>

        {/* Card 3 - Experiência e Alcance Nacional */}
        <div className="group bg-background relative flex h-full w-full flex-col overflow-hidden border border-dashed border-black/40 p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:shadow-2xl md:w-1/3">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-slate-900" />
              <Badge
                variant="outline"
                className="border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
              >
                +300 Clientes
              </Badge>
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-slate-900">
                Experiência Comprovada
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                <span className="text-accent font-semibold">
                  Mais de uma década
                </span>{" "}
                atendendo clientes. Líderes nacionais no envase de açaí com
                presença em todo Brasil e América do Sul.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs text-slate-500">
              <MapPin className="mr-2 h-4 w-4" />
              Curitiba • São Paulo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
