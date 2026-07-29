'use client';

import Image from 'next/image';
import Link from 'next/link';

import { BlurFade } from '@/components/ui/blur-fade';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import logoProfills from '@/public/logo-branco.png';

import { socialLinks } from './socialLinks';
import {
  Archive,
  Brain,
  Building,
  Calendar,
  Cloud,
  Droplets,
  Globe,
  GraduationCap,
  Home,
  Landmark,
  Layers,
  Leaf,
  Menu,
  Package,
  Store,
  User,
  Users,
  Wrench
} from 'lucide-react';

const projetos = [
  {
    title: 'Profills P&D',
    href: '/projetos/profills-pd',
    description: 'IA e Indústria 4.0, com menos paradas e falhas.',
    icon: <Brain className='text-accent mr-2 size-5' />
  },
  {
    title: 'Profills ERP',
    href: '/projetos/profills-erp',
    description: 'Gestão integrada em nuvem, automação e menos erros.',
    icon: <Cloud className='text-accent mr-2 size-5' />
  },
  {
    title: 'Profills Bank',
    href: '/projetos/profills-bank',
    description: 'Finanças digitais acessíveis e seguras.',
    icon: <Landmark className='text-accent mr-2 size-5' />
  },
  {
    title: 'Profills HUB',
    href: '/projetos/profills-hub',
    description:
      'Presença internacional, embalagens seguras e soluções completas',
    icon: <Globe className='text-accent mr-2 size-5' />
  },
  {
    title: 'Profills Locação',
    href: '/projetos/profills-locacao',
    description: 'Máquinas por assinatura, acesso fácil e baixo risco.',
    icon: <Calendar className='text-accent mr-2 size-5' />
  },
  {
    title: 'Profills Marketplace',
    href: '/projetos/profills-marketplace',
    description:
      'Conexão digital segura entre produtores, clientes e parceiros.',
    icon: <Store className='text-accent mr-2 size-5' />
  },
  {
    title: 'Profills School',
    href: '/projetos/profills-school',
    description: 'Educação técnica acessível para capacitar e gerar impacto.',
    icon: <GraduationCap className='text-accent mr-2 size-5' />
  },
  {
    title: 'Profills Sustentabilidade',
    href: '/projetos/profills-sustentabilidade',
    description: 'Soluções em alimento, educação e futuro com impacto.',
    icon: <Leaf className='text-accent mr-2 size-5' />
  }
];

const maquinas = [
  {
    title: 'Envasadoras',
    href: '/maquinas?categoria=Envasadoras',
    icon: <Droplets className='text-accent mr-2 size-5' />
  },
  {
    title: 'Enfardadeiras',
    href: '/maquinas?categoria=Enfardadeiras',
    icon: <Archive className='text-accent mr-2 size-5' />
  },
  {
    title: 'Embaladoras',
    href: '/maquinas?categoria=Embaladoras',
    icon: <Package className='text-accent mr-2 size-5' />
  },
  {
    title: 'Envolvedoras',
    href: '/maquinas?categoria=Envolvedoras',
    icon: <Layers className='text-accent mr-2 size-5' />
  }
];

const pecas = [
  {
    title: 'Sensores',
    href: 'https://profillsbrasil.lojaintegrada.com.br/sensores'
  },
  {
    title: 'Resistência',
    href: 'https://profillsbrasil.lojaintegrada.com.br/resistencias'
  },
  {
    title: 'Atuadores',
    href: 'https://profillsbrasil.lojaintegrada.com.br/atuadores'
  },
  {
    title: 'Silenciadores',
    href: 'https://profillsbrasil.lojaintegrada.com.br/silenciadores'
  },
  {
    title: 'Lâminas',
    href: 'https://profillsbrasil.lojaintegrada.com.br/corte'
  },
  {
    title: 'Válvulas',
    href: 'https://profillsbrasil.lojaintegrada.com.br/valvulas'
  },
  { title: 'Molas', href: 'https://profillsbrasil.lojaintegrada.com.br/molas' },
  {
    title: 'Selagem',
    href: 'https://profillsbrasil.lojaintegrada.com.br/aquecimento-e-selagem'
  },
  {
    title: 'Fitas',
    href: 'https://profillsbrasil.lojaintegrada.com.br/aquecimento-e-selagem'
  },
  {
    title: 'Conexões',
    href: 'https://profillsbrasil.lojaintegrada.com.br/conexoes-pneumaticas'
  }
];

