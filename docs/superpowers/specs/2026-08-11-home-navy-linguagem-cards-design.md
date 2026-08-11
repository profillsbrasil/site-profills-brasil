# Home navy — linguagem de cards e superfícies

**Data:** 2026-08-11 · **Status:** experimento na branch `sandbox` (uncommitted até aprovação final)
**Contexto:** a home inteira migrou para o tema navy do hero (classe `.tema-navy` em `globals.css` re-declara os tokens semânticos para a subárvore). Este spec registra a linguagem visual escolhida para cards e superfícies sobre esse fundo, decidida seção a seção com o visual companion.

## O problema que a linguagem resolve

Sobre fundo escuro, as receitas do tema claro morrem:

- `bg-background`/`bg-secondary` em card = superfície idêntica ao fundo (ratio 1.0, card invisível);
- `shadow-*`/`drop-shadow` pretas = invisíveis sobre navy;
- `border-black/30` = borda sem contraste;
- texto sem classe de cor herda o navy do body (invisível) ou fica branco chapado sem hierarquia.

## As três famílias

### 1. Placa técnica — conteúdo de benefício/argumento

Usada em: cards de "Como podemos ajudar sua empresa?" (`ctaAjudarEmpresa.tsx`), marquee de diferenciais da GT-3000 (`gt3000.tsx`).

Receita:

```
rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-slate-900/60
hover:border-solid hover:border-accent hover:bg-slate-900/85
+ marca "+" de blueprint no canto: absolute top-0.5 right-1.5 font-mono text-xs text-[rgba(148,178,235,0.4)]
```

O hover tracejado→sólido accent é a mesma transição das setas do hero-carrossel — é o gesto que amarra a página.

### 2. Moldura blueprint — produto clicável com mídia

Usada em: bento de "Máquinas em Destaque" (`cardsGridMaquinas.tsx`), grid de "Nossas Embalagens" (`listaEmbalagens.tsx`).

A mídia (foto/carrossel/modelo 3D) flutua direto no navy dentro de um quadro tracejado com **cantoneiras accent** (dois spans de 8×8px, cantos opostos); só o rodapé tem superfície:

```
card:    flex h-full flex-col  (o quadro é flex-1 → alturas equalizam por linha do grid)
quadro:  relative flex-1 rounded-t-xs border border-dashed border-[rgba(148,178,235,0.3)]
         group-hover:border-[rgba(148,178,235,0.55)]
cantos:  absolute -top-px -left-px z-10 h-2 w-2 border-t border-l border-accent  (e o espelho no canto oposto)
rodapé:  rounded-b-xs border border-t-0 border-dashed border-[rgba(148,178,235,0.22)]
         bg-slate-900/60 group-hover:bg-slate-900/85
```

**Uniformidade de tamanho** (requisito explícito): grid estica os cards por linha; `flex-1` no quadro absorve a diferença; descrições com `line-clamp-2 min-h-[2lh]` reservam sempre duas linhas no rodapé.

### 3. Chips de marca — logos de fornecedores

Usada em: "As melhores marcas do mercado" (`ctaAjudarEmpresa.tsx`).

- Chip `bg-card` + borda tracejada `rgba(148,178,235,0.25)`, hover `border-accent/60`.
- Logos monocromáticas brancas via `brightness-0 invert`, `opacity-65` → `100` no hover (PNGs precisam de fundo transparente — o da Autonics foi limpo com `magick -transparent white`).
- **Hover automático**: overlay de borda accent + brilho da logo pulsam em sequência (keyframes `marca-borda-ativa`/`marca-logo-ativa` em `globals.css`, ciclo de 16s, `animationDelay: i*2s`, ~2s por marca). O overlay fica invisível fora da vez do chip, então o hover real continua respondendo. Reduced motion: `motion-reduce:hidden`/`motion-reduce:animate-none`.

### 4. CTA "Monte sua fábrica" (assinatura)

Ilustração livre flutuando sobre o grid (`hero-flutua` 6s, `motion-reduce:animate-none`) ao lado de uma placa técnica **com cantoneiras accent** (híbrido: superfície de placa + cantos de moldura). Botão branco sólido ancorado no canto inferior direito da placa (`md:self-end`), colado ao texto — nunca separado por vão esticado.

### Autoplay nos carrosséis de card

Os cards do bento de Máquinas em Destaque alternam máquina↔embalagem sozinhos, **sem setas visíveis**, cada um no seu ritmo (8s/9.5s/11s/12.5s/14s) para as trocas não baterem em uníssono. `loop: true`, `stopOnInteraction: false`, plugins vazios sob `useReducedMotion`.

## Regras transversais

- Título de card: `text-white`. Texto descritivo: `text-muted-foreground` (azul claro `oklch(0.8206 0.0417 262)` sob `.tema-navy`). Ícones de apoio/spec: `text-accent`.
- Nunca sombras pretas nem `bg-background` em superfícies de card dentro de `.tema-navy`. Elevação vem de tom (`bg-card`, `bg-slate-900/60`) + borda.
- Separadores e réguas: sempre tracejados, família `rgba(148,178,235, 0.22–0.3)` — mesma linha das faixas elevadas da home e do separador hero→conteúdo.
- Botão sólido dentro de card navy: cor explícita (`!bg-white !text-slate-900`), nunca token de background (aprendido no botão do Monte sua fábrica).

## Armadilha registrada

`cn()`/tailwind-merge descarta `leading-*` declarado **antes** de `text-[<tamanho>]` arbitrário (classifica o font-size como conflito de line-height). O leading deve vir **depois** do font-size na lista de classes — caso real: título do hero renderizava com line-height 1.5 em vez de 1.06 (`heroSlideCopy.tsx`).
