# Página de Máquina Fase 0 — Fundação + Piloto Pouch Speed — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o novo modelo de dados do catálogo 2026 e o template "dossiê industrial" da página de máquina, validado de ponta a ponta com a Linha Pouch Speed (rota `/maquinas/envasadora-stand-up-pouch-speed`).

**Architecture:** Registry de máquinas em `lib/data/maquinas/` (um arquivo por máquina, resolução por slug), rota dinâmica renomeada `[maquinaId]`→`[slug]` com SSG + metadata por máquina, e página composta por 9 blocos (componentes privados da rota). Redirects 301 dos ids antigos via `next.config.ts` consumindo um módulo leve sem imports de imagem.

**Tech Stack:** Next.js 16 App Router (Turbopack) · React 19 · TypeScript · Tailwind v4 (tokens `.tema-navy`) · motion (`motion/react`) · `@google/model-viewer` via `components/modelo3d` · Vitest + Testing Library · Bun.

**Spec:** `docs/superpowers/specs/2026-08-13-pagina-maquina-catalogo-2026-design.md` (ler antes; contém as 13 decisões, regras editoriais e o modelo de dados). Mockup de composição aprovado: `.superpowers/brainstorm/2603547-1786626154/content/pagina-completa-v3.html`.

## Global Constraints

- Package manager é **Bun**: `bun run test`, `bun dev`, `bunx`.
- Motion importa de `'motion/react'` — nunca `framer-motion`. Toda animação nova respeita `useReducedMotion` (usar `components/AnimatedContainer.tsx`, que já faz isso).
- 3D/WebGL entra **sempre** via `dynamic(() => import(...), { ssr: false })` — nunca `<model-viewer>` direto.
- Conteúdo do site em pt-BR. Textos das fichas copiados **verbatim** do docx (regra editorial: nunca inventar valor; campo sem dado não existe no array).
- Commits: Conventional Commits em PT, subject ≤50 chars, sem atribuição de AI.
- Tema: página inteira navy via classe `tema-navy` (tokens em `app/globals.css:264`). Armadilha conhecida: `bg-background`/`bg-secondary` sobre navy somem — superfícies de card usam `bg-slate-900/60` + borda tracejada `border-[rgba(148,178,235,0.35)]` (spec 2026-08-11).
- Navbar desktop é `fixed top-0 z-50 h-16` → sub-nav sticky usa `top-16`; a página compensa com `pt-16`.
- CTA proibido: "Montar meu projeto" (não linkar `/montar-maquina` nesta página).
- Estado intermediário do big-bang: após a Task 3, URLs numéricas de máquinas ainda não migradas (ids ≠ 16) passam a 404 **neste branch** — esperado até as fases 2–3; não "consertar".

## File Structure

```
lib/data/maquinas/
├── types.ts                          # interfaces + enums (novo)
├── redirects.ts                      # mapa legacyId→slug, sem imports de imagem (novo)
├── index.ts                          # registry + getMaquinaBySlug (novo)
├── relacionadas.ts                   # algoritmo de máquinas relacionadas (novo)
├── categorias-produto.ts             # metadados das 5 categorias de produto (novo)
├── envasadora-stand-up-pouch-speed.ts# ficha do piloto (novo)
├── integridade.test.ts               # testes de integridade do registry (novo)
└── relacionadas.test.ts              # testes do algoritmo (novo)

lib/images/catalogo2026/
├── maquinas/envasadora-stand-up-pouch-speed.webp   (copiado de arquivos-referencia)
├── embalagens/envasadora-stand-up-pouch-speed.webp (copiado)
└── produtos/{liquidos,pastosos,pos,graos,solidos}.png (copiados; compressão fica p/ fase 1)

lib/utils/whatsapp.ts                 # waLink + número de vendas (novo)

app/(site)/maquinas/[slug]/           # renomeado de [maquinaId]/
├── page.tsx                          # reescrito: resolução por slug, SSG, metadata, composição
├── _components/
│   ├── specificationModal.tsx        # movido de [maquinaId]/_components, props desacopladas
│   ├── subNavMaquina.tsx             # bloco 1 (novo)
│   ├── heroDossie.tsx                # bloco 2 (novo)
│   ├── visaoGeral.tsx                # bloco 3 (novo)
│   ├── videoMaquina.tsx              # bloco 4 (novo)
│   ├── aplicacoesProdutos.tsx        # bloco 5 (novo)
│   ├── embalagemBloco.tsx            # bloco 6 (novo)
│   ├── fichaTecnica.tsx              # bloco 7 (novo)
│   ├── conversao.tsx                 # bloco 8 (novo)
│   ├── relacionadas.tsx              # bloco 9 (novo)
│   └── __tests__/                    # testes dos componentes
next.config.ts                        # modificado: redirects das máquinas
```

Não tocar nesta fase: `maquinasData.ts` (listagem/home/montar-maquina seguem consumindo), `app/api/specifications/route.ts`, `lib/schemas/specification-form.ts`, footer.

---

### Task 1: Modelo de dados + ficha do piloto + testes de integridade

**Files:**
- Create: `lib/data/maquinas/types.ts`
- Create: `lib/data/maquinas/redirects.ts`
- Create: `lib/data/maquinas/index.ts`
- Create: `lib/data/maquinas/envasadora-stand-up-pouch-speed.ts`
- Create: `lib/images/catalogo2026/` (5+2 imagens copiadas)
- Test: `lib/data/maquinas/integridade.test.ts`

**Interfaces:**
- Consumes: nada (fundação).
- Produces: `MaquinaCatalogo`, `EspecificacaoItem`, `CategoriaCatalogo`, `CategoriaProduto` (types.ts); `maquinasCatalogo: MaquinaCatalogo[]`, `getMaquinaBySlug(slug: string): MaquinaCatalogo | undefined` (index.ts); `maquinaRedirects: { legacyId: number; slug: string }[]` (redirects.ts).

- [ ] **Step 1: Copiar os assets do piloto**

```bash
mkdir -p lib/images/catalogo2026/{maquinas,embalagens,produtos}
cp "arquivos-referencia/Imagens/Maquinas/pouch-mecanica-profills.webp" \
   "lib/images/catalogo2026/maquinas/envasadora-stand-up-pouch-speed.webp"
cp "arquivos-referencia/Imagens/embalagens/envasadora-pouch-mecanica-profills-embalagem.webp" \
   "lib/images/catalogo2026/embalagens/envasadora-stand-up-pouch-speed.webp"
for f in liquidos pastosos pos graos solidos; do
  cp "arquivos-referencia/Imagens/produtos/$f.png" "lib/images/catalogo2026/produtos/$f.png"
done
```

- [ ] **Step 2: Escrever o teste de integridade (falhando)**

`lib/data/maquinas/integridade.test.ts`:

```ts
import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { maquinasCatalogo, getMaquinaBySlug } from './index';
import { maquinaRedirects } from './redirects';

describe('integridade do registry de máquinas', () => {
  it('tem slugs únicos', () => {
    const slugs = maquinasCatalogo.map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('tem SEO completo em todas as máquinas', () => {
    for (const m of maquinasCatalogo) {
      expect(m.seo.titulo.length, m.slug).toBeGreaterThan(0);
      expect(m.seo.descricao.length, m.slug).toBeGreaterThan(0);
    }
  });

  it('máquinas padrão têm specs não-vazias; engenharia tem conteudoEngenharia', () => {
    for (const m of maquinasCatalogo) {
      if (m.tipoPagina === 'padrao') {
        expect(m.specsMaquina.length, m.slug).toBeGreaterThan(0);
        expect(m.specsEmbalagem.length, m.slug).toBeGreaterThan(0);
      } else {
        expect(m.conteudoEngenharia, m.slug).toBeDefined();
      }
    }
  });

  it('todo glb declarado existe em public/', () => {
    for (const m of maquinasCatalogo) {
      if (!m.embalagem3d) continue;
      const arquivo = path.join(process.cwd(), 'public', m.embalagem3d.glb);
      expect(fs.existsSync(arquivo), m.embalagem3d.glb).toBe(true);
    }
  });

  it('redirects e registry são consistentes nos dois sentidos', () => {
    // todo destino de redirect existe no registry
    for (const r of maquinaRedirects) {
      expect(getMaquinaBySlug(r.slug), `redirect ${r.legacyId}`).toBeDefined();
    }
    // toda máquina com legacyId tem redirect
    for (const m of maquinasCatalogo) {
      if (m.legacyId === undefined) continue;
      expect(
        maquinaRedirects.some((r) => r.legacyId === m.legacyId),
        m.slug
      ).toBe(true);
    }
    // NOTA fase 2: quando as 35 fichas existirem, adicionar asserção de
    // cobertura completa dos ids 1–33 (18 → /maquinas é caso especial no next.config).
  });

  it('getMaquinaBySlug resolve o piloto e rejeita slug inválido', () => {
    expect(getMaquinaBySlug('envasadora-stand-up-pouch-speed')?.nome).toBe(
      'Linha Pouch Speed'
    );
    expect(getMaquinaBySlug('nao-existe')).toBeUndefined();
  });
});
```

- [ ] **Step 3: Rodar e confirmar falha**

Run: `bun run test lib/data/maquinas/integridade.test.ts`
Expected: FAIL (módulos `./index` e `./redirects` não existem).

