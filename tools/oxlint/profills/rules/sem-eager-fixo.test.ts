import { semEagerFixoRule } from './sem-eager-fixo.ts';
import { RuleTester } from 'oxlint/plugins-dev';

const tester = new RuleTester({
  languageOptions: { parserOptions: { lang: 'tsx' } }
});

const imp = "import Image from 'next/image';\n";
const erro = { messageId: 'eagerFixo' };

tester.run('profills/sem-eager-fixo', semEagerFixoRule, {
  valid: [
    `${imp}<Image src={a} alt='' loading={index < 6 ? 'eager' : 'lazy'} />`,
    `${imp}<Image src={a} alt='' loading='lazy' />`,
    `${imp}<Image src={a} alt='' preload sizes='100vw' />`,
    "<img src='a.png' alt='' loading={acimaDaDobra ? 'eager' : 'lazy'} />",
    "<model-viewer loading='eager' />",
    "import Image from './Image';\n<Image loading='eager' />"
  ],
  invalid: [
    { code: `${imp}<Image src={a} alt='' loading='eager' />`, errors: [erro] },
    {
      code: `${imp}<Image src={a} alt='' loading={'eager'} />`,
      errors: [erro]
    },
    {
      code: `${imp}<Image src={a} alt='' loading={\`eager\`} />`,
      errors: [erro]
    },
    { code: "<img src='a.png' alt='' loading='eager' />", errors: [erro] }
  ]
});
