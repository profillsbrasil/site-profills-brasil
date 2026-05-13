# Mobile hint + hero timeline fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unificar visual do `ScrollHint` mobile com o desktop (cascade chevron + label "Arraste para baixo"), fechar gap "tela azul" entre cards saírem e vídeo aparecer no `DesktopHero`, e encurtar a altura sticky de `h-[200vh]` para `h-[140vh]`.

**Architecture:** 2 commits sequenciais na branch `feat/melhoria-intuitividade-home`. Commit 1 toca `ScrollHint` + globals.css + testes. Commit 2 toca timeline do `scrollExpansionHero`.

**Tech Stack:** Next.js 16, React 19, Tailwind 4, motion/react, Vitest + Testing Library + jsdom.

**Spec:** `docs/superpowers/specs/2026-05-13-mobile-hint-hero-timeline-design.md`

---

## File Structure

**Modificados:**
- `components/blocks/scrollHint.tsx` — unifica markup de mobile + desktop, label varia por variant
- `components/blocks/__tests__/scrollHint.test.tsx` — atualiza 2 testes para refletir nova copy mobile
- `app/globals.css` — remove `.scroll-hint-pill`, `.scroll-hint-chevron-single`, `@keyframes scroll-hint-nudge`, `@supports` fallback do pill
- `app/(home)/_components/scrollExpansionHero.tsx` — `h-[200vh]` → `h-[140vh]` + `videoOpacity` range

**Nenhum arquivo criado ou removido.**

---

## Task 1: Mobile hint = cascade desktop + copy "Arraste para baixo"

