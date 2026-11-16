import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import 'server-only';

/** Bytes guardados por chave, como `blog/<slug>/foto.webp`. */
export type Armazem = {
  gravar: (chave: string, bytes: Uint8Array) => Promise<void>;
  /** null quando a chave não existe. */
  ler: (chave: string) => Promise<Uint8Array | null>;
};

/** Armazém numa pasta do disco. A chave nunca sai da pasta. */
export function criarArmazemDisco(raiz: string): Armazem {
  const pasta = path.resolve(raiz);

  const caminho = (chave: string) => {
    const alvo = path.resolve(pasta, chave);

    if (!alvo.startsWith(`${pasta}${path.sep}`)) {
      throw new Error(`Chave fora do armazém: ${chave}`);
    }

    return alvo;
  };

  return {
    async gravar(chave, bytes) {
      const alvo = caminho(chave);
      const temporario = `${alvo}.${crypto.randomUUID()}.tmp`;

      await mkdir(path.dirname(alvo), { recursive: true });
      await writeFile(temporario, bytes);
      await rename(temporario, alvo);
    },

    async ler(chave) {
      try {
        return new Uint8Array(await readFile(caminho(chave)));
      } catch (erro) {
        if (erro instanceof Error && 'code' in erro && erro.code === 'ENOENT') {
          return null;
        }

        throw erro;
      }
    }
  };
}
