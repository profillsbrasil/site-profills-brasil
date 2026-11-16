'use client';

import Image from 'next/image';
import Link from 'next/link';

import { LinkDaArvore } from '@/components/layout/linkDaArvore';
import { NAVEGACAO, type NoMenu } from '@/components/layout/navegacao';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { BlurFade } from '@/components/ui/blur-fade';
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
import { Menu } from 'lucide-react';

const principais = [NAVEGACAO.marca, ...NAVEGACAO.links, ...NAVEGACAO.monte];

function FolhasDoMenu({ painel }: { painel: NoMenu['painel'] }) {
  switch (painel.forma) {
    case 'vitrine':
      return (
        <div className='space-y-2 pl-6'>
          {painel.folhas.map((folha) => (
            <div
              key={folha.id}
              className='hover:text-accent flex items-center py-3 text-secondary-foreground/70 transition-colors'>
              <DrawerClose asChild>
                <LinkDaArvore alvo={folha} className='flex w-full items-center'>
                  <folha.icone className='text-accent mr-2 size-5' />
                  {folha.rotulo}
                </LinkDaArvore>
              </DrawerClose>
            </div>
          ))}
        </div>
      );
    case 'cartoes':
      return (
        <div className='space-y-3 pl-6'>
          {painel.folhas.map((folha) => (
            <div
              key={folha.id}
              className='hover:text-accent flex items-start py-3 text-secondary-foreground/70 transition-colors'>
              <DrawerClose asChild>
                <LinkDaArvore alvo={folha} className='flex w-full items-start'>
                  <div className='flex items-start'>
                    <folha.icone className='text-accent mr-2 size-5' />
                    <div className='font-medium'>{folha.rotulo}</div>
                  </div>
                </LinkDaArvore>
              </DrawerClose>
            </div>
          ))}
        </div>
      );
    case 'fotos':
      return (
        <div className='space-y-2 pl-6'>
          {painel.folhas.map((folha) => (
            <div
              key={folha.id}
              className='hover:text-accent flex items-center py-3 text-secondary-foreground/70 transition-colors'>
              <DrawerClose asChild>
                <LinkDaArvore alvo={folha} className='flex w-full items-center'>
                  {folha.rotulo}
                </LinkDaArvore>
              </DrawerClose>
            </div>
          ))}
        </div>
      );
  }
}

export default function NavbarMobile() {
  return (
    <div className='fixed top-0 z-50 flex h-16 w-full border-b border-secondary-foreground/5 bg-secondary lg:hidden'>
      <div className='flex h-full w-full items-center justify-center pr-5'>
        <LinkDaArvore
          alvo={NAVEGACAO.marca}
          className='flex h-full w-full items-center justify-center'>
          <Image
            src={logoProfills}
            alt='Logo Profills'
            priority
            sizes='314px'
            className='h-8 w-auto object-contain'
          />
        </LinkDaArvore>
      </div>

      <div className='absolute top-1/2 right-4 -translate-y-1/2'>
        <Drawer direction='right'>
          <DrawerTrigger asChild>
            <button
              type='button'
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
              <div className='mb-6'>
                {principais.map((no, i) => (
                  <BlurFade
                    key={no.id}
                    delay={0.05 + i * 0.03}
                    direction='right'>
                    <DrawerClose asChild>
                      <LinkDaArvore
                        alvo={no}
                        className='hover:text-accent flex min-h-[44px] items-center border-l-2 border-transparent py-3 text-secondary-foreground transition-all duration-200 hover:border-accent hover:pl-1'>
                        <no.icone className='text-accent mr-2 size-5' />
                        {no.rotulo}
                      </LinkDaArvore>
                    </DrawerClose>
                  </BlurFade>
                ))}
              </div>

              <BlurFade delay={0.25} direction='right'>
                <Accordion type='multiple' className='w-full'>
                  {NAVEGACAO.menus.map((menu) => (
                    <AccordionItem
                      key={menu.id}
                      value={menu.id}
                      className='border-secondary-foreground/10'>
                      <AccordionTrigger className='hover:text-accent text-secondary-foreground'>
                        <div className='flex items-center'>
                          <menu.icone className='text-accent mr-2 size-5' />
                          {menu.rotulo}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className='pb-4'>
                        <FolhasDoMenu painel={menu.painel} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </BlurFade>
            </div>
            <BlurFade delay={0.3} direction='up'>
              <DrawerFooter
                data-redes
                className='flex flex-row items-center justify-center gap-3'>
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
