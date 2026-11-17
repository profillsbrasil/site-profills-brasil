'use client';

import { type ReactNode, createContext, use, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import type { ImagensApagadas } from '@/lib/blog/tipos';

import { type ResultadoApagar, apagarRascunho } from '../acoes';
import { classeBotaoContorno } from './estilos';
import { Trash2 } from 'lucide-react';

type Apagado = { titulo: string; imagens: ImagensApagadas };

const AvisoContext = createContext<(apagado: Apagado) => void>(() => {});

const imagens = (n: number) => (n === 1 ? '1 imagem' : `${n} imagens`);

const SEM_USO = 'como "Sem uso" na tela Imagens.';

export function textoDoAviso({ titulo, imagens: resultado }: Apagado) {
  const inicio = `Rascunho "${titulo}" apagado`;

  if (resultado === null) {
    return `${inicio}. As imagens dele não saíram do armazém e aparecem ${SEM_USO}`;
  }

  const { apagadas, falharam } = resultado;
  const com = apagadas > 0 ? `, com ${imagens(apagadas)}` : '';

  if (falharam === 0) return `${inicio}${com}.`;

  const ficaram =
    falharam === 1
      ? 'não saiu do armazém e aparece'
      : 'não saíram do armazém e aparecem';

  return `${inicio}${com}. ${imagens(falharam)} ${ficaram} ${SEM_USO}`;
}

const falhou = ({ imagens: resultado }: Apagado) =>
  resultado === null || resultado.falharam > 0;

/** Guarda o aviso acima da lista: a linha apagada sai no refresh e leva o estado dela junto. */
export function AvisosDeApagar({
  cabecalho,
  children
}: {
  cabecalho: ReactNode;
  children: ReactNode;
}) {
  const [apagado, setApagado] = useState<Apagado | null>(null);

  return (
    <AvisoContext value={setApagado}>
      {cabecalho}
      {apagado ? (
        <p
          role='status'
          className={`border-b px-5 py-2 text-xs font-medium ${falhou(apagado) ? 'border-[#f0d5b8] bg-[#fbeee0] text-[#9a4f12]' : 'border-[#bfe3cf] bg-[#e3f3ea] text-[#1f7a4d]'}`}>
          {textoDoAviso(apagado)}
        </p>
      ) : null}
      {children}
    </AvisoContext>
  );
}

type Etapa =
  | { fase: 'fechado' }
  | { fase: 'confirmando'; erro: string | null }
  | { fase: 'apagando' };

export function LixeiraRascunho({
  slug,
  versao,
  titulo
}: {
  slug: string;
  versao: number;
  titulo: string;
}) {
  const avisar = use(AvisoContext);
  const [etapa, setEtapa] = useState<Etapa>({ fase: 'fechado' });
  const enviando = useRef(false);
  const apagando = etapa.fase === 'apagando';

  async function apagar() {
    if (enviando.current) return;

    enviando.current = true;
    setEtapa({ fase: 'apagando' });

    let resultado: ResultadoApagar;

    try {
      resultado = await apagarRascunho({ slug, versao });
    } catch {
      resultado = {
        ok: false,
        erro: 'O servidor não respondeu. Confira a conexão e tente de novo.'
      };
    }

    enviando.current = false;

    if (!resultado.ok) {
      setEtapa({ fase: 'confirmando', erro: resultado.erro });

      return;
    }

    setEtapa({ fase: 'fechado' });
    avisar({ titulo, imagens: resultado.imagens });
  }

  return (
    <>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        aria-label={`Apagar o rascunho "${titulo}"`}
        title='Apagar rascunho'
        onClick={() => setEtapa({ fase: 'confirmando', erro: null })}
        className='absolute top-1/2 right-4 size-7 -translate-y-1/2 rounded-xs text-[#8a90a0] transition-colors hover:bg-[#fdecec] hover:text-[#9b1c1c] focus-visible:bg-[#fdecec] focus-visible:text-[#9b1c1c] focus-visible:ring-0 motion-reduce:transition-none'>
        <Trash2 aria-hidden='true' className='size-4' />
      </Button>

      <Dialog
        open={etapa.fase !== 'fechado'}
        onOpenChange={(aberto) => {
          if (!aberto && !apagando) setEtapa({ fase: 'fechado' });
        }}>
        <DialogContent
          showCloseButton={false}
          className='tema-admin rounded-xs motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none'>
          <DialogHeader>
            <DialogTitle>Apagar rascunho?</DialogTitle>
            <DialogDescription>
              O rascunho{' '}
              <strong className='font-semibold text-[#1b1c1f]'>
                {`"${titulo}"`}
              </strong>{' '}
              sai da lista. As imagens dele saem do armazém junto, menos as que
              outro post usa. Não dá para desfazer.
            </DialogDescription>
          </DialogHeader>
          {etapa.fase === 'confirmando' && etapa.erro ? (
            <p role='alert' className='text-sm text-[#9b1c1c]'>
              {etapa.erro}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              disabled={apagando}
              className={classeBotaoContorno}
              onClick={() => setEtapa({ fase: 'fechado' })}>
              Cancelar
            </Button>
            <Button
              type='button'
              disabled={apagando}
              aria-busy={apagando}
              className='rounded-xs bg-[#b42318] text-white shadow-none hover:bg-[#912018] focus-visible:bg-[#912018] focus-visible:ring-0 motion-reduce:transition-none'
              onClick={() => void apagar()}>
              {apagando ? 'Apagando…' : 'Apagar rascunho'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
