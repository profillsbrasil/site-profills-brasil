import type { ESTree } from '@oxlint/plugins';

type Atributo = ESTree.JSXAttribute | ESTree.JSXSpreadAttribute;

export function ehTexto(valor: unknown): valor is string {
  return typeof valor === 'string';
}

export function nomeDoElemento(node: ESTree.JSXOpeningElement) {
  return node.name.type === 'JSXIdentifier' ? node.name.name : null;
}

export function temSpread(node: ESTree.JSXOpeningElement) {
  return node.attributes.some((a: Atributo) => a.type === 'JSXSpreadAttribute');
}

export function atributo(node: ESTree.JSXOpeningElement, nome: string) {
  for (const a of node.attributes) {
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

/** `fill` e `fill={true}` ligam a prop; `fill={false}` não. */
export function atributoLigado(node: ESTree.JSXOpeningElement, nome: string) {
  const a = atributo(node, nome);

  if (a === null) return false;
  const v = a.value;

  return !(
    v?.type === 'JSXExpressionContainer' &&
    v.expression.type === 'Literal' &&
    v.expression.value === false
  );
}

/** Valor string literal do atributo: `x='a'`, `x={'a'}` ou `x={`a`}`; null para qualquer outra forma. */
export function valorLiteral(a: ESTree.JSXAttribute) {
  const v = a.value;

  if (v === null) return null;

  if (v.type === 'Literal') return v.value;

  if (v.type !== 'JSXExpressionContainer') return null;
  const e = v.expression;

  if (e.type === 'Literal' && ehTexto(e.value)) return e.value;

  if (e.type === 'TemplateLiteral' && e.expressions.length === 0) {
    return e.quasis[0]?.value.cooked ?? null;
  }

  return null;
}

export function importPadrao(program: ESTree.Program, fonte: string) {
  for (const s of program.body) {
    if (s.type !== 'ImportDeclaration' || s.source.value !== fonte) continue;

    for (const esp of s.specifiers) {
      if (esp.type === 'ImportDefaultSpecifier') return esp.local.name;
    }
  }

  return null;
}
