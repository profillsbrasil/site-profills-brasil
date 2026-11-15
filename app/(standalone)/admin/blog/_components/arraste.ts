'use client';

import { useEffect, useRef, useState } from 'react';

import type { TipoBloco } from '@/lib/blog/tipos';
import {
  type DragPreview,
  bindDrag,
  bindDragPreview,
  createAutoScroll,
  dragThreshold
} from '@ui-sdk/core';

import type { Destino } from './editor-reducer';

export type Carga =
  | { tipo: 'novo'; bloco: TipoBloco }
  | { tipo: 'linha'; linhaId: string; colunas: 1 | 2 };

export type EstadoArraste = { carga: Carga; destino: Destino | null };

const MARGEM_DA_LISTA = 32;
const ZONA_LATERAL_MAXIMA = 96;

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

export function useArraste(soltar: (carga: Carga, destino: Destino) => void) {
  const listaRef = useRef<HTMLDivElement>(null);
  const [arraste, setArraste] = useState<EstadoArraste | null>(null);
  const pararAtual = useRef<(() => void) | null>(null);

  useEffect(() => () => pararAtual.current?.(), []);

  const iniciar = (
    evento: React.PointerEvent<HTMLElement>,
    carga: Carga,
    copiar?: HTMLElement | null
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

    const rolagem = createAutoScroll({
      edge: 56,
      ignore: () => previa?.el,
      onScroll: atualizar
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
        previa = bindDragPreview(copiar ?? alca, {
          x: inicio.clientX,
          y: inicio.clientY
        });
        previa.el.style.opacity = '0.85';
        setArraste({ carga, destino: null });
      },
      onMove: ({ x, y }) => {
        ponteiro = { x, y };
        previa?.move(x, y);
        rolagem.update(x, y);
        atualizar();
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
