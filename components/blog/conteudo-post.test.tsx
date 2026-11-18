import type { Bloco, Linha } from '@/lib/blog/tipos';
import { fireEvent, render, screen, within } from '@testing-library/react';

import { ConteudoPost, type ModoConteudo } from './conteudo-post';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({ default: 'img' }));

const linha = (...colunas: [Bloco] | [Bloco, Bloco]) =>
  ({
    id: colunas.map((c) => c.id).join('+'),
    colunas,
    proporcao: 62
  }) satisfies Linha;

const renderizar = (linhas: Linha[], modo: ModoConteudo = 'publico') =>
  render(
    <div data-testid='corpo'>
      <ConteudoPost linhas={linhas} modo={modo} />
    </div>
  );

const todos: Bloco[] = [
  { id: 't', tipo: 'titulo', texto: 'O que mudou' },
  { id: 'p', tipo: 'paragrafo', texto: 'A GT troca de formato pelo painel.' },
  {
    id: 'i',
    tipo: 'imagem',
    src: '/blog/gt/foto-0123456789.webp',
    legenda: 'Operador na saída da linha'
  },
  { id: 'l', tipo: 'lista', itens: ['Laticínios', '', 'Sucos'] },
  {
    id: 'c',
    tipo: 'citacao',
    texto: 'Agora troca três vezes.',
    autor: 'Gerente'
  },
  {
    id: 'tb',
    tipo: 'tabela',
    linhas: [
      ['Na troca', 'Antes', 'Agora'],
      ['Linha parada', '60 min', '15 min']
    ]
  },
  {
    id: 'v',
    tipo: 'video',
    url: 'https://youtu.be/dQw4w9WgXcQ',
    legenda: 'A troca em 40 segundos'
  },
  {
    id: 'lk',
    tipo: 'link',
    titulo: 'Página da feira',
    url: 'https://example.com/feira'
  },
  { id: 'a', tipo: 'aviso', titulo: 'Já tem uma GT?', texto: 'O kit serve.' },
  { id: 'm', tipo: 'maquina', slug: 'envasadora-gable-top-gt' },
  { id: 'd', tipo: 'download', titulo: 'Catálogo 2026', arquivo: 'PDF, 12 MB' }
];

describe('ConteudoPost na página pública', () => {
  it('renderiza cada tipo de bloco com a marcação que o leitor usa', () => {
    renderizar(todos.map((b) => linha(b)));

    expect(
      screen.getByRole('heading', { level: 2, name: 'O que mudou' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('A GT troca de formato pelo painel.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Operador na saída da linha').closest('figure')
    ).toContainElement(
      document.querySelector('img[src="/blog/gt/foto-0123456789.webp"]')
    );
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(
      ['Laticínios', 'Sucos']
    );
    expect(screen.getByText('Gerente').tagName).toBe('CITE');
    expect(
      screen.getAllByRole('columnheader').map((th) => th.textContent)
    ).toEqual(['Na troca', 'Antes', 'Agora']);
    expect(screen.getByRole('cell', { name: '15 min' })).toBeInTheDocument();
    const externo = screen.getByRole('link', { name: /Página da feira/ });

    expect(externo).toHaveAttribute('target', '_blank');
    expect(externo).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('Já tem uma GT?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver a máquina/ })).toHaveAttribute(
      'href',
      '/maquinas/envasadora-gable-top-gt'
    );
    expect(screen.getByRole('link', { name: /Catálogo 2026/ })).toHaveAttribute(
      'href',
      '/download'
    );
  });

  it('o vídeo só carrega o player do YouTube depois do clique', () => {
    renderizar([linha(todos[6])]);

    expect(document.querySelector('iframe')).toBeNull();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Tocar o vídeo: A troca em 40 segundos'
      })
    );
    expect(
      screen.getByTitle('A troca em 40 segundos').getAttribute('src')
    ).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1');
  });

  it('o foco do teclado passa do botão para o player', () => {
    renderizar([linha(todos[6])]);

    const botao = screen.getByRole('button', {
      name: 'Tocar o vídeo: A troca em 40 segundos'
    });

    botao.focus();
    fireEvent.click(botao);

    expect(screen.getByTitle('A troca em 40 segundos')).toHaveFocus();
  });

  it('imagem com legenda diz o texto uma vez, pelo figcaption', () => {
    renderizar([linha(todos[2])]);

    const legenda = screen.getByText('Operador na saída da linha');

    expect(legenda.tagName).toBe('FIGCAPTION');
    expect(
      screen.queryByRole('img', { name: 'Operador na saída da linha' })
    ).toBeNull();
    expect(legenda.closest('figure')?.querySelector('img')).toHaveAttribute(
      'alt',
      ''
    );
  });

  it('imagem sem legenda fica decorativa e sem figcaption', () => {
    const { container } = renderizar([
      linha({
        id: 'i',
        tipo: 'imagem',
        src: '/blog/gt/foto-0123456789.webp',
        legenda: ''
      })
    ]);

    expect(container.querySelector('img')).toHaveAttribute('alt', '');
    expect(container.querySelector('figcaption')).toBeNull();
  });

  it('bloco sem conteúdo some da página', () => {
    renderizar([
      linha({ id: 'p', tipo: 'paragrafo', texto: '  ' }),
      linha({ id: 'i', tipo: 'imagem', src: null, legenda: 'Sem foto' }),
      linha({
        id: 'v',
        tipo: 'video',
        url: 'https://vimeo.com/1',
        legenda: 'x'
      }),
      linha({
        id: 'lk',
        tipo: 'link',
        titulo: 'Sem endereço',
        url: 'javascript:alert(1)'
      }),
      linha({ id: 'm', tipo: 'maquina', slug: 'nao-existe' })
    ]);

    expect(screen.getByTestId('corpo')).toBeEmptyDOMElement();
  });

  it('linha de duas colunas leva a proporção gravada', () => {
    renderizar([
      linha(
        { id: 'p', tipo: 'paragrafo', texto: 'Texto' },
        { id: 'a', tipo: 'aviso', titulo: 'Onde', texto: 'Rua B' }
      )
    ]);

    const grade = screen.getByText('Texto').closest('[style]');

    expect(grade?.getAttribute('style')).toContain(
      '--colunas: minmax(0, 62fr) minmax(0, 38fr)'
    );
  });
});

describe('ConteudoPost na prévia do admin', () => {
  it('mostra o que falta e não cria link para fora do editor', () => {
    renderizar(
      [
        linha({ id: 'p', tipo: 'paragrafo', texto: '' }),
        linha({ id: 'm', tipo: 'maquina', slug: 'envasadora-gable-top-gt' }),
        linha({ id: 'lk', tipo: 'link', titulo: '', url: '' })
      ],
      'previa'
    );

    const corpo = screen.getByTestId('corpo');

    expect(within(corpo).getByText('Parágrafo vazio')).toBeInTheDocument();
    expect(within(corpo).getByText('Título do link')).toBeInTheDocument();
    expect(within(corpo).queryByRole('link')).toBeNull();
  });
});