- [ ] **Step 4: Criar `types.ts`**

```ts
import type { StaticImageData } from 'next/image';

export const categoriasCatalogo = [
  'Stand-up pouch',
  'Embalagens cartonadas e especiais',
  'Embalagens flexíveis',
  'Fim de linha e embalagens flexíveis',
  'Embalagens rígidas',
  'Embalagens rígidas e higienização',
  'Fim de linha',
  'Linhas completas e automação'
] as const;
export type CategoriaCatalogo = (typeof categoriasCatalogo)[number];

export const categoriasProduto = [
  'liquidos',
  'pastosos',
  'pos',
  'graos',
  'solidos'
] as const;
export type CategoriaProduto = (typeof categoriasProduto)[number];

export interface EspecificacaoItem {
  rotulo: string;
  valor: string;
}

export interface MaquinaCatalogo {
  slug: string;
  /** id numérico da URL antiga (1–33); ausente nas 3 máquinas novas do catálogo 2026 */
  legacyId?: number;
  nome: string;
  nomeCompleto: string;
  headline: string;
  seo: { titulo: string; descricao: string };
  categoria: CategoriaCatalogo;
  paginaCatalogo: string;
  tipoPagina: 'padrao' | 'engenharia';
  descritivo: string;
  recursos: string[];
  aplicacoes: {
    categoriaPrincipal: string;
    categorias: CategoriaProduto[];
    produtos: string[];
  };
  imagens: {
    maquina: StaticImageData;
    embalagem: StaticImageData;
    maquinaClassName?: string;
    embalagemClassName?: string;
  };
  embalagem3d?: { glb: string; cameraOrbit?: string };
  video?: { src: string; poster?: string };
  specsMaquina: EspecificacaoItem[];
  specsEmbalagem: EspecificacaoItem[];
  capacidadeMaxima?: number;
  embalagensCompativeis: string[];
  destaqueHero?: [EspecificacaoItem, EspecificacaoItem, EspecificacaoItem];
  conteudoEngenharia?: { escopo: string; blocos: EspecificacaoItem[] };
}
```

- [ ] **Step 5: Criar `redirects.ts`** (leve — importável pelo `next.config.ts`)

```ts
/**
 * Mapa id antigo → slug novo. Fonte única dos redirects 301.
 * SEM imports de imagem/registry: este módulo é consumido pelo next.config.ts.
 * Fase 2 completa os 32 ids restantes (id18 → /maquinas é caso especial no config).
 */
export const maquinaRedirects: { legacyId: number; slug: string }[] = [
  { legacyId: 16, slug: 'envasadora-stand-up-pouch-speed' }
];
```

- [ ] **Step 6: Criar a ficha do piloto** (`envasadora-stand-up-pouch-speed.ts` — conteúdo verbatim do docx, p.16)

```ts
import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-stand-up-pouch-speed.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-stand-up-pouch-speed.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraStandUpPouchSpeed: MaquinaCatalogo = {
  slug: 'envasadora-stand-up-pouch-speed',
  legacyId: 16,
  nome: 'Linha Pouch Speed',
  nomeCompleto: 'Linha Pouch Speed - Envasadora Stand-Up Pouch Mecânica',
  headline:
    'Alta produtividade para operações que precisam automatizar alimentação, abertura, dosagem e selagem de embalagens stand-up pouch.',
  seo: {
    titulo: 'Envasadora Stand-Up Pouch Speed | Profills',
    descricao:
      'Envasadora automática stand-up pouch de alta velocidade para líquidos, pós, grãos e sólidos, com produção de até 5.400 unidades por hora.'
  },
  categoria: 'Stand-up pouch',
  paginaCatalogo: 'P.16',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha Pouch Speed é uma solução mecânica de alta velocidade para o envase em embalagens stand-up pouch. Foi desenvolvida para integrar as principais etapas do processo em um fluxo contínuo, com controle por CLP e IHM touchscreen. A configuração de dosagem é definida de acordo com a característica do produto, permitindo trabalhar com líquidos, pós e determinados sólidos. É indicada para indústrias que buscam produtividade, repetibilidade e acabamento padronizado da embalagem.',
  recursos: [
    'Formato especial customizado',
    'Datação por inkjet ou hot stamping',
    'Dosagem temporizada, por bomba positiva ou volumétrica',
    'Configuração definida após testes com produto e embalagem'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos, pastosos, pós, grãos e sólidos',
    categorias: ['liquidos', 'pastosos', 'pos', 'graos', 'solidos'],
    produtos: [
      'Molho de tomate',
      'Ketchup',
      'Maionese',
      'Mostarda',
      'Molhos prontos',
      'Polpas de frutas',
      'Sucos concentrados',
      'Bebidas funcionais',
      'Mel',
      'Sabão líquido',
      'Detergente',
      'Amaciante',
      'Desinfetante',
      'Shampoo',
      'Condicionador',
      'Fertilizante líquido',
      'Whey protein',
      'Café',
      'Arroz',
      'Feijão',
      'Castanhas',
      'Temperos',
      'Ração pet'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: { glb: '/embalagens-3d/pouch.glb', cameraOrbit: '27deg 80deg 100%' },
  specsEmbalagem: [
    { rotulo: 'Largura do filme', valor: '320 a 650 mm' },
    { rotulo: 'Espessura do filme', valor: '130 a 160 µm' },
    { rotulo: 'Largura final da embalagem', valor: '125 a 280 mm' },
    { rotulo: 'Comprimento final da embalagem', valor: '100 a 200 mm' },
    { rotulo: 'Materiais compatíveis', valor: 'PET + PE; PET + PE + alumínio; BOPP; BOPA; EVOH' },
    { rotulo: 'Tipos de produto', valor: 'Líquidos, pós e alguns sólidos' }
  ],
  specsMaquina: [
    { rotulo: 'Capacidade de produção', valor: 'Até 5.400 unidades/hora' },
    { rotulo: 'Sistema de datação', valor: 'Inkjet ou hot stamping' },
    { rotulo: 'Sistema de dosagem', valor: 'Temporizado, bomba positiva ou volumétrico' },
    { rotulo: 'Tensão operativa', valor: '220 V / 60 Hz' },
    { rotulo: 'Potência ativa instalada', valor: '8,97 kW' },
    { rotulo: 'Consumo de energia', valor: '6,65 kWh' },
    { rotulo: 'Comando', valor: 'CLP com IHM touchscreen' },
    { rotulo: 'Consumo de ar', valor: '349 L/min' },
    { rotulo: 'Área de operação', valor: '5.300 x 3.300 mm' },
    { rotulo: 'Material de fabricação', valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono' }
  ],
  capacidadeMaxima: 5400,
  embalagensCompativeis: ['Pouch'],
  destaqueHero: [
    { rotulo: 'Capacidade', valor: 'até 5.400 un/h' },
    { rotulo: 'Dosagem', valor: 'temporizada · bomba · volumétrica' },
    { rotulo: 'Comando', valor: 'CLP + IHM touchscreen' }
  ]
};
```

- [ ] **Step 7: Criar `index.ts`**

```ts
import { envasadoraStandUpPouchSpeed } from './envasadora-stand-up-pouch-speed';
import type { MaquinaCatalogo } from './types';

export * from './types';
export { maquinaRedirects } from './redirects';

export const maquinasCatalogo: MaquinaCatalogo[] = [envasadoraStandUpPouchSpeed];

export function getMaquinaBySlug(slug: string): MaquinaCatalogo | undefined {
  return maquinasCatalogo.find((m) => m.slug === slug);
}
```

- [ ] **Step 8: Rodar os testes e confirmar que passam**

Run: `bun run test lib/data/maquinas/integridade.test.ts`
Expected: PASS (6 testes).

- [ ] **Step 9: Commit**

```bash
git add lib/data/maquinas lib/images/catalogo2026
git commit -m "feat: modelo de dados do catálogo 2026 + piloto"
```

---

### Task 2: Redirects 301 no next.config

**Files:**
- Modify: `lib/data/maquinas/redirects.ts` (adiciona helper)
- Modify: `next.config.ts:26-34`
- Test: `lib/data/maquinas/redirects.test.ts`

**Interfaces:**
- Consumes: `maquinaRedirects` (Task 1).
- Produces: `buildMaquinaRedirects(): { source: string; destination: string; permanent: boolean }[]` (redirects.ts).

- [ ] **Step 1: Teste falhando** — `lib/data/maquinas/redirects.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { buildMaquinaRedirects } from './redirects';

describe('buildMaquinaRedirects', () => {
  it('gera 301 de id antigo para slug', () => {
    const redirects = buildMaquinaRedirects();
    expect(redirects).toContainEqual({
      source: '/maquinas/16',
      destination: '/maquinas/envasadora-stand-up-pouch-speed',
      permanent: true
    });
  });

  it('redireciona a Doypack removida (id 18) para a listagem', () => {
    expect(buildMaquinaRedirects()).toContainEqual({
      source: '/maquinas/18',
      destination: '/maquinas',
      permanent: true
    });
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `bun run test lib/data/maquinas/redirects.test.ts`
Expected: FAIL ("buildMaquinaRedirects is not a function").

- [ ] **Step 3: Implementar o helper no fim de `redirects.ts`**

```ts
/** id 18 (Doypack) saiu do catálogo 2026 — decisão 4 do spec. */
const REDIRECT_REMOVIDAS = [{ source: '/maquinas/18', destination: '/maquinas' }];

