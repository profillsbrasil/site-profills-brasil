import type { ESTree } from '@oxlint/plugins';

type Atributo = ESTree.JSXAttribute | ESTree.JSXSpreadAttribute;

export function nomeDoElemento(node: ESTree.JSXOpeningElement): string | null {
  return node.name.type === 'JSXIdentifier' ? node.name.name : null;
}

export function temSpread(node: ESTree.JSXOpeningElement): boolean {
  return node.attributes.some((a: Atributo) => a.type === 'JSXSpreadAttribute');
}

export function atributo(
  node: ESTree.JSXOpeningElement,
  nome: string
): ESTree.JSXAttribute | null {
  for (const a of node.attributes as Atributo[]) {
    if (
      a.type === 'JSXAttribute' &&
      a.name.type === 'JSXIdentifier' &&
      a.name.name === nome
    ) {
      return a;
    }
  }
  return null;
}

// `fill` e `fill={true}` ligam a prop; `fill={false}` não.
export function atributoLigado(
  node: ESTree.JSXOpeningElement,
  nome: string
): boolean {
  const a = atributo(node, nome);
  if (a === null) return false;
  const v = a.value;
  return !(
    v?.type === 'JSXExpressionContainer' &&
    v.expression.type === 'Literal' &&
    v.expression.value === false
  );
}

// Valor string literal do atributo: `x='a'`, `x={'a'}` ou `x={`a`}`.
export function valorLiteral(a: ESTree.JSXAttribute): string | null {
  const v = a.value;
  if (v === null) return null;
  if (v.type === 'Literal') return typeof v.value === 'string' ? v.value : null;
  if (v.type !== 'JSXExpressionContainer') return null;
  const e = v.expression;
  if (e.type === 'Literal' && typeof e.value === 'string') return e.value;
  if (e.type === 'TemplateLiteral' && e.expressions.length === 0) {
    return e.quasis[0]?.value.cooked ?? null;
  }
  return null;
}

// Nome local do import padrão de `fonte` neste arquivo.
export function importPadrao(
  program: ESTree.Program,
  fonte: string
): string | null {
  for (const s of program.body) {
    if (s.type !== 'ImportDeclaration' || s.source.value !== fonte) continue;
    for (const esp of s.specifiers) {
      if (esp.type === 'ImportDefaultSpecifier') return esp.local.name;
    }
  }
  return null;
}
