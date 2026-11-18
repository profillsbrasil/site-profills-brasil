'use client';

import { useEffect, useRef, useState } from 'react';

import type { Lado, TipoBloco } from '@/lib/blog/tipos';
import {
  type DragPreview,
  bindDrag,
  bindDragPreview,
  createAutoScroll,
  dragThreshold
} from '@ui-sdk/core';

import type { Destino } from './editor-reducer';
import { registroBlocos } from './registro-blocos';

export type Carga =
  | { tipo: 'novo'; bloco: TipoBloco }
  | { tipo: 'linha'; linhaId: string; colunas: 1 | 2 };

export type EstadoArraste = { carga: Carga; destino: Destino | null };

const MARGEM_DA_LISTA = 32;
const ZONA_LATERAL_MAXIMA = 96;
const FOLGA_DO_PONTEIRO = 14;
const FOLGA_DA_LINHA_ALVO = 16;

const CLASSE_FICHA =
  'fixed top-0 left-0 flex items-center gap-2 rounded-xs border border-[#3b80f6] bg-white px-2 py-1 text-[13px] font-medium whitespace-nowrap text-[#1b1c1f] shadow-[0_6px_18px_rgba(15,23,43,0.18)] [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-[#5a6172]';

type Ponto = { x: number; y: number };

type Tamanho = { largura: number; altura: number };

export type AlvoLateral = { lado: Lado; esquerda: number; direita: number };

const mesmoDestino = (a: Destino | null, b: Destino | null) =>
  JSON.stringify(a) === JSON.stringify(b);

/**
 * Lê as linhas renderizadas (`data-linha-id`, `data-colunas`) e diz onde a carga cai:
 * na borda esquerda ou direita de uma linha de uma coluna, ou no vão entre linhas.
 */
export function acharDestino(
  lista: HTMLElement,
  x: number,
  y: number,
  carga: Carga
): Destino | null {
  const caixa = lista.getBoundingClientRect();

  const fora =
    x < caixa.left - MARGEM_DA_LISTA ||
    x > caixa.right + MARGEM_DA_LISTA ||
    y < caixa.top - MARGEM_DA_LISTA ||
    y > caixa.bottom + MARGEM_DA_LISTA;

  if (fora) return null;

  const linhas = [...lista.querySelectorAll<HTMLElement>('[data-linha-id]')];
  const idArrastado = carga.tipo === 'linha' ? carga.linhaId : null;
  const aceitaLado = carga.tipo === 'novo' || carga.colunas === 1;

  for (const linha of linhas) {
    const id = linha.dataset.linhaId;
    const r = linha.getBoundingClientRect();
    const naAltura = y >= r.top && y <= r.bottom;
    const umaColuna = linha.dataset.colunas === '1';

    if (!id || !naAltura || !aceitaLado || !umaColuna || id === idArrastado) {
      continue;
    }

    const zona = Math.min(ZONA_LATERAL_MAXIMA, r.width * 0.25);

    if (x <= r.left + zona)
      return { tipo: 'lado', linhaId: id, lado: 'esquerda' };

    if (x >= r.right - zona)
      return { tipo: 'lado', linhaId: id, lado: 'direita' };
  }

  const posicao = linhas.filter((linha) => {
    const r = linha.getBoundingClientRect();

    return r.top + r.height / 2 < y;
  }).length;

  const origem = linhas.findIndex((l) => l.dataset.linhaId === idArrastado);

  if (origem >= 0 && (posicao === origem || posicao === origem + 1))
    return null;

  return { tipo: 'linha', posicao };
}

const aoLadoDoPonteiro = (ponteiro: number, tamanho: number, tela: number) =>
  ponteiro + FOLGA_DO_PONTEIRO + tamanho <= tela
    ? ponteiro + FOLGA_DO_PONTEIRO
    : ponteiro - FOLGA_DO_PONTEIRO - tamanho;

const dentroDaTela = (inicio: number, tamanho: number, tela: number) =>
  Math.min(Math.max(inicio, 0), tela - tamanho);

function xDaFicha(
  ponteiro: Ponto,
  largura: number,
  alvo: AlvoLateral | null,
  tela: number
) {
  if (!alvo) return aoLadoDoPonteiro(ponteiro.x, largura, tela);

  if (alvo.lado === 'esquerda')
    return Math.min(ponteiro.x, alvo.esquerda) - FOLGA_DA_LINHA_ALVO - largura;

  return Math.max(ponteiro.x, alvo.direita) + FOLGA_DA_LINHA_ALVO;
}

