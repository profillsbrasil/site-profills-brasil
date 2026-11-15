'use client';

import { useReducer, useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { type Carga, useArraste } from './arraste';
import { DadosPost } from './dados-post';
import { type Destino, editorReducer } from './editor-reducer';
import { Lateral } from './lateral';
import { LinhaEditor } from './linha-editor';
import { Paleta } from './paleta';
import { postExemplo } from './post-exemplo';
import { type Dispositivo, PreviaPost } from './previa-post';
import { registroBlocos } from './registro-blocos';
import type { TipoBloco } from './tipos';
import { Monitor, Smartphone } from 'lucide-react';

const novoId = () => crypto.randomUUID();

const classeAba =
  'h-full flex-none gap-1.5 rounded-xs border-0 px-3 text-xs text-[#5a6172] shadow-none hover:bg-[#eceef2] hover:text-[#1b1c1f] focus-visible:bg-[#eceef2] focus-visible:text-[#1b1c1f] focus-visible:ring-0 focus-visible:outline-none data-[state=active]:bg-[#0f172b] data-[state=active]:text-white data-[state=active]:shadow-none';

function Vao({ ativo }: { ativo: boolean }) {
  return (
    <div aria-hidden='true' className='relative h-4'>
      {ativo ? (
        <div
          data-alvo-vao
          className='absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center gap-2 text-[0.68rem] font-semibold text-[#3b80f6]'>
          <span className='h-0.5 flex-1 bg-[#3b80f6]' />
          Nova linha aqui
          <span className='h-0.5 flex-1 bg-[#3b80f6]' />
        </div>
      ) : null}
    </div>
  );
}

export function EditorBlog() {
  const [post, dispatch] = useReducer(editorReducer, postExemplo);
  const [dispositivo, setDispositivo] = useState<Dispositivo>('computador');

  const inserir = (tipo: TipoBloco, destino: Destino) =>
    dispatch({
      tipo: 'inserirBloco',
      bloco: registroBlocos[tipo].criar(novoId()),
      destino,
      novaLinhaId: novoId()
    });

  const soltar = (carga: Carga, destino: Destino) => {
    if (carga.tipo === 'novo') {
      inserir(carga.bloco, destino);

      return;
    }

    if (destino.tipo === 'linha') {
      dispatch({
        tipo: 'moverLinha',
        linhaId: carga.linhaId,
        posicao: destino.posicao
      });

      return;
    }

    dispatch({
      tipo: 'porLadoALado',
      linhaId: carga.linhaId,
      alvoId: destino.linhaId,
      lado: destino.lado
    });
  };

  const { listaRef, arraste, iniciar } = useArraste(soltar);
  const destino = arraste?.destino ?? null;
  const vaoAtivo = destino?.tipo === 'linha' ? destino.posicao : null;

  return (
    <div className='grid h-dvh grid-cols-[auto_minmax(0,1fr)] bg-[#0f172b] text-sm'>
      <Lateral />

      <div className='my-2 mr-2 flex min-h-0 flex-col overflow-hidden rounded-xs bg-[#f3f4f6] text-[#1b1c1f]'>
        <header className='flex flex-wrap items-center gap-3 border-b border-[#dfe2e8] bg-white px-5 py-3'>
          <h1 className='text-lg font-bold'>Editar post</h1>
          <span className='text-xs text-[#5a6172]'>
            Protótipo: nada aqui é salvo
          </span>
        </header>

        <div className='grid min-h-0 flex-1 grid-cols-[14.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-5 px-5'>
          <aside
            aria-labelledby='titulo-paleta'
            className='min-h-0 overflow-y-auto py-5'>
            <h2 id='titulo-paleta' className='text-[0.95rem] font-bold'>
              Blocos
            </h2>
            <p className='mt-1 mb-3 text-xs text-[#5a6172]'>
              Arraste para o texto ou clique para pôr no fim.
            </p>
            <Paleta
              onInserir={(tipo) =>
                inserir(tipo, { tipo: 'linha', posicao: post.linhas.length })
              }
              onArrastar={(e, carga) => iniciar(e, carga)}
            />
          </aside>

          <section
            aria-labelledby='titulo-conteudo'
            data-coluna='editor'
            className='min-h-0 overflow-y-auto py-5'>
            <h2 className='mb-2.5 text-[0.95rem] font-bold'>Dados do post</h2>
            <DadosPost post={post} dispatch={dispatch} />

            <h2
              id='titulo-conteudo'
              className='mt-6 mb-1 text-[0.95rem] font-bold'>
              Conteúdo
            </h2>
            <div ref={listaRef} data-lista-linhas>
              {post.linhas.map((linha, indice) => (
                <div key={linha.id}>
                  <Vao ativo={vaoAtivo === indice} />
                  <LinhaEditor
                    linha={linha}
                    indice={indice}
                    total={post.linhas.length}
                    ladoAlvo={
                      destino?.tipo === 'lado' && destino.linhaId === linha.id
                        ? destino.lado
                        : null
                    }
                    arrastando={
                      arraste?.carga.tipo === 'linha' &&
                      arraste.carga.linhaId === linha.id
                    }
                    dispatch={dispatch}
                    novoId={novoId}
                    onArrastar={iniciar}
                  />
                </div>
              ))}
              <Vao ativo={vaoAtivo === post.linhas.length} />
              {post.linhas.length === 0 ? (
                <p className='rounded-xs border border-dashed border-[#8a90a0] p-6 text-center text-xs text-[#5a6172]'>
                  Arraste um bloco para cá.
                </p>
              ) : null}
            </div>
          </section>

          <section
            aria-labelledby='titulo-previa'
            className='min-h-0 overflow-y-auto py-5'>
            <Tabs
              value={dispositivo}
              onValueChange={(valor) =>
                setDispositivo(valor === 'celular' ? 'celular' : 'computador')
              }
              className='gap-3'>
              <div className='flex items-center justify-between gap-2'>
                <h2 id='titulo-previa' className='text-[0.95rem] font-bold'>
                  Como fica no site
                </h2>
                <TabsList className='h-8 rounded-xs border border-[#dfe2e8] bg-white p-0.5'>
                  <TabsTrigger value='computador' className={classeAba}>
                    <Monitor aria-hidden='true' />
                    Computador
                  </TabsTrigger>
                  <TabsTrigger value='celular' className={classeAba}>
                    <Smartphone aria-hidden='true' />
                    Celular
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value='computador'>
                <PreviaPost post={post} dispositivo='computador' />
              </TabsContent>
              <TabsContent value='celular'>
                <div className='mx-auto w-[375px] max-w-full rounded-xs border-8 border-[#05080f] bg-[#05080f]'>
                  <PreviaPost post={post} dispositivo='celular' />
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
    </div>
  );
}
