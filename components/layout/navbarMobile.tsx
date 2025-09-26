"use client";

import {
  Archive,
  Brain,
  Building,
  Calendar,
  Cloud,
  Droplets,
  Facebook,
  Globe,
  GraduationCap,
  Home,
  Instagram,
  Landmark,
  Layers,
  Leaf,
  Linkedin,
  Menu,
  Package,
  Store,
  User,
  Wrench,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logoProfills from "@/public/logo-branco.png";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const projetos = [
  {
    title: "Profills P&D",
    href: "/projetos/profills-pd",
    description: "IA e Indústria 4.0, com menos paradas e falhas.",
    icon: <Brain className="text-accent mr-2 size-5" />,
  },
  {
    title: "Profills ERP",
    href: "/projetos/profills-erp",
    description: "Gestão integrada em nuvem, automação e menos erros.",
    icon: <Cloud className="text-accent mr-2 size-5" />,
  },
  {
    title: "Profills Bank",
    href: "/projetos/profills-bank",
    description: "Finanças digitais acessíveis e seguras.",
    icon: <Landmark className="text-accent mr-2 size-5" />,
  },
  {
    title: "Profills HUB",
    href: "/projetos/profills-hub",
    description:
      "Presença internacional, embalagens seguras e soluções completas",
    icon: <Globe className="text-accent mr-2 size-5" />,
  },
  {
    title: "Profills Locação",
    href: "/projetos/profills-locacao",
    description: "Máquinas por assinatura, acesso fácil e baixo risco.",
    icon: <Calendar className="text-accent mr-2 size-5" />,
  },
  {
    title: "Profills Marketplace",
    href: "/projetos/profills-marketplace",
    description:
      "Conexão digital segura entre produtores, clientes e parceiros.",
    icon: <Store className="text-accent mr-2 size-5" />,
  },
  {
    title: "Profills School",
    href: "/projetos/profills-school",
    description: "Educação técnica acessível para capacitar e gerar impacto.",
    icon: <GraduationCap className="text-accent mr-2 size-5" />,
  },
  {
    title: "Profills Sustentabilidade",
    href: "/projetos/profills-sustentabilidade",
    description: "Soluções em alimento, educação e futuro com impacto.",
    icon: <Leaf className="text-accent mr-2 size-5" />,
  },
];

const maquinas = [
  {
    title: "Envasadoras",
    href: "/maquinas?categoria=Envasadoras",
    icon: <Droplets className="text-accent mr-2 size-5" />,
  },
  {
    title: "Enfardadeiras",
    href: "/maquinas?categoria=Enfardadeiras",
    icon: <Archive className="text-accent mr-2 size-5" />,
  },
  {
    title: "Embaladoras",
    href: "/maquinas?categoria=Embaladoras",
    icon: <Package className="text-accent mr-2 size-5" />,
  },
  {
    title: "Envolvedoras",
    href: "/maquinas?categoria=Envolvedoras",
    icon: <Layers className="text-accent mr-2 size-5" />,
  },
];

const pecas = [
  {
    title: "Sensores",
    href: "https://profillsbrasil.lojaintegrada.com.br/sensores",
  },
  {
    title: "Resistência",
    href: "https://profillsbrasil.lojaintegrada.com.br/resistencias",
  },
  {
    title: "Atuadores",
    href: "https://profillsbrasil.lojaintegrada.com.br/atuadores",
  },
  {
    title: "Silenciadores",
    href: "https://profillsbrasil.lojaintegrada.com.br/silenciadores",
  },
  {
    title: "Lâminas",
    href: "https://profillsbrasil.lojaintegrada.com.br/corte",
  },
  {
    title: "Válvulas",
    href: "https://profillsbrasil.lojaintegrada.com.br/valvulas",
  },
  { title: "Molas", href: "https://profillsbrasil.lojaintegrada.com.br/molas" },
  {
    title: "Selagem",
    href: "https://profillsbrasil.lojaintegrada.com.br/aquecimento-e-selagem",
  },
  {
    title: "Fitas",
    href: "https://profillsbrasil.lojaintegrada.com.br/aquecimento-e-selagem",
  },
  {
    title: "Conexões",
    href: "https://profillsbrasil.lojaintegrada.com.br/conexoes-pneumaticas",
  },
];

const servicos = [
  { title: "Corte a Laser", href: "/servicos-personalizados" },
  { title: "Dobra e Corte CNC", href: "/servicos-personalizados" },
  { title: "Usinagem CNC", href: "/servicos-personalizados" },
  { title: "Soldagem", href: "/servicos-personalizados" },
];

export default function NavbarMobile() {
  return (
    <div className="border-border/10 fixed top-0 z-50 flex h-16 w-full border-b bg-slate-900 md:hidden">
      <Link href="/" className="flex h-full w-full items-center justify-center">
        <Image
          src={logoProfills}
          alt="Logo Profills"
          className="h-8 w-auto object-contain"
        />
      </Link>

      <div className="absolute top-1/2 right-4 -translate-y-1/2">
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <button className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-800 text-white transition-colors hover:bg-slate-700">
              <Menu className="h-6 w-6" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="h-full w-80 border-l border-slate-700 bg-slate-900">
            <DrawerHeader className="border-border/20 border-b pb-4">
              <DrawerTitle className="flex items-center justify-center text-xl font-bold text-white">
                <Image
                  src={logoProfills}
                  alt="Logo Profills"
                  className="h-8 w-auto object-contain"
                />
              </DrawerTitle>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Links principais */}
              <div className="mb-6">
                <DrawerClose asChild>
                  <Link
                    href="/"
                    className="hover:text-accent flex items-center py-3 text-white transition-colors"
                  >
                    <Home className="text-accent mr-2 size-5" />
                    Home
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link
                    href="/sobre"
                    className="hover:text-accent flex items-center py-3 text-white transition-colors"
                  >
                    <User className="text-accent mr-2 size-5" />
                    Sobre
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link
                    href="/montar-fabrica"
                    className="hover:text-accent flex items-center py-3 text-white transition-colors"
                  >
                    <Building className="text-accent mr-2 size-5" />
                    Monte a sua fábrica
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link
                    href="/montar-maquina"
                    className="hover:text-accent flex items-center py-3 text-white transition-colors"
                  >
                    <Wrench className="text-accent mr-2 size-5" />
                    Monte a sua máquina
                  </Link>
                </DrawerClose>
              </div>

              {/* Accordion para seções com múltiplas opções */}
              <Accordion
                type="multiple"
                defaultValue={["maquinas"]}
                className="w-full"
              >
                {/* Máquinas */}
                <AccordionItem value="maquinas" className="border-border/20">
                  <AccordionTrigger className="hover:text-accent text-white">
                    <div className="flex items-center">
                      <Package className="text-accent mr-2 size-5" />
                      Máquinas
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-2 pl-6">
                      {maquinas.map((maquina) => (
                        <DrawerClose asChild key={maquina.title}>
                          <Link
                            href={maquina.href}
                            className="hover:text-accent flex items-center py-2 text-slate-300 transition-colors"
                          >
                            {maquina.icon}
                            {maquina.title}
                          </Link>
                        </DrawerClose>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Peças */}
                <AccordionItem value="pecas" className="border-border/20">
                  <AccordionTrigger className="hover:text-accent text-white">
                    <div className="flex items-center">
                      <Archive className="text-accent mr-2 size-5" />
                      Peças
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-2 pl-6">
                      {pecas.map((peca) => (
                        <DrawerClose asChild key={peca.title}>
                          <Link
                            href={peca.href}
                            target="_blank"
                            className="hover:text-accent flex items-center py-2 text-slate-300 transition-colors"
                          >
                            {peca.title}
                          </Link>
                        </DrawerClose>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Projetos */}
                <AccordionItem value="projetos" className="border-border/20">
                  <AccordionTrigger className="hover:text-accent text-white">
                    <div className="flex items-center">
                      <Brain className="text-accent mr-2 size-5" />
                      Projetos
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-3 pl-6">
                      {projetos.map((projeto) => (
                        <DrawerClose asChild key={projeto.title}>
                          <Link
                            href={projeto.href}
                            className="hover:text-accent flex items-start py-2 text-slate-300 transition-colors"
                          >
                            <div className="flex items-start">
                              {projeto.icon}
                              <div className="font-medium">{projeto.title}</div>
                            </div>
                          </Link>
                        </DrawerClose>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Outros Serviços */}
                <AccordionItem value="servicos" className="border-border/20">
                  <AccordionTrigger className="hover:text-accent text-white">
                    <div className="flex items-center">
                      <Layers className="text-accent mr-2 size-5" />
                      Outros Serviços
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-2 pl-6">
                      {servicos.map((servico) => (
                        <DrawerClose asChild key={servico.title}>
                          <Link
                            href={servico.href}
                            className="hover:text-accent flex items-center py-2 text-slate-300 transition-colors"
                          >
                            {servico.title}
                          </Link>
                        </DrawerClose>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <DrawerFooter className="flex flex-row items-center justify-center gap-3">
              {[
                {
                  href: "https://www.facebook.com/profillsbrasil/",
                  icon: Facebook,
                  label: "Facebook",
                  color: "text-blue-500 ",
                },
                {
                  href: "https://www.instagram.com/profillsdobrasil/",
                  icon: Instagram,
                  label: "Instagram",
                  color: "text-pink-500 ",
                },
                {
                  href: "https://www.linkedin.com/company/profillsdobrasil/",
                  icon: Linkedin,
                  label: "LinkedIn",
                  color: "text-blue-400 ",
                },
                {
                  href: "https://www.youtube.com/channel/UCQhaNOzqbkYnZlknSd79zEw",
                  icon: Youtube,
                  label: "YouTube",
                  color: "text-red-500 ",
                },
              ].map(({ href, icon: Icon, label, color }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`group relative rounded-xs border border-slate-700/50 bg-slate-800/30 p-3 backdrop-blur-sm ${color} transition-all duration-300 hover:scale-110 hover:border-slate-600/50 hover:shadow-lg md:p-4`}
                >
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                  <div className="absolute inset-0 rounded-xs bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              ))}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
