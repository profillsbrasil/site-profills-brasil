# Mobile Hero — Correção e Polimento

## Contexto

O `MobileHero` em `app/(home)/_components/scrollExpansionHero.tsx` apresentava dois problemas: o modelo 3D não aparecia (container com `h-1/2` dentro de `BlurFade` de altura `auto` resulta em altura zero para o `<model-viewer>`), e o texto ainda exibia a lista estática com `CircleCheckBig` — o `HeroShowcase` implementado recentemente para o desktop nunca foi aplicado ao mobile. Além disso, o H1 usava `text-accent` (azul) ao invés de branco, e o texto era diferente do desktop. O objetivo é corrigir o que está quebrado e uniformizar o visual com o `DesktopHero`.

## Decisões de Design

- **Texto:** H1 `"Tudo Para Seu Negócio!"` em `text-secondary-foreground` (branco) + H2 `"Inovação a cada embalagem"` em `text-accent` — idêntico ao desktop.
- **Showcase:** `HeroShowcase` reutilizado diretamente no lugar da lista estática.
- **Modelo 3D:** Container com `h-[260px] w-full` — altura explícita necessária para o `<model-viewer>` renderizar.
- **Layout:** `flex-col gap-8 px-6 py-16` sem percentuais `h-1/2` que dependem de altura do parent.
- **Animações:** `BlurFade` mantido para ambas as seções. `TextAnimate` removido (substituído por `<h1>` direto dentro do `BlurFade`).

## Arquivo Modificado

`app/(home)/_components/scrollExpansionHero.tsx` — apenas a função `MobileHero()`.

## Código Final de `MobileHero`

```tsx
function MobileHero({ children }: { children?: ReactNode }) {
  return (
    <div className='relative min-h-[calc(100vh-5rem)] bg-linear-to-br from-slate-900 via-slate-800 to-slate-900'>
      <GridPatternMobile />

      <div className='relative z-10 flex min-h-[calc(100vh-5rem)] w-full flex-col items-start justify-center gap-8 px-6 py-16'>
        {/* Texto + Showcase */}
        <BlurFade delay={0.1} inView>
          <div className='flex w-full flex-col'>
            <h1 className='text-4xl font-bold leading-tight tracking-tight text-secondary-foreground select-none'>
              Tudo Para<br />Seu Negócio!
            </h1>
            <h2 className='mt-1 text-lg text-accent'>Inovação a cada embalagem</h2>
            <HeroShowcase />
          </div>
        </BlurFade>

        {/* Modelo 3D */}
        <BlurFade delay={0.3} inView>
          <div className='flex w-full items-center justify-center'>
            <CaixaHome3d
              alt='Modelo 3D - Linha de Produtos Profills'
              modelSrc='/caixa-teste-3d.glb'
              cameraOrbit='40deg 75deg 105%'
              autoRotate={true}
              isMobile={true}
              className='h-[260px] w-full'
            />
          </div>
        </BlurFade>
      </div>

      <section className='relative z-20 min-h-screen bg-white pt-8'>
        {children}
      </section>
    </div>
  );
}
```

## Limpeza de Imports

- Remover `CircleCheckBig` de `lucide-react` — não usado em nenhum lugar após remoção da lista estática.
- Remover `TextAnimate` de `@/components/ui/text-animate` — substituído por `<h1>` direto com `BlurFade`.

## Restrições

- Não alterar `DesktopHero`, `HeroShowcase`, `HeroTextContent`, nem qualquer lógica de scroll.
- O componente é `'use client'` — sem mudanças de arquitetura necessárias.
- `BlurFade` e `GridPatternMobile` permanecem.

## Verificação

1. `npm run dev` → abrir `http://localhost:3000`
2. No DevTools, ativar viewport mobile (ex: iPhone 12 — 390px)
3. Confirmar que H1 está em branco com texto "Tudo Para Seu Negócio!"
4. Confirmar que `HeroShowcase` aparece com auto-rotação e dots
5. Confirmar que o modelo 3D renderiza com altura visível (~260px)
6. Rolar para baixo: seção de conteúdo aparece normalmente
7. Voltar para desktop (>768px): `DesktopHero` sem alterações
