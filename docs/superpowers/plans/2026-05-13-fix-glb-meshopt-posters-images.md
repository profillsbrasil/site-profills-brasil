# Fix runtime errors — GLB meshopt + posters 404 + Image sizes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans.

**Goal:** Eliminar 3 classes de erros em runtime: GLBs comprimidos com meshopt não carregam no model-viewer (16 erros), posters 404 (16 erros), `<Image fill>` sem `sizes` (12 warnings perf).

**Architecture:** 4 commits sequenciais na branch `feat/melhoria-intuitividade-home`. Re-comprimir GLBs sem meshopt, remover `posterSrc` wiring, adicionar `sizes` em imagens com fill, investigar warning de position.

**Tech Stack:** Next.js 16, gltf-transform CLI, ffmpeg, model-viewer.

---

## File Structure

**Modificados (in-place):**
- `public/embalagens-3d/*.glb` — 16 modelos re-comprimidos sem meshopt
- `app/(home)/_components/listaEmbalagens.tsx` — remove `posterSrc` field e prop
- `app/(home)/_components/maquinas-destaque/cardsGridMaquinas.tsx` — adiciona `sizes` nas 2 `<Image fill>`
- `app/(home)/_components/scrollExpansionHero.tsx` — investigar/corrigir warning position se aplicável

**Backup local em `/tmp/glb-meshopt-backup/`** antes de re-comprimir GLBs.

---

## Task 1: Re-comprimir GLBs sem meshopt

**Files:**
- Modify (16): `public/embalagens-3d/*.glb`

- [ ] **Step 1.1: Backup dos GLBs atuais (já comprimidos com meshopt)**

```bash
cd /home/othavio/profills/site-profills-brasil
mkdir -p /tmp/glb-meshopt-backup
cp public/embalagens-3d/*.glb /tmp/glb-meshopt-backup/
ls /tmp/glb-meshopt-backup/ | wc -l
```

Expected: `16`.

- [ ] **Step 1.2: Restaurar GLBs originais do git (pré-compressão meshopt)**

O commit `76b4451` foi o que comprimiu com meshopt. O parent (`76b4451^` = `bf3376a` ou anterior) tem os GLBs originais.

```bash
mkdir -p /tmp/glb-original
for slug in 3-soldas-duplo bisnaga fardo flowpack frascos-tubulares gable-top galao garrafas-02 lata-tinta pote02 pouch sache-4-soldas sache-especial sache-saco stick uht; do
  git show 76b4451^:public/embalagens-3d/${slug}.glb > /tmp/glb-original/${slug}.glb
done
ls -lh /tmp/glb-original/ | head -20
```

Expected: 16 GLBs, tamanhos originais (bisnaga ~50MB, demais 100KB-2.8MB).

- [ ] **Step 1.3: Re-comprimir cada GLB usando SÓ texture compression (sem meshopt)**

```bash
for f in /tmp/glb-original/*.glb; do
  name=$(basename "$f")
  echo "==> $name"
  npx @gltf-transform/cli optimize "$f" "public/embalagens-3d/$name" --texture-compress webp --texture-size 1024
done
ls -lh public/embalagens-3d/*.glb
```

Expected: cada GLB ≤ 5 MB (target permissivo já que removemos meshopt). Bisnaga pode ficar mais alto que 140KB de antes — aceito até 5MB.

- [ ] **Step 1.4: Suite de testes**

```bash
bun run test
```

Expected: 41 passes.

- [ ] **Step 1.5: Smoke manual (recomendado)**

```bash
bun run dev
```

Abrir `http://localhost:3000`, scrollar até `ListaEmbalagens`. Cada card deve renderizar o modelo 3D. **Sem erros no console sobre `setMeshoptDecoder`.** Encerrar dev.

- [ ] **Step 1.6: Commit**

```bash
git add public/embalagens-3d/
git commit -m "fix(glb): recomprime sem meshopt (model-viewer compat)"
```

---

## Task 2: Remover `posterSrc` wiring (posters não existem)

**Files:**
- Modify: `app/(home)/_components/listaEmbalagens.tsx`

- [ ] **Step 2.1: Remover campo `posterSrc` de cada item em `listaDeEmbalagens` e a prop no JSX**

Em `app/(home)/_components/listaEmbalagens.tsx`:

1. Apagar cada linha `posterSrc: '/embalagens-3d/posters/<slug>.webp',` dentro dos objetos do array `listaDeEmbalagens` (16 ocorrências).

2. Localizar o JSX `<OptimizedEmbalagem3d ... />` (próximo da linha 144) e remover a linha `posterSrc={card.posterSrc}`:

**Antes:**
```tsx
<OptimizedEmbalagem3d
  modelSrc={card.modelSrc}
  posterSrc={card.posterSrc}
  alt={`Modelo 3D - ${card.title}`}
  cameraOrbit={card.cameraOrbit}
  autoRotate={true}
/>
```

**Depois:**
```tsx
<OptimizedEmbalagem3d
  modelSrc={card.modelSrc}
  alt={`Modelo 3D - ${card.title}`}
  cameraOrbit={card.cameraOrbit}
  autoRotate={true}
/>
```

- [ ] **Step 2.2: Suite**

