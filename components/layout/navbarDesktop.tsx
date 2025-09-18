"use client";

import {
  Brain,
  Calendar,
  Cloud,
  Globe,
  GraduationCap,
  Landmark,
  Leaf,
  Store,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/layout/customNavigationMenu";

import servicosPersonalizados from "@/lib/images/extras/cortador.jpg";
import pecasImg from "@/lib/images/extras/pecas-producao.png";
import maquinaImagem from "@/lib/images/novasImagens/maquinasEmbalagens/maquinas/tc-4s-204-360-3.png";
import logoProfills from "@/public/logo-branco.png";
import Image from "next/image";

const projetos: {
  title: string;
  href: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    title: "Profills P&D",
    href: "/projetos/profills-pd",
    description: "IA e Indústria 4.0, com menos paradas e falhas.",
    icon: <Brain className="text-accent mr-2 size-7" />,
  },

  {
    title: "Profills ERP",
    href: "/projetos/profills-erp",
    description: "Gestão integrada em nuvem, automação e menos erros.",
    icon: <Cloud className="text-accent mr-2 size-7" />,
  },
  {
    title: "Profills Bank",
    href: "/projetos/profills-bank",
    description: "Finanças digitais acessíveis e seguras.",
    icon: <Landmark className="text-accent mr-2 size-7" />,
  },
  {
    title: "Profills HUB",
    href: "/projetos/profills-hub",
    description:
      "Presença internacional, embalagens seguras e soluções completas",
    icon: <Globe className="text-accent mr-2 size-7" />,
  },
  {
    title: "Profills Locação",
    href: "/projetos/profills-locacao",
    description: "Máquinas por assinatura, acesso fácil e baixo risco.",
    icon: <Calendar className="text-accent mr-2 size-7" />,
  },
  {
    title: "Profills Marketplace",
    href: "/projetos/profills-marketplace",
    description:
      "Conexão digital segura entre produtores, clientes e parceiros.",
    icon: <Store className="text-accent mr-2 size-7" />,
  },
  {
    title: "Profills School",
    href: "/projetos/profills-school",
    description: "Educação técnica acessível para capacitar e gerar impacto.",
    icon: <GraduationCap className="text-accent mr-2 size-7" />,
  },
  {
    title: "Profills Sustentabilidade",
    href: "/projetos/profills-sustentabilidade",
    description: "Soluções em alimento, educação e futuro com impacto.",
    icon: <Leaf className="text-accent mr-2 size-7" />,
  },
];