**Files:**
- Modify: `components/blocks/__tests__/scrollHint.test.tsx`
- Modify: `components/blocks/scrollHint.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1.1: Atualizar testes — substituir os 2 testes de label**

Em `components/blocks/__tests__/scrollHint.test.tsx`, localizar e substituir o teste `'variant mobile renderiza pill com label'`:

**Antes:**
```tsx
it('variant mobile renderiza pill com label', () => {
  render(<ScrollHint variant='mobile' />);
  const el = screen.getByTestId('scroll-hint-mobile');
  expect(el).toHaveTextContent(/role para descobrir/i);
});
```

**Depois:**
```tsx
it('variant mobile renderiza cascade com label "Arraste para baixo"', () => {
  render(<ScrollHint variant='mobile' />);
  const el = screen.getByTestId('scroll-hint-mobile');
  expect(el).toHaveTextContent(/arraste para baixo/i);
});
```

Localizar e substituir o teste `'variant desktop renderiza label'`:

**Antes:**
```tsx
it('variant desktop renderiza label', () => {
  render(<ScrollHint variant='desktop' />);
  expect(screen.getByText(/role para descobrir/i)).toBeInTheDocument();
});
```

**Depois:**
```tsx
it('variant desktop usa label "Role para descobrir"', () => {
  render(<ScrollHint variant='desktop' />);
  expect(screen.getByText(/role para descobrir/i)).toBeInTheDocument();
});
```

- [ ] **Step 1.2: Rodar testes e confirmar 1 falha**

```bash
cd /home/othavio/profills/site-profills-brasil
bun run test components/blocks/__tests__/scrollHint.test.tsx
```

Expected: o teste mobile falha (componente atual renderiza "Role para descobrir" no mobile). Desktop passa.

- [ ] **Step 1.3: Substituir o bloco de render do `ScrollHint` para unificar variantes**

Em `components/blocks/scrollHint.tsx`, substituir tudo a partir de `if (reduceMotion) return null;` até o final do componente (inclusive os dois blocos `if (variant === 'desktop')` e o return mobile) por:

```tsx
  if (reduceMotion) return null;

  const resolvedTestId =
    testId ?? (variant === 'desktop' ? 'scroll-hint-desktop' : 'scroll-hint-mobile');

  const label =
    variant === 'mobile' ? 'Arraste para baixo' : 'Role para descobrir';

  return (
    <motion.div
      data-testid={resolvedTestId}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className='pointer-events-none fixed bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2'>
      <div className='flex flex-col items-center'>
        <span className='scroll-hint-chevron' style={{ animationDelay: '0s' }} />
        <span
          className='scroll-hint-chevron'
          style={{ animationDelay: '0.25s' }}
        />
        <span
          className='scroll-hint-chevron'
          style={{ animationDelay: '0.5s' }}
        />
      </div>
      <span className='text-xs uppercase tracking-wider text-white/70'>
        {label}
      </span>
    </motion.div>
  );
}
```

(Substitui ambos os returns variant-específicos por um único bloco unificado.)

- [ ] **Step 1.4: Rodar testes do componente**

```bash
bun run test components/blocks/__tests__/scrollHint.test.tsx
```

Expected: 9 passes (todos).

- [ ] **Step 1.5: Remover CSS obsoleto do globals.css**

Em `app/globals.css`, **apagar** os blocos abaixo (continuam aparecendo nas linhas ~189-224):

```css
@keyframes scroll-hint-nudge {
  0%, 100% { transform: rotate(45deg) translate(0, 0); }
  50% { transform: rotate(45deg) translate(2px, 2px); }
}
```

```css
.scroll-hint-chevron-single {
  width: 10px;
  height: 10px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  animation: scroll-hint-nudge 1.6s ease-in-out infinite;
}
```

```css
.scroll-hint-pill {
  background-color: rgb(255 255 255 / 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
```

```css
@supports not (backdrop-filter: blur(8px)) {
  .scroll-hint-pill {
    background-color: rgb(255 255 255 / 0.2);
  }
}
```

**Manter intactos:** `@keyframes scroll-hint-cascade` e `.scroll-hint-chevron` (são usados pela versão unificada).

- [ ] **Step 1.6: Confirmar que nada mais referencia os símbolos removidos**

```bash
grep -rn "scroll-hint-pill\|scroll-hint-chevron-single\|scroll-hint-nudge" components/ app/ --include='*.tsx' --include='*.css'
```

Expected: zero matches. Se aparecer algo, abortar e relatar.

- [ ] **Step 1.7: Suite completa**

```bash
bun run test
```

Expected: 41 passes em 7 arquivos. Zero regressão.

- [ ] **Step 1.8: Commit**

```bash
git add components/blocks/scrollHint.tsx components/blocks/__tests__/scrollHint.test.tsx app/globals.css
git commit -m "feat(scroll-hint): mobile usa cascade + Arraste"
```

---

## Task 2: Hero timeline — h-140vh + fecha gap cards/video

**Files:**
- Modify: `app/(home)/_components/scrollExpansionHero.tsx`

- [ ] **Step 2.1: Encurtar a altura do hero**

Em `app/(home)/_components/scrollExpansionHero.tsx`, localizar a linha 145:

```tsx
<section ref={heroRef} className='relative h-[200vh]'>
```

Substituir por:

```tsx
<section ref={heroRef} className='relative h-[140vh]'>
```

- [ ] **Step 2.2: Estender o range do `videoOpacity` para começar em 0**

Na mesma função `DesktopHero`, localizar a linha 120:

```tsx
const videoOpacity = useTransform(scrollYProgress, [0.015, 0.06], [0, 1]);
```

Substituir por:

```tsx
const videoOpacity = useTransform(scrollYProgress, [0, 0.035], [0, 1]);
```

**NÃO TOCAR** nos outros `useTransform`. Os ranges de `cardsOpacity`, `leftX`, `rightX`, `videoScale`, `gridOpacity`, `lightBgOpacity` permanecem.

- [ ] **Step 2.3: Suite completa**

```bash
bun run test
```

Expected: 41 passes. Teste de integração `scrollExpansionHero.test.tsx` não checa altura nem ranges, então não regride.

- [ ] **Step 2.4: Smoke visual manual (recomendado)**

```bash
bun run dev
```

Abrir `http://localhost:3000`. Verificações:

1. Hero sem flash de background azul ao primeiro scroll — vídeo emerge enquanto cards saem.
2. Total de scroll até a próxima seção menor que antes.
3. `lightBgOpacity` transição para branco acontece no terço final do hero.

Encerrar dev com Ctrl+C.

- [ ] **Step 2.5: Commit**

```bash
git add app/\(home\)/_components/scrollExpansionHero.tsx
git commit -m "perf(hero): h-140vh + fecha gap cards/video"
```

---

## Task 3: Validação final

- [ ] **Step 3.1: Suite completa**

```bash
cd /home/othavio/profills/site-profills-brasil
bun run test
```

Expected: 41 passes em 7 arquivos.

- [ ] **Step 3.2: Build de produção**

```bash
bun run build
```

Expected: build conclui sem erro fatal.

- [ ] **Step 3.3: Verificar critérios da spec (estático)**

```bash
echo "=== ScrollHint render unificado ===" && grep -n "Arraste para baixo\|Role para descobrir\|scroll-hint-chevron\|scroll-hint-pill" components/blocks/scrollHint.tsx
echo "=== CSS obsoleto removido ===" && grep -n "scroll-hint-pill\|scroll-hint-chevron-single\|scroll-hint-nudge" app/globals.css
echo "=== Hero ===" && grep -n 'h-\[140vh\]\|videoOpacity' app/\(home\)/_components/scrollExpansionHero.tsx
```

Verifique:
- `scrollHint.tsx` cita "Arraste para baixo" e "Role para descobrir", referencia `scroll-hint-chevron`, sem `scroll-hint-pill`.
- `globals.css` zero ocorrências de `scroll-hint-pill`, `scroll-hint-chevron-single`, `scroll-hint-nudge`.
- `scrollExpansionHero.tsx` tem `h-[140vh]` e `videoOpacity` com range `[0, 0.035]`.

- [ ] **Step 3.4: Listar commits dos 2 fixes**

```bash
git log --oneline 49cfba4..HEAD
```

Expected: spec commit + 2 commits de implementação.

---

## Notas para o executor

- **Use `bun run test`, NUNCA `bun test`.** `bun test` usa o runner próprio do Bun (sem jsdom) e falha com `ReferenceError: window is not defined`. O script `package.json` define `"test": "vitest run"` — é o que precisamos.
- Não dar `git push` sem aprovação explícita do usuário (regra `ask` ativa).
- Não usar `--no-verify` em commits.
- Lint pre-existing crash (`@eslint/eslintrc`) é conhecido. Não introduzido por esta task — pular Step de lint sem reportar como issue novo.
- O teste de integração em `app/(home)/_components/__tests__/scrollExpansionHero.test.tsx` mocka `next/dynamic` e `motion/react` — não checa altura nem ranges. Mudanças do Task 2 não regridem nenhum teste.
- Re-`Read` arquivos modificados antes de qualquer `Edit` adicional na mesma task (harness invalida file state após escrita).