export function buildMaquinaRedirects() {
  return [
    ...maquinaRedirects.map((r) => ({
      source: `/maquinas/${r.legacyId}`,
      destination: `/maquinas/${r.slug}`,
      permanent: true
    })),
    ...REDIRECT_REMOVIDAS.map((r) => ({ ...r, permanent: true }))
  ];
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `bun run test lib/data/maquinas/redirects.test.ts` — Expected: PASS.

- [ ] **Step 5: Ligar no `next.config.ts`** — substituir o bloco `async redirects()` atual por:

```ts
import { buildMaquinaRedirects } from './lib/data/maquinas/redirects';
// ... dentro de nextConfig:
  async redirects() {
    return [
      {
        source: '/downloads/:path*',
        destination: '/download',
        permanent: true,
      },
      ...buildMaquinaRedirects(),
    ];
  },
```

- [ ] **Step 6: Verificar que o dev server sobe sem erro de config**

Run: `bun dev --port 3999 & sleep 8; curl -s -o /dev/null -w "%{http_code}" -I http://localhost:3999/maquinas/16; kill %1`
Expected: `308` ou `301`/`307` (redirect emitido). Se `500`, a config quebrou — checar import.

- [ ] **Step 7: Commit**

```bash
git add lib/data/maquinas/redirects.ts lib/data/maquinas/redirects.test.ts next.config.ts
git commit -m "feat: redirects 301 das URLs antigas de máquinas"
```

---

### Task 3: Rota `[slug]` com SSG + metadata (esqueleto da página)

**Files:**
- Rename: `app/(site)/maquinas/[maquinaId]/` → `app/(site)/maquinas/[slug]/` (via `git mv`)
- Rewrite: `app/(site)/maquinas/[slug]/page.tsx`
- Test: `app/(site)/maquinas/[slug]/__tests__/page.test.tsx`

**Interfaces:**
- Consumes: `getMaquinaBySlug`, `maquinasCatalogo` (Task 1).
- Produces: `MaquinaPage` (default export, Server Component async com `params: Promise<{ slug: string }>`), `generateStaticParams`, `generateMetadata`. Os componentes de bloco (Tasks 4–12) serão montados dentro dele na Task 13.

**Nota:** a partir daqui a página antiga deixa de existir (o Next não permite `[maquinaId]` e `[slug]` no mesmo nível). `ProducaoMaxima` e o bug `animationDuration={maquina.unidadeMaxima}` morrem aqui. O `specificationModal.tsx` é movido junto na rename e adaptado na Task 11 — até lá o import antigo dele quebraria o build, então o esqueleto desta task **não** o importa.

- [ ] **Step 1: Renomear a pasta**

```bash
git mv "app/(site)/maquinas/[maquinaId]" "app/(site)/maquinas/[slug]"
```

- [ ] **Step 2: Teste falhando** — `app/(site)/maquinas/[slug]/__tests__/page.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import MaquinaPage, { generateMetadata, generateStaticParams } from '../page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  })
}));

const paramsDoPiloto = Promise.resolve({ slug: 'envasadora-stand-up-pouch-speed' });

describe('página de máquina', () => {
  it('gera params estáticos para todas as máquinas do registry', async () => {
    const params = await generateStaticParams();
    expect(params).toContainEqual({ slug: 'envasadora-stand-up-pouch-speed' });
  });

  it('gera metadata com título e descrição do docx', async () => {
    const meta = await generateMetadata({ params: paramsDoPiloto });
    expect(meta.title).toBe('Envasadora Stand-Up Pouch Speed | Profills');
    expect(meta.description).toContain('5.400 unidades por hora');
  });

  it('renderiza o H1 do docx para o piloto', async () => {
    render(await MaquinaPage({ params: paramsDoPiloto }));
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Linha Pouch Speed - Envasadora Stand-Up Pouch Mecânica/i
      })
    ).toBeInTheDocument();
  });

  it('chama notFound para slug inexistente', async () => {
    await expect(
      MaquinaPage({ params: Promise.resolve({ slug: 'nao-existe' }) })
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
```

- [ ] **Step 3: Rodar e confirmar falha**

Run: `bun run test "app/(site)/maquinas/[slug]/__tests__/page.test.tsx"`
Expected: FAIL (page antiga não tem `generateStaticParams` e resolve por id).

- [ ] **Step 4: Reescrever `page.tsx`** (esqueleto — blocos entram nas próximas tasks)

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { getMaquinaBySlug, maquinasCatalogo } from '@/lib/data/maquinas';

interface MaquinaPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return maquinasCatalogo.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params
}: MaquinaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const maquina = getMaquinaBySlug(slug);
  if (!maquina) return {};
  return {
    title: maquina.seo.titulo,
    description: maquina.seo.descricao,
    openGraph: {
      title: maquina.seo.titulo,
      description: maquina.seo.descricao,
      images: [{ url: maquina.imagens.maquina.src }]
    }
  };
}