const servicos = [
  { title: 'Corte a Laser', href: '/servicos-personalizados' },
  { title: 'Dobra e Corte CNC', href: '/servicos-personalizados' },
  { title: 'Usinagem CNC', href: '/servicos-personalizados' },
  { title: 'Soldagem', href: '/servicos-personalizados' }
];

export default function NavbarMobile() {
  return (
    <div className='fixed top-0 z-50 flex h-16 w-full border-b border-secondary-foreground/5 bg-secondary md:hidden'>
      <div className='flex h-full w-full items-center justify-center pr-5'>
        <Link
          href='/'
          className='flex h-full w-full items-center justify-center'>
          <Image
            src={logoProfills}
            alt='Logo Profills'
            priority
            className='h-8 w-auto object-contain'
          />
        </Link>
      </div>

      <div className='absolute top-1/2 right-4 -translate-y-1/2'>
        <Drawer direction='right'>
          <DrawerTrigger asChild>
            <button
              aria-label='Abrir menu de navegação'
              className='flex h-11 w-11 items-center justify-center rounded-md bg-secondary-foreground/10 text-secondary-foreground transition-colors hover:bg-secondary-foreground/20'>
              <Menu className='h-6 w-6' />
            </button>
          </DrawerTrigger>
          <DrawerContent className='h-full border-l border-secondary-foreground/10 bg-secondary data-[vaul-drawer-direction=right]:w-[92%] data-[vaul-drawer-direction=right]:sm:max-w-none'>
            <DrawerHeader className='border-b border-secondary-foreground/10 pb-4'>
              <DrawerTitle className='flex items-center justify-center text-xl font-bold text-secondary-foreground'>
                <Image
                  src={logoProfills}
                  alt='Logo Profills'
                  className='h-8 w-auto object-contain'
                />
              </DrawerTitle>
              <DrawerDescription className='sr-only'>
                Navegue pelas seções do site Profills Brasil
              </DrawerDescription>
            </DrawerHeader>

            <div className='flex-1 overflow-y-auto p-4'>
              {/* Links principais */}
              <div className='mb-6'>
                <BlurFade delay={0.05} direction="right">
                  <DrawerClose asChild>
                    <Link
                      href='/'
                      className='hover:text-accent flex min-h-[44px] items-center border-l-2 border-transparent py-3 text-secondary-foreground transition-all duration-200 hover:border-accent hover:pl-1'>
                      <Home className='text-accent mr-2 size-5' />
                      Início
                    </Link>
                  </DrawerClose>
                </BlurFade>
                <BlurFade delay={0.1} direction="right">
                  <DrawerClose asChild>
                    <Link
                      href='/sobre'
                      className='hover:text-accent flex min-h-[44px] items-center border-l-2 border-transparent py-3 text-secondary-foreground transition-all duration-200 hover:border-accent hover:pl-1'>
                      <User className='text-accent mr-2 size-5' />
                      Sobre
                    </Link>
                  </DrawerClose>
                </BlurFade>
                <BlurFade delay={0.125} direction="right">
                  <DrawerClose asChild>
                    <Link
                      href='/clientes'
                      className='hover:text-accent flex min-h-[44px] items-center border-l-2 border-transparent py-3 text-secondary-foreground transition-all duration-200 hover:border-accent hover:pl-1'>
                      <Users className='text-accent mr-2 size-5' />
                      Clientes
                    </Link>
                  </DrawerClose>
                </BlurFade>
                <BlurFade delay={0.15} direction="right">
                  <DrawerClose asChild>
                    <Link
                      href='/montar-fabrica'
                      className='hover:text-accent flex min-h-[44px] items-center border-l-2 border-transparent py-3 text-secondary-foreground transition-all duration-200 hover:border-accent hover:pl-1'>
                      <Building className='text-accent mr-2 size-5' />
                      Monte a sua fábrica
                    </Link>
                  </DrawerClose>
                </BlurFade>
                <BlurFade delay={0.2} direction="right">
                  <DrawerClose asChild>
                    <Link
                      href='/montar-maquina'
                      className='hover:text-accent flex min-h-[44px] items-center border-l-2 border-transparent py-3 text-secondary-foreground transition-all duration-200 hover:border-accent hover:pl-1'>
                      <Wrench className='text-accent mr-2 size-5' />
                      Monte a sua máquina
                    </Link>
                  </DrawerClose>
                </BlurFade>
              </div>

              {/* Accordion para seções com múltiplas opções */}
              <BlurFade delay={0.25} direction="right">
              <Accordion type='multiple' className='w-full'>
                {/* Máquinas */}
                <AccordionItem value='maquinas' className='border-secondary-foreground/10'>
                  <AccordionTrigger className='hover:text-accent text-secondary-foreground'>
                    <div className='flex items-center'>
                      <Package className='text-accent mr-2 size-5' />
                      Máquinas
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-4'>
                    <div className='space-y-2 pl-6'>
                      {maquinas.map((maquina) => (
                        <div
                          key={maquina.title}
                          className='hover:text-accent flex items-center py-3 text-secondary-foreground/70 transition-colors'>
                          <DrawerClose asChild>
                            <Link
                              href={maquina.href}
                              className='flex w-full items-center'>
                              {maquina.icon}
                              {maquina.title}
                            </Link>
                          </DrawerClose>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Peças - oculto até integração com sistema externo */}
                <AccordionItem value='pecas' className='hidden border-secondary-foreground/10'>
                  <AccordionTrigger className='hover:text-accent text-secondary-foreground'>
                    <div className='flex items-center'>
                      <Archive className='text-accent mr-2 size-5' />
                      Peças
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-4'>
                    <div className='space-y-2 pl-6'>
                      {pecas.map((peca) => (
                        <div
                          key={peca.title}
                          className='hover:text-accent flex items-center py-3 text-secondary-foreground/70 transition-colors'>
                          <DrawerClose asChild>
                            <Link
                              href={peca.href}
                              target='_blank'
                              className='flex w-full items-center'>
                              {peca.title}
                            </Link>
                          </DrawerClose>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Projetos */}
                <AccordionItem value='projetos' className='border-secondary-foreground/10'>
                  <AccordionTrigger className='hover:text-accent text-secondary-foreground'>
                    <div className='flex items-center'>
                      <Brain className='text-accent mr-2 size-5' />
                      Projetos
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-4'>
                    <div className='space-y-3 pl-6'>
                      {projetos.map((projeto) => (
                        <div
                          key={projeto.title}
                          className='hover:text-accent flex items-start py-3 text-secondary-foreground/70 transition-colors'>
                          <DrawerClose asChild>
                            <Link
                              href={projeto.href}
                              className='flex w-full items-start'>
                              <div className='flex items-start'>
                                {projeto.icon}
                                <div className='font-medium'>
                                  {projeto.title}
                                </div>
                              </div>
                            </Link>
                          </DrawerClose>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Outros Serviços */}
                <AccordionItem value='servicos' className='border-secondary-foreground/10'>
                  <AccordionTrigger className='hover:text-accent text-secondary-foreground'>
                    <div className='flex items-center'>
                      <Layers className='text-accent mr-2 size-5' />
                      Outros Serviços
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-4'>
                    <div className='space-y-2 pl-6'>
                      {servicos.map((servico) => (
                        <div
                          key={servico.title}
                          className='hover:text-accent flex items-center py-3 text-secondary-foreground/70 transition-colors'>
                          <DrawerClose asChild>
                            <Link
                              href={servico.href}
                              className='flex w-full items-center'>
                              {servico.title}
                            </Link>
                          </DrawerClose>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              </BlurFade>
            </div>
            <BlurFade delay={0.3} direction="up">
            <DrawerFooter className='flex flex-row items-center justify-center gap-3'>
              {socialLinks.map(({ href, Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  className='rounded-xs border border-secondary-foreground/10 p-3 text-secondary-foreground/40 transition-all duration-300 hover:border-accent/30 hover:text-accent'>
                  <Icon className='h-6 w-6' />
                </Link>
              ))}
            </DrawerFooter>
            </BlurFade>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