/**
 * Onde fica o canto da ficha que segue o ponteiro, sempre inteira na tela. Sobre
 * um alvo lateral ela sai para fora da borda da linha alvo, para não cobrir a
 * zona nem o rótulo "Lado a lado".
 */
export function posicaoDaFicha(
  ponteiro: Ponto,
  ficha: Tamanho,
  alvo: AlvoLateral | null,
  tela: Tamanho
): Ponto {
  return {
    x: dentroDaTela(
      xDaFicha(ponteiro, ficha.largura, alvo, tela.largura),
      ficha.largura,
      tela.largura
    ),
    y: dentroDaTela(
      aoLadoDoPonteiro(ponteiro.y, ficha.altura, tela.altura),
      ficha.altura,
      tela.altura
    )
  };
}

function montarFicha(icone: Element | null, nome: string) {
  const ficha = document.createElement('div');
  const texto = document.createElement('span');

  ficha.className = CLASSE_FICHA;
  texto.textContent = nome;

  if (icone) ficha.append(icone.cloneNode(true));

  ficha.append(texto);

  return ficha;
}

export function useArraste(soltar: (carga: Carga, destino: Destino) => void) {
  const listaRef = useRef<HTMLDivElement>(null);
  const [arraste, setArraste] = useState<EstadoArraste | null>(null);
  const pararAtual = useRef<(() => void) | null>(null);

  useEffect(() => () => pararAtual.current?.(), []);

  const iniciar = (
    evento: React.PointerEvent<HTMLElement>,
    carga: Carga,
    nome = carga.tipo === 'novo' ? registroBlocos[carga.bloco].nome : ''
  ) => {
    if (evento.button !== 0) return;

    const alca = evento.currentTarget;
    const inicio = evento.nativeEvent;
    let previa: DragPreview | null = null;
    let destino: Destino | null = null;
    let ponteiro = { x: inicio.clientX, y: inicio.clientY };

    const atualizar = () => {
      const novo = listaRef.current
        ? acharDestino(listaRef.current, ponteiro.x, ponteiro.y, carga)
        : null;

      if (mesmoDestino(novo, destino)) return;
      destino = novo;
      setArraste({ carga, destino: novo });
    };

    const posicionar = () => {
      if (!previa) return;

      const linha =
        destino?.tipo === 'lado'
          ? listaRef.current?.querySelector<HTMLElement>(
              `[data-linha-id="${CSS.escape(destino.linhaId)}"]`
            )
          : null;

      const borda = linha?.getBoundingClientRect();

      const alvo =
        destino?.tipo === 'lado' && borda
          ? { lado: destino.lado, esquerda: borda.left, direita: borda.right }
          : null;

      const { x, y } = posicaoDaFicha(
        ponteiro,
        { largura: previa.el.offsetWidth, altura: previa.el.offsetHeight },
        alvo,
        {
          largura: document.documentElement.clientWidth,
          altura: document.documentElement.clientHeight
        }
      );

      previa.move(x, y);
    };

    const acompanhar = () => {
      atualizar();
      posicionar();
    };

    const rolagem = createAutoScroll({
      edge: 56,
      ignore: () => previa?.el,
      onScroll: acompanhar
    });

    const encerrar = () => {
      rolagem.stop();
      previa?.remove();
      previa = null;
      setArraste(null);
    };

    pararAtual.current?.();

    const pararPonteiro = bindDrag(alca, inicio, {
      threshold: dragThreshold,
      cancelOnEscape: true,
      onStart: () => {
        const ficha = montarFicha(alca.querySelector('svg'), nome);

        document.body.append(ficha);
        previa = bindDragPreview(ficha, { x: 0, y: 0 });
        ficha.remove();
        posicionar();
        setArraste({ carga, destino: null });
      },
      onMove: ({ x, y }) => {
        ponteiro = { x, y };
        rolagem.update(x, y);
        acompanhar();
      },
      onEnd: (_evento, cancelado) => {
        const final = destino;
        const moveu = previa !== null;

        encerrar();

        if (!cancelado && moveu && final) soltar(carga, final);
      }
    });

    pararAtual.current = () => {
      pararPonteiro();
      encerrar();
    };
  };

  return { listaRef, arraste, iniciar };
}
