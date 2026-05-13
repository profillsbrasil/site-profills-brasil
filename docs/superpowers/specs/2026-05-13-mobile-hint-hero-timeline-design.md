# Mobile hint + hero timeline fix — Design

**Data:** 2026-05-13
**Branch:** `feat/melhoria-intuitividade-home` (continuação)
**Status:** Aprovado para implementação

## Contexto

Após o último fix (chevron CSS, state machine reativa, dead zone), QA visual identificou 3 problemas restantes:

1. **Pill mobile com aparência feia e copy errada.** "Role para descobrir" não combina com dispositivo touch — verbo correto é "arraste". Pill glass-morphism com chevron único difere visualmente do desktop e parece deslocada no contexto mobile.
2. **Tela azul vazia entre cards saírem e vídeo aparecer no DesktopHero.** Timeline atual: `cardsOpacity: [0, 0.025]` e `videoOpacity: [0.015, 0.06]`. Overlap de apenas 1% (0.015 a 0.025). Um scroll médio passa direto pelo overlap, mostrando apenas o background `bg-secondary` (azul slate) por uma fração de scroll. Visualmente: gap.
3. **Excesso de scroll após vídeo aparecer.** Após `videoOpacity` 100% (progress 0.06), faltam 188vh (94% × 200vh) para chegar na próxima seção. Em trackpad com momentum, 3 flicks. Usuário pede 2.

## Objetivos

- Mobile hint = clone visual do desktop com copy contextualmente correta.
- Vídeo emerge enquanto cards ainda estão saindo — sem tela azul intermediária.
- Encurtar hero scroll para acomodar ~2 scrolls após vídeo full.

## Não objetivos

- Redesign do `MobileHero` ou do `DesktopHero` além dos pontos elencados.
- Refator do componente `ScrollHint` API.
- Mudança nos demais ranges de `useTransform`.

## Decisões

| Eixo | Decisão |
|------|---------|
| Visual mobile | Clone do desktop: cascade 3 chevrons + label embaixo |
| Copy mobile | "Arraste para baixo" |
| Copy desktop | Mantém "Role para descobrir" |
| Gap cards/vídeo | `videoOpacity` range `[0.015, 0.06]` → `[0, 0.035]` |
| Hero altura | `h-[200vh]` → `h-[140vh]` |
| `lightBgOpacity` | Mantém `[0.6, 1.0]` |
| `scroll-hint-pill` + `scroll-hint-chevron-single` + `@keyframes scroll-hint-nudge` | Remover do `app/globals.css` (não mais usados) |

## Arquitetura

2 mudanças cirúrgicas em arquivos distintos:

**Frente A — Mobile hint visual:** `components/blocks/scrollHint.tsx` unifica markup entre variantes; única divergência é o label string. `app/globals.css` perde CSS obsoleto.

**Frente B — Timeline hero:** `app/(home)/_components/scrollExpansionHero.tsx` ajusta altura (`h-[140vh]`) + range de `videoOpacity`.

Sem novo arquivo, sem nova prop, sem nova dependência.

## Componentes

### `components/blocks/scrollHint.tsx` — unificar variantes

Substituir todo o bloco render (após `if (reduceMotion) return null;`) por:

```tsx
const resolvedTestId =
  testId ?? (variant === 'desktop' ? 'scroll-hint-desktop' : 'scroll-hint-mobile');

const label = variant === 'mobile' ? 'Arraste para baixo' : 'Role para descobrir';

return (
  <motion.div
    data-testid={resolvedTestId}
    initial={{ opacity: 0 }}
    animate={{ opacity: visible ? 1 : 0 }}
    transition={{ duration: 0.4 }}
    className='pointer-events-none fixed bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2'>
    <div className='flex flex-col items-center'>
      <span className='scroll-hint-chevron' style={{ animationDelay: '0s' }} />
      <span className='scroll-hint-chevron' style={{ animationDelay: '0.25s' }} />
      <span className='scroll-hint-chevron' style={{ animationDelay: '0.5s' }} />
    </div>
    <span className='text-xs uppercase tracking-wider text-white/70'>
      {label}
    </span>
  </motion.div>
);
```

