# Página de Máquina Fases 3–4 — Colaterais + Limpeza — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar as 4 superfícies colaterais (listagem, navbar, home destaque, montar-maquina) do array legado `maquinasData` para o registry do Catálogo 2026, e remover todo o código/asset morto — completando o big-bang (fases 0–4) e deixando só a fase 5 (QA visual) antes do deploy.

**Architecture:** Cada superfície migra numa task própria (a listagem é a maior — troca de fonte + 8 categorias novas). A limpeza vem por último, guiada por grep (nada que ainda tenha import é removido). `maquinasData.ts` morre na fase 4.

**Tech Stack:** Bun · Next.js 16 · Vitest. Sem dependências novas.

**Spec:** `docs/superpowers/specs/2026-08-13-pagina-maquina-catalogo-2026-design.md` (§2 decisão 10, §7, §11 fases 3–4). O payload do specificationModal (§7) já migrou no fix wave das fases 1–2 — fora deste plano.

## Global Constraints

- Bun (`bun run test`). **NUNCA `bun run format`** — só `bunx prettier --write <arquivos>`. Gate = `bunx tsc --noEmit` (limpo exceto webglSupport.test.ts pré-existente) + `bun run build`.
- Commits PT ≤50 chars sem atribuição de AI; um por task.
- **Visual dos cards da listagem NÃO muda** (spec §7) — muda a fonte de dados e os filtros.
- Registry: `maquinasCatalogo`/`getMaquinaBySlug`/`categoriasCatalogo` (8 valores) de `@/lib/data/maquinas`; tipo `MaquinaCatalogo` (campos: slug, nome, nomeCompleto, headline, categoria, imagens?, embalagensCompativeis, capacidadeMaxima?, tipoPagina...).
- URLs sempre por slug: `/maquinas/${m.slug}`.
- Máquinas de engenharia (2, sem `imagens`) aparecem na listagem? SIM — com card adaptado (só a foto fica ausente; usar o bloco de fallback que a task definir), pois são páginas publicáveis.
- Testes existentes de comportamento das superfícies (se houver) seguem passando; escrever testes novos onde o plano pede.

## Mapeamento de campos (legado → registry) para os cards

| Legado (`MaquinaData`) | Registry (`MaquinaCatalogo`) |
|---|---|
| `name` (título do card) | `nome` |
| `descricao` (subtítulo) | parte após ' - ' de `nomeCompleto` (helper `subtituloDe(m)`; fallback `categoria`) |
| `imgMaquina`/`imgEmbalagem` | `imagens.maquina`/`imagens.embalagem` (opcionais — guard) |
| `imgMaquinaClassName`/`imgEmbalagemClassName` | `imagens.maquinaClassName`/`imagens.embalagemClassName` |
| `id` (URL) | `slug` |
| `categoria` (5 antigas) | `categoria` (8 novas de `categoriasCatalogo`) |
| `embalagensCompativeis` | idem (mesmo vocabulário de 13 tipos) |
| `unidadeMaxima` | `capacidadeMaxima` |

---

### Task 1: Listagem `/maquinas` no registry (8 categorias)

**Files:**
- Modify: `app/(site)/maquinas/page.tsx`
- Modify: `app/(site)/maquinas/_components/cardMaquinas/cardMaquina.tsx` e `maquinaCard.tsx`
- Create: `app/(site)/maquinas/_components/cardMaquinas/__tests__/listagem.test.tsx`

**Contrato:**
- `page.tsx` troca `maquinasData`/`categorias` por `maquinasCatalogo`/`categoriasCatalogo`; barra de categorias = 'Todas' + as 8 (mobile: scroll horizontal já existente comporta); sidebar `tiposEmbalagem` mantém a lista atual de 13 (extrair para `lib/data/maquinas/tipos-embalagem.ts` e importar, já que `maquinasData.ts` morre na fase 4); `tiposVisiveis` continua derivado das máquinas da categoria ativa; deep-link `?categoria=` aceita os 8 valores novos.
- `CardMaquina` recebe `maquinas: MaquinaCatalogo[]`; `Link` para `/maquinas/${m.slug}`; `key` por slug.
- `MaquinaCard` consome o mapeamento da tabela acima; sem `imagens` (2 de engenharia) renderiza a moldura com o miolo `bg-slate-900/60` + nome centralizado (sem `<img>`), mantendo o mesmo frame blueprint.
- Testes: renderiza 35 cards em 'Todas'; filtro por 'Stand-up pouch' mostra 4 (speed, tampa, compacta, mini — pela contagem do registry, derive no teste via filter, não hardcode se preferir); card de engenharia sem `<img>` não quebra; links por slug.
- Commit: `feat: listagem de máquinas no registry 2026`

### Task 2: Navbar com as categorias novas

**Files:**
- Modify: `components/layout/navbarDesktop.tsx` (dropdown "Máquinas")
- Modify: `components/layout/navbarMobile.tsx` (se tiver o mesmo menu — verificar)