export default function NavbarDesktop() {
  return (
    <NavigationMenu
      viewport={false}
      delayDuration={0}
      skipDelayDuration={500}
      className="border-border/10 fixed top-0 z-50 hidden h-16 min-w-full border-b bg-slate-900 md:flex"
    >
      <NavigationMenuList className="flex h-full w-7xl items-center justify-center">
        <NavigationMenuItem className="h-full">
          <Link href="/">
            <Image
              src={logoProfills}
              alt="Logo Profills"
              className="h-full w-auto"
            />
          </Link>
        </NavigationMenuItem>
        <div className="flex h-full w-full items-center justify-center gap-2">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/sobre">Sobre</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Máquinas</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="flex h-full w-[500px] items-center justify-center gap-2">
                <div className="flex h-full w-2/3 flex-col gap-2">
                  <ListItem
                    href="/maquinas"
                    title="Envasadoras"
                    className="w-full"
                  >
                    Maquinas para embalar produtos em sachês, bisnagas, frascos,
                    galões, baldes, pouchs, mini pouchs, entre outros.
                  </ListItem>
                  <ListItem
                    href="/maquinas"
                    title="Enfardadeiras"
                    className="w-full"
                  >
                    Maquinas para enfardar produtos em fardos, sacos, entre
                    outros.
                  </ListItem>
                  <ListItem
                    href="/maquinas"
                    className="w-full"
                    title="Embaladoras"
                  >
                    Maquinas para embalar produtos em sacos, bisnagas, frascos,
                    galões, baldes, pouchs, mini pouchs, entre outros.
                  </ListItem>
                  <ListItem
                    href="/maquinas"
                    className="w-full"
                    title="Envolvedoras"
                  >
                    Maquinas para envolver produtos em bisnagas, frascos,
                    galões, baldes, pouchs, mini pouchs, entre outros.
                  </ListItem>
                </div>
                <Image
                  src={maquinaImagem}
                  loading="eager"
                  alt="Máquina de embalagem cartonada"
                  className="mt-10 h-full w-1/3 scale-180 object-contain"
                />
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Peças</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid h-full w-[500px] grid-cols-[1fr_1fr] gap-2">
                <div className="flex h-full w-full gap-2">
                  <div className="flex w-1/2 flex-col gap-2">
                    <NavigationMenuLink asChild>
                      <Link
                        href="https://profillsbrasil.lojaintegrada.com.br/sensores"
                        target="_blank"
                        className="w-full text-left"
                      >
                        Sensores
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="https://profillsbrasil.lojaintegrada.com.br/resistencias"
                        target="_blank"
                        className="w-full text-left"
                      >
                        Resistência
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="https://profillsbrasil.lojaintegrada.com.br/atuadores"
                        target="_blank"
                        className="w-full text-left"
                      >
                        Atuadores
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="https://profillsbrasil.lojaintegrada.com.br/silenciadores"
                        target="_blank"
                        className="w-full text-left"
                      >
                        Silenciadores
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="https://profillsbrasil.lojaintegrada.com.br/corte"
                        target="_blank"
                        className="w-full text-left"
                      >
                        Laminas
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className="flex w-1/2 flex-col gap-2 pr-2">
                    <NavigationMenuLink asChild>
                      <Link
                        href="https://profillsbrasil.lojaintegrada.com.br/valvulas"
                        target="_blank"
                        className="w-full text-left"
                      >
                        Válvulas
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="https://profillsbrasil.lojaintegrada.com.br/molas"
                        target="_blank"
                        className="w-full text-left"
                      >
                        Molas
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="https://profillsbrasil.lojaintegrada.com.br/aquecimento-e-selagem"
                        target="_blank"
                        className="w-full text-left"
                      >
                        Selagem
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="https://profillsbrasil.lojaintegrada.com.br/aquecimento-e-selagem"
                        target="_blank"
                        className="w-full text-left"
                      >
                        Fitas
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="https://profillsbrasil.lojaintegrada.com.br/conexoes-pneumaticas"
                        target="_blank"
                        className="w-full text-left"
                      >
                        Conexões
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </div>
                <div className="relative h-full w-full">
                  <Image
                    src={pecasImg}
                    alt="Peças a venda"
                    className="absolute h-full w-full object-cover"
                  />
                </div>
              </div>
              <ListItem
                href="/docs/primitives/typography"
                title="Ver catálogo completo!"
                className="border-accent mt-2 mb-1 flex h-full w-full rounded-xs border"
              >
                Veja nosso catálogo completo de peças a venda.
              </ListItem>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Projetos</NavigationMenuTrigger>
            <NavigationMenuContent>
              <span className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {projetos.map((projeto) => (
                  <ListItem
                    key={projeto.title}
                    title={projeto.title}
                    href={projeto.href}
                    icon={projeto.icon}
                  >
                    {projeto.description}
                  </ListItem>
                ))}
              </span>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/montar-fabrica">Monte a sua fabrica</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Outros Serviços</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[400px] grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <NavigationMenuLink asChild>
                    <Link href="/servicos-personalizados">Corte a Laser</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/servicos-personalizados">
                      Dobra e Corte CNC
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/servicos-personalizados">Usinagem CNC</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/servicos-personalizados">Soldagem</Link>
                  </NavigationMenuLink>
                </div>
                <div className="relative h-full w-full">
                  <Image
                    src={servicosPersonalizados}
                    alt="Serviços Personalizados"
                    className="absolute inset-0 h-full w-full rounded-xs object-cover"
                  />
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  className,
  icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  icon?: React.ReactNode;
}) {
  return (
    <span {...props} className={`group w-full ${className}`}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="flex w-full flex-row items-center justify-start gap-2"
        >
          {icon}
          <div className="flex flex-1 flex-col items-start justify-center">
            <div className="group-hover:text-accent/90 text-accent mb-1 text-sm leading-none font-bold">
              {title}
            </div>
            <p className="line-clamp-1 text-sm leading-tight text-white group-hover:text-white">
              {children}
            </p>
          </div>
        </Link>
      </NavigationMenuLink>
    </span>
  );
}
