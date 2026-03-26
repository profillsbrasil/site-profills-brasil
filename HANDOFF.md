# Handoff — Melhorias de Animações & UX — Profills Brasil

## 📅 Data: 26/03/2026

---

## ✅ O que foi feito

### Fase 0 — Setup
- Criado `.impeccable.md` com Design Context completo (usuários, marca, estética, princípios)
- Configurado MagicUI MCP para **Amp**, **Codex** e **OpenCode**

### Fase 1 — Correções Críticas
- `lang="en"` → `lang="pt-BR"` no layout
- Typos corrigidos: "Evasadoreas" → "Envasadoras", "Acreditamo...comeca" → "Acreditamos...começa", "Marcearia" → "Mercearia"
- Espaçamento padronizado: todas seções com `py-10`
- Borders padronizadas: removido `border-dashed` inconsistente
- Título "Nossas Embalagens" agora visível no mobile
- Limpeza de classes CSS duplicadas (espaços extras)

### Fase 2 — Navbar (Desktop + Mobile)
- **Desktop**: Glassmorphism on scroll (`backdrop-blur-xl`, transparência, shadow)
- **Mobile**: Stagger animation com `BlurFade` nos links do drawer
- **Mobile**: Hover melhorado com borda lateral azul nos links
- **Ambos**: Transições de `duration-100` → `duration-200`

### Fase 3 — Hero Performance Fix (CRÍTICO)
- **Eliminado travamento**: Substituído sistema manual de `wheel/touch preventDefault` + `setState` por `useScroll`/`useTransform` do Framer Motion (GPU-accelerated, zero re-renders)
- **Arquitetura**: Sticky container `300vh` com scroll nativo
- **Background**: Layer crossfade (dark → white) em vez de cálculos `rgb()` inline
- **Vídeo**: Sempre renderizado com `preload='auto'`
- **Cards**: `visibility: hidden` via state quando completamente faded (resolve model-viewer web component)
- **Acessibilidade**: `useReducedMotion()` com versão estática
- **Resultado**: ~485 linhas → ~230 linhas, 6 states → 2 states

### Fase 4 — Seções da Home
- **TextAnimate** (`blurInUp` por palavra) em todos os títulos de seção:
  - GT-3000, CTA Ajudar Empresa, Máquinas em Destaque, Nossas Embalagens, Serviços Personalizados, Monte sua Fábrica, Carrossel Produtos
- **BlurFade** com stagger nos cards "Como ajudar sua empresa" e CTA "Monte sua fábrica"
- **Hover** melhorado nos cards de embalagens 3D (`hover:-translate-y-1`)

### Fase 5 — Footer
- **BlurFade** no logo/descrição, cards de contato (staggered 0.2/0.3/0.4), e social links

---

## 🔧 Componentes MagicUI instalados
- `@/components/ui/blur-fade` — Fade com blur (usado em navbar mobile, seções, footer)
- `@/components/ui/text-animate` — Animação de texto por palavra/caractere (usado em títulos)

---

## ⚠️ Pendências / Melhorias futuras

### Bug pré-existente (não introduzido por nós)
- `app/maquinas/[maquinaId]/page.tsx` — Erro de tipo: `MaquinaPageProps` não satisfaz `PageProps` (Next.js 15 async params)

### Possíveis melhorias adicionais
1. **Hero mobile** — Poderia ter animações de entrada com BlurFade nos textos e modelo 3D
2. **Carrossel de produtos** — Está `hidden` no mobile (`hidden md:flex`), considerar versão mobile
3. **ShineBorder** (MagicUI) — Poderia ser adicionado nos botões CTA para efeito premium
4. **Páginas internas** — `/sobre`, `/maquinas`, `/projetos` não foram tocadas
5. **Lighthouse audit** — Rodar performance check após deploy
6. **3D model optimization** — Se performance ainda for issue em devices fracos, considerar poster/image fallback

### Arquivos principais modificados
```
app/layout.tsx                                    — lang pt-BR
app/(home)/page.tsx                               — sem mudanças
app/(home)/_components/scrollExpansionHero.tsx     — refatoração completa (hero)
app/(home)/_components/gt3000.tsx                  — TextAnimate + BlurFade
app/(home)/_components/ctaAjudarEmpresa.tsx        — TextAnimate + BlurFade stagger
app/(home)/_components/ctaMonteSuaFabrica.tsx       — TextAnimate + BlurFade
app/(home)/_components/carrosselProdutos.tsx        — TextAnimate
app/(home)/_components/listaEmbalagens.tsx          — TextAnimate + hover cards
app/(home)/_components/servicosPersonalizados.tsx   — TextAnimate
app/(home)/_components/maquinas-destaque/
  maquinasDestaque.tsx                             — TextAnimate
components/layout/navbarDesktop.tsx                — glassmorphism on scroll
components/layout/navbarMobile.tsx                 — BlurFade stagger + hover
components/layout/customNavigationMenu.tsx         — transições mais suaves
components/layout/footer.tsx                       — BlurFade stagger
components/ui/blur-fade.tsx                        — componente MagicUI (novo)
components/ui/text-animate.tsx                     — componente MagicUI (novo)
.impeccable.md                                     — design context (novo)
```

### Configurações MCP adicionadas
```
~/.config/amp/settings.json          — magicuidesign-mcp
~/.codex/config.toml                 — magicuidesign-mcp
~/.config/opencode/opencode.json     — magicuidesign-mcp
```
