'use client';

import { type MouseEvent, useEffect, useReducer, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Post, PostGuardado, TipoBloco } from '@/lib/blog/tipos';
import type { EntradaEditor } from '@/lib/schemas/post-blog';

import {
  type ResultadoGravacao,
  despublicar,
  publicar,
  salvarRascunho
} from '../acoes';
import { type Carga, useArraste } from './arraste';
import { DadosPost } from './dados-post';
import { dataPorExtenso, horaMinuto } from './datas';
import { type Destino, editorReducer } from './editor-reducer';
import { type EnvioImagem, EnvioImagemContext } from './envio-imagem';
import { classeBotaoCheio, classeBotaoContorno } from './estilos';
import { Lateral } from './lateral';
import { LinhaEditor } from './linha-editor';
import { Paleta } from './paleta';
import { type Dispositivo, PreviaPost } from './previa-post';
import { registroBlocos } from './registro-blocos';
import { Monitor, Smartphone } from 'lucide-react';

const novoId = () => crypto.randomUUID();

const postVazio: Post = {
  assunto: 'maquina',
  titulo: '',
  resumo: '',
  capa: null,
  linhas: []
};

type AcaoGravacao = 'salvar' | 'publicar' | 'despublicar';

type Fase =
  | { fase: 'parado' }
  | { fase: 'gravando'; acao: AcaoGravacao | 'imagem' }
  | { fase: 'gravado'; acao: AcaoGravacao | 'imagem'; em: string }
  | { fase: 'erro'; motivo: string };

const acoesServidor: Record<
  AcaoGravacao,
  (entrada: EntradaEditor) => Promise<ResultadoGravacao>
> = {
  salvar: salvarRascunho,
  publicar,
  despublicar
};

const textoGravando: Record<AcaoGravacao | 'imagem', string> = {
  salvar: 'Salvando',
  publicar: 'Publicando',
  despublicar: 'Despublicando',
  imagem: 'Enviando imagem'
};

function textoStatus(fase: Fase, gravacao: PostGuardado | null, sujo: boolean) {
  const pendente = sujo ? ' Há mudanças não salvas.' : '';

  switch (fase.fase) {
    case 'gravando':
      return `${textoGravando[fase.acao]}…`;
    case 'erro':
      return sujo ? 'Mudanças não salvas.' : '';
    case 'gravado': {
      const hora = horaMinuto(fase.em);

      const feito = {
        salvar:
          gravacao?.estado === 'publicado'
            ? `Alterações salvas às ${hora}.`
            : `Rascunho salvo às ${hora}.`,
        publicar: `Publicado às ${hora}.`,
        despublicar: `Voltou para rascunho às ${hora}.`,
        imagem: `Imagem enviada às ${hora}.`
      }[fase.acao];

      return `${feito}${pendente}`;
    }

    case 'parado':
      if (sujo) return 'Mudanças não salvas.';

      return gravacao
        ? `Salvo em ${dataPorExtenso(gravacao.atualizadoEm)} às ${horaMinuto(gravacao.atualizadoEm)}.`
        : 'Ainda não salvo.';
  }
}

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

type Props = {
  /** null no post novo, que ganha slug na primeira gravação. */
  inicial: PostGuardado | null;
  totalPosts: number;
};

