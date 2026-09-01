/**
 * Injeta um bloco JSON-LD no HTML. Server component — o dado já sai renderizado,
 * sem custo de hidratação.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type='application/ld+json'
      // O objeto é montado no servidor a partir de dados do repo, nunca de input do usuário.
      dangerouslySetInnerHTML={{
        // escapa < para um texto de conteúdo com </script> não fechar a tag
        __html: JSON.stringify(data).replace(/</g, String.raw`\u003c`)
      }}
    />
  );
}
