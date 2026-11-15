'use client';

import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { maquinasCatalogo } from '@/lib/data/maquinas';

import { EscolherImagem } from './escolher-imagem';
import { classeBotaoContorno, classeCampo, classeIcone } from './estilos';
import type { Bloco, BlocoDoTipo, TipoBloco } from './tipos';
import { Plus, X } from 'lucide-react';

type PropsCampos<T extends TipoBloco> = {
  bloco: BlocoDoTipo<T>;
  mudar: (bloco: BlocoDoTipo<T>) => void;
};

function CamposLista({ bloco, mudar }: PropsCampos<'lista'>) {
  const campos = useRef<(HTMLInputElement | null)[]>([]);
  const focarDepois = useRef<number | null>(null);

  useEffect(() => {
    if (focarDepois.current === null) return;
    campos.current[focarDepois.current]?.focus();
    focarDepois.current = null;
  }, [bloco.itens]);

  const trocarItem = (indice: number, texto: string) =>
    mudar({
      ...bloco,
      itens: bloco.itens.map((t, i) => (i === indice ? texto : t))
    });

  const criarDepois = (indice: number) => {
    focarDepois.current = indice + 1;
    mudar({ ...bloco, itens: bloco.itens.toSpliced(indice + 1, 0, '') });
  };

  const apagar = (indice: number) => {
    if (bloco.itens.length < 2) return;
    focarDepois.current = Math.max(0, indice - 1);
    mudar({ ...bloco, itens: bloco.itens.toSpliced(indice, 1) });
  };

  return (
    <ul className='grid gap-1.5'>
      {bloco.itens.map((texto, indice) => (
        <li
          // A lista é texto livre sem id por item; a posição é a identidade do campo.
          key={indice}
          className='grid grid-cols-[1rem_minmax(0,1fr)_auto] items-center gap-1.5'>
          <span
            aria-hidden='true'
            className='size-1.5 justify-self-center bg-[#3b80f6]'
          />
          <Input
            ref={(el) => {
              campos.current[indice] = el;
            }}
            aria-label={`Item ${indice + 1}`}
            placeholder='Item da lista'
            className={classeCampo}
            value={texto}
            onChange={(e) => trocarItem(indice, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                criarDepois(indice);
              }

              if (
                e.key === 'Backspace' &&
                texto === '' &&
                bloco.itens.length > 1
              ) {
                e.preventDefault();
                apagar(indice);
              }
            }}
          />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            aria-label={`Apagar item ${indice + 1}`}
            className={classeIcone}
            disabled={bloco.itens.length < 2}
            onClick={() => apagar(indice)}>
            <X />
          </Button>
        </li>
      ))}
    </ul>
  );
}

function CamposTabela({ bloco, mudar }: PropsCampos<'tabela'>) {
  const colunas = Math.max(...bloco.linhas.map((l) => l.length));

  const trocar = (linha: number, coluna: number, texto: string) =>
    mudar({
      ...bloco,
      linhas: bloco.linhas.map((l, y) =>
        y === linha ? l.map((c, x) => (x === coluna ? texto : c)) : l
      )
    });

  const operacoes = [
    {
      nome: 'Linha',
      icone: true,
      pode: true,
      fazer: () =>
        mudar({
          ...bloco,
          linhas: [...bloco.linhas, Array.from({ length: colunas }, () => '')]
        })
    },
    {
      nome: 'Coluna',
      icone: true,
      pode: colunas < 6,
      fazer: () =>
        mudar({ ...bloco, linhas: bloco.linhas.map((l) => [...l, '']) })
    },
    {
      nome: 'Tirar linha',
      icone: false,
      pode: bloco.linhas.length > 2,
      fazer: () => mudar({ ...bloco, linhas: bloco.linhas.slice(0, -1) })
    },
    {
      nome: 'Tirar coluna',
      icone: false,
      pode: colunas > 1,
      fazer: () =>
        mudar({ ...bloco, linhas: bloco.linhas.map((l) => l.slice(0, -1)) })
    }
  ];

  return (
    <div className='grid gap-2'>
      <div
        className='grid overflow-x-auto rounded-xs border border-[#dfe2e8]'
        style={{
          gridTemplateColumns: `repeat(${colunas}, minmax(5.5rem, 1fr))`
        }}>
        {bloco.linhas.map((linha, y) =>
          Array.from({ length: colunas }, (_, x) => (
            <input
              // Célula de grade sem id própria; linha e coluna são a identidade.
              key={`${y}-${x}`}
              aria-label={`Linha ${y + 1}, coluna ${x + 1}`}
              value={linha[x] ?? ''}
              onChange={(e) => trocar(y, x, e.target.value)}
              className={`min-w-0 border-r border-b border-[#eceef2] px-2.5 py-2 text-sm outline-none transition-colors hover:bg-[#f7f8fa] focus-visible:bg-[#e8f0fe] motion-reduce:transition-none ${y === 0 ? 'bg-[#f3f4f6] font-semibold' : 'bg-white'}`}
            />
          ))
        )}
      </div>
      <div className='flex flex-wrap gap-1.5'>
        {operacoes.map((op) => (
          <Button
            key={op.nome}
            type='button'
            variant='outline'
            size='sm'
            className={classeBotaoContorno}
            disabled={!op.pode}
            onClick={op.fazer}>
            {op.icone ? <Plus aria-hidden='true' /> : null}
            {op.nome}
          </Button>
        ))}
      </div>
    </div>
  );
}

