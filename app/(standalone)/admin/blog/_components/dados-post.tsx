'use client';

import type { Dispatch } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type Post, assuntos, ehAssunto } from '@/lib/blog/tipos';

import type { AcaoEditor } from './editor-reducer';
import { EscolherImagem } from './escolher-imagem';
import { classeCampo, classeRotulo } from './estilos';

function Contador({
  texto,
  minimo,
  maximo
}: {
  texto: string;
  minimo: number;
  maximo: number;
}) {
  const n = texto.length;
  const bom = n >= minimo && n <= maximo;

  return (
    <span
      className={`float-right font-normal ${bom ? 'text-[#1f7a4d]' : 'text-[#a05a00]'}`}>
      {n} de {minimo} a {maximo} letras
    </span>
  );
}

export function DadosPost({
  post,
  dispatch
}: {
  post: Post;
  dispatch: Dispatch<AcaoEditor>;
}) {
  return (
    <div className='grid gap-3.5 rounded-xs border border-[#dfe2e8] bg-white p-4'>
      <div className='grid gap-1.5'>
        <Label htmlFor='post-assunto' className={classeRotulo}>
          Assunto
        </Label>
        <Select
          value={post.assunto}
          onValueChange={(valor) => {
            if (ehAssunto(valor)) {
              dispatch({ tipo: 'editarDados', dados: { assunto: valor } });
            }
          }}>
          <SelectTrigger id='post-assunto' className={`w-full ${classeCampo}`}>
            <SelectValue>{assuntos[post.assunto].nome}</SelectValue>
          </SelectTrigger>
          <SelectContent className='tema-admin rounded-xs'>
            {Object.entries(assuntos).map(([valor, { nome, descricao }]) => (
              <SelectItem key={valor} value={valor} className='rounded-xs'>
                <span className='flex flex-col'>
                  <span>{nome}</span>
                  <span className='text-xs text-[#5a6172]'>{descricao}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='grid gap-1.5'>
        <Label htmlFor='post-titulo' className={`block ${classeRotulo}`}>
          Título
          <Contador texto={post.titulo} minimo={30} maximo={65} />
        </Label>
        <Input
          id='post-titulo'
          className={classeCampo}
          value={post.titulo}
          onChange={(e) =>
            dispatch({ tipo: 'editarDados', dados: { titulo: e.target.value } })
          }
        />
      </div>

      <div className='grid gap-1.5'>
        <Label htmlFor='post-resumo' className={`block ${classeRotulo}`}>
          Resumo, aparece na listagem e no Google
          <Contador texto={post.resumo} minimo={90} maximo={160} />
        </Label>
        <Textarea
          id='post-resumo'
          rows={2}
          className={classeCampo}
          value={post.resumo}
          onChange={(e) =>
            dispatch({ tipo: 'editarDados', dados: { resumo: e.target.value } })
          }
        />
      </div>

      <div className='grid gap-1.5'>
        <span className={classeRotulo}>Capa</span>
        <EscolherImagem
          rotulo='capa do post'
          src={post.capa}
          onEscolher={(capa) =>
            dispatch({ tipo: 'editarDados', dados: { capa } })
          }
        />
      </div>
    </div>
  );
}
