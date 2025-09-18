import logoProfills from "@/public/logo-branco.png";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GridPattern } from "./gridPatternBg";

export default function Footer() {
  return (
    <footer className="relative h-full w-full overflow-x-hidden bg-slate-900 text-white">
      <GridPattern />
      <div className="container mx-auto grid h-full max-w-[70vw] grid-cols-7 gap-10 pt-16 pb-10">
        <div className="col-span-3 flex h-full flex-col items-center justify-between">
          <div className="flex h-1/3 flex-col items-center justify-center gap-3">
            <Image
              src={logoProfills}
              alt="Logo Profills"
              className="h-1/3 w-auto"
            />
            <p className="text-center text-sm text-white">
              A Profills é uma empresa jovem e arrojada, que produz Máquinas
              Envasadoras para produtos líquidos, pastosos e sólidos. Utilizamos
              tecnologia de ponta e os melhores componentes.
            </p>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7206.5151991491575!2d-49.265868!3d-25.42965!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce46cbe8fffff%3A0xd40a29c07a52e3d1!2sR.%20Mal.%20Deodoro%2C%20717%20-%20Centro%2C%20Curitiba%20-%20PR%2C%2080020-320!5e0!3m2!1spt-BR!2sbr!4v1756731227044!5m2!1spt-BR!2sbr"
            width="100%"
            height="65%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-sm pt-5 opacity-90"
          />
        </div>
        <div className="col-span-2 hidden h-full flex-col items-start justify-center gap-10 md:flex">
          <div className="border-border/20 hover:border-accent/50 shadow-accent/50 z-10 flex h-1/3 w-full flex-col items-start justify-center gap-2 rounded-sm border border-dashed bg-slate-900 p-5 shadow-sm transition-all duration-300">
            <h3 className="text-start text-2xl font-bold">Vendas/Peças</h3>
            <ul className="flex flex-col items-start gap-1">
              <Link
                href="tel:+5541997851998"
                className="flex items-center gap-2 text-base"
              >
                <Phone className="text-accent size-5" />
                <span>
                  +55 <span className="text-accent">(</span> 41{" "}
                  <span className="text-accent">)</span> 99785-1998
                </span>
              </Link>
              <Link
                href="mailto:comercial@profillsdobrasil.com.br"
                className="flex items-center gap-2 text-base"
              >
                <Mail className="text-accent size-5" />
                <span> comercial@profillsdobrasil.com.br</span>
              </Link>
            </ul>
          </div>
          <div className="border-border/20 hover:border-accent/50 shadow-accent/50 z-10 flex w-full flex-col items-start justify-center gap-2 rounded-sm border border-dashed bg-slate-900 p-5 shadow-sm transition-all duration-300">
            <h3 className="text-start text-2xl font-bold">
              Suporte e Assistência Técnica
            </h3>
            <ul className="flex flex-col items-start gap-1">
              <Link
                href="mailto:suporte@profillsdobrasil.com.br"
                className="flex items-center gap-2 text-base"
              >
                <Mail className="text-accent size-5" />
                <span> suporte@profillsdobrasil.com.br</span>
              </Link>
            </ul>
          </div>
          <div className="border-border/20 hover:border-accent/50 shadow-accent/50 z-10 flex w-full flex-col items-start justify-center gap-2 rounded-sm border border-dashed bg-slate-900 p-5 shadow-sm transition-all duration-300">
            <h3 className="text-start text-2xl font-bold">
              Compras (Fornecedores)
            </h3>
            <ul className="flex flex-col items-start gap-1">
              <Link
                href="tel:+554197695013"
                className="flex items-center gap-2 text-base"
              >
                <Phone className="text-accent size-5" />
                <span>
                  +55 <span className="text-accent">(</span> 41{" "}
                  <span className="text-accent">)</span> 9769-5013
                </span>
              </Link>
              <Link
                href="mailto:compras@profillsdobrasil.com.br"
                className="flex items-center gap-2 text-base"
              >
                <Mail className="text-accent size-5" />
                <span>
                  compras<span className="text-accent">@</span>
                  profillsdobrasil.com.br
                </span>
              </Link>
            </ul>
          </div>
        </div>
        <div className="col-span-2 hidden h-full w-full flex-col items-center justify-center gap-10 md:flex">
          <Link
            href="https://www.facebook.com/profillsbrasil/"
            target="_blank"
            className="border-border/20 group hover:border-accent/50 hover:shadow-accent/50 z-10 flex h-1/4 w-full items-center justify-center gap-5 rounded-sm border border-dashed bg-slate-900 p-5 text-xl"
          >
            <Facebook className="text-accent size-8" />

            <span className="group-hover:decoration-accent font-bold group-hover:underline group-hover:underline-offset-4">
              Facebook
            </span>
          </Link>

          <Link
            href="https://www.instagram.com/profillsdobrasil/"
            target="_blank"
            className="border-border/20 group hover:border-accent/50 hover:shadow-accent/50 z-10 flex h-1/4 w-full items-center justify-center gap-5 rounded-sm border border-dashed bg-slate-900 p-5 text-xl"
          >
            <Instagram className="text-accent size-8" />

            <span className="group-hover:decoration-accent font-bold group-hover:underline group-hover:underline-offset-4">
              Instagram
            </span>
          </Link>
          <Link
            href="https://www.linkedin.com/company/profillsdobrasil/"
            target="_blank"
            className="border-border/20 group hover:border-accent/50 hover:shadow-accent/50 z-10 flex h-1/4 w-full items-center justify-center gap-5 rounded-sm border border-dashed bg-slate-900 p-5 text-xl"
          >
            <Linkedin className="text-accent size-8" />

            <span className="group-hover:decoration-accent font-bold group-hover:underline group-hover:underline-offset-4">
              LinkedIn
            </span>
          </Link>
          <Link
            href="https://www.youtube.com/channel/UCQhaNOzqbkYnZlknSd79zEw"
            target="_blank"
            className="border-border/20 group hover:border-accent/50 hover:shadow-accent/50 z-10 flex h-1/4 w-full items-center justify-center gap-5 rounded-sm border border-dashed bg-slate-900 p-5 text-xl"
          >
            <Youtube className="text-accent size-8" />

            <span className="group-hover:decoration-accent font-bold group-hover:underline group-hover:underline-offset-4">
              YouTube
            </span>
          </Link>
        </div>
      </div>
      <div className="border-border/10 z-10 w-full border-t bg-slate-900 py-3 opacity-95">
        <p className="text-center text-sm text-white">
          <span className="text-accent">&copy;</span> {new Date().getFullYear()}{" "}
          <span className="decoration-accent font-bold underline underline-offset-4">
            Profills Brasil
          </span>
          . Todos os direitos reservados <span className="text-accent">.</span>
        </p>
      </div>
    </footer>
  );
}
