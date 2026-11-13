import { defineRule } from '@oxlint/plugins';
import type { ESTree, Scope, SourceCode, Variable } from '@oxlint/plugins';

const FONTES_MOTION = new Set([
  'motion/react',
  'motion/react-client',
  'framer-motion'
]);

function resolver(
  sourceCode: SourceCode,
  id: ESTree.Node & { name: string }
): Variable | null {
  let scope: Scope | null = sourceCode.getScope(id);
  while (scope !== null) {
    const v = scope.set.get(id.name);
    if (v !== undefined) return v;
    scope = scope.upper;
  }
  return null;
}

function ehChave(p: { key: ESTree.Node }, nome: string): boolean {
  return (
    (p.key.type === 'Identifier' && p.key.name === nome) ||
    (p.key.type === 'Literal' && p.key.value === nome)
  );
}

export const opacityScrollEmFuncaoRule = defineRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        'Proíbe `opacity` vinda de `useTransform` na forma de array sobre o progresso de `useScroll`.'
    },
    messages: {
      opacityArray:
        '`useTransform(progresso, [..], [..])` em `opacity` vira ScrollTimeline nativa e renderiza invertido. Use a forma de função: `useTransform(() => ...)`. Ver docs/superpowers/specs/2026-05-19-hero-video-viewtimeline-bug-design.md.'
    }
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const hooks = {
      useScroll: new Set<string>(),
      useTransform: new Set<string>()
    };
    // Variáveis com o progresso do scroll e variáveis com o objeto de useScroll().
    const progresso = new Set<Variable>();
    const objetoScroll = new Set<Variable>();
    const transformsArray = new Set<Variable>();
    const usosEmOpacity: ESTree.Node[] = [];

    function ehChamadaDe(
      n: ESTree.Node | null | undefined,
      hook: keyof typeof hooks
    ) {
      return (
        n?.type === 'CallExpression' &&
        n.callee.type === 'Identifier' &&
        hooks[hook].has(n.callee.name)
      );
    }

    function apontaPara(
      n: ESTree.Node | undefined,
      variaveis: Set<Variable>
    ): boolean {
      if (n?.type !== 'Identifier') return false;
      const v = resolver(sourceCode, n);
      return v !== null && variaveis.has(v);
    }

    function ehProgresso(arg: ESTree.Node | undefined): boolean {
      if (arg?.type === 'MemberExpression') {
        return apontaPara(arg.object, objetoScroll);
      }
      return apontaPara(arg, progresso);
    }

    function ehTransformArray(n: ESTree.Node | null | undefined): boolean {
      if (!ehChamadaDe(n, 'useTransform') || n?.type !== 'CallExpression')
        return false;
      return (
        n.arguments[1]?.type === 'ArrayExpression' &&
        ehProgresso(n.arguments[0])
      );
    }

    return {
      ImportDeclaration(node) {
        if (!FONTES_MOTION.has(String(node.source.value))) return;
        for (const s of node.specifiers) {
          if (s.type !== 'ImportSpecifier' || s.imported.type !== 'Identifier')
            continue;
          const nome = s.imported.name;
          if (nome === 'useScroll' || nome === 'useTransform')
            hooks[nome].add(s.local.name);
        }
      },
      VariableDeclarator(node) {
        if (ehChamadaDe(node.init, 'useScroll')) {
          const alvo =
            node.id.type === 'ObjectPattern' ? progresso : objetoScroll;
          for (const v of sourceCode.getDeclaredVariables(node)) alvo.add(v);
          return;
        }
        if (node.id.type === 'Identifier' && ehTransformArray(node.init)) {
          for (const v of sourceCode.getDeclaredVariables(node))
            transformsArray.add(v);
        }
      },
      Property(node) {
        if (ehChave(node, 'opacity')) usosEmOpacity.push(node.value);
      },
      'Program:exit'() {
        for (const valor of usosEmOpacity) {
          const ruim =
            ehTransformArray(valor) || apontaPara(valor, transformsArray);
          if (ruim) context.report({ node: valor, messageId: 'opacityArray' });
        }
      }
    };
  }
});
