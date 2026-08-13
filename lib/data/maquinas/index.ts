import { automacaoIndustrialRoboticaIntegrada } from './automacao-industrial-robotica-integrada';
import { embaladoraHorizontalFlowpack } from './embaladora-horizontal-flowpack';
import { empacotadeiraVerticalPtcSpeed } from './empacotadeira-vertical-ptc-speed';
import { enfardadeiraProdutosAcabadosTc4u } from './enfardadeira-produtos-acabados-tc4u';
import { envasadoraBagsLiquidosTc3sc } from './envasadora-bags-liquidos-tc3sc';
import { envasadoraCaixasAssepticasLeiteSucos } from './envasadora-caixas-assepticas-leite-sucos';
import { envasadoraFrascosTubulares } from './envasadora-frascos-tubulares';
import { envasadoraGableTopGt } from './envasadora-gable-top-gt';
import { envasadoraHorizontalGaloes25Litros } from './envasadora-horizontal-galoes-25-litros';
import { envasadoraHorizontalLinearFrascos } from './envasadora-horizontal-linear-frascos';
import { envasadoraHorizontalRotativaFrascos } from './envasadora-horizontal-rotativa-frascos';
import { envasadoraHorizontalTriblocFrascos } from './envasadora-horizontal-tribloc-frascos';
import { envasadoraLinearFrascosFechamentoAutomatico } from './envasadora-linear-frascos-fechamento-automatico';
import { envasadoraMiniStandUpPouch } from './envasadora-mini-stand-up-pouch';
import { envasadoraPouchCompactaPreFormado } from './envasadora-pouch-compacta-pre-formado';
import { envasadoraRotativaPotesCopos } from './envasadora-rotativa-potes-copos';
import { envasadoraSaches3SoldasLiquidosTc3sc } from './envasadora-saches-3-soldas-liquidos-tc3sc';
import { envasadoraSaches3SoldasPosSolidosTc3sc } from './envasadora-saches-3-soldas-pos-solidos-tc3sc';
import { envasadoraSaches3SoldasTc3sl } from './envasadora-saches-3-soldas-tc3sl';
import { envasadoraSaches4SoldasTc4s1Via } from './envasadora-saches-4-soldas-tc4s-1-via';
import { envasadoraSaches4SoldasTc4s2Vias } from './envasadora-saches-4-soldas-tc4s-2-vias';
import { envasadoraSaches4SoldasTc4s3Vias } from './envasadora-saches-4-soldas-tc4s-3-vias';
import { envasadoraSachesFormatadosTc4s3Vias } from './envasadora-saches-formatados-tc4s-3-vias';
import { envasadoraSachesLiquidosLinhaTp } from './envasadora-saches-liquidos-linha-tp';
import { envasadoraSachesLiquidosTp4Vias } from './envasadora-saches-liquidos-tp-4-vias';
import { envasadoraSachesPosSolidosTcv } from './envasadora-saches-pos-solidos-tcv';
import { envasadoraSeladoraBisnagas } from './envasadora-seladora-bisnagas';
import { envasadoraSemiautomaticaBaldes } from './envasadora-semiautomatica-baldes';
import { envasadoraStandUpPouchCartonado } from './envasadora-stand-up-pouch-cartonado';
import { envasadoraStandUpPouchPreFormadoComTampa } from './envasadora-stand-up-pouch-pre-formado-com-tampa';
import { envasadoraStandUpPouchSpeed } from './envasadora-stand-up-pouch-speed';
import { envasadoraStickTc3sc1A4Vias } from './envasadora-stick-tc3sc-1-a-4-vias';
import { envolvedoraOverlapEmbalagensPet } from './envolvedora-overlap-embalagens-pet';
import { linhaProducaoCompletaEnvase } from './linha-producao-completa-envase';
import { maquinaLavagemGaloes } from './maquina-lavagem-galoes';
import type { MaquinaCatalogo } from './types';

export * from './types';
export { maquinaRedirects } from './redirects';

export const maquinasCatalogo: MaquinaCatalogo[] = [
  envasadoraStandUpPouchSpeed,
  envasadoraStandUpPouchPreFormadoComTampa,
  envasadoraPouchCompactaPreFormado,
  envasadoraMiniStandUpPouch,
  envasadoraSeladoraBisnagas,
  envasadoraGableTopGt,
  envasadoraCaixasAssepticasLeiteSucos,
  envasadoraRotativaPotesCopos,
  envasadoraStandUpPouchCartonado,
  envasadoraSachesLiquidosLinhaTp,
  envasadoraSachesLiquidosTp4Vias,
  envasadoraSaches4SoldasTc4s1Via,
  envasadoraSaches4SoldasTc4s2Vias,
  envasadoraSaches4SoldasTc4s3Vias,
  envasadoraSachesFormatadosTc4s3Vias,
  envasadoraSaches3SoldasPosSolidosTc3sc,
  envasadoraSaches3SoldasLiquidosTc3sc,
  envasadoraStickTc3sc1A4Vias,
  envasadoraSaches3SoldasTc3sl,
  envasadoraSachesPosSolidosTcv,
  enfardadeiraProdutosAcabadosTc4u,
  empacotadeiraVerticalPtcSpeed,
  envasadoraBagsLiquidosTc3sc,
  embaladoraHorizontalFlowpack,
  envasadoraHorizontalLinearFrascos,
  envasadoraHorizontalTriblocFrascos,
  envasadoraHorizontalRotativaFrascos,
  envasadoraFrascosTubulares,
  envasadoraHorizontalGaloes25Litros,
  envasadoraLinearFrascosFechamentoAutomatico,
  envasadoraSemiautomaticaBaldes,
  maquinaLavagemGaloes,
  envolvedoraOverlapEmbalagensPet,
  linhaProducaoCompletaEnvase,
  automacaoIndustrialRoboticaIntegrada
];

export function getMaquinaBySlug(slug: string): MaquinaCatalogo | undefined {
  return maquinasCatalogo.find((m) => m.slug === slug);
}
