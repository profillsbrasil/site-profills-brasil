'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/layout/customNavigationMenu';
import { ICONE_CATEGORIA } from '@/components/layout/iconesCategorias';
import { categoriasCatalogo, maquinasCatalogo } from '@/lib/data/maquinas';
import type { CategoriaCatalogo } from '@/lib/data/maquinas';
import servicosPersonalizados from '@/lib/images/extras/cortador.jpg';
import pecasImg from '@/lib/images/extras/pecas-producao.png';
import logoProfills from '@/public/logo-branco.png';

import {
  Brain,
  Calendar,
  Cloud,
  ExternalLink,
  Globe,
  GraduationCap,
  Landmark,
  Layers,
  Leaf,
  Store
} from 'lucide-react';

const projetos: {
  title: string;
  href: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    title: 'Profills P&D',
    href: '/projetos/profills-pd',
    description: 'IA e Indústria 4.0, com menos paradas e falhas.',
    icon: <Brain className='text-accent mr-2 size-6' />
  },

  {
    title: 'Profills ERP',
    href: '/projetos/profills-erp',
    description: 'Gestão integrada em nuvem, automação e menos erros.',
    icon: <Cloud className='text-accent mr-2 size-6' />
  },
  {
    title: 'Profills Bank',
    href: '/projetos/profills-bank',
    description: 'Finanças digitais acessíveis e seguras.',
    icon: <Landmark className='text-accent mr-2 size-6' />
  },
  {
    title: 'Profills HUB',
    href: '/projetos/profills-hub',
    description:
      'Presença internacional, embalagens seguras e soluções completas',
    icon: <Globe className='text-accent mr-2 size-6' />
  },
  {
    title: 'Profills Locação',
    href: '/projetos/profills-locacao',
    description: 'Máquinas por assinatura, acesso fácil e baixo risco.',
    icon: <Calendar className='text-accent mr-2 size-6' />
  },
  {
    title: 'Profills Marketplace',
    href: '/projetos/profills-marketplace',
    description:
      'Conexão digital segura entre produtores, clientes e parceiros.',
    icon: <Store className='text-accent mr-2 size-6' />
  },
  {
    title: 'Profills School',
    href: '/projetos/profills-school',
    description: 'Educação técnica acessível para capacitar e gerar impacto.',
    icon: <GraduationCap className='text-accent mr-2 size-6' />
  },
  {
    title: 'Profills Sustentabilidade',
    href: '/projetos/profills-sustentabilidade',
    description: 'Soluções em alimento, educação e futuro com impacto.',
    icon: <Leaf className='text-accent mr-2 size-6' />
  }
];

/* Vitrine do popout de Máquinas: primeira máquina com foto da categoria
   (ordem do registry). Categoria só de engenharia (sem fotos) retorna
   undefined — a vitrine mostra o placeholder, nunca máquina de outra
   categoria. */
function maquinaVitrine(categoria: CategoriaCatalogo | null) {
  return maquinasCatalogo.find(
    (m) => m.imagens && (categoria === null || m.categoria === categoria)
  );
}

