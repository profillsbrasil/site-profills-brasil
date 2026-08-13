# Página de Máquina Fases 1–2 — Assets + 34 Fichas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **Exceção:** a Task 4 (extração em massa) é executada pelo controller via Workflow (fan-out paralelo) — ver instruções na task.

**Goal:** Migrar os ~70 assets de `arquivos-referencia/` para o repo (renomeados por slug, normalizados) e cadastrar as 34 fichas restantes do Catálogo 2026, deixando as 35 páginas de máquina completas (33 padrão + 2 engenharia).

**Architecture:** Fase 1 é mecânica (script de migração com tabela autoritativa + ImageMagick). Fase 2 estende o modelo para o template engenharia e popula o registry via extração paralela do docx (agentes retornam JSON validado por schema; controller gera os `.ts`). Gates: testes de integridade estendidos + build SSG das 35.

**Tech Stack:** Bun · ImageMagick (`magick`) · Vitest · Workflow (extração) · Next.js 16.

**Spec:** `docs/superpowers/specs/2026-08-13-pagina-maquina-catalogo-2026-design.md` · Fonte de conteúdo: extração do docx em `/tmp/claude-1000/-home-othavio-Work-site-profills-brasil/fb11b441-3c4b-4963-9370-fc7f35706b41/scratchpad/Descritivo_Linhas_Maquinas_Site_Profills_2026.txt` (regenerável com `soffice --headless --convert-to "txt:Text (encoded):UTF8" arquivos-referencia/Descritivo_Linhas_Maquinas_Site_Profills_2026.docx`).

## Global Constraints

- Bun (`bun run test`); Prettier nos arquivos tocados; commits PT ≤50 chars sem atribuição de AI.
- Conteúdo das fichas **verbatim do docx** (acentos incluídos); campo ausente não existe no array; capacidade "até X"; proibido publicar certificações/conformidades sanitárias/precisão garantida/vida útil.
- Decisões já tomadas pelo usuário: foto da "Linear c/ Fechamento Automático" **reusa a da família** (horizontal-linear); Doypack id18 removida; docx é a verdade em divergências.
- Lint segue quebrado (pré-existente): gate = `bunx tsc --noEmit` + `bun run build`.
- `arquivos-referencia/` permanece untracked.

## Tabela mestra (autoritativa — slug oficial do docx · legacyId · imagens de origem)

Fontes de imagem relativas a `arquivos-referencia/Imagens/`. `※N` = nota abaixo.

