import { dynamic3dSemSsrRule } from './dynamic-3d-sem-ssr.ts';
import { RuleTester } from 'oxlint/plugins-dev';

const tester = new RuleTester({
  cwd: '/repo',
  languageOptions: { parserOptions: { lang: 'tsx' } }
});

const imp = "import dynamic from 'next/dynamic';\n";
const filename = '/repo/app/(site)/sobre/_components/historia.tsx';
const erro = { messageId: 'semSsrFalse' };

tester.run('profills/dynamic-3d-sem-ssr', dynamic3dSemSsrRule, {
  valid: [
    {
      code: `${imp}const G = dynamic(() => import('react-globe.gl'), { ssr: false });`,
      filename
    },
    {
      code: `${imp}const E = dynamic(
        () => import('@/components/modelo3d/optimizedEmbalagem3d').then((m) => ({ default: m.OptimizedEmbalagem3d })),
        { ssr: false, loading: () => null }
      );`,
      filename
    },
    {
      code: `${imp}const F = dynamic(() => import('@/components/ui/dialog'));`,
      filename
    },
    {
      code: `${imp}const G = dynamic(() => import('three'), opcoes);`,
      filename
    },
    { code: "const G = dynamic(() => import('three'));", filename }
  ],
  invalid: [
    {
      code: `${imp}const G = dynamic(() => import('react-globe.gl'));`,
      filename,
      errors: [erro]
    },
    {
      code: `${imp}const M = dynamic(async () => { return import('@google/model-viewer'); }, { ssr: true });`,
      filename,
      errors: [erro]
    },
    {
      code: `${imp}const E = dynamic(() => import('@/components/modelo3d/embalagem3d').then((m) => m.Embalagem3d));`,
      filename,
      errors: [erro]
    },
    {
      code: `import load from 'next/dynamic';\nconst E = load(() => import('../../../../components/modelo3d/caixaHome3d'), { loading: () => null });`,
      filename,
      errors: [erro]
    },
    {
      code: `${imp}const G = dynamic(() => import('@/components/magicui/globe').then((m) => ({ default: m.Globe })));`,
      filename,
      errors: [erro]
    }
  ]
});