**Contrato:** links do dropdown = 'Todas as máquinas' → `/maquinas` + um link por categoria que faça sentido no menu. 8 itens é muito para dropdown? Manter TODAS as 8 (cobertura completa — hoje falta categoria no menu e o spec pede navbar atualizada) em lista simples; a imagem estática do dropdown permanece. Labels = os valores exatos de `categoriasCatalogo`; href = `/maquinas?categoria=${encodeURIComponent(c)}`. Importar `categoriasCatalogo` e gerar via map (não hardcode). Teste do arquivo de navbar se já existir padrão; senão smoke via build.
- Commit: `feat: navbar com categorias do catálogo 2026`

### Task 3: Home maquinas-destaque por slug

**Files:**
- Modify: `app/(site)/(home)/_components/maquinas-destaque/cardsGridMaquinas.tsx`
- Test: `app/(site)/(home)/_components/maquinas-destaque/__tests__/cardsGridMaquinas.test.tsx` (novo)

**Contrato:** `featuredMachines` deixa de ser ids `[1,2,16,22,27]` e vira slugs equivalentes:
`['envasadora-saches-liquidos-linha-tp', 'envasadora-saches-4-soldas-tc4s-1-via', 'envasadora-stand-up-pouch-speed', 'enfardadeira-produtos-acabados-tc4u', 'envasadora-gable-top-gt']`
resolvidos via `getMaquinaBySlug` com **validação que falha alto**: `const m = getMaquinaBySlug(slug); if (!m || !m.imagens) throw new Error(...)` no escopo de módulo (erro de build, não `undefined` silencioso — spec §7). `FeatureCard` adapta campos pela tabela de mapeamento; links `/maquinas/${slug}`. Teste: os 5 slugs resolvem no registry e têm imagens.
- Commit: `feat: destaques da home por slug`

### Task 4: montar-maquina no registry

**Files:**
- Modify: `app/(site)/montar-maquina/_components/combinacaoMaquinas.tsx`
- Test: `app/(site)/montar-maquina/_components/__tests__/recomendacao.test.ts` (novo — extrair `getBestMachineRecommendation` para módulo testável se estiver inline)

**Contrato:** a heurística consome `maquinasCatalogo`; o `switch(categoria)` antigo (5 categorias) é reescrito para as 8 novas mantendo o comportamento observável: cada uma das 8 opções de embalagem da UI e 6 de produto continua produzindo UMA recomendação coerente (ex.: UI 'pouch'+'liquidos' → alguma SUP; 'cartonada' → GT/assépticas; 'sache' → família TC/TP; 'frasco' → frascos). Excluir `tipoPagina==='engenharia'` das recomendações (não são produto de prateleira). Resultado usa `nome`/`imagens?.maquina`/`capacidadeMaxima`/`embalagensCompativeis` e linka `/maquinas/${slug}`. Teste: para cada uma das 8 embalagens da UI (com produto compatível), a recomendação retorna máquina não-engenharia cuja `embalagensCompativeis` bate com o tipo esperado.
- Commit: `feat: montar-maquina no registry 2026`

### Task 5 (Fase 4): Limpeza guiada por grep

**Files (remover SÓ o que o grep provar órfão após Tasks 1–4):**
- Delete: `app/(site)/maquinas/_components/cardMaquinas/maquinasData.ts`
- Delete: `lib/catalogo_completo_maquinas.json`
- Delete: `lib/images/maquinas/` (pasta órfã desde a análise)
- Delete: imagens órfãs conhecidas de `lib/images/novasImagens/maquinasEmbalagens/` (`maquinas/nimco-editada.png`, `papel-sustentabilidade.png`, `sache-sozinho.png`, `POUCH-SOZINHO.png`) **+ qualquer outra da pasta que ficou sem import após as Tasks 1–4** (script: para cada arquivo, grep pelo basename em app/ components/ lib/; sem hit → listar; revisar a lista antes de deletar; ATENÇÃO: a home — hero carrossel, gt3000, listaEmbalagens — ainda usa imagens dessa pasta; remoção é individual, nunca da pasta inteira)
- Modify: `CLAUDE.md` do repo (mapa: remover referência ao `catalogo_completo_maquinas.json`; `lib/data/maquinas/` vira a fonte das máquinas; nota do grid-pattern morto pode ficar)
- Modify: `docs/superpowers/specs/2026-08-13-...design.md` §7 (marcar código morto como removido)

**Gate da task:** `grep -rn "maquinasData\|catalogo_completo" app/ components/ lib/ --include=*.ts*` → zero hits; suíte + tsc + build verdes.
- Commit: `chore: remove fonte legada e assets órfãos`

### Task 6: Gate final das fases 3–4

- [ ] Suíte inteira + `tsc` + `bun run build` (35 SSG + listagem + home).
- [ ] Smoke browser (controller): home (destaques novos linkam por slug), `/maquinas` (filtro de 8 categorias funciona, cards linkam por slug, cards de engenharia ok), navbar dropdown, montar-maquina (uma recomendação end-to-end), console limpo.
- [ ] Ledger + reportar. Fase 5 (QA visual das 35 + mobile + `*ClassName` por máquina) fica para sessão dedicada com o usuário.