export default function NavbarDesktop() {
  const [scrolled, setScrolled] = useState(false);
  const [categoriaVitrine, setCategoriaVitrine] =
    useState<CategoriaCatalogo | null>(null);
  const vitrine = maquinaVitrine(categoriaVitrine);
  const subtituloVitrine = vitrine
    ? (vitrine.nomeCompleto.split(' - ')[1] ?? vitrine.categoria)
    : '';

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 10);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <NavigationMenu
      viewport={false}
      delayDuration={0}
      skipDelayDuration={500}
      className={`fixed top-0 z-50 hidden h-16 min-w-full border-b md:flex transition-all duration-300 ${
        scrolled
          ? 'bg-secondary/95 backdrop-blur-md border-secondary-foreground/10 shadow-lg shadow-black/20'
          : 'bg-secondary border-secondary-foreground/5'
      }`}>
      <NavigationMenuList className='flex h-full w-7xl items-center justify-center'>
        <NavigationMenuItem className='h-full'>
          <Link href='/'>
            <Image
              src={logoProfills}
              alt='Logo Profills'
              priority
              className='h-full'
            />
          </Link>
        </NavigationMenuItem>
        <div className='flex h-full w-full items-center justify-center gap-2'>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href='/'>Início</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href='/sobre'>Sobre</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href='/clientes'>Clientes</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Máquinas</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className='flex w-[640px] gap-3'>
                <div className='flex min-w-0 flex-1 flex-col gap-1 whitespace-nowrap'>
                  <ListItem
                    href='/maquinas'
                    title='Todas as máquinas'
                    className='w-full'
                    icon={<Layers className='text-accent mr-2 size-6' />}
                    onMouseEnter={() => setCategoriaVitrine(null)}
                    onFocus={() => setCategoriaVitrine(null)}
                  />
                  <div
                    aria-hidden
                    className='my-1 border-t border-dashed border-[rgba(148,178,235,0.22)]'
                  />
                  {categoriasCatalogo.map((categoria) => {
                    const Icone = ICONE_CATEGORIA[categoria];
                    return (
                      <ListItem
                        key={categoria}
                        href={`/maquinas?categoria=${encodeURIComponent(categoria)}`}
                        title={categoria}
                        className='w-full'
                        icon={<Icone className='text-accent mr-2 size-6' />}
                        onMouseEnter={() => setCategoriaVitrine(categoria)}
                        onFocus={() => setCategoriaVitrine(categoria)}
                      />
                    );
                  })}
                </div>
                <div className='relative flex w-[250px] shrink-0 flex-col rounded-xs border border-dashed border-[rgba(148,178,235,0.3)]'>
                  <span
                    aria-hidden
                    className='border-accent absolute -top-px -left-px z-10 h-2 w-2 border-t border-l'
                  />
                  <span
                    aria-hidden
                    className='border-accent absolute -right-px -bottom-px z-10 h-2 w-2 border-r border-b'
                  />
                  {vitrine?.imagens ? (
                    <div
                      key={vitrine.slug}
                      className='animate-in fade-in flex min-h-0 flex-1 flex-col duration-200 motion-reduce:animate-none'>
                      <Image
                        src={vitrine.imagens.maquina}
                        alt={vitrine.nome}
                        loading='eager'
                        className='min-h-0 w-full flex-1 object-contain p-3'
                      />
                      <div className='border-t border-dashed border-[rgba(148,178,235,0.22)] bg-slate-900/60 px-3 py-2'>
                        <p className='text-sm font-bold text-white'>
                          {vitrine.nome}
                        </p>
                        <p className='text-muted-foreground/70 font-mono text-[10px] tracking-wider uppercase'>
                          {subtituloVitrine}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className='animate-in fade-in flex min-h-0 flex-1 flex-col items-center justify-center gap-2 rounded-xs bg-slate-900/60 p-4 duration-200 motion-reduce:animate-none'>
                      <span className='text-accent font-mono text-2xl'>+</span>
                      <span className='text-muted-foreground/70 px-2 text-center font-mono text-[11px] tracking-[0.2em] uppercase'>
                        Solução de engenharia
                        <br />
                        sob projeto
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className='hidden'>
            <NavigationMenuTrigger>Peças</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className='grid h-full w-[500px] grid-cols-[1fr_1fr] gap-2'>
                <div className='flex h-full w-full gap-2'>
                  <div className='flex w-1/2 flex-col gap-2'>
                    <NavigationMenuLink asChild>
                      <Link
                        href='https://profillsbrasil.lojaintegrada.com.br/sensores'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex w-full items-center gap-1 text-left'>
                        Sensores <ExternalLink className='size-3 opacity-50' />
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href='https://profillsbrasil.lojaintegrada.com.br/resistencias'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex w-full items-center gap-1 text-left'>
                        Resistência{' '}
                        <ExternalLink className='size-3 opacity-50' />
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href='https://profillsbrasil.lojaintegrada.com.br/atuadores'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex w-full items-center gap-1 text-left'>
                        Atuadores <ExternalLink className='size-3 opacity-50' />
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href='https://profillsbrasil.lojaintegrada.com.br/silenciadores'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex w-full items-center gap-1 text-left'>
                        Silenciadores{' '}
                        <ExternalLink className='size-3 opacity-50' />
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href='https://profillsbrasil.lojaintegrada.com.br/corte'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex w-full items-center gap-1 text-left'>
                        Laminas <ExternalLink className='size-3 opacity-50' />
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className='flex w-1/2 flex-col gap-2 pr-2'>
                    <NavigationMenuLink asChild>
                      <Link
                        href='https://profillsbrasil.lojaintegrada.com.br/valvulas'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex w-full items-center gap-1 text-left'>
                        Válvulas <ExternalLink className='size-3 opacity-50' />
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href='https://profillsbrasil.lojaintegrada.com.br/molas'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex w-full items-center gap-1 text-left'>
                        Molas <ExternalLink className='size-3 opacity-50' />
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href='https://profillsbrasil.lojaintegrada.com.br/aquecimento-e-selagem'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex w-full items-center gap-1 text-left'>
                        Selagem <ExternalLink className='size-3 opacity-50' />
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href='https://profillsbrasil.lojaintegrada.com.br/aquecimento-e-selagem'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex w-full items-center gap-1 text-left'>
                        Fitas <ExternalLink className='size-3 opacity-50' />
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href='https://profillsbrasil.lojaintegrada.com.br/conexoes-pneumaticas'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex w-full items-center gap-1 text-left'>
                        Conexões <ExternalLink className='size-3 opacity-50' />
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </div>
                <div className='relative h-full w-full'>
                  <Image
                    src={pecasImg}
                    alt='Peças a venda'
                    className='absolute h-full w-full object-cover'
                  />
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Projetos</NavigationMenuTrigger>
            <NavigationMenuContent>
              <span className='grid w-[500px] gap-2 md:grid-cols-2'>
                {projetos.map((projeto) => (
                  <ListItem
                    key={projeto.title}
                    title={projeto.title}
                    href={projeto.href}
                    icon={projeto.icon}>
                    {projeto.description}
                  </ListItem>
                ))}
              </span>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href='/montar-fabrica'>Monte a sua fábrica</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href='/montar-maquina'>Monte a sua máquina</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Outros Serviços</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className='grid w-[350px] grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                  <NavigationMenuLink asChild>
                    <Link href='/servicos-personalizados#corte-laser'>
                      Corte a Laser
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href='/servicos-personalizados#dobra-cnc'>
                      Dobra e Corte CNC
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href='/servicos-personalizados#usinagem-cnc'>
                      Usinagem CNC
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href='/servicos-personalizados#soldagem'>
                      Soldagem
                    </Link>
                  </NavigationMenuLink>
                </div>
                <div className='relative h-full w-full'>
                  <Image
                    src={servicosPersonalizados}
                    alt='Serviços Personalizados'
                    className='absolute inset-0 h-full w-full rounded-xs object-cover'
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
}: React.ComponentPropsWithoutRef<'li'> & {
  href: string;
  icon?: React.ReactNode;
}) {
  return (
    <span {...props} className={`group w-full ${className}`}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className='flex w-full flex-row items-center justify-start gap-2'>
          {icon}
          <div className='flex flex-1 flex-col items-start justify-center'>
            <div className='group-hover:text-accent/90 text-accent mb-1 text-sm leading-none font-bold'>
              {title}
            </div>
            {children && (
              <p className='line-clamp-1 text-sm leading-tight text-secondary-foreground/70 group-hover:text-secondary-foreground'>
                {children}
              </p>
            )}
          </div>
        </Link>
      </NavigationMenuLink>
    </span>
  );
}
