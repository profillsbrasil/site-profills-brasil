import { opacityScrollEmFuncaoRule } from './opacity-scroll-em-funcao.ts';
import { RuleTester } from 'oxlint/plugins-dev';

const tester = new RuleTester({
  languageOptions: { parserOptions: { lang: 'tsx' } }
});
const imp = "import { motion, useScroll, useTransform } from 'motion/react';\n";
const erro = { messageId: 'opacityArray' };

tester.run('profills/opacity-scroll-em-funcao', opacityScrollEmFuncaoRule, {
  valid: [
    `${imp}function A() {
      const { scrollYProgress } = useScroll();
      const o = useTransform(() => 1 - scrollYProgress.get());
      return <motion.div style={{ opacity: o }} />;
    }`,
    `${imp}function A() {
      const { scrollYProgress } = useScroll();
      const x = useTransform(scrollYProgress, [0, 1], [0, 100]);
      return <motion.div style={{ x }} />;
    }`,
    `${imp}function A({ hover }) {
      const o = useTransform(hover, [0, 1], [0, 1]);
      return <motion.div style={{ opacity: o }} />;
    }`,
    `import { useTransform } from './outro';
    function A({ scrollYProgress }) {
      const o = useTransform(scrollYProgress, [0, 1], [0, 1]);
      return <div style={{ opacity: o }} />;
    }`
  ],
  invalid: [
    {
      code: `${imp}function A() {
        const { scrollYProgress } = useScroll({ target: ref });
        const videoOpacity = useTransform(scrollYProgress, [0.04, 0.12], [0, 1]);
        return <motion.div style={{ opacity: videoOpacity }} />;
      }`,
      errors: [erro]
    },
    {
      code: `${imp}function A() {
        const scroll = useScroll();
        return <motion.div style={{ opacity: useTransform(scroll.scrollYProgress, [0, 1], [1, 0]) }} />;
      }`,
      errors: [erro]
    },
    {
      code: `import { useScroll as uS, useTransform as uT } from 'framer-motion';
      function A() {
        const { scrollY: p } = uS();
        const o = uT(p, [0, 300], [1, 0]);
        return <div style={{ 'opacity': o }} />;
      }`,
      errors: [erro]
    }
  ]
});
