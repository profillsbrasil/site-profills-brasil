/** Valor que o JSON.stringify serializa; campo undefined some do objeto. */
type Json =
  | string
  | number
  | boolean
  | null
  | readonly Json[]
  | { readonly [chave: string]: Json | undefined };

/**
 * Injeta um bloco JSON-LD no HTML. Server component — o dado já sai renderizado,
 * sem custo de hidratação.
 */
export function JsonLd({
  data
}: {
  data: { readonly [chave: string]: Json | undefined };
}) {
  return (
    <script
      type='application/ld+json'
      // O objeto sai do servidor, mas o título e o resumo de post vêm do admin do blog:
      // o escape de < impede que um </script> no texto feche a tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, String.raw`\u003c`)
      }}
    />
  );
}
