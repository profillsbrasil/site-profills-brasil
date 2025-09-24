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

      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 text-center">
          <Link
            href="/"
            aria-label="Profills Brasil"
            className="group mb-8 inline-block"
          >
            <div className="relative">
              <Image
                src={logoProfills}
                alt="Logo Profills"
                className="mx-auto h-16 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </Link>
          <div className="mx-auto max-w-3xl">
            <p className="text-lg leading-relaxed font-medium text-slate-300">
              A Profills é uma empresa jovem e arrojada, que produz{" "}
              <span className="text-accent font-semibold">
                Máquinas Envasadoras
              </span>{" "}
              para produtos líquidos, pastosos e sólidos.
            </p>
            <p className="mt-2 text-slate-400">
              Utilizando tecnologia de ponta e os melhores componentes.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Sales/Parts */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-xs bg-gradient-to-br from-cyan-500/20 to-blue-600/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative rounded-xs border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xs bg-gradient-to-br from-cyan-500 to-blue-600">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-6 text-center text-xl font-bold text-white">
                Vendas/Peças
              </h3>
              <div className="space-y-4">
                <Link
                  href="mailto:comercial@profillsdobrasil.com.br"
                  className="group/link flex items-center gap-3 text-slate-300 transition-colors hover:text-cyan-400"
                >
                  <Mail className="h-5 w-5 text-cyan-400 transition-transform group-hover/link:scale-110" />
                  <span className="text-sm font-medium">
                    comercial@profillsdobrasil.com.br
                  </span>
                </Link>
                <Link
                  href="tel:+5541997851998"
                  className="group/link flex items-center gap-3 text-slate-300 transition-colors hover:text-cyan-400"
                >
                  <Phone className="h-5 w-5 text-cyan-400 transition-transform group-hover/link:scale-110" />
                  <span className="text-sm font-medium">
                    +55 (41) 99785-1998
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Support and Technical Assistance */}
          <div className="group relative h-full">
            <div className="absolute inset-0 h-full rounded-xs bg-gradient-to-br from-orange-500/20 to-red-600/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative h-full rounded-xs border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xs bg-gradient-to-br from-orange-500 to-red-600">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-6 text-center text-xl font-bold text-white">
                Suporte e Assistência Técnica
              </h3>
              <div className="space-y-4">
                <Link
                  href="mailto:suporte@profillsdobrasil.com.br"
                  className="group/link flex items-center gap-3 text-slate-300 transition-colors hover:text-orange-400"
                >
                  <Mail className="h-5 w-5 text-orange-400 transition-transform group-hover/link:scale-110" />
                  <span className="text-sm font-medium">
                    suporte@profillsdobrasil.com.br
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Purchases (Suppliers) */}
          <div className="group relative">
            <div className="absolute inset-0 rounded-xs bg-gradient-to-br from-emerald-500/20 to-teal-600/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative rounded-xs border border-slate-700/50 bg-slate-800/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xs bg-gradient-to-br from-emerald-500 to-teal-600">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-6 text-center text-xl font-bold text-white">
                Compras (Fornecedores)
              </h3>
              <div className="space-y-4">
                <Link
                  href="mailto:compras@profillsdobrasil.com.br"
                  className="group/link flex items-center gap-3 text-slate-300 transition-colors hover:text-emerald-400"
                >
                  <Mail className="h-5 w-5 text-emerald-400 transition-transform group-hover/link:scale-110" />
                  <span className="text-sm font-medium">
                    compras@profillsdobrasil.com.br
                  </span>
                </Link>
                <Link
                  href="tel:+554197695013"
                  className="group/link flex items-center gap-3 text-slate-300 transition-colors hover:text-emerald-400"
                >
                  <Phone className="h-5 w-5 text-emerald-400 transition-transform group-hover/link:scale-110" />
                  <span className="text-sm font-medium">
                    +55 (41) 9769-5013
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10">
          <div className="mb-8 text-center">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Conecte-se conosco
            </h3>
            <p className="text-slate-400">
              Siga-nos nas redes sociais para novidades e atualizações
            </p>
          </div>
          <div className="flex items-center justify-center gap-6">
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
                className={`group relative rounded-xs border border-slate-700/50 bg-slate-800/30 p-4 text-slate-400 backdrop-blur-sm ${color} transition-all duration-300 hover:scale-110 hover:border-slate-600/50 hover:shadow-lg`}
              >
                <Icon className="h-6 w-6" />
                <div className="absolute inset-0 rounded-xs bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