export function EditorBlog({ inicial, totalPosts }: Props) {
  const router = useRouter();

  const [post, dispatch] = useReducer(
    editorReducer,
    inicial?.post ?? postVazio
  );

  const [postSalvo, setPostSalvo] = useState(inicial?.post ?? postVazio);
  const [gravacao, setGravacao] = useState(inicial);
  const [fase, setFase] = useState<Fase>({ fase: 'parado' });
  const [saida, setSaida] = useState<string | null>(null);
  const [dispositivo, setDispositivo] = useState<Dispositivo>('computador');

  const sujo = post !== postSalvo;
  const ocupado = fase.fase === 'gravando';
  const publicado = gravacao?.estado === 'publicado';

  useEffect(() => {
    if (!sujo) return;

    const segurar = (e: BeforeUnloadEvent) => e.preventDefault();

    window.addEventListener('beforeunload', segurar);

    return () => window.removeEventListener('beforeunload', segurar);
  }, [sujo]);

  const gravar = async (acao: AcaoGravacao) => {
    const enviado = post;

    setFase({ fase: 'gravando', acao });

    let resultado: ResultadoGravacao;

    try {
      resultado = await acoesServidor[acao]({
        slug: gravacao?.slug ?? null,
        post: enviado
      });
    } catch {
      resultado = {
        ok: false,
        erro: 'O servidor do bun dev não respondeu. Veja se ele ainda está rodando.'
      };
    }

    if (!resultado.ok) {
      setFase({ fase: 'erro', motivo: resultado.erro });

      return null;
    }

    const { guardado } = resultado;

    if (!gravacao) {
      window.history.replaceState(null, '', `/admin/blog/${guardado.slug}`);
    }

    setGravacao(guardado);
    setPostSalvo(enviado);
    setFase({ fase: 'gravado', acao, em: guardado.atualizadoEm });

    return guardado;
  };

  const envioImagem: EnvioImagem = {
    recusar: (motivo) => setFase({ fase: 'erro', motivo }),
    enviar: async (arquivo) => {
      const slug = gravacao?.slug ?? (await gravar('salvar'))?.slug;

      if (!slug) return null;

      setFase({ fase: 'gravando', acao: 'imagem' });

      const corpo = new FormData();
      corpo.set('arquivo', arquivo);

      try {
        const resposta = await fetch(`/admin/blog/${slug}/imagem`, {
          method: 'POST',
          body: corpo
        });

        const dados: { caminho?: string; erro?: string } =
          await resposta.json();

        if (!resposta.ok || !dados.caminho) {
          setFase({
            fase: 'erro',
            motivo: dados.erro ?? 'A imagem não foi gravada.'
          });

          return null;
        }

        setFase({
          fase: 'gravado',
          acao: 'imagem',
          em: new Date().toISOString()
        });

        return dados.caminho;
      } catch {
        setFase({
          fase: 'erro',
          motivo: 'O servidor do bun dev não respondeu ao envio da imagem.'
        });

        return null;
      }
    }
  };

  const aoNavegar = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!sujo) return;
    e.preventDefault();
    setSaida(href);
  };

  const salvarESair = async () => {
    const destinoSaida = saida;

    setSaida(null);

    if (destinoSaida && (await gravar('salvar'))) router.push(destinoSaida);
  };

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
    <EnvioImagemContext value={envioImagem}>
      <div className='grid h-dvh grid-cols-[auto_minmax(0,1fr)] bg-[#0f172b] text-sm'>
        <Lateral
          atual={inicial ? 'editor' : 'novo'}
          totalPosts={totalPosts + (!inicial && gravacao ? 1 : 0)}
          aoNavegar={aoNavegar}
        />

        <div className='my-2 mr-2 flex min-h-0 flex-col overflow-hidden rounded-xs bg-[#f3f4f6] text-[#1b1c1f]'>
          <header className='flex flex-wrap items-center gap-3 border-b border-[#dfe2e8] bg-white px-5 py-3'>
            <h1 className='text-lg font-bold'>
              {gravacao ? 'Editar post' : 'Novo post'}
            </h1>
            <span
              className={`rounded-xs px-2 py-0.5 text-xs font-semibold ${publicado ? 'bg-[#e3f3ea] text-[#1f7a4d]' : 'bg-[#eceef2] text-[#5a6172]'}`}>
              {publicado ? 'Publicado' : 'Rascunho'}
            </span>
            <p aria-live='polite' className='text-xs text-[#5a6172]'>
              {textoStatus(fase, gravacao, sujo)}
            </p>
            <div className='ml-auto flex gap-2'>
              {publicado ? (
                <>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className={classeBotaoContorno}
                    disabled={ocupado}
                    onClick={() => void gravar('despublicar')}>
                    Despublicar
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    className={classeBotaoCheio}
                    disabled={ocupado}
                    onClick={() => void gravar('salvar')}>
                    Salvar alterações
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className={classeBotaoContorno}
                    disabled={ocupado}
                    onClick={() => void gravar('salvar')}>
                    Salvar rascunho
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    className={classeBotaoCheio}
                    disabled={ocupado}
                    onClick={() => void gravar('publicar')}>
                    Publicar
                  </Button>
                </>
              )}
            </div>
          </header>

          {fase.fase === 'erro' ? (
            <p
              role='alert'
              className='border-b border-[#f3c4c4] bg-[#fdecec] px-5 py-2 text-xs font-medium text-[#9b1c1c]'>
              Não gravou: {fase.motivo} O texto continua aqui no editor.
            </p>
          ) : null}

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

      <Dialog
        open={saida !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setSaida(null);
        }}>
        <DialogContent showCloseButton={false} className='rounded-xs'>
          <DialogHeader>
            <DialogTitle>Sair sem salvar?</DialogTitle>
            <DialogDescription>
              As mudanças feitas desde a última gravação ficam só nesta tela e
              se perdem quando você sair.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              className={classeBotaoContorno}
              onClick={() => setSaida(null)}>
              Continuar editando
            </Button>
            <Button
              type='button'
              variant='outline'
              className={classeBotaoContorno}
              onClick={() => {
                if (saida) router.push(saida);
                setSaida(null);
              }}>
              Sair sem salvar
            </Button>
            <Button
              type='button'
              className={classeBotaoCheio}
              onClick={() => void salvarESair()}>
              Salvar e sair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EnvioImagemContext>
  );
}
