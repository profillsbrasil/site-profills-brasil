/** Erro com motivo para mostrar ao autor do post, em pt-BR. */
export class ErroBlog extends Error {
  override name = 'ErroBlog';
}

export const motivosImagem = {
  tipo: 'Envie a imagem em PNG, JPEG, WebP ou AVIF.',
  tamanho: 'A imagem passa de 5 MB. Diminua e envie de novo.'
};

export type Tentativa<T> =
  | { ok: true; valor: T }
  | { ok: false; motivo: string; doAutor: boolean };

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

    const motivo =
      erro instanceof Error && 'code' in erro
        ? `Não foi possível gravar no disco (${String(erro.code)}).`
        : 'Erro inesperado ao gravar. Veja o terminal do bun dev.';

    return { ok: false, motivo, doAutor: false };
  }
}
