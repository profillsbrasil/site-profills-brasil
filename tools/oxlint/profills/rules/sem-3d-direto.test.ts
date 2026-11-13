import { sem3dDiretoRule } from './sem-3d-direto.ts';
import { RuleTester } from 'oxlint/plugins-dev';

const tester = new RuleTester({
  cwd: '/repo',
  languageOptions: { parserOptions: { lang: 'tsx' } }
});
const rota = '/repo/app/(site)/sobre/_components/historia.tsx';

tester.run('profills/sem-3d-direto', sem3dDiretoRule, {
  valid: [
    {
      code: "import * as THREE from 'three';",
      filename: '/repo/components/magicui/globe.tsx'
    },
    {
      code: "await import('@google/model-viewer');",
      filename: '/repo/components/modelo3d/embalagem3d.tsx'
    },
    {
      code: '<model-viewer src={src} />',
      filename: '/repo/components/modelo3d/caixaHome3d.tsx'
    },
    {
      code: "import type { GlobeMethods } from 'react-globe.gl';",
      filename: rota
    },
    {
      code: "import { type ModelViewerElement } from '@google/model-viewer';",
      filename: rota
    },
    {
      code: "import { Globe } from '@/components/magicui/globe';",
      filename: rota
    },
    { code: "import threeish from 'threeish';", filename: rota }
  ],
  invalid: [
    {
      code: "import * as THREE from 'three';",
      filename: rota,
      errors: [{ messageId: 'import3d' }]
    },
    {
      code: "import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';",
      filename: rota,
      errors: [{ messageId: 'import3d' }]
    },
    {
      code: "const G = import('react-globe.gl');",
      filename: rota,
      errors: [{ messageId: 'import3d' }]
    },
    {
      code: "export { default } from '@google/model-viewer';",
      filename: rota,
      errors: [{ messageId: 'import3d' }]
    },
    {
      code: '<model-viewer src={src} />',
      filename: rota,
      errors: [{ messageId: 'modelViewer' }]
    },
    {
      code: "import * as THREE from 'three';",
      filename: '/repo/components/magicui/globe-novo.tsx',
      errors: [{ messageId: 'import3d' }]
    }
  ]
});