| # | Slug (docx) | legacyId | Maquinas/ | embalagens/ |
|---|---|---|---|---|
| 1 | envasadora-stand-up-pouch-speed | 16 | ✔ migrada (piloto) | ✔ migrada |
| 2 | envasadora-stand-up-pouch-pre-formado-com-tampa | 20 | envasadora-stand-up-pouch-preformado-profills.webp | envasadora-pouch-pre-formado-embalagem.webp |
| 3 | envasadora-pouch-compacta-pre-formado | — | envasadora-pouch-pronto-compacta-profills.webp ※1 | envassadora-pouch-pronto-compacto-profills-embalagem.webp |
| 4 | envasadora-mini-stand-up-pouch | 21 | envasadora-mini-pouch-profills.webp | envassadora-mini-pouch-profills-embalagem.webp |
| 5 | envasadora-seladora-bisnagas | 26 | envasadora-bisnagas-profills.webp | envasadora-bisnagas-profills-embalagem.webp |
| 6 | envasadora-gable-top-gt | 27 | envasadora-gt3000-cartonados-gabletop-profills.webp | envasagora-gt3000-gabletop-embalagem.webp |
| 7 | envasadora-caixas-assepticas-leite-sucos | 28 | envasadora-uth-cartonada-profills.webp | envasadora-uht-profills-embalagem.webp |
| 8 | envasadora-rotativa-potes-copos | 32 | envasadora-potes-calipo-profills.webp ※1 | envasadora-profills-pote-embalagem.webp |
| 9 | envasadora-stand-up-pouch-cartonado | 31 | pouch-mecanica-profills.webp ※2 | envasadora-pouch-mecanica-profills-embalagem.webp ※2 |
| 10 | envasadora-saches-liquidos-linha-tp | 1 | envassadora-tp-saches-profills.webp | envasadora-tp-profills-embalagem.webp |
| 11 | envasadora-saches-liquidos-tp-4-vias | 5 | envassadora-tp-saches-4-vias-profills.webp | envasadora-tp-4vias-profills-embalagem.webp |
| 12 | envasadora-saches-4-soldas-tc4s-1-via | 2 | envasadora-linhaTC4S1via-profills.webp | envasadora-tc4s-1via-profills-embalagem.webp |
| 13 | envasadora-saches-4-soldas-tc4s-2-vias | 3 | envasadora-linhaTC4S2vias-profills.webp | envasadora-tc4s-2vias-profills-embalagem.webp |
| 14 | envasadora-saches-4-soldas-tc4s-3-vias | 4 | envasadora-linhaTC4S3vias-profills.webp ※1 | envasadora-tc4s-3vias-profills-embalagem.webp |
| 15 | envasadora-saches-formatados-tc4s-3-vias | 6 | envasadora-linhaTC4S3vias-formatado-profills.webp ※3 | envasadora-tc-4s-formatado-embalagem.webp |
| 16 | envasadora-saches-3-soldas-pos-solidos-tc3sc | 7 | envasadora-tc3sc-pos-e-solidos-profills.webp ※1 | embalagem-tc-3sc-embalagem-pos-e-solidos.webp |
| 17 | envasadora-saches-3-soldas-liquidos-tc3sc | 8 | envasadora-tc3sc-liquidos-profills.webp | embalagem-tc-3sc-embalagem-liquidos.webp |
| 18 | envasadora-stick-tc3sc-1-a-4-vias | 9 | envasadora-tc3sc-stick-profills.webp ※1 | envasasdora-stick-profills-embalagem.webp |
| 19 | envasadora-saches-3-soldas-tc3sl | 10 | envasadora-TC3SL-profills.webp | envasadora-tc3sl-profills-embalagem.webp |
| 20 | envasadora-saches-pos-solidos-tcv | 11 | envasadora-linha-tcv-profills.webp ※1 | envasadora-linhatcv-solidos-profills-embalagem.webp |
| 21 | enfardadeira-produtos-acabados-tc4u | 22 | envasadora-linha-tcu-profills.webp | envasadora-tc4u-embalagem.webp |
| 22 | empacotadeira-vertical-ptc-speed | 23 | envasadora-linha-ptc-speed.webp | envasadora-ptc-speed-profills-embalagem.webp |
| 23 | envasadora-bags-liquidos-tc3sc | 24 | envasadora-tc3sc-bag.webp | envasadora-tc3scbag-profills-embalagem.webp |
| 24 | embaladora-horizontal-flowpack | 25 | flowpack.webp | flowpack-profills-embalagem.webp |
| 25 | envasadora-horizontal-linear-frascos | 12 | envasadora-linha-frascos-horizontal-linear.webp ※4 | envasdora-horitzontal-linear-frascos-profills-embalagem.webp |
| 26 | envasadora-horizontal-tribloc-frascos | 13 | envasadora-linha-frascos-horizontal-tribloc.webp | envasadora-horizontal-tribloc-profills-embalagem.webp |
| 27 | envasadora-horizontal-rotativa-frascos | 14 | envasadora-linha-frascos-horizontal-rotativa.webp | linha-de-frascos-rotativa-embalagem.webp |
| 28 | envasadora-frascos-tubulares | 33 | envasadora-linha-frascos-tubulares.webp | linha-de-frascos-tubulares-embalagem.webp |
| 29 | envasadora-horizontal-galoes-25-litros | 15 | envasadora-horizontal-galao-profills.webp | envasadora-horizontal-galao-embalagens.webp |
| 30 | envasadora-linear-frascos-fechamento-automatico | 17 | ※5 (reusa a da linha 25) | ※5 (reusa a da linha 25) |
| 31 | envasadora-semiautomatica-baldes | 19 | envasadora-linha-baldes-semiautomatica-profills.webp | "envasadora-baldes-semiautomatica-embalagem copiar.webp" ※6 |
| 32 | maquina-lavagem-galoes | 29 | lavadora-de-galoes-profills.webp | lavadora-galao-embalagem.webp |
| 33 | envolvedora-overlap-embalagens-pet | 30 | envolvedor-profills.webp | envolvedora-embalagem.webp |
| 34 | linha-producao-completa-envase | — | ※7 (sem foto — hero variante) | ※7 |
| 35 | automacao-industrial-robotica-integrada | — | ※7 | ※7 |

