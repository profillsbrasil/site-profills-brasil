/** Valor que o JSON.stringify serializa; campo undefined some do objeto. */
type Json =
  | string
  | number
  | boolean
  | null
  | readonly Json[]
  | { readonly [chave: string]: Json | undefined };

const semFimDeScript = (json: string) => json.replace(/</g, String.raw`\u003c`);

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
      dangerouslySetInnerHTML={{
        __html: semFimDeScript(JSON.stringify(data))
      }}
    />
  );
}
