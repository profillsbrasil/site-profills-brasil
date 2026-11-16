import { eslintCompatPlugin } from '@oxlint/plugins';

import { dynamic3dSemSsrRule } from './rules/dynamic-3d-sem-ssr.ts';
import { imagePrecisaDeSizesRule } from './rules/image-precisa-de-sizes.ts';
import { opacityScrollEmFuncaoRule } from './rules/opacity-scroll-em-funcao.ts';
import { sem3dDiretoRule } from './rules/sem-3d-direto.ts';
import { semBancoDiretoRule } from './rules/sem-banco-direto.ts';
import { semEagerFixoRule } from './rules/sem-eager-fixo.ts';
import { videoCompletoRule } from './rules/video-completo.ts';

// Regras de carregamento do site e a porta única do banco; cada uma barra um padrão medido.
const profillsPlugin = eslintCompatPlugin({
  meta: { name: 'profills' },
  rules: {
    'image-precisa-de-sizes': imagePrecisaDeSizesRule,
    'sem-eager-fixo': semEagerFixoRule,
    'video-completo': videoCompletoRule,
    'opacity-scroll-em-funcao': opacityScrollEmFuncaoRule,
    'dynamic-3d-sem-ssr': dynamic3dSemSsrRule,
    'sem-3d-direto': sem3dDiretoRule,
    'sem-banco-direto': semBancoDiretoRule
  }
});

export default profillsPlugin;
