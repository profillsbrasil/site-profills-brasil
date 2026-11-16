export type ImagemCrua = { data: Uint8Array; width: number; height: number };

const JANELA = 8;
const PASSO = 4;
const C1 = (0.01 * 255) ** 2;
const C2 = (0.03 * 255) ** 2;

// Pixel transparente pode guardar qualquer RGB sem mudar o que a tela mostra, então o RGB entra pré-multiplicado pelo alpha.
function premultiplicar(
  { data, width }: ImagemCrua,
  largura: number,
  altura: number
) {
  const saida = new Uint8ClampedArray(largura * altura * 4);

  for (let y = 0; y < altura; y++) {
    for (let x = 0; x < largura; x++) {
      const origem = (y * width + x) * 4;
      const destino = (y * largura + x) * 4;
      const alpha = data[origem + 3];
      saida[destino] = (data[origem] * alpha) / 255;
      saida[destino + 1] = (data[origem + 1] * alpha) / 255;
      saida[destino + 2] = (data[origem + 2] * alpha) / 255;
      saida[destino + 3] = alpha;
    }
  }

  return saida;
}

/** SSIM médio por canal (R, G, B pré-multiplicados e alpha), janela 8x8 uniforme com passo 4. */
export function ssimPorCanal(
  a: ImagemCrua,
  b: ImagemCrua
): [number, number, number, number] {
  const largura = Math.min(a.width, b.width);
  const altura = Math.min(a.height, b.height);
  const pa = premultiplicar(a, largura, altura);
  const pb = premultiplicar(b, largura, altura);
  const soma = [0, 0, 0, 0];
  let janelas = 0;
  const n = JANELA * JANELA;

  for (let y0 = 0; y0 + JANELA <= altura; y0 += PASSO) {
    for (let x0 = 0; x0 + JANELA <= largura; x0 += PASSO) {
      for (let c = 0; c < 4; c++) {
        let sa = 0,
          sb = 0,
          saa = 0,
          sbb = 0,
          sab = 0;

        for (let y = y0; y < y0 + JANELA; y++) {
          let i = (y * largura + x0) * 4 + c;

          for (let x = 0; x < JANELA; x++, i += 4) {
            const va = pa[i];
            const vb = pb[i];
            sa += va;
            sb += vb;
            saa += va * va;
            sbb += vb * vb;
            sab += va * vb;
          }
        }

        const ma = sa / n;
        const mb = sb / n;
        const vara = saa / n - ma * ma;
        const varb = sbb / n - mb * mb;
        const cov = sab / n - ma * mb;
        soma[c] +=
          ((2 * ma * mb + C1) * (2 * cov + C2)) /
          ((ma * ma + mb * mb + C1) * (vara + varb + C2));
      }

      janelas++;
    }
  }

  const [vermelho, verde, azul, alpha] = soma.map((s) => s / janelas);

  return [vermelho, verde, azul, alpha];
}
