import { ErroConfiguracao } from '@/lib/utils/erro-configuracao';

/** Erro com motivo para mostrar ao autor do post, em pt-BR. */
export class ErroBlog extends Error {
  override name = 'ErroBlog';
}

/** A action e a rota de imagem devolvem isto em vez de redirecionar: um redirect jogaria fora o editor sujo. */
export const MOTIVO_SEM_SESSAO =
  'Sua sessão do admin terminou. Entre de novo em outra aba e salve outra vez; o texto continua aqui.';

export const motivosImagem = {
  tipo: 'Envie a imagem em PNG, JPEG, WebP ou AVIF.',
  tamanho: 'A imagem passa de 5 MB. Diminua e envie de novo.'
};

export type Tentativa<T> =
  { ok: true; valor: T } | { ok: false; motivo: string; doAutor: boolean };

/** Roda a gravação e troca a exceção por um motivo que o editor mostra. */
export async function comMotivo<T>(
  operacao: () => Promise<T>
): Promise<Tentativa<T>> {
  try {
    return { ok: true, valor: await operacao() };
  } catch (erro) {
    if (erro instanceof ErroBlog) {
      return { ok: false, motivo: erro.message, doAutor: true };
    }

    if (erro instanceof ErroConfiguracao) {
      return { ok: false, motivo: erro.message, doAutor: false };
    }

    const motivo =
      erro instanceof Error && 'code' in erro
        ? `Não foi possível gravar (${String(erro.code)}).`
        : 'Erro inesperado ao gravar. Veja o log do servidor.';

    return { ok: false, motivo, doAutor: false };
  }
}
