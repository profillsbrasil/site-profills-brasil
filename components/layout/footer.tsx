import logoProfills from "@/public/logo-branco.png";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GridPattern } from "./gridPatternBg";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-900">
      <GridPattern />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-14">
        <div className="mb-6 text-center md:mb-8">
          <Link
            href="/"
            aria-label="Profills Brasil"
            className="group mb-6 inline-block md:mb-8"
          >
            <div className="relative">
              <Image
                src={logoProfills}
                alt="Logo Profills"
                className="mx-auto h-12 w-auto transition-transform duration-300 md:h-16"
              />
            </div>
          </Link>
          <div className="mx-auto max-w-3xl">
            <p className="text-sm leading-relaxed font-medium text-slate-300 md:text-lg">
              A Profills é uma empresa jovem e arrojada, que produz{" "}
              <span className="text-accent font-semibold">
                Máquinas Envasadoras
              </span>{" "}
              para produtos líquidos, pastosos e sólidos.
            </p>
            <p className="mt-2 text-xs text-slate-400 md:text-base">
              Utilizando tecnologia de ponta e os melhores componentes.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-8">
          {/* Sales/Parts */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-xs bg-gradient-to-br from-cyan-500/20 to-blue-600/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative rounded-xs border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10 md:p-8">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xs bg-gradient-to-br from-cyan-500 to-blue-600 md:mb-6 md:h-12 md:w-12">
                <Phone className="h-5 w-5 text-white md:h-6 md:w-6" />
              </div>
              <h3 className="mb-4 text-center text-lg font-bold text-white md:mb-6 md:text-xl">
                Vendas/Peças
              </h3>
              <div className="flex flex-col items-center space-y-3 md:items-start md:space-y-4">
                <Link
                  href="mailto:comercial@profillsdobrasil.com.br"
                  className="group/link flex items-center gap-2 text-slate-300 transition-colors hover:text-cyan-400 md:gap-3"
                >
                  <Mail className="h-4 w-4 text-cyan-400 transition-transform group-hover/link:scale-110 md:h-5 md:w-5" />
                  <span className="text-xs font-medium md:text-sm">
                    comercial@profillsdobrasil.com.br
                  </span>
                </Link>
                <Link
                  href="tel:+5541997851998"
                  className="group/link flex items-center gap-2 text-slate-300 transition-colors hover:text-cyan-400 md:gap-3"
                >
                  <Phone className="h-4 w-4 text-cyan-400 transition-transform group-hover/link:scale-110 md:h-5 md:w-5" />
                  <span className="text-xs font-medium md:text-sm">
                    +55 (41) 99785-1998
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Support and Technical Assistance */}
          <div className="group relative h-full">
            <div className="absolute inset-0 h-full rounded-xs bg-gradient-to-br from-orange-500/20 to-red-600/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative h-full rounded-xs border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10 md:p-8">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xs bg-gradient-to-br from-orange-500 to-red-600 md:mb-6 md:h-12 md:w-12">
                <Mail className="h-5 w-5 text-white md:h-6 md:w-6" />
              </div>
              <h3 className="mb-4 text-center text-lg font-bold text-white md:mb-6 md:text-xl">
                Suporte e Assistência Técnica
              </h3>
              <div className="flex flex-col items-center space-y-3 md:items-start md:space-y-4">
                <Link
                  href="mailto:suporte@profillsdobrasil.com.br"
                  className="group/link flex items-center gap-2 text-slate-300 transition-colors hover:text-orange-400 md:gap-3"
                >
                  <Mail className="h-4 w-4 text-orange-400 transition-transform group-hover/link:scale-110 md:h-5 md:w-5" />
                  <span className="text-xs font-medium md:text-sm">
                    suporte@profillsdobrasil.com.br
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Purchases (Suppliers) */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-xs bg-gradient-to-br from-emerald-500/20 to-teal-600/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative rounded-xs border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 md:p-8">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xs bg-gradient-to-br from-emerald-500 to-teal-600 md:mb-6 md:h-12 md:w-12">
                <MapPin className="h-5 w-5 text-white md:h-6 md:w-6" />
              </div>
              <h3 className="mb-4 text-center text-lg font-bold text-white md:mb-6 md:text-xl">
                Compras (Fornecedores)
              </h3>
              <div className="flex flex-col items-center space-y-3 md:items-start md:space-y-4">
                <Link
                  href="mailto:compras@profillsdobrasil.com.br"
                  className="group/link flex items-center gap-2 text-slate-300 transition-colors hover:text-emerald-400 md:gap-3"
                >
                  <Mail className="h-4 w-4 text-emerald-400 transition-transform group-hover/link:scale-110 md:h-5 md:w-5" />
                  <span className="text-xs font-medium md:text-sm">
                    compras@profillsdobrasil.com.br
                  </span>
                </Link>
                <Link
                  href="tel:+554197695013"
                  className="group/link flex items-center gap-2 text-slate-300 transition-colors hover:text-emerald-400 md:gap-3"
                >
                  <Phone className="h-4 w-4 text-emerald-400 transition-transform group-hover/link:scale-110 md:h-5 md:w-5" />
                  <span className="text-xs font-medium md:text-sm">
                    +55 (41) 9769-5013
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 md:pt-10">
          <div className="mb-6 text-center md:mb-8">
            <h3 className="mb-2 text-base font-semibold text-white md:text-lg">
              Conecte-se conosco
            </h3>
            <p className="text-xs text-slate-400 md:text-base">
              Siga-nos nas redes sociais para novidades e atualizações
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 md:gap-6">
            {[
              {
                href: "https://www.facebook.com/profillsbrasil/",
                icon: Facebook,
                label: "Facebook",
                color: "hover:text-blue-500",
              },
              {
                href: "https://www.instagram.com/profillsdobrasil/",
                icon: Instagram,
                label: "Instagram",
                color: "hover:text-pink-500",
              },
              {
                href: "https://www.linkedin.com/company/profillsdobrasil/",
                icon: Linkedin,
                label: "LinkedIn",
                color: "hover:text-blue-400",
              },
              {
                href: "https://www.youtube.com/channel/UCQhaNOzqbkYnZlknSd79zEw",
                icon: Youtube,
                label: "YouTube",
                color: "hover:text-red-500",
              },
            ].map(({ href, icon: Icon, label, color }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`group relative rounded-xs border border-slate-700/50 bg-slate-800/30 p-3 text-slate-400 backdrop-blur-sm ${color} transition-all duration-300 hover:scale-110 hover:border-slate-600/50 hover:shadow-lg md:p-4`}
              >
                <Icon className="h-5 w-5 md:h-6 md:w-6" />
                <div className="absolute inset-0 rounded-xs bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
