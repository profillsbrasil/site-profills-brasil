# Rodada 2 de UI do catálogo: listagem, navbar e relacionadas

**Data:** 2026-08-13 (mesma noite do big-bang) · **Status:** implementado no PR #25
**Processo:** cada decisão foi escolhida pelo usuário sobre mockups no visual companion (telas `filtros-maquinas`, `popout-navbar`, `busca-sidebar`, `relacionadas-carrossel` em `.superpowers/brainstorm/3624191-1786651637/content/`), aplicada e verificada no browser. Revisão adversarial multi-agente rodou sobre o diff (5 achados confirmados, todos corrigidos — ver §5).

Este spec **revisa** pontos do spec do catálogo (`2026-08-13-pagina-maquina-catalogo-2026-design.md` §3 blocos 5 e 9, §7) — o texto de lá permanece como registro histórico com ponteiros para cá.

## 1. Listagem `/maquinas` — painel único de filtros + busca

**Decisão (opção B da tela de filtros + opção A da tela de busca):** morre a dupla "faixa de categorias no topo + sidebar de embalagens à esquerda"; nasce um **painel-placa único à esquerda** (padrão catálogo industrial) com uma **placa de busca separada acima** dele.

Anatomia (`app/(site)/maquinas/_components/filtrosSidebar.tsx`, estado no `page.tsx`):

- **Placa BUSCAR** (moldura própria + marca "+"): input com lupa accent, tracejado em repouso → sólido no foco, × para limpar. Busca por `nome + nomeCompleto`, ignora acento/caixa (NFD). Deep-link `?q=` gravado com debounce de 300ms.
- **Painel CATEGORIA + EMBALAGEM**: lista vertical de categorias com ícone (`ICONE_CATEGORIA`) e contagem; chips de embalagem só com os tipos válidos da categoria ativa; rodapé com contador vivo "N MÁQUINAS" (mono, número em accent) e "limpar ×" quando há filtro ativo.
- **Contagem honesta:** o número ao lado de cada categoria diz **o que o clique produz** — interseção com embalagem ativa e busca; embalagem totalmente incompatível é resetada pelo clique (e a contagem reflete isso). Busca nunca reseta.
- **Sem scroll interno** (exigência do usuário): painel `w-80` (rótulos longos em 1 linha), variante `denso` no desktop (ponteiro preciso), sem `max-h`/`overflow`. Tradeoff declarado: em viewports muito baixos o rodapé do painel pode cortar enquanto sticky.
- **Mobile:** barra sticky com botão "Filtrar · N" que abre **gaveta vaul** (`tema-navy` no `DrawerContent` — portal escapa do escopo do tema!) com as mesmas seções em alvos de toque maiores + CTA "Ver N máquinas". Antes desta rodada o mobile não tinha filtro de embalagem.
- **Título removido:** "Nossas Máquinas" vira `<h1 className='sr-only'>` (semântica/SEO preservadas); container com `pt-16` limpa a navbar fixa e o catálogo abre direto.
- URL (`?categoria=&embalagem=&q=`), deep-links e reanimação por `filterKey` preservados (busca fora do `filterKey` de propósito — reanimar a cada tecla flicka).

## 2. Popout "Máquinas" da navbar — vitrine por hover

**Decisão (opção B da tela do popout, com troca por hover pedida pelo usuário):** painel de 640px — coluna de itens em linha única ("Todas as máquinas" + separador + 8 categorias, ícones compartilhados) e **vitrine à direita**: moldura tracejada com cantoneiras + placa de identificação (nome bold + subtítulo mono uppercase).

- Hover/focus numa categoria troca a máquina exibida: **primeira máquina com foto da categoria na ordem do registry** (`maquinaVitrine` em `navbarDesktop.tsx`). Fade rápido via `animate-in fade-in` + `motion-reduce:animate-none`.
- Categoria só de engenharia (sem fotos — ex.: "Linhas completas e automação") mostra o **placeholder "solução de engenharia sob projeto"** na moldura — nunca máquina de outra categoria (achado Major da revisão).
- O PNG legado avulso (`tc-4s-204-360-3.png`) saiu.

## 3. Relacionadas — carrossel full-bleed com fileira sempre cheia

**Decisão (opção A da tela do carrossel + 2 iterações do usuário):** a grade fixa de 3 cards vira carrossel embla.

- **Cabeçalho** alinhado ao container (`max-w-7xl`): título à esquerda, setas-chip no canto direito (tracejado/accent, gramática dos filtros).
- **Trilho full-bleed dos dois lados:** o 1º card nasce **colado na borda esquerda da página** (iteração final do usuário — sem recuo inicial; a versão com recuo alinhado ao cabeçalho foi testada e descartada) e a fileira corre até a borda direita com peek do próximo.
- **Fotos 160/192px** (antes 112px); cards `basis-[75%] sm:320px md:360px`; sem a linha `border-t` no topo da seção.
- **Fileira sempre cheia:** `getMaquinasRelacionadas` perdeu o corte fixo de 3 e ganhou `{ minimo }` — o pool ranqueado (mesma categoria → embalagens em comum, algoritmo do spec do catálogo intacto) é **completado com as demais máquinas com foto na ordem do registry** até `MINIMO_CARROSSEL = 8`, sem duplicata e nunca a própria máquina. Máquina isolada (ex-caso "seção some") agora também mostra a barra completa.
- A seção renderiza **fora** do container `max-w-7xl` da página de detalhe (mudança estrutural em `[slug]/page.tsx`).

## 4. Ajustes menores da rodada

- **Cards da listagem:** embalagem sem corte — default `h-1/2 w-auto max-w-[65%] object-contain` (antes `object-cover` decepava packshots; escolhido sobre mockup com assets reais).
- **Vinhetas de materiais** (bloco Aplicações do dossiê): 92px → 128/136px, legenda 9px → 11px.

## 5. Achados da revisão adversarial (corrigidos no próprio PR)

1. Vitrine caía em máquina de outra categoria quando a categoria não tinha foto (Major) → placeholder de engenharia.
2. Contagem por categoria ignorava embalagem ativa e prometia mais resultados que o clique entregava (Major) → contagem = resultado do clique.
3. Gaveta mobile sem `DrawerDescription` (aria-describedby) → sr-only adicionada, padrão do `navbarMobile`.
4. Alvos de toque reduzidos vs padrão do repo → h-9/py maiores na gaveta; densidade só no desktop.
5. "(1 máquinas)" no texto sr-only → singular/plural.

## 6. Armadilhas aprendidas (para o CLAUDE.md)

- Testes que renderizam carrossel **embla** precisam de stubs `matchMedia`/`ResizeObserver` (pattern sancionado em `cardsGridMaquinas.test.tsx`) — mordeu duas vezes na rodada.
- Recuo inicial de carrossel full-bleed vive no **viewport** do embla (o div `overflow-hidden`), não no flex interno — no flex, o primeiro snap "rola por cima" do padding. (Registrado aqui como conhecimento; a versão final não usa recuo.)
- Portal do vaul renderiza fora do escopo `.tema-navy` — o `DrawerContent` precisa da classe de tema explícita.
