import { ErroBlog } from './erro';
import type { Intencao, Post, PostGuardado } from './tipos';

/**
 * Rotas fixas em /admin/blog/: um post com um desses slugs deixaria o editor
 * inalcançável. O check das migrações 0000 e 0005 repete esta lista.
 */
export const SLUGS_RESERVADOS = ['novo', 'imagens', 'assuntos'];

const formatoHora = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo'
});

const hora = (iso: string) =>
  formatoHora.format(new Date(iso)).replace(':', 'h');

/** A gravação só vale sobre a versão que o editor leu. */
export function conferirVersao(
  atual: PostGuardado | null,
  versaoLida: number
): asserts atual is PostGuardado {
  if (!atual) throw new ErroBlog('Esse post não existe mais.');

  if (atual.versao !== versaoLida) {
    throw new ErroBlog(
      `Este post foi salvo em outra aba às ${hora(atual.atualizadoEm)}. Recarregue a página para ver a versão nova.`
    );
  }
}

export const MOTIVO_APAGAR_PUBLICADO =
  'Post publicado não pode ser apagado. Despublique antes de apagar.';

/** Só rascunho sai, e só na versão que a tela leu. Post que já saiu passa: apagar de novo termina as imagens. */
export function conferirApagamento(
  atual: PostGuardado | null,
  versaoLida: number
) {
  if (!atual) return;

  conferirVersao(atual, versaoLida);

  if (atual.estado === 'publicado') throw new ErroBlog(MOTIVO_APAGAR_PUBLICADO);
}

/**
 * O post depois de uma gravação. Salvar mantém o estado, publicar de novo
 * preserva a data da primeira publicação, despublicar volta para rascunho.
 */
export function transicao(
  atual: PostGuardado | null,
  post: Post,
  intencao: Intencao,
  agora: string,
  slug: string
) {
  const base = {
    slug,
    versao: (atual?.versao ?? 0) + 1,
    criadoEm: atual?.criadoEm ?? agora,
    atualizadoEm: agora,
    post
  };

  const publicado =
    intencao === 'publicar' ||
    (intencao === 'salvar' && atual?.estado === 'publicado');

  return publicado
    ? ({
        ...base,
        estado: 'publicado',
        publicadoEm: atual?.publicadoEm ?? agora
      } satisfies PostGuardado)
    : ({
        ...base,
        estado: 'rascunho',
        publicadoEm: null
      } satisfies PostGuardado);
}