function CampoTexto({
  rotulo,
  valor,
  linhas,
  onMudar
}: {
  rotulo: string;
  valor: string;
  linhas?: number;
  onMudar: (valor: string) => void;
}) {
  if (linhas) {
    return (
      <Textarea
        aria-label={rotulo}
        placeholder={rotulo}
        rows={linhas}
        className={classeCampo}
        value={valor}
        onChange={(e) => onMudar(e.target.value)}
      />
    );
  }

  return (
    <Input
      aria-label={rotulo}
      placeholder={rotulo}
      className={classeCampo}
      value={valor}
      onChange={(e) => onMudar(e.target.value)}
    />
  );
}

export function CamposBloco({
  bloco,
  mudar
}: {
  bloco: Bloco;
  mudar: (bloco: Bloco) => void;
}) {
  switch (bloco.tipo) {
    case 'titulo':
      return (
        <CampoTexto
          rotulo='Título da seção'
          valor={bloco.texto}
          onMudar={(texto) => mudar({ ...bloco, texto })}
        />
      );
    case 'paragrafo':
      return (
        <CampoTexto
          rotulo='Escreva o texto'
          linhas={4}
          valor={bloco.texto}
          onMudar={(texto) => mudar({ ...bloco, texto })}
        />
      );
    case 'imagem':
      return (
        <div className='grid gap-2'>
          <EscolherImagem
            rotulo='imagem do bloco'
            proporcao='foto'
            src={bloco.src}
            onEscolher={(src) => mudar({ ...bloco, src })}
          />
          <CampoTexto
            rotulo='Legenda da imagem'
            valor={bloco.legenda}
            onMudar={(legenda) => mudar({ ...bloco, legenda })}
          />
        </div>
      );
    case 'lista':
      return <CamposLista bloco={bloco} mudar={mudar} />;
    case 'citacao':
      return (
        <div className='grid gap-2 border-l-2 border-[#dfe2e8] pl-3'>
          <CampoTexto
            rotulo='O que a pessoa disse'
            linhas={2}
            valor={bloco.texto}
            onMudar={(texto) => mudar({ ...bloco, texto })}
          />
          <CampoTexto
            rotulo='Quem disse'
            valor={bloco.autor}
            onMudar={(autor) => mudar({ ...bloco, autor })}
          />
        </div>
      );
    case 'tabela':
      return <CamposTabela bloco={bloco} mudar={mudar} />;
    case 'video':
      return (
        <div className='grid gap-2'>
          <CampoTexto
            rotulo='Endereço do vídeo no YouTube'
            valor={bloco.url}
            onMudar={(url) => mudar({ ...bloco, url })}
          />
          <CampoTexto
            rotulo='Legenda do vídeo'
            valor={bloco.legenda}
            onMudar={(legenda) => mudar({ ...bloco, legenda })}
          />
        </div>
      );
    case 'link':
      return (
        <div className='grid gap-2'>
          <CampoTexto
            rotulo='Título que aparece no cartão'
            valor={bloco.titulo}
            onMudar={(titulo) => mudar({ ...bloco, titulo })}
          />
          <CampoTexto
            rotulo='Endereço, como https://'
            valor={bloco.url}
            onMudar={(url) => mudar({ ...bloco, url })}
          />
        </div>
      );
    case 'aviso':
      return (
        <div className='grid gap-2 rounded-xs border border-[#c7dafc] bg-[#e8f0fe] p-3'>
          <CampoTexto
            rotulo='Título do aviso'
            valor={bloco.titulo}
            onMudar={(titulo) => mudar({ ...bloco, titulo })}
          />
          <CampoTexto
            rotulo='Texto do aviso'
            linhas={2}
            valor={bloco.texto}
            onMudar={(texto) => mudar({ ...bloco, texto })}
          />
        </div>
      );
    case 'maquina':
      return (
        <Select
          value={bloco.slug}
          onValueChange={(slug) => mudar({ ...bloco, slug })}>
          <SelectTrigger
            aria-label='Máquina'
            className={`w-full ${classeCampo}`}>
            <SelectValue placeholder='Escolha a máquina' />
          </SelectTrigger>
          <SelectContent className='rounded-xs'>
            {maquinasCatalogo.map((m) => (
              <SelectItem key={m.slug} value={m.slug} className='rounded-xs'>
                {m.seo.titulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'download':
      return (
        <div className='grid gap-2'>
          <CampoTexto
            rotulo='Nome do arquivo para o leitor'
            valor={bloco.titulo}
            onMudar={(titulo) => mudar({ ...bloco, titulo })}
          />
          <CampoTexto
            rotulo='Tipo e tamanho, como PDF, 12 MB'
            valor={bloco.arquivo}
            onMudar={(arquivo) => mudar({ ...bloco, arquivo })}
          />
        </div>
      );
  }
}
