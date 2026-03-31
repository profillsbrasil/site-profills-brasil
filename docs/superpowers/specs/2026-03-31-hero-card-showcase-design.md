# Hero Card Esquerdo — Showcase Rotativo

## Contexto

O card esquerdo da `HeroSection` (componente `HeroTextContent` em `app/(home)/_components/scrollExpansionHero.tsx`) exibia apenas título + subtítulo + lista estática com ícones `CircleCheckBig`. O visual era considerado sem graça — só texto, sem dinamismo. O objetivo é substituir a lista estática por um showcase rotativo que apresenta os produtos/serviços da Profills de forma mais envolvente, sem quebrar a animação de scroll já existente (cards saem lateralmente ao rolar a página).

## Decisões de Design

- **Estilo do showcase:** Open/sem borda — separador horizontal + barra vertical accent à esquerda de cada slide. Integrado ao card sem "caixa dentro de caixa".
- **Conteúdo por slide:** Título do produto/serviço + descrição curta (1 linha).
- **Interação:** Auto-rotação a cada 3,5 segundos com pausa ao hoverar. Dots clicáveis para navegação manual.
- **Transição:** Slide lateral usando `AnimatePresence` + `motion.div` (biblioteca `motion/react` já instalada no projeto).

## Arquitetura

### Arquivo modificado

`app/(home)/_components/scrollExpansionHero.tsx` — apenas a função `HeroTextContent()` é alterada.

### Componente `HeroShowcase`

Novo componente interno no mesmo arquivo:

```tsx
const SLIDES = [
  { title: 'Máquinas Envasadoras',    desc: 'Linha completa para sua linha de produção' },
  { title: 'Peças e Componentes',     desc: 'Reposição rápida com peças originais' },
  { title: 'Consultoria Técnica',     desc: 'Especialistas prontos para apoiar seu negócio' },
  { title: 'E muito mais!',           desc: 'Soluções completas para toda sua empresa' },
]
```

Estado: `activeIndex` (number) controlado por `useState`.

Auto-rotação: `useEffect` com `setInterval` de 3500ms, limpo no cleanup. O intervalo é pausado com `clearInterval` no `onMouseEnter` do container e reiniciado no `onMouseLeave`.

Transição: `AnimatePresence mode="wait"` + `motion.div` com:
- `initial`: `{ x: 40, opacity: 0 }`
- `animate`: `{ x: 0, opacity: 1 }`
- `exit`: `{ x: -40, opacity: 0 }`
- `transition`: `{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }`

### Estrutura visual do slide ativo

```
[separador horizontal com gradient accent]

[barra vertical accent 3px] | [título bold]
                               [descrição muted]

[dot ativo 22px] [dot 6px] [dot 6px] [dot 6px]
```

Dot ativo: `width: 22px`, `bg-accent`. Dots inativos: `width: 6px`, `bg-white/20`.

### `HeroTextContent` atualizado

Remove: os 4 `<p>` com `CircleCheckBig`.  
Mantém: `<h1>`, `<h2>`.  
Adiciona: `<HeroShowcase />` abaixo do `<h2>`.

## Conteúdo dos Slides

| # | Título | Descrição |
|---|--------|-----------|
| 1 | Máquinas Envasadoras | Linha completa para sua linha de produção |
| 2 | Peças e Componentes | Reposição rápida com peças originais |
| 3 | Consultoria Técnica | Especialistas prontos para apoiar seu negócio |
| 4 | E muito mais! | Soluções completas para toda sua empresa |

## Restrições

- Não alterar a animação de scroll existente (`leftX`, `cardsOpacity`, `visibility`).
- O componente é `'use client'` — `useState`/`useEffect` são permitidos.
- Manter compatibilidade com `MobileHero` (mesma lógica pode ser aplicada, mas fora do escopo desta spec).
- Não adicionar novas dependências — usar `motion/react` já instalado.

## Verificação

1. `npm run dev` → abrir `http://localhost:3000`
2. Confirmar que os slides trocam automaticamente a cada ~3,5s
3. Confirmar que clicar nos dots navega para o slide correspondente
4. Hoverar o card deve pausar a auto-rotação
5. Rolar a página: o card deve continuar saindo para a esquerda normalmente
6. Checar mobile: `MobileHero` não é alterada nesta spec
