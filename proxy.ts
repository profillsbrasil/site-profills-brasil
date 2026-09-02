import { NextRequest, NextResponse } from 'next/server';

import { buscarVendedorPorCodigo, normalizarCodigo } from '@/lib/crm/referral';
import {
  INDICACAO_COOKIE,
  assinarIndicacao,
  lerIndicacao,
  opcoesCookieIndicacao,
  precisaRenovar,
  temSegredoIndicacao
} from '@/lib/indicacao/cookie-server';
import { logger } from '@/lib/utils/logger';

/* Um aviso por processo: sem segredo toda requisição passaria por aqui. */
let avisouSemSegredo = false;

function avisarSemSegredo() {
  if (avisouSemSegredo) return;
  avisouSemSegredo = true;
  logger.warn(
    '[indicacao] INDICACAO_COOKIE_SECRET ausente; o site segue sem Indicação'
  );
}

/* Só rotas de página: API, assets do Next, arquivos com extensão, sitemap,
   robots e a imagem OG ficam de fora. */
export const config = {
  matcher: [
    '/((?!api|_next|sitemap\\.xml|robots\\.txt|opengraph-image|.*\\..*).*)'
  ]
};

async function entrarPorLink(request: NextRequest): Promise<NextResponse> {
  const limpa = request.nextUrl.clone();
  const codigo = normalizarCodigo(limpa.searchParams.get('ref'));
  limpa.searchParams.delete('ref');
  const res = NextResponse.redirect(limpa, 302);

  if (!codigo) return res;
  /* Sem segredo o cookie não pode ser assinado; a URL ainda fica limpa. */
  if (!temSegredoIndicacao()) {
    avisarSemSegredo();
    return res;
  }

  const busca = await buscarVendedorPorCodigo(codigo);
  if (busca.tipo === 'encontrado') {
    res.cookies.set(
      INDICACAO_COOKIE,
      await assinarIndicacao(busca.vendedor),
      opcoesCookieIndicacao()
    );
  }
  return res;
}

async function renovarSePreciso(request: NextRequest): Promise<NextResponse> {
  const bruto = request.cookies.get(INDICACAO_COOKIE)?.value;
  if (!bruto) return NextResponse.next();
  /* Sem segredo nada é verificável: manter o cookie, não apagá-lo. */
  if (!temSegredoIndicacao()) {
    avisarSemSegredo();
    return NextResponse.next();
  }

  const atual = await lerIndicacao(bruto);
  if (!atual) {
    const res = NextResponse.next();
    res.cookies.delete(INDICACAO_COOKIE);
    return res;
  }
  if (!precisaRenovar(atual)) return NextResponse.next();

  const busca = await buscarVendedorPorCodigo(atual.codigo);
  const res = NextResponse.next();
  if (busca.tipo === 'encontrado') {
    res.cookies.set(
      INDICACAO_COOKIE,
      await assinarIndicacao(busca.vendedor),
      opcoesCookieIndicacao()
    );
  } else if (busca.tipo === 'nao-encontrado') {
    res.cookies.delete(INDICACAO_COOKIE);
  }
  /* indisponivel: mantém o cookie como está e tenta de novo na próxima. */
  return res;
}

export default async function proxy(request: NextRequest) {
  try {
    if (request.nextUrl.searchParams.has('ref')) {
      return await entrarPorLink(request);
    }
    return await renovarSePreciso(request);
  } catch (erro) {
    logger.error('[indicacao] proxy falhou; página segue sem Indicação', erro);
    return NextResponse.next();
  }
}