```bash
bun run test
```

Expected: 41 passes.

- [ ] **Step 2.3: Commit**

```bash
git add app/\(home\)/_components/listaEmbalagens.tsx
git commit -m "fix(modelo3d): remove posterSrc wiring (arquivos ausentes)"
```

---

## Task 3: Adicionar `sizes` em `<Image fill>` de `cardsGridMaquinas.tsx`

**Files:**
- Modify: `app/(home)/_components/maquinas-destaque/cardsGridMaquinas.tsx`

- [ ] **Step 3.1: Adicionar `sizes` em ambas as `<Image>` com `fill`**

Em `app/(home)/_components/maquinas-destaque/cardsGridMaquinas.tsx`:

**Primeira `<Image>` (linha ~96):**

Adicionar `sizes='(max-width: 768px) 100vw, 33vw'` após `fill`:

```tsx
<Image
  src={machine.imgMaquina}
  alt={machine.name}
  fill
  sizes='(max-width: 768px) 100vw, 33vw'
  className={cn(
    'h-full w-full rounded-xs object-contain transition-transform duration-500',
    machine.imgMaquinaClassName
  )}
/>
```

**Segunda `<Image>` (linha ~109):** mesma adição:

```tsx
<Image
  src={machine.imgEmbalagem}
  alt={`Embalagem ${machine.name}`}
  fill
  sizes='(max-width: 768px) 100vw, 33vw'
  className={cn(
    'h-full w-full rounded-xs !object-contain transition-transform duration-500',
    machine.imgEmbalagemClassName
  )}
/>
```

- [ ] **Step 3.2: Build de produção (sem warnings de sizes)**

```bash
bun run build 2>&1 | grep -i "fill.*sizes\|sizes.*prop" || echo "OK: zero warnings"
```

Expected: `OK: zero warnings` (warnings de fill/sizes não aparecem mais).

- [ ] **Step 3.3: Suite**

```bash
bun run test
```

Expected: 41 passes.

- [ ] **Step 3.4: Commit**

```bash
git add app/\(home\)/_components/maquinas-destaque/cardsGridMaquinas.tsx
git commit -m "perf(images): adiciona sizes em cards de maquinas"
```

---

## Task 4: Investigar warning de "non-static position"

**Files:**
- Possivelmente: `app/(home)/_components/scrollExpansionHero.tsx`

- [ ] **Step 4.1: Rodar dev e reproduzir warning**

```bash
bun run dev &
DEV_PID=$!
sleep 6
curl -s http://localhost:3000 > /dev/null
kill $DEV_PID
```

Expected: o warning aparece em logs do `bun run dev`. Anote o componente que aparece no stack trace.

- [ ] **Step 4.2: Se vier de `scrollExpansionHero`, verificar `heroRef` parent**

Em `app/(home)/_components/scrollExpansionHero.tsx`, a `<section ref={heroRef} className='relative h-[140vh]'>` já tem `relative`. O warning vem da `useScroll({ target: heroRef })` quando o ref aponta para um elemento sem position. Se o `<section>` tem `relative`, o warning vem de algum OUTRO scroll element.

Verificar se outros componentes na home usam `useScroll`:

```bash
grep -rn "useScroll" --include='*.tsx' app/ components/
```

Se houver outro consumidor (ex.: globe.gl, carrossel), avaliar caso a caso.

Se o warning **não** vem de `scrollExpansionHero`, pular adicionar `relative` aqui.

- [ ] **Step 4.3: Se causa raiz não puder ser identificada, marcar como DONE_WITH_CONCERNS**

Warning é dev-mode (não breaking). Acceptable concern se causa raiz exige investigação maior. Reportar o stack trace observado em Step 4.1.

- [ ] **Step 4.4: Commit (se aplicável)**

Só se foi feito fix.

---

## Task 5: Validação final

- [ ] **Step 5.1: Suite completa**

```bash
bun run test
```

Expected: 41 passes.

- [ ] **Step 5.2: Build de produção**

```bash
bun run build
```

Expected: sem erros fatais.

- [ ] **Step 5.3: Dev server + verificar logs**

```bash
bun run dev &
DEV_PID=$!
sleep 8
curl -s http://localhost:3000 > /dev/null
sleep 3
kill $DEV_PID
```

Verificar nos logs:
- Zero `setMeshoptDecoder` errors
- Zero `/embalagens-3d/posters/` 404s (porque removemos as referências)
- Zero `fill ... sizes` warnings em `cardsGridMaquinas` paths

- [ ] **Step 5.4: Listar commits dos fixes**

```bash
git log --oneline e31792d..HEAD
```

Expected: ~4 commits (plan + Task 1, 2, 3, [4]).

---

## Notas para o executor

- Use `bun run test` (não `bun test`).
- Não fazer git push. Não use --no-verify.
- Backup `/tmp/glb-backup/` foi criado em Task 4 anterior e deveria estar lá. Se foi limpado, BLOCKED — peça ao usuário um novo backup ou outra estratégia.
- gltf-transform via `npx -y @gltf-transform/cli@latest` — pode demorar no primeiro uso. Aceitar.
- Task 4 (warning position) é P3, pode ser DONE_WITH_CONCERNS se não localizar causa raiz facilmente.