export default async function MaquinaPage({ params }: MaquinaPageProps) {
  const { slug } = await params;
  const maquina = getMaquinaBySlug(slug);
  if (!maquina) notFound();

  return (
    <div className='tema-navy bg-background text-foreground relative min-h-screen w-full pt-16'>
      <GridPattern />
      <div className='relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8'>
        {/* Blocos do template entram nas Tasks 4–12; montagem final na Task 13 */}
        <h1 className='pt-10 text-2xl font-bold md:text-4xl'>
          {maquina.nomeCompleto}
        </h1>
        <p className='text-muted-foreground mt-4 max-w-2xl'>{maquina.headline}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `bun run test "app/(site)/maquinas/[slug]/__tests__/page.test.tsx"` — Expected: PASS (4 testes).

- [ ] **Step 6: Rodar a suíte inteira** (a rename pode ter quebrado imports)

Run: `bun run test`
Expected: PASS. Se algo importar `[maquinaId]` (grep para confirmar: `grep -rn "maquinaId" app/ components/ lib/ --include="*.tsx" --include="*.ts"`), os usos em `specificationModal`/schema são aceitáveis (adaptados na Task 11); paths de import quebrados não são — corrigir.

- [ ] **Step 7: Commit**

```bash
git add -A "app/(site)/maquinas"
git commit -m "feat: rota de máquina por slug com SSG e metadata"
```

---

### Task 4: `subNavMaquina` — sub-nav sticky com âncoras derivadas

**Files:**
- Create: `app/(site)/maquinas/[slug]/_components/subNavMaquina.tsx`
- Test: `app/(site)/maquinas/[slug]/_components/__tests__/subNavMaquina.test.tsx`

**Interfaces:**
- Consumes: nada do registry (recebe props).
- Produces: `SubNavMaquina({ nome, secoes, children }: { nome: string; secoes: { id: string; rotulo: string }[]; children?: React.ReactNode })` — client component; `children` é o slot do CTA (o botão do modal entra na Task 13). As âncoras vêm das seções efetivamente renderizadas (decisão do spec §3.1).

- [ ] **Step 1: Teste falhando** — `__tests__/subNavMaquina.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SubNavMaquina } from '../subNavMaquina';

const secoes = [
  { id: 'visao-geral', rotulo: 'Visão geral' },
  { id: 'ficha-tecnica', rotulo: 'Ficha técnica' }
];

describe('SubNavMaquina', () => {
  it('renderiza o nome e uma âncora por seção recebida', () => {
    render(<SubNavMaquina nome='Pouch Speed' secoes={secoes} />);
    expect(screen.getByText('Pouch Speed')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Visão geral' })).toHaveAttribute(
      'href',
      '#visao-geral'
    );
    expect(screen.getByRole('link', { name: 'Ficha técnica' })).toHaveAttribute(
      'href',
      '#ficha-tecnica'
    );
  });

  it('não inventa âncoras além das recebidas', () => {
    render(<SubNavMaquina nome='X' secoes={[secoes[0]]} />);
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `bun run test "app/(site)/maquinas/[slug]/_components/__tests__/subNavMaquina.test.tsx"` — Expected: FAIL (módulo não existe).

- [ ] **Step 3: Implementar**

```tsx
'use client';

interface SubNavMaquinaProps {
  nome: string;
  secoes: { id: string; rotulo: string }[];
  children?: React.ReactNode;
}

export function SubNavMaquina({ nome, secoes, children }: SubNavMaquinaProps) {
  return (
    <nav
      aria-label='Seções da página'
      className='sticky top-0 z-40 -mx-4 border-b border-dashed border-[rgba(148,178,235,0.3)] bg-slate-900/95 backdrop-blur-sm md:top-16 md:-mx-8'>
      <div className='mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-2 md:gap-6 md:px-8'>
        <span className='shrink-0 font-mono text-sm font-bold text-white'>
          {nome}
        </span>
        <span className='h-4 w-px shrink-0 bg-[rgba(148,178,235,0.25)]' />
        {secoes.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className='text-muted-foreground hover:text-foreground shrink-0 font-mono text-xs tracking-wider uppercase transition-colors'>
            {s.rotulo}
          </a>
        ))}
        <div className='ml-auto shrink-0'>{children}</div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Rodar e confirmar que passa** — `bun run test ...subNavMaquina.test.tsx` — Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/maquinas/[slug]/_components"
git commit -m "feat: sub-nav sticky da página de máquina"
```

---

### Task 5: `heroDossie` — hero "dossiê industrial"

**Files:**
- Create: `app/(site)/maquinas/[slug]/_components/heroDossie.tsx`
- Test: `app/(site)/maquinas/[slug]/_components/__tests__/heroDossie.test.tsx`

**Interfaces:**
- Consumes: `MaquinaCatalogo` (Task 1); `NumberTicker` (`@/components/magicui/number-ticker`); `AnimatedContainer` (`@/components/AnimatedContainer`).
- Produces: `HeroDossie({ maquina, children }: { maquina: MaquinaCatalogo; children?: React.ReactNode })` — `children` = slot dos CTAs (Task 13). Regras do spec §3.2: mini-tabela usa `destaqueHero` (fallback: 3 primeiros de `specsMaquina`); NumberTicker só quando `capacidadeMaxima` existe.

- [ ] **Step 1: Teste falhando** — `__tests__/heroDossie.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';

import { HeroDossie } from '../heroDossie';

describe('HeroDossie', () => {
  it('renderiza H1, headline, categoria e página do catálogo', () => {
    render(<HeroDossie maquina={piloto} />);
    expect(
      screen.getByRole('heading', { level: 1, name: piloto.nomeCompleto })
    ).toBeInTheDocument();
    expect(screen.getByText(piloto.headline)).toBeInTheDocument();
    expect(screen.getByText(/Stand-up pouch/i)).toBeInTheDocument();
    expect(screen.getByText(/P\.16/)).toBeInTheDocument();
  });

  it('renderiza as 3 linhas do destaqueHero', () => {
    render(<HeroDossie maquina={piloto} />);
    expect(screen.getByText('Dosagem')).toBeInTheDocument();
    expect(screen.getByText('Comando')).toBeInTheDocument();
  });

  it('usa os 3 primeiros specsMaquina quando destaqueHero está ausente', () => {
    render(<HeroDossie maquina={{ ...piloto, destaqueHero: undefined }} />);
    expect(screen.getByText('Sistema de datação')).toBeInTheDocument();
  });

  it('sem capacidadeMaxima não renderiza o ticker (valor vira texto puro)', () => {
    const { container } = render(
      <HeroDossie maquina={{ ...piloto, capacidadeMaxima: undefined }} />
    );
    expect(container.querySelector('[data-ticker]')).toBeNull();
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha** — Expected: FAIL (módulo não existe).

- [ ] **Step 3: Implementar**

```tsx
import Image from 'next/image';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import { NumberTicker } from '@/components/magicui/number-ticker';
import type { MaquinaCatalogo } from '@/lib/data/maquinas';
import { cn } from '@/lib/utils';

function Cantoneiras() {
  const base = 'absolute h-2.5 w-2.5 border-accent';
  return (
    <>
      <span className={cn(base, '-top-px -left-px border-t-2 border-l-2')} />
      <span className={cn(base, '-top-px -right-px border-t-2 border-r-2')} />
      <span className={cn(base, '-bottom-px -left-px border-b-2 border-l-2')} />
      <span className={cn(base, '-right-px -bottom-px border-r-2 border-b-2')} />
    </>
  );
}

interface HeroDossieProps {
  maquina: MaquinaCatalogo;
  children?: React.ReactNode;
}

export function HeroDossie({ maquina, children }: HeroDossieProps) {
  const linhas = maquina.destaqueHero ?? maquina.specsMaquina.slice(0, 3);

  return (
    <AnimatedContainer trigger='mount' className='pt-8 md:pt-12'>
      <section className='relative border border-dashed border-[rgba(148,178,235,0.35)] p-5 md:p-8'>
        <Cantoneiras />
        <div className='flex items-center justify-between border-b border-dashed border-[rgba(148,178,235,0.25)] pb-3'>
          <span className='text-accent font-mono text-[10px] tracking-[0.2em] uppercase'>
            {maquina.categoria}
          </span>
          <span className='text-muted-foreground/60 font-mono text-[10px] tracking-wider'>
            FICHA · CATÁLOGO 2026 · {maquina.paginaCatalogo}
          </span>
        </div>

        <div className='flex flex-col items-center gap-6 pt-6 md:flex-row'>
          <div className='w-full md:w-[45%]'>
            <h1 className='text-2xl leading-tight font-bold text-white md:text-4xl'>
              {maquina.nomeCompleto}
            </h1>
            <p className='text-muted-foreground mt-3 max-w-md text-sm md:text-base'>
              {maquina.headline}
            </p>

            <dl className='mt-5 w-full max-w-sm font-mono'>
              {linhas.map((item) => (
                <div
                  key={item.rotulo}
                  className='flex items-baseline justify-between gap-4 border-b border-[rgba(148,178,235,0.15)] py-2 last:border-0'>
                  <dt className='text-muted-foreground/70 text-[11px] tracking-wider uppercase'>
                    {item.rotulo}
                  </dt>
                  <dd className='text-right text-sm font-semibold text-white'>
                    {item.rotulo === 'Capacidade' && maquina.capacidadeMaxima ? (
                      <span data-ticker>
                        até{' '}
                        <NumberTicker
                          value={maquina.capacidadeMaxima}
                          startValue={Math.floor(maquina.capacidadeMaxima * 0.5)}
                          className='font-semibold text-white'
                        />{' '}
                        un/h
                      </span>
                    ) : (
                      item.valor
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className='mt-6 flex flex-wrap gap-3'>{children}</div>
          </div>

          <div className='relative flex w-full justify-center md:w-[55%]'>
            <Image
              src={maquina.imagens.maquina}
              alt={`${maquina.nomeCompleto} Profills`}
              priority
              className={cn(
                'md:-my-16 max-h-[320px] w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)] md:max-h-[480px]',
                maquina.imagens.maquinaClassName
              )}
            />
          </div>
        </div>
      </section>
    </AnimatedContainer>
  );
}
```

- [ ] **Step 4: Rodar e confirmar que passa** — Expected: PASS (4 testes).

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/maquinas/[slug]/_components"
git commit -m "feat: hero dossiê da página de máquina"
```

---

### Task 6: `visaoGeral` — texto descritivo + placa de recursos

**Files:**
- Create: `app/(site)/maquinas/[slug]/_components/visaoGeral.tsx`
- Test: `app/(site)/maquinas/[slug]/_components/__tests__/visaoGeral.test.tsx`

**Interfaces:**
- Consumes: `MaquinaCatalogo`.
- Produces: `VisaoGeral({ maquina }: { maquina: MaquinaCatalogo })` — Server Component; raiz com `id='visao-geral'` (âncora do sub-nav).

- [ ] **Step 1: Teste falhando**:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';

import { VisaoGeral } from '../visaoGeral';

describe('VisaoGeral', () => {
  it('renderiza o descritivo e todos os recursos', () => {
    render(<VisaoGeral maquina={piloto} />);
    expect(screen.getByText(/solução mecânica de alta velocidade/)).toBeInTheDocument();
    for (const recurso of piloto.recursos) {
      expect(screen.getByText(recurso)).toBeInTheDocument();
    }
  });

  it('tem a âncora visao-geral', () => {
    const { container } = render(<VisaoGeral maquina={piloto} />);
    expect(container.querySelector('#visao-geral')).not.toBeNull();
  });

  it('omite a placa de recursos quando o array é vazio', () => {
    render(<VisaoGeral maquina={{ ...piloto, recursos: [] }} />);
    expect(screen.queryByText('Recursos e especiais')).toBeNull();
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha** — Expected: FAIL.

- [ ] **Step 3: Implementar**

```tsx
import { AnimatedContainer } from '@/components/AnimatedContainer';
import type { MaquinaCatalogo } from '@/lib/data/maquinas';

export function VisaoGeral({ maquina }: { maquina: MaquinaCatalogo }) {
  return (
    <section id='visao-geral' className='scroll-mt-28 py-10 md:py-14'>
      <AnimatedContainer className='flex flex-col gap-8 md:flex-row'>
        <div className='md:w-3/5'>
          <h2 className='text-lg font-bold text-white md:text-xl'>Visão geral</h2>
          <p className='text-muted-foreground mt-3 leading-relaxed'>
            {maquina.descritivo}
          </p>
        </div>
        {maquina.recursos.length > 0 && (
          <div className='md:w-2/5'>
            <div className='relative border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60 p-5'>
              <span className='text-accent/60 absolute -top-2 -left-1 font-mono text-xs'>
                +
              </span>
              <h3 className='font-mono text-xs font-semibold tracking-widest text-white uppercase'>
                Recursos e especiais
              </h3>
              <ul className='mt-3 space-y-2'>
                {maquina.recursos.map((r) => (
                  <li key={r} className='text-muted-foreground flex gap-2 text-sm'>
                    <span className='text-accent'>▸</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </AnimatedContainer>
    </section>
  );
}
```

- [ ] **Step 4: Rodar e confirmar que passa** — Expected: PASS (3 testes).

- [ ] **Step 5: Commit** — `git add ... && git commit -m "feat: bloco visão geral com placa de recursos"`

---

### Task 7: `videoMaquina` — bloco pronto-mas-oculto

**Files:**
- Create: `app/(site)/maquinas/[slug]/_components/videoMaquina.tsx`
- Test: `app/(site)/maquinas/[slug]/_components/__tests__/videoMaquina.test.tsx`

**Interfaces:**
- Consumes: `MaquinaCatalogo['video']`.
- Produces: `VideoMaquina({ video, nome }: { video?: { src: string; poster?: string }; nome: string })` — retorna `null` sem vídeo (regra do docx: nunca quadro vazio); com vídeo, `<section id='video'>` com `<video controls preload='metadata'>`.

- [ ] **Step 1: Teste falhando**:

```tsx
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { VideoMaquina } from '../videoMaquina';

describe('VideoMaquina', () => {
  it('não renderiza NADA sem vídeo (nem section, nem placeholder)', () => {
    const { container } = render(<VideoMaquina nome='X' />);
    expect(container.innerHTML).toBe('');
  });

  it('renderiza o player quando há vídeo', () => {
    const { container } = render(
      <VideoMaquina
        nome='Pouch Speed'
        video={{ src: '/videos/maquinas/teste.mp4', poster: '/videos/maquinas/teste.webp' }}
      />
    );
    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute('poster', '/videos/maquinas/teste.webp');
    expect(container.querySelector('#video')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha** — Expected: FAIL.

- [ ] **Step 3: Implementar**

```tsx
import { AnimatedContainer } from '@/components/AnimatedContainer';

interface VideoMaquinaProps {
  video?: { src: string; poster?: string };
  nome: string;
}

export function VideoMaquina({ video, nome }: VideoMaquinaProps) {
  if (!video) return null;

  return (
    <section id='video' className='scroll-mt-28 py-10 md:py-14'>
      <AnimatedContainer>
        <h2 className='text-lg font-bold text-white md:text-xl'>
          Veja a {nome} em operação
        </h2>
        <div className='relative mt-4 border border-dashed border-[rgba(148,178,235,0.35)] p-2'>
          <video
            controls
            preload='metadata'
            poster={video.poster}
            className='w-full'
            src={video.src}
          />
        </div>
      </AnimatedContainer>
    </section>
  );
}
```

- [ ] **Step 4: Rodar e confirmar que passa** — Expected: PASS (2 testes).

- [ ] **Step 5: Commit** — `git commit -m "feat: bloco de vídeo oculto sem asset"`

---

### Task 8: `aplicacoesProdutos` — miniaturas + expansível SEO

**Files:**
- Create: `lib/data/maquinas/categorias-produto.ts`
- Create: `app/(site)/maquinas/[slug]/_components/aplicacoesProdutos.tsx`
- Test: `app/(site)/maquinas/[slug]/_components/__tests__/aplicacoesProdutos.test.tsx`

**Interfaces:**
- Consumes: `CategoriaProduto`, `MaquinaCatalogo['aplicacoes']`; imagens de `lib/images/catalogo2026/produtos/`.
- Produces: `categoriasProdutoInfo: Record<CategoriaProduto, { rotulo: string; img: StaticImageData }>` (categorias-produto.ts); `AplicacoesProdutos({ aplicacoes }: { aplicacoes: MaquinaCatalogo['aplicacoes'] })` com âncora `id='aplicacoes'`. Lista de produtos dentro de `<details>` nativo — **conteúdo no DOM mesmo fechado** (regra SEO do docx).

- [ ] **Step 1: Criar `lib/data/maquinas/categorias-produto.ts`**

```ts
import type { StaticImageData } from 'next/image';

import imgGraos from '@/lib/images/catalogo2026/produtos/graos.png';
import imgLiquidos from '@/lib/images/catalogo2026/produtos/liquidos.png';
import imgPastosos from '@/lib/images/catalogo2026/produtos/pastosos.png';
import imgPos from '@/lib/images/catalogo2026/produtos/pos.png';
import imgSolidos from '@/lib/images/catalogo2026/produtos/solidos.png';

import type { CategoriaProduto } from './types';

export const categoriasProdutoInfo: Record<
  CategoriaProduto,
  { rotulo: string; img: StaticImageData }
> = {
  liquidos: { rotulo: 'Líquidos', img: imgLiquidos },
  pastosos: { rotulo: 'Pastosos', img: imgPastosos },
  pos: { rotulo: 'Pós', img: imgPos },
  graos: { rotulo: 'Grãos', img: imgGraos },
  solidos: { rotulo: 'Sólidos', img: imgSolidos }
};
```

- [ ] **Step 2: Teste falhando**:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';

import { AplicacoesProdutos } from '../aplicacoesProdutos';

describe('AplicacoesProdutos', () => {
  it('renderiza subtítulo (categoriaPrincipal) e uma miniatura por categoria', () => {
    render(<AplicacoesProdutos aplicacoes={piloto.aplicacoes} />);
    expect(
      screen.getByText('Líquidos, pastosos, pós, grãos e sólidos')
    ).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(5);
  });

  it('mantém os 23 produtos no DOM mesmo com o expansível fechado (SEO)', () => {
    render(<AplicacoesProdutos aplicacoes={piloto.aplicacoes} />);
    expect(screen.getByText('Ração pet')).toBeInTheDocument();
    expect(screen.getByText(/Ver produtos compatíveis \(23\)/)).toBeInTheDocument();
  });

  it('mostra só as miniaturas das categorias da máquina', () => {
    render(
      <AplicacoesProdutos
        aplicacoes={{ ...piloto.aplicacoes, categorias: ['pos'] }}
      />
    );
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByAltText(/Pós/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Rodar e confirmar falha** — Expected: FAIL.

- [ ] **Step 4: Implementar**

```tsx
import Image from 'next/image';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import type { MaquinaCatalogo } from '@/lib/data/maquinas';
import { categoriasProdutoInfo } from '@/lib/data/maquinas/categorias-produto';

export function AplicacoesProdutos({
  aplicacoes
}: {
  aplicacoes: MaquinaCatalogo['aplicacoes'];
}) {
  return (
    <section id='aplicacoes' className='scroll-mt-28 py-10 md:py-14'>
      <AnimatedContainer className='flex flex-col gap-8 md:flex-row md:items-start'>
        <div className='md:w-1/2'>
          <h2 className='text-lg font-bold text-white md:text-xl'>
            Aplicações e produtos
          </h2>
          <p className='text-muted-foreground/70 mt-1 font-mono text-xs tracking-wider'>
            {aplicacoes.categoriaPrincipal}
          </p>

          <details className='group mt-5 max-w-md border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60'>
            <summary className='text-muted-foreground flex cursor-pointer list-none items-center justify-between px-4 py-3 font-mono text-sm select-none'>
              Ver produtos compatíveis ({aplicacoes.produtos.length})
              <span className='text-accent transition-transform group-open:rotate-45'>
                ＋
              </span>
            </summary>
            <ul className='flex flex-wrap gap-2 border-t border-dashed border-[rgba(148,178,235,0.25)] p-4'>
              {aplicacoes.produtos.map((p) => (
                <li
                  key={p}
                  className='text-muted-foreground rounded-full border border-[rgba(148,178,235,0.25)] px-3 py-1 text-xs'>
                  {p}
                </li>
              ))}
            </ul>
          </details>
          <p className='text-muted-foreground/50 mt-3 max-w-md text-xs italic'>
            Exemplos editoriais, sujeitos à validação técnica com produto, volume,
            embalagem e dosador.
          </p>
        </div>

        <div className='flex flex-wrap gap-2 md:w-1/2 md:justify-end'>
          {aplicacoes.categorias.map((cat) => {
            const info = categoriasProdutoInfo[cat];
            return (
              <figure
                key={cat}
                className='relative w-[92px] overflow-hidden rounded-md border border-[rgba(148,178,235,0.2)]'>
                <Image
                  src={info.img}
                  alt={`Categoria ${info.rotulo}`}
                  className='aspect-square w-full object-cover'
                />
                <figcaption className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(3,8,20,0.92)] to-transparent px-2 pt-4 pb-1 text-[9px] font-semibold tracking-wider text-white uppercase'>
                  {info.rotulo}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </AnimatedContainer>
    </section>
  );
}
```

- [ ] **Step 5: Rodar e confirmar que passa** — Expected: PASS (3 testes).

- [ ] **Step 6: Commit** — `git commit -m "feat: bloco aplicações com expansível SEO"`

---

### Task 9: `embalagemBloco` — specs do filme + 3D com fallback

**Files:**
- Create: `app/(site)/maquinas/[slug]/_components/embalagemBloco.tsx`
- Test: `app/(site)/maquinas/[slug]/_components/__tests__/embalagemBloco.test.tsx`

**Interfaces:**
- Consumes: `MaquinaCatalogo`; `OptimizedEmbalagem3d` (`@/components/modelo3d/optimizedEmbalagem3d`, props `modelSrc`/`cameraOrbit`/`alt` — importado via `next/dynamic` com `ssr: false`, padrão do repo).
- Produces: `EmbalagemBloco({ maquina }: { maquina: MaquinaCatalogo })`, âncora `id='embalagem'`. Com `embalagem3d` → 3D; sem → `<Image>` da embalagem.

- [ ] **Step 1: Teste falhando** (mocka o componente 3D — jsdom não tem WebGL):

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';

import { EmbalagemBloco } from '../embalagemBloco';

vi.mock('next/dynamic', () => ({
  default: () =>
    function Modelo3dMock() {
      return <div data-testid='modelo-3d' />;
    }
}));

describe('EmbalagemBloco', () => {
  it('renderiza o 3D quando a máquina tem embalagem3d', () => {
    render(<EmbalagemBloco maquina={piloto} />);
    expect(screen.getByTestId('modelo-3d')).toBeInTheDocument();
  });

  it('cai para a foto quando não há glb', () => {
    render(<EmbalagemBloco maquina={{ ...piloto, embalagem3d: undefined }} />);
    expect(screen.queryByTestId('modelo-3d')).toBeNull();
    expect(screen.getByAltText(/embalagem/i)).toBeInTheDocument();
  });

  it('renderiza as specs de embalagem como pares rótulo/valor', () => {
    render(<EmbalagemBloco maquina={piloto} />);
    expect(screen.getByText('Largura do filme')).toBeInTheDocument();
    expect(screen.getByText('320 a 650 mm')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha** — Expected: FAIL.

- [ ] **Step 3: Implementar**

```tsx
'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import type { MaquinaCatalogo } from '@/lib/data/maquinas';
import { cn } from '@/lib/utils';

const OptimizedEmbalagem3d = dynamic(
  () =>
    import('@/components/modelo3d/optimizedEmbalagem3d').then((m) => ({
      default: m.OptimizedEmbalagem3d
    })),
  { ssr: false }
);

export function EmbalagemBloco({ maquina }: { maquina: MaquinaCatalogo }) {
  return (
    <section id='embalagem' className='scroll-mt-28 py-10 md:py-14'>
      <AnimatedContainer className='flex flex-col items-center gap-8 md:flex-row'>
        <div className='md:w-1/2'>
          <h2 className='text-lg font-bold text-white md:text-xl'>
            A embalagem que ela entrega
          </h2>
          <dl className='mt-4 max-w-md font-mono'>
            {maquina.specsEmbalagem.map((item) => (
              <div
                key={item.rotulo}
                className='flex items-baseline justify-between gap-4 border-b border-[rgba(148,178,235,0.15)] py-2 last:border-0'>
                <dt className='text-muted-foreground/70 text-[11px] tracking-wider uppercase'>
                  {item.rotulo}
                </dt>
                <dd className='max-w-[60%] text-right text-sm text-white'>
                  {item.valor}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className='relative w-full border border-dashed border-[rgba(148,178,235,0.35)] p-4 md:w-1/2'>
          {maquina.embalagem3d ? (
            <>
              <OptimizedEmbalagem3d
                modelSrc={maquina.embalagem3d.glb}
                cameraOrbit={maquina.embalagem3d.cameraOrbit}
                alt={`Embalagem produzida pela ${maquina.nome}`}
                className='h-64 w-full md:h-80'
              />
              <p className='text-muted-foreground/50 mt-2 text-center font-mono text-[10px]'>
                ⟲ arraste para girar o modelo 3D
              </p>
            </>
          ) : (
            <Image
              src={maquina.imagens.embalagem}
              alt={`Embalagem produzida pela ${maquina.nome}`}
              className={cn(
                'mx-auto max-h-64 w-auto object-contain md:max-h-80',
                maquina.imagens.embalagemClassName
              )}
            />
          )}
        </div>
      </AnimatedContainer>
    </section>
  );
}
```

- [ ] **Step 4: Rodar e confirmar que passa** — Expected: PASS (3 testes).

- [ ] **Step 5: Commit** — `git commit -m "feat: bloco embalagem com 3D e fallback"`

---

### Task 10: `fichaTecnica` — duas placas gêmeas + disclaimers

**Files:**
- Create: `app/(site)/maquinas/[slug]/_components/fichaTecnica.tsx`
- Test: `app/(site)/maquinas/[slug]/_components/__tests__/fichaTecnica.test.tsx`

**Interfaces:**
- Consumes: `MaquinaCatalogo`.
- Produces: `FichaTecnica({ maquina }: { maquina: MaquinaCatalogo })`, âncora `id='ficha-tecnica'`. Disclaimers obrigatórios (spec §4): o de capacidade ("A produção varia conforme produto, volume, embalagem e configuração do projeto.") e o de fonte ("Fonte: Catálogo de Máquinas Profills 2026").

- [ ] **Step 1: Teste falhando**:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';

import { FichaTecnica } from '../fichaTecnica';

describe('FichaTecnica', () => {
  it('renderiza as duas placas com todos os campos', () => {
    render(<FichaTecnica maquina={piloto} />);
    expect(screen.getByText('Máquina')).toBeInTheDocument();
    expect(screen.getByText('Embalagem')).toBeInTheDocument();
    expect(screen.getByText('Potência ativa instalada')).toBeInTheDocument();
    expect(screen.getByText('8,97 kW')).toBeInTheDocument();
    expect(screen.getByText('Materiais compatíveis')).toBeInTheDocument();
  });

  it('renderiza os dois disclaimers editoriais do docx', () => {
    render(<FichaTecnica maquina={piloto} />);
    expect(
      screen.getByText(/A produção varia conforme produto, volume, embalagem e configuração do projeto/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Fonte: Catálogo de Máquinas Profills 2026/)).toBeInTheDocument();
  });

  it('não renderiza linha para campo ausente (arrays curtos não quebram)', () => {
    render(
      <FichaTecnica
        maquina={{ ...piloto, specsMaquina: [{ rotulo: 'Comando', valor: 'CLP' }] }}
      />
    );
    expect(screen.queryByText('Potência ativa instalada')).toBeNull();
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha** — Expected: FAIL.

- [ ] **Step 3: Implementar**

```tsx
import Image from 'next/image';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import type { EspecificacaoItem, MaquinaCatalogo } from '@/lib/data/maquinas';
import { cn } from '@/lib/utils';

function PlacaSpecs({
  titulo,
  itens,
  children
}: {
  titulo: string;
  itens: EspecificacaoItem[];
  children?: React.ReactNode;
}) {
  return (
    <div className='relative flex-1 border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60 p-5'>
      <span className='text-accent/60 absolute -top-2 -left-1 font-mono text-xs'>+</span>
      <h3 className='flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-white uppercase'>
        <span className='bg-accent inline-block h-1.5 w-1.5' />
        {titulo}
      </h3>
      <dl className='mt-3 font-mono'>
        {itens.map((item) => (
          <div
            key={item.rotulo}
            className='flex items-baseline justify-between gap-4 border-b border-[rgba(148,178,235,0.12)] py-2 last:border-0'>
            <dt className='text-muted-foreground/70 text-[11px] tracking-wider uppercase'>
              {item.rotulo}
            </dt>
            <dd className='max-w-[60%] text-right text-sm text-white'>{item.valor}</dd>
          </div>
        ))}
      </dl>
      {children}
    </div>
  );
}

export function FichaTecnica({ maquina }: { maquina: MaquinaCatalogo }) {
  return (
    <section id='ficha-tecnica' className='scroll-mt-28 py-10 md:py-14'>
      <AnimatedContainer>
        <h2 className='text-lg font-bold text-white md:text-xl'>Ficha técnica</h2>
        <p className='text-muted-foreground/70 mt-1 font-mono text-xs tracking-wider'>
          Fonte: Catálogo de Máquinas Profills 2026
        </p>

        <div className='mt-5 flex flex-col gap-4 md:flex-row'>
          <PlacaSpecs titulo='Máquina' itens={maquina.specsMaquina} />
          <PlacaSpecs titulo='Embalagem' itens={maquina.specsEmbalagem}>
            <Image
              src={maquina.imagens.embalagem}
              alt={`Embalagem da ${maquina.nome}`}
              className={cn(
                'mx-auto mt-4 max-h-28 w-auto object-contain',
                maquina.imagens.embalagemClassName
              )}
            />
          </PlacaSpecs>
        </div>

        <p className='text-muted-foreground/50 mt-3 text-xs italic'>
          Valores máximos de referência. A produção varia conforme produto, volume,
          embalagem e configuração do projeto.
        </p>
      </AnimatedContainer>
    </section>
  );
}
```

- [ ] **Step 4: Rodar e confirmar que passa** — Expected: PASS (3 testes).

- [ ] **Step 5: Commit** — `git commit -m "feat: ficha técnica em placas gêmeas"`

---

### Task 11: CTAs — modal adaptado + WhatsApp + `conversao`

**Files:**
- Create: `lib/utils/whatsapp.ts`
- Test: `lib/utils/whatsapp.test.ts`
- Modify: `app/(site)/maquinas/[slug]/_components/specificationModal.tsx` (props desacopladas + copy nova)
- Create: `app/(site)/maquinas/[slug]/_components/conversao.tsx`
- Test: `app/(site)/maquinas/[slug]/_components/__tests__/conversao.test.tsx`

**Interfaces:**
- Consumes: modal existente (form + `POST /api/specifications` — **API e schema zod não mudam nesta fase**; payload continua `{ maquinaId: number, maquinaNome: string, ... }`).
- Produces: `waLink(numero: string, mensagem: string): string` e `WHATSAPP_VENDAS = '5541997851998'` (whatsapp.ts); `SpecificationModal({ maquinaId, maquinaNome, triggerClassName }: { maquinaId: number; maquinaNome: string; triggerClassName?: string })`; `Conversao({ maquina }: { maquina: MaquinaCatalogo })` com âncora `id='contato'`.
- Nota: o piloto tem `legacyId: 16` → `maquinaId={maquina.legacyId ?? 0}`. O schema exige `min(1)`; as 3 máquinas sem legacyId só entram na fase 2, e a migração do payload para slug é fase 3 — registrar num TODO no código.

- [ ] **Step 1: Teste falhando de `waLink`** — `lib/utils/whatsapp.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { waLink, WHATSAPP_VENDAS } from './whatsapp';

describe('waLink', () => {
  it('monta URL do wa.me com mensagem URL-encoded', () => {
    expect(waLink(WHATSAPP_VENDAS, 'Olá, tenho interesse')).toBe(
      'https://wa.me/5541997851998?text=Ol%C3%A1%2C%20tenho%20interesse'
    );
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha** — Expected: FAIL.

- [ ] **Step 3: Criar `lib/utils/whatsapp.ts`** (mesma lógica do footer — unificação do footer fica para a fase 4):

```ts
export const WHATSAPP_VENDAS = '5541997851998';

export function waLink(numero: string, mensagem: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
```

- [ ] **Step 4: Rodar e confirmar que passa** — Expected: PASS.

- [ ] **Step 5: Adaptar o `specificationModal.tsx`** — mudanças cirúrgicas, sem tocar no form:

1. Trocar a interface e o header do componente:

```tsx
interface SpecificationModalProps {
  maquinaId: number;
  maquinaNome: string;
  triggerClassName?: string;
}

export default function SpecificationModal({
  maquinaId,
  maquinaNome,
  triggerClassName
}: SpecificationModalProps) {
```

2. Remover o import `MaquinaData` de `maquinasData` e usar `defaultValues: { maquinaId, maquinaNome }`.
3. Substituir `{maquina.name}` por `{maquinaNome}` na `DialogDescription`.
4. Copy e cor do trigger (CTA primário accent, não emerald — decisão de design; spec §3):

```tsx
<DialogTrigger asChild>
  <Button
    className={cn(
      'bg-accent hover:bg-accent/85 rounded-xs px-6 py-5 font-semibold text-white',
      triggerClassName
    )}>
    Solicitar proposta técnica e comercial
  </Button>
</DialogTrigger>
```

5. Títulos do dialog: "Solicitar proposta técnica e comercial" / descrição "Preencha os dados abaixo para receber a proposta da máquina {maquinaNome}". Botão submit: "Enviar solicitação".

- [ ] **Step 6: Teste falhando da `Conversao`** — `__tests__/conversao.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';

import { Conversao } from '../conversao';

describe('Conversao', () => {
  it('tem o CTA de proposta e o link de especialista no WhatsApp', () => {
    render(<Conversao maquina={piloto} />);
    expect(
      screen.getByRole('button', { name: /Solicitar proposta técnica e comercial/i })
    ).toBeInTheDocument();
    const wa = screen.getByRole('link', { name: /Falar com um especialista/i });
    expect(wa).toHaveAttribute('href', expect.stringContaining('wa.me/5541997851998'));
    expect(wa.getAttribute('href')).toContain(encodeURIComponent('Linha Pouch Speed'));
  });

  it('não renderiza nenhum link para montar-maquina (CTA proibido)', () => {
    const { container } = render(<Conversao maquina={piloto} />);
    expect(container.querySelector('a[href*="montar-maquina"]')).toBeNull();
  });
});
```

- [ ] **Step 7: Rodar e confirmar falha** — Expected: FAIL.

- [ ] **Step 8: Implementar `conversao.tsx`**

```tsx
import { AnimatedContainer } from '@/components/AnimatedContainer';
import type { MaquinaCatalogo } from '@/lib/data/maquinas';
import { waLink, WHATSAPP_VENDAS } from '@/lib/utils/whatsapp';

import SpecificationModal from './specificationModal';

export function Conversao({ maquina }: { maquina: MaquinaCatalogo }) {
  const mensagem = `Olá! Tenho interesse na ${maquina.nome} (${maquina.nomeCompleto}).`;

  return (
    <section id='contato' className='scroll-mt-28 py-12 text-center md:py-16'>
      <AnimatedContainer>
        <h2 className='text-xl font-bold text-white md:text-2xl'>
          Pronto para dimensionar a {maquina.nome} na sua operação?
        </h2>
        <p className='text-muted-foreground mt-2'>
          Fale com o time técnico-comercial da Profills.
        </p>
        <div className='mt-6 flex flex-wrap items-center justify-center gap-3'>
          <SpecificationModal
            maquinaId={maquina.legacyId ?? 0}
            maquinaNome={maquina.nome}
          />
          <a
            href={waLink(WHATSAPP_VENDAS, mensagem)}
            target='_blank'
            rel='noopener noreferrer'
            className='text-muted-foreground hover:text-foreground rounded-xs border border-[rgba(148,178,235,0.4)] px-6 py-3 font-semibold transition-colors'>
            Falar com um especialista
          </a>
        </div>
      </AnimatedContainer>
    </section>
  );
}
```

- [ ] **Step 9: Rodar e confirmar que passa** — `bun run test` (suíte inteira — o modal mudou de props; nada mais o importa nesta fase). Expected: PASS.

- [ ] **Step 10: Commit** — `git commit -m "feat: bloco conversão com modal e WhatsApp"`

---

### Task 12: `relacionadas` — algoritmo + bloco

**Files:**
- Create: `lib/data/maquinas/relacionadas.ts`
- Test: `lib/data/maquinas/relacionadas.test.ts`
- Create: `app/(site)/maquinas/[slug]/_components/relacionadas.tsx`
- Test: `app/(site)/maquinas/[slug]/_components/__tests__/relacionadas.test.tsx`

**Interfaces:**
- Consumes: `MaquinaCatalogo`, `maquinasCatalogo`.
- Produces: `getMaquinasRelacionadas(maquina: MaquinaCatalogo, todas: MaquinaCatalogo[], limite?: number): MaquinaCatalogo[]` (algoritmo do spec §3.9); `Relacionadas({ maquina }: { maquina: MaquinaCatalogo })` — some quando não há relacionadas (caso do piloto na fase 0).

- [ ] **Step 1: Teste falhando do algoritmo** — `lib/data/maquinas/relacionadas.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { envasadoraStandUpPouchSpeed as piloto } from './envasadora-stand-up-pouch-speed';
import { getMaquinasRelacionadas } from './relacionadas';
import type { MaquinaCatalogo } from './types';

// Fixture mínima: só os campos que o algoritmo lê importam para o teste.
function fixture(overrides: Partial<MaquinaCatalogo>): MaquinaCatalogo {
  return { ...piloto, ...overrides } as MaquinaCatalogo;
}

const mesmaCateg1 = fixture({ slug: 'a', capacidadeMaxima: 5400, embalagensCompativeis: ['Pouch'] });
const mesmaCateg2 = fixture({ slug: 'b', capacidadeMaxima: 900, embalagensCompativeis: ['Pouch'] });
const outraCategComEmbalagem = fixture({
  slug: 'c',
  categoria: 'Embalagens flexíveis',
  embalagensCompativeis: ['Pouch', 'Sachê']
});
const semRelacao = fixture({
  slug: 'd',
  categoria: 'Fim de linha',
  embalagensCompativeis: ['Fardo']
});

describe('getMaquinasRelacionadas', () => {
  it('exclui a própria máquina e prioriza mesma categoria por proximidade de capacidade', () => {
    const resultado = getMaquinasRelacionadas(piloto, [
      piloto, mesmaCateg2, mesmaCateg1, outraCategComEmbalagem, semRelacao
    ]);
    expect(resultado.map((m) => m.slug)).toEqual(['a', 'b', 'c']);
  });

  it('retorna vazio quando só existe a própria máquina', () => {
    expect(getMaquinasRelacionadas(piloto, [piloto])).toEqual([]);
  });

  it('ignora o critério de capacidade quando um lado não tem o valor', () => {
    const semCapacidade = fixture({ slug: 'e', capacidadeMaxima: undefined });
    const resultado = getMaquinasRelacionadas(piloto, [piloto, semCapacidade]);
    expect(resultado.map((m) => m.slug)).toEqual(['e']);
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha** — Expected: FAIL.

- [ ] **Step 3: Implementar `relacionadas.ts`**

```ts
import type { MaquinaCatalogo } from './types';

function intersecao(a: string[], b: string[]) {
  return a.filter((x) => b.includes(x)).length;
}

function difRelativaCapacidade(a?: number, b?: number) {
  if (!a || !b) return 0; // critério ignorado quando um lado não tem valor
  return Math.abs(a - b) / Math.max(a, b);
}

/**
 * Algoritmo do spec §3.9: mesma categoria primeiro (ranking por embalagens em
 * comum, desempate por menor diferença relativa de capacidade); completa com
 * máquinas de outras categorias que compartilham embalagem.
 */
export function getMaquinasRelacionadas(
  maquina: MaquinaCatalogo,
  todas: MaquinaCatalogo[],
  limite = 3
): MaquinaCatalogo[] {
  const candidatas = todas.filter((m) => m.slug !== maquina.slug);

  const pontuar = (m: MaquinaCatalogo) => ({
    maquina: m,
    embalagens: intersecao(m.embalagensCompativeis, maquina.embalagensCompativeis),
    capacidade: difRelativaCapacidade(m.capacidadeMaxima, maquina.capacidadeMaxima)
  });

  const ordenar = (lista: ReturnType<typeof pontuar>[]) =>
    lista
      .sort((a, b) => b.embalagens - a.embalagens || a.capacidade - b.capacidade)
      .map((x) => x.maquina);

  const mesmaCategoria = ordenar(
    candidatas.filter((m) => m.categoria === maquina.categoria).map(pontuar)
  );
  const outras = ordenar(
    candidatas
      .filter((m) => m.categoria !== maquina.categoria)
      .map(pontuar)
      .filter((x) => x.embalagens > 0)
  );

  return [...mesmaCategoria, ...outras].slice(0, limite);
}
```

- [ ] **Step 4: Rodar e confirmar que passa** — Expected: PASS (3 testes).

- [ ] **Step 5: Teste falhando do componente** — `__tests__/relacionadas.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';

import { Relacionadas } from '../relacionadas';

describe('Relacionadas', () => {
  it('não renderiza nada quando o registry só tem a própria máquina (fase 0)', () => {
    const { container } = render(<Relacionadas maquina={piloto} />);
    expect(container.innerHTML).toBe('');
  });
});
```

- [ ] **Step 6: Rodar e confirmar falha** — Expected: FAIL.

- [ ] **Step 7: Implementar `relacionadas.tsx`**

```tsx
import Image from 'next/image';
import Link from 'next/link';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import { maquinasCatalogo, type MaquinaCatalogo } from '@/lib/data/maquinas';
import { getMaquinasRelacionadas } from '@/lib/data/maquinas/relacionadas';

export function Relacionadas({ maquina }: { maquina: MaquinaCatalogo }) {
  const relacionadas = getMaquinasRelacionadas(maquina, maquinasCatalogo);
  if (relacionadas.length === 0) return null;

  return (
    <section className='border-t border-dashed border-[rgba(148,178,235,0.18)] py-10 md:py-14'>
      <AnimatedContainer>
        <h2 className='text-base font-bold text-white'>Máquinas relacionadas</h2>
        <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
          {relacionadas.map((m) => (
            <Link
              key={m.slug}
              href={`/maquinas/${m.slug}`}
              className='group relative border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60 p-4 text-center transition-colors hover:border-[rgba(148,178,235,0.6)]'>
              <Image
                src={m.imagens.maquina}
                alt={m.nomeCompleto}
                className='mx-auto h-28 w-auto object-contain'
              />
              <p className='mt-2 text-sm font-semibold text-white'>{m.nome}</p>
              {m.capacidadeMaxima && (
                <p className='text-muted-foreground/70 font-mono text-xs'>
                  até {m.capacidadeMaxima.toLocaleString('pt-BR')} un/h
                </p>
              )}
            </Link>
          ))}
        </div>
      </AnimatedContainer>
    </section>
  );
}
```

- [ ] **Step 8: Rodar e confirmar que passa** — Expected: PASS.

- [ ] **Step 9: Commit** — `git commit -m "feat: máquinas relacionadas com ranking"`

---

### Task 13: Montagem final da página + verificação no browser

**Files:**
- Modify: `app/(site)/maquinas/[slug]/page.tsx` (troca o esqueleto pela composição completa)
- Modify: `app/(site)/maquinas/[slug]/__tests__/page.test.tsx` (asserções de composição)

**Interfaces:**
- Consumes: todos os componentes das Tasks 4–12.
- Produces: página completa do template padrão.

- [ ] **Step 1: Ampliar o teste da página** — adicionar ao `page.test.tsx` (manter os 4 testes existentes; mock do `next/dynamic` igual ao da Task 9 para o bloco 3D):

```tsx
it('compõe os blocos na ordem do spec com âncoras derivadas', async () => {
  const { container } = render(await MaquinaPage({ params: paramsDoPiloto }));
  const ids = [...container.querySelectorAll('section[id], nav')].map(
    (el) => el.id || el.tagName.toLowerCase()
  );
  // nav (sub-nav) → hero (section sem id) → visao-geral → aplicacoes → embalagem → ficha-tecnica → contato
  expect(ids).toContain('visao-geral');
  expect(ids).toContain('aplicacoes');
  expect(ids).toContain('embalagem');
  expect(ids).toContain('ficha-tecnica');
  expect(ids).toContain('contato');
  expect(container.querySelector('#video')).toBeNull(); // piloto sem vídeo
});
```

- [ ] **Step 2: Rodar e confirmar falha** — Expected: FAIL (esqueleto não tem os blocos).

- [ ] **Step 3: Compor a página** — corpo final do `MaquinaPage`:

```tsx
export default async function MaquinaPage({ params }: MaquinaPageProps) {
  const { slug } = await params;
  const maquina = getMaquinaBySlug(slug);
  if (!maquina) notFound();

  const secoes = [
    { id: 'visao-geral', rotulo: 'Visão geral' },
    ...(maquina.tipoPagina === 'padrao'
      ? [
          { id: 'aplicacoes', rotulo: 'Aplicações' },
          { id: 'embalagem', rotulo: 'Embalagem' },
          { id: 'ficha-tecnica', rotulo: 'Ficha técnica' }
        ]
      : []),
    { id: 'contato', rotulo: 'Contato' }
  ];

  return (
    <div className='tema-navy bg-background text-foreground relative min-h-screen w-full pt-16'>
      <GridPattern />
      <div className='relative z-10'>
        <SubNavMaquina nome={maquina.nome} secoes={secoes}>
          <SpecificationModal
            maquinaId={maquina.legacyId ?? 0}
            maquinaNome={maquina.nome}
            triggerClassName='px-3 py-1.5 text-xs'
          />
        </SubNavMaquina>

        <div className='mx-auto w-full max-w-7xl px-4 md:px-8'>
          <HeroDossie maquina={maquina}>
            <SpecificationModal
              maquinaId={maquina.legacyId ?? 0}
              maquinaNome={maquina.nome}
            />
            <a
              href={waLink(WHATSAPP_VENDAS, `Olá! Tenho interesse na ${maquina.nome}.`)}
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-foreground rounded-xs border border-[rgba(148,178,235,0.4)] px-5 py-2.5 text-sm font-semibold transition-colors'>
              Falar com um especialista
            </a>
            {maquina.video && (
              <a href='#video' className='text-accent px-2 py-2.5 text-sm font-mono'>
                ▶ Ver máquina em operação
              </a>
            )}
          </HeroDossie>
          <VisaoGeral maquina={maquina} />
          <VideoMaquina video={maquina.video} nome={maquina.nome} />
          {maquina.tipoPagina === 'padrao' && (
            <>
              <AplicacoesProdutos aplicacoes={maquina.aplicacoes} />
              <EmbalagemBloco maquina={maquina} />
              <FichaTecnica maquina={maquina} />
            </>
          )}
          <Conversao maquina={maquina} />
          <Relacionadas maquina={maquina} />
        </div>
      </div>
    </div>
  );
}
```

Imports novos no topo: `SubNavMaquina`, `HeroDossie`, `VisaoGeral`, `VideoMaquina`, `AplicacoesProdutos`, `EmbalagemBloco`, `FichaTecnica`, `Conversao`, `Relacionadas`, `SpecificationModal`, `waLink`/`WHATSAPP_VENDAS`. (Nota: o template variante engenharia — bloco Escopo com `conteudoEngenharia` — é fase 2; o `tipoPagina === 'padrao'` acima já deixa o encaixe pronto.)

- [ ] **Step 4: Rodar a suíte inteira** — `bun run test` — Expected: PASS.

- [ ] **Step 5: Rodar lint e build**

Run: `bun run lint && bun run build`
Expected: sem erros. `generateStaticParams` deve pré-gerar `/maquinas/envasadora-stand-up-pouch-speed`.

- [ ] **Step 6: Verificação funcional no browser** (dev server da sessão está na porta 3003 — ver `/tmp/dev-up-3003.state`):

1. `http://localhost:3003/maquinas/envasadora-stand-up-pouch-speed` → página completa, 3D do pouch girando, expansível abre/fecha, âncoras rolam.
2. `http://localhost:3003/maquinas/16` → redireciona para o slug.
3. `http://localhost:3003/maquinas/18` → redireciona para `/maquinas`.
4. `http://localhost:3003/maquinas/nao-existe` → 404.
5. Console do browser sem erros; `<title>` = "Envasadora Stand-Up Pouch Speed | Profills".
6. Mobile (responsivo ~390px): sub-nav com scroll horizontal, hero empilhado, placas empilhadas.

- [ ] **Step 7: Commit**

```bash
git add -A "app/(site)/maquinas/[slug]"
git commit -m "feat: composição final da página de máquina"
```

**Após a Task 13:** parar e reportar para revisão visual do usuário (QA perceptual contra o mockup `pagina-completa-v3.html` — "pronto" exige as 3 provas: funcional, perceptual e dados). Fases 1–5 do spec §11 ganham planos próprios depois da aprovação do piloto.
