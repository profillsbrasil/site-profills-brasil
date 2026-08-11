# Impeccable Design Context — Profills Brasil

## Design Context

### Users
Donos de fábricas e indústrias de todos os portes (pequenas, médias e grandes) que buscam máquinas envasadoras, embaladoras, enfardadeiras e envolvedoras para produtos líquidos, pastosos e sólidos. Acessam o site tanto em desktop (escritório) quanto mobile (chão de fábrica). O job-to-be-done é encontrar a solução certa de maquinário, entender capacidades técnicas, solicitar orçamentos e montar sua linha de produção.

### Brand Personality
- **Voz:** Direta, técnica e acessível — sem jargão desnecessário, mas com autoridade industrial
- **Tom:** Profissional e confiante, com toques de modernidade tecnológica
- **3 palavras:** Confiável, Eficiente, Moderna
- **Emoções-alvo:** Confiança/solidez + sensação de futuro/inovação

### Aesthetic Direction
- **Tom visual:** Industrial premium — limpo, tecnológico, com presença forte. Não minimalista demais, mas sem excesso decorativo
- **Tema:** Home em navy blueprint ("A Prancheta Industrial" — ver DESIGN.md) com navbar/footer navy em todo o site; páginas internas (catálogo, formulários) em light mode
- **Anti-referências:** Nada que pareça amador, genérico ou artesanal. Evitar estética "template gratuito"
- **Paleta base:**
  - **Primary/Foreground:** Dark navy (~oklch 0.21 0.002 286) — textos e elementos principais
  - **Accent:** Azul vibrante (~oklch 0.62 0.19 260) — CTAs, destaques, ícones
  - **Secondary:** Azul escuro profundo (~oklch 0.21 0.04 266) — navbar, footer, hero sections
  - **Superfícies escuras:** Slate-800/900 para seções de contraste
  - **Detalhes contextuais:** Cyan, emerald, orange para diferenciação funcional (vendas, suporte, compras)
  - **Background claro:** Branco com variações sutis de stone/neutral
- **Tipografia:** Geist Sans (corpo) / Geist Mono (dados técnicos) — moderna, geométrica, boa legibilidade
- **Componentes:** shadcn/ui (estilo New York, base Stone) com Radix UI primitives
- **Animações:** Framer Motion para transições, Three.js/model-viewer para modelos 3D de produtos

### Design Principles

1. **Credibilidade industrial** — Cada elemento deve reforçar que a Profills é uma empresa séria e estabelecida. Espaçamento generoso, tipografia firme, imagens de alta qualidade. Nada improvisado.

2. **Clareza técnica** — Informações de produto (specs, categorias, capacidades) devem ser fáceis de encontrar e comparar. Hierarquia visual clara. O usuário industrial não tem tempo para decifrar interfaces confusas.

3. **Modernidade com propósito** — Animações, 3D e efeitos visuais existem para demonstrar capacidade tecnológica, não como decoração. Cada interação sofisticada deve servir ao entendimento do produto ou reforçar o posicionamento de inovação.

4. **Consistência robusta** — Design system coeso usando tokens CSS, componentes shadcn/ui e padrões repetíveis. Seções escuras (slate-900 com grid pattern) para hero/navbar/footer, seções claras para conteúdo. Accent azul como fio condutor.

5. **Performance primeiro** — O público acessa de contextos variados (escritório, fábrica, celular). Otimizar carregamento, lazy loading de modelos 3D e vídeos, responsividade real — não apenas "funciona no mobile", mas "funciona bem no mobile".
