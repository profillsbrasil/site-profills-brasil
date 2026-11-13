import { imagePrecisaDeSizesRule } from './image-precisa-de-sizes.ts';
import { RuleTester } from 'oxlint/plugins-dev';

const tester = new RuleTester({
  languageOptions: { parserOptions: { lang: 'tsx' } }
});

const imp = "import Image from 'next/image';\n";
const erro = { messageId: 'semSizes' };

tester.run('profills/image-precisa-de-sizes', imagePrecisaDeSizesRule, {
  valid: [
    `${imp}<Image src={a} alt='' fill sizes='100vw' />`,
    `${imp}<Image src={a} alt='' priority sizes='(min-width: 768px) 50vw, 100vw' />`,
    `${imp}<Image src={a} alt='' width={400} height={300} />`,
    `${imp}<Image src={a} alt='' fill={false} />`,
    `${imp}<Image {...props} fill />`,
    "import Image from './Image';\n<Image fill />",
    "<img src='a.png' alt='' />"
  ],
  invalid: [
    { code: `${imp}<Image src={a} alt='' fill />`, errors: [erro] },
    { code: `${imp}<Image src={a} alt='' priority />`, errors: [erro] },
    { code: `${imp}<Image src={a} alt='' preload />`, errors: [erro] },
    {
      code: "import Foto from 'next/image';\n<Foto src={a} alt='' fill={true} />",
      errors: [erro]
    }
  ]
});