### `app/globals.css` — remoção de CSS obsoleto

Apagar:

- `@keyframes scroll-hint-nudge { ... }`
- `.scroll-hint-chevron-single { ... }`
- `.scroll-hint-pill { ... }`
- Bloco `@supports not (backdrop-filter: blur(8px)) { .scroll-hint-pill { ... } }`

Manter intactos: `@keyframes scroll-hint-cascade` e `.scroll-hint-chevron`.

### `app/(home)/_components/scrollExpansionHero.tsx` — timeline

Linha 120:

```tsx
const videoOpacity = useTransform(scrollYProgress, [0, 0.035], [0, 1]);
```

(Era `[0.015, 0.06]`.)

Linha 145:

```tsx
<section ref={heroRef} className='relative h-[140vh]'>
```

(Era `h-[200vh]`.)

Demais `useTransform` inalterados.

## Data flow

### Timeline atualizada

```
progress       0.000  0.025   0.035   0.060   0.300   0.600   1.000
cardsOpacity   1──────0
videoOpacity   0──────────────1
gridOpacity    1───────────────────────0
lightBgOpacity 0───────────────────────────────0───────────────1
```

Sobreposição completa de cards e vídeo de progress 0 a 0.025: quando cards atingem opacity 0, vídeo já está em opacity 0.025/0.035 ≈ 71%. Sem flash de background sólido.

### Scroll real (em viewport 1080p)

| Métrica | Antes | Depois |
|---------|-------|--------|
| Altura total | 200vh | 140vh |
| Cards out | 5vh | 3.5vh |
| Video full | 12vh | 4.9vh |
| Light BG start | 120vh | 84vh |
| Total | 200vh | 140vh |

## Error handling

- `ScrollHint` mantém todos os comportamentos atuais (reduced-motion, state machine, cleanup).
- Mudança de altura no hero não afeta `useScroll` (motion normaliza `scrollYProgress` 0-1).
- CSS removido não tem consumidor externo (verificado via grep no projeto).

Sem novo `ErrorBoundary`. Sem novo branch de erro.

## Testes

### Unit — `components/blocks/__tests__/scrollHint.test.tsx`

Atualizar 2 testes existentes:

**Substituir** o teste `'variant mobile renderiza pill com label'`:

```tsx
it('variant mobile renderiza cascade com label "Arraste para baixo"', () => {
  render(<ScrollHint variant='mobile' />);
  const el = screen.getByTestId('scroll-hint-mobile');
  expect(el).toHaveTextContent(/arraste para baixo/i);
});
```

**Substituir** o teste `'variant desktop renderiza label'` por versão mais específica:

```tsx
it('variant desktop usa label "Role para descobrir"', () => {
  render(<ScrollHint variant='desktop' />);
  expect(screen.getByText(/role para descobrir/i)).toBeInTheDocument();
});
```

Restante dos 7 testes mantidos sem alteração.

### Integração — `scrollExpansionHero.test.tsx`

Sem mudança. Continua usando `getByTestId('scroll-hint-mobile')` / `getByTestId('scroll-hint-desktop')` — testids preservados.

### Fora do escopo de teste automatizado

- Verificação visual do cascade no mobile (jsdom não renderiza CSS).
- Smoke do gap fechado (visual QA em browser).
- Smoke do hero encurtado (visual QA com slow 3G scroll).

## Plano de commits

1. `feat(scroll-hint): mobile usa cascade + Arraste`
2. `perf(hero): h-140vh + fecha gap cards/video`

## Critérios de aceitação

- [ ] Mobile mostra cascade chevron sobre fundo escuro do `MobileHero`, sem pill.
- [ ] Mobile label = "Arraste para baixo".
- [ ] Desktop mantém "Role para descobrir" sem regressão.
- [ ] DesktopHero: ao primeiro scroll, vídeo já visível parcialmente — sem flash de background azul.
- [ ] Hero scroll total reduzido para 140vh.
- [ ] `bun run test` passa.

## Fora do escopo

- Geração de posters dos GLBs (tracked separadamente).
- Lint crash pre-existente.
- Refator do `ScrollExpandMedia` além dos pontos elencados.