Notas: **※1** render cru/fora do padrão — normalizar para largura 1200px na migração. **※2** mesma foto do piloto (docx define 2 máquinas com specs idênticas; foto diferenciada é pendência futura da Profills) — copiar com o nome do slug 9. **※3** conferir visualmente que a foto "formatado" é a máquina de sachês formatados (spec §6.4). **※4** existe variante `...-linear-6-bicos.webp` — migrar também como `envasadora-horizontal-linear-frascos--alt6bicos.webp` para a QA visual da fase 5 escolher. **※5** decisão do usuário (2026-08-13): reusa as imagens da linha 25 (cópia com o nome do slug 30; trocar quando a Profills enviar foto real). **※6** usar o `.webp` (o " copiar" do nome some na renomeação); descartar o `.png` de 1,4MB. **※7** linhas de engenharia não têm foto no material — o template variante renderiza hero sem imagem (Task 3).

Cobertura de legacyId: 32 ids (1–17, 19–33) — id18 já redireciona para `/maquinas`. 3 fichas novas sem legacyId (#3, #34, #35).

**Localização das fichas no txt do docx:** cada ficha começa 3 linhas antes do seu "Slug sugerido:" (linha do cabeçalho de categoria) e termina na linha anterior ao próximo cabeçalho. Linhas dos "Slug sugerido:": 81, 155, 227, 300, 367, 437, 507, 567, 637, 705, 782, 852, 925, 997, 1067, 1134, 1207, 1278, 1353, 1423, 1494, 1561, 1637, 1706, 1777, 1849, 1915, 1983, 2046, 2111, 2178, 2243, 2293, 2354, 2419.

## Mapa tipo de embalagem → glb (guia de extração; conferir cameraOrbit em `app/(site)/(home)/_components/listaEmbalagens.tsx`)

pouch (todas SUP) → `/embalagens-3d/pouch.glb` · sachê 4 soldas (TC4S, TP?※) → `sache-4-soldas.glb` · sachê 3 soldas (TC3SC/TC3SL/TCV) → `3-soldas-duplo.glb` · stick → `stick.glb` · bisnaga → `bisnaga.glb` · gable top → `gable-top.glb` · asséptica/UHT → `uht.glb` · pote → `pote02.glb` · galão → `galao.glb` · frasco → `garrafas-02.glb` · frasco tubular → `frascos-tubulares.glb` · fardo (TC4U, Envolvedora) → `fardo.glb` · flowpack → `flowpack.glb` · bag → `sache-saco.glb` · balde → `lata-tinta.glb` · PTC Speed (sachê/pacote vertical) → `sache-especial.glb`. ※TP é sachê (3 soldas?): decidir pelo texto da ficha; na dúvida, omitir `embalagem3d` (fallback foto) e anotar para a QA da fase 5. Copiar o `cameraOrbit` do glb correspondente em `listaEmbalagens.tsx` sempre que existir lá.

---

### Task 1: Migração e normalização dos assets (Fase 1)

**Files:**
- Create: `scripts/migrar-assets-catalogo2026.sh` (temporário; removido na fase 4)
- Create: `lib/images/catalogo2026/maquinas/*.webp` (33 arquivos) e `lib/images/catalogo2026/embalagens/*.webp` (33)
- Modify: `lib/images/catalogo2026/produtos/*.png` → `.webp` + `lib/data/maquinas/categorias-produto.ts` (imports)
- Test: `lib/data/maquinas/assets.test.ts`

**Interfaces:**
- Consumes: tabela mestra acima (embutir no script como array `slug|origem_maquina|origem_embalagem`).
- Produces: convenção `lib/images/catalogo2026/{maquinas,embalagens}/<slug>.webp` que a Task 4 importa.

- [ ] **Step 1: Teste falhando** — `assets.test.ts`: para cada um dos 33 slugs com foto (tabela, exceto #34/#35), `fs.existsSync('lib/images/catalogo2026/maquinas/<slug>.webp')` e idem em `embalagens/`; produtos: 5 arquivos `.webp` existem e nenhum `.png` restou. (Embutir o array de 33 slugs no teste.)
- [ ] **Step 2: Rodar e confirmar falha.**
- [ ] **Step 3: Escrever e rodar o script de migração** — para cada linha da tabela: `cp` da origem para `lib/images/catalogo2026/<pasta>/<slug>.webp`; nos ※1, `magick <origem> -resize 1200x <destino>`; linha 30 copia da 25; produtos: `magick <f>.png -quality 82 <f>.webp && rm <f>.png`; NÃO copiar `envasadora-baldes-semiautomatica-embalagem.png`.
- [ ] **Step 4: Atualizar imports de `categorias-produto.ts`** (`.png` → `.webp`) e rodar `bun run test` inteiro.
- [ ] **Step 5: Verificar dimensões** — `identify` em todos: máquinas ≤1200px largura; nenhuma >700KB (re-comprimir com `-quality 80` se passar).
- [ ] **Step 6: Conferência visual ※3** — abrir as duas imagens TC4S 3 vias (Read tool) e confirmar que a "formatado" mostra a máquina de sachês formatados; anotar no report.
- [ ] **Step 7: Commit** — `feat: assets do catálogo 2026 migrados` (+ script).

### Task 2: Modelo para engenharia + componente Escopo

**Files:**
- Modify: `lib/data/maquinas/types.ts` (imagens opcional p/ engenharia)
- Create: `app/(site)/maquinas/[slug]/_components/escopoEngenharia.tsx`
- Modify: `app/(site)/maquinas/[slug]/page.tsx` (bloco Escopo + âncora + hero sem foto)
- Modify: `app/(site)/maquinas/[slug]/_components/heroDossie.tsx` (renderizar sem imagem quando ausente)
- Test: `__tests__/escopoEngenharia.test.tsx` + casos novos em `heroDossie.test.tsx` e `page.test.tsx`

**Interfaces:**
- Produces: `MaquinaCatalogo['imagens']` vira opcional (`imagens?: {...}`) com **teste de integridade novo**: obrigatório quando `tipoPagina='padrao'`; `EscopoEngenharia({ conteudo }: { conteudo: NonNullable<MaquinaCatalogo['conteudoEngenharia']> })` com âncora `id='escopo'` (parágrafo `escopo` + placas com `blocos`); hero sem `imagens` → coluna de texto ocupa largura total (sem coluna de imagem); page: secoes de engenharia = visao-geral · escopo · contato, e `<EscopoEngenharia>` renderiza entre VisaoGeral e Conversao quando `tipoPagina==='engenharia'`; FichaTecnica/EmbalagemBloco/Relacionadas seguem fora do branch engenharia (Relacionadas usa `imagens` — proteger com optional chaining ou filtrar máquinas sem imagem).
- TDD em todos; commit: `feat: template de páginas de engenharia`.

### Task 3: Redirects completos

**Files:**
- Modify: `lib/data/maquinas/redirects.ts` (32 entradas da tabela mestra)
- Modify: `lib/data/maquinas/integridade.test.ts` (asserção de cobertura total: ids 1–17 e 19–33 presentes; destinos existem no registry — esta asserção só passa após a Task 4; escrever como `it.todo` → ativar na Task 4)
- Modify: `lib/data/maquinas/redirects.test.ts` (amostras: 1→tp, 17→linear-fechamento, 33→tubulares)
- Commit: `feat: mapa completo de redirects das máquinas`.

### Task 4: Extração das 34 fichas (executada pelo controller via Workflow)

**Contrato de extração (por ficha):** agente recebe o trecho do txt (faixa de linhas da tabela) + slug + legacyId + regras editoriais e retorna JSON com schema espelhando `MaquinaCatalogo` SEM os campos de imagem/glb (o gerador injeta: imports das imagens pelo slug, `embalagem3d` pelo mapa tipo→glb, `paginaCatalogo` do cabeçalho, `capacidadeMaxima` parseado de "Até N unidades/hora", `destaqueHero` = capacidade + 2 linhas mais distintivas escolhidas pelo agente). Fichas #34/#35: `tipoPagina:'engenharia'` + `conteudoEngenharia` (escopo = texto descritivo; blocos = tabela "definido conforme projeto"), sem specs/aplicações-miniaturas.

**Verificação:** cada JSON validado por schema; verificador cruza 3 campos aleatórios de cada ficha contra o txt (anti-alucinação); gerador escreve `lib/data/maquinas/<slug>.ts` + registra em `index.ts`; `bun run test` (integridade: 35 slugs únicos, seo, specs, glbs existem, redirects bidirecionais — ativar o `it.todo` da Task 3); `bunx tsc --noEmit`; `bun run build` (35 páginas SSG).

**Commits em 4 lotes** (pouches+cartonadas · sachês/flexíveis · frascos/rígidas · fim de linha+engenharia), mensagens `feat: fichas <grupo> do catálogo 2026`.

### Task 5: Gate final das fases 1–2

- [ ] Suíte inteira + `tsc` + `bun run build` — 35 rotas SSG no output.
- [ ] Smoke browser (controller): 1 página por categoria (8 amostras) + 1 engenharia — âncoras, 3D/foto, ficha, sem erros de console.
- [ ] Atualizar `docs/superpowers/specs/...design.md` §9: marcar bloqueador da foto Linear como resolvido (reuso decidido pelo usuário).
- [ ] Parar e reportar para o usuário — QA visual das 35 páginas (fase 5) é dele + controller, com ajustes de `*ClassName` por máquina.
