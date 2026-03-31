# Hero Card Showcase Rotativo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a lista estática de produtos no card esquerdo da HeroSection por um showcase rotativo com slide lateral, auto-rotação e dots clicáveis.

**Architecture:** Um único componente interno `HeroShowcase` é adicionado ao arquivo `scrollExpansionHero.tsx`. Ele usa `AnimatePresence` + `motion.div` para a transição e `useState`/`useEffect` para o estado do slide ativo e auto-rotação. `HeroTextContent` é simplificado para renderizar `<HeroShowcase />` no lugar da lista `CircleCheckBig`.

**Tech Stack:** Next.js 15, React 19, `motion/react` (já instalado), Tailwind CSS v4.

---

### Task 1: Implementar `HeroShowcase` e atualizar `HeroTextContent`

**Files:**
- Modify: `app/(home)/_components/scrollExpansionHero.tsx`

> **Nota sobre testes:** Este é um componente puramente visual. A verificação é feita manualmente no browser (ver checklist no final da task). Não há lógica de negócio isolável para unit test.

- [ ] **Step 1: Adicionar `AnimatePresence` ao import de `motion/react`**

Em `app/(home)/_components/scrollExpansionHero.tsx`, linha 29, alterar:

```tsx
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform
} from 'motion/react';
```

Para:

```tsx
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform
} from 'motion/react';
```

- [ ] **Step 2: Adicionar a constante `SLIDES` antes da função `HeroTextContent`**

Logo antes da função `HeroTextContent` (atualmente na linha 229), inserir:

```tsx
const SLIDES = [
  { title: 'Máquinas Envasadoras', desc: 'Linha completa para sua linha de produção' },
  { title: 'Peças e Componentes',  desc: 'Reposição rápida com peças originais' },
  { title: 'Consultoria Técnica',  desc: 'Especialistas prontos para apoiar seu negócio' },
  { title: 'E muito mais!',        desc: 'Soluções completas para toda sua empresa' },
];
```

- [ ] **Step 3: Adicionar o componente `HeroShowcase` logo após a constante `SLIDES`**

```tsx
function HeroShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoRotate = () => {
    if (intervalRef.current) return; // evita intervalos duplicados
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 3500);
  };

  const stopAutoRotate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoRotate();
    return () => stopAutoRotate();
  }, []);

  return (
    <div
      className='mt-6 w-full'
      onMouseEnter={stopAutoRotate}
      onMouseLeave={startAutoRotate}
    >
      {/* Separador com gradient accent */}
      <div className='mb-4 h-px bg-linear-to-r from-accent/40 to-transparent' />

      {/* Slide com transição lateral */}
      <div className='relative min-h-[54px]'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeIndex}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className='flex items-start gap-3'
          >
            {/* Barra vertical accent */}
            <div className='mt-[3px] h-[50px] w-[3px] flex-shrink-0 rounded-full bg-linear-to-b from-accent to-accent/10' />
            <div>
              <p className='text-[15px] font-bold text-secondary-foreground'>
                {SLIDES[activeIndex].title}
              </p>
              <p className='mt-1 text-[12px] leading-relaxed text-secondary-foreground/50'>
                {SLIDES[activeIndex].desc}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots de navegação */}
      <div className='mt-3 flex items-center gap-[5px]'>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              stopAutoRotate();
              setActiveIndex(i);
              startAutoRotate();
            }}
            className={`h-[3px] rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'w-[22px] bg-accent'
                : 'w-[6px] bg-white/20'
            }`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Substituir `HeroTextContent` pela versão simplificada**

Substituir a função `HeroTextContent` atual (linhas 229–255) por:

```tsx
function HeroTextContent() {
  return (
    <div className='relative flex h-full w-full flex-col justify-center font-bold'>
      <h1 className='text-4xl leading-tight tracking-tight text-secondary-foreground select-none md:text-5xl'>
        Tudo Para Seu Negócio!
      </h1>
      <h2 className='mt-1 text-lg text-accent md:text-xl'>Inovação a cada embalagem</h2>
      <HeroShowcase />
    </div>
  );
}
```

- [ ] **Step 5: Verificar no browser**

```bash
npm run dev
```

Abrir `http://localhost:3000` e confirmar:

1. Os slides trocam automaticamente a cada ~3,5s
2. Clicar nos dots navega para o slide correspondente
3. Hoverar o card pausa a auto-rotação (o slide para de trocar)
4. Rolar a página: o card continua saindo para a esquerda normalmente
5. A versão mobile (`MobileHero`) não foi alterada — verificar que ainda funciona em viewport < 768px

- [ ] **Step 6: Commit**

```bash
git add app/(home)/_components/scrollExpansionHero.tsx
git commit -m "feat: substituir lista estática por showcase rotativo no hero card"
```
