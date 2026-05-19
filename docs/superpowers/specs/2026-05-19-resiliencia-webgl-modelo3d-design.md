# Resiliência de WebGL nos modelos 3D

**Data:** 2026-05-19
**Status:** Aprovado para planejamento

## Contexto

O site usa `@google/model-viewer` (que depende de `three.js`/WebGL) para exibir
modelos 3D de embalagens. Em ambientes sem aceleração de GPU/WebGL, o dev server
encaminha para o terminal uma cascata de erros:

```
THREE.WebGLRenderer: A WebGL context could not be created.
  Sandboxed = yes, GL_VENDOR = Disabled, VENDOR = 0xffff
unhandledRejection: TypeError: Cannot read properties of null (reading 'isPresenting')
```

### Cadeia causal

1. O navegador não consegue criar um contexto WebGL (GPU desabilitada/bloqueada).
2. O `THREE.WebGLRenderer` instanciado pelo `<model-viewer>` fica `null`.
3. O loop de render / código WebXR do model-viewer continua lendo
   `renderer.xr.isPresenting` num objeto `null`, disparando uma promise
   rejeitada não tratada — repetida por instância/frame.
4. O `onError` do `<model-viewer>` **não** captura isso, pois é uma rejection
   interna do three.js, fora do ciclo de erro do custom element.

Hoje não há detecção de capacidade WebGL. Qualquer visitante sem WebGL
(GPU bloqueada, dispositivo low-end) vê o mesmo crash. Pior: como nenhum caller
passa `posterSrc`, o `CaixaHome3d` exibe um spinner "Carregando modelo 3D..."
que **gira indefinidamente**.

## Objetivo

Tornar os componentes 3D resilientes: detectar a ausência de WebGL e degradar
graciosamente para um fallback estático, eliminando os erros na raiz — sem
mascarar falhas com try/catch silencioso.

## Decisões de design

- **Fallback:** placeholder estilizado com ícone + mensagem
  "Visualização 3D indisponível neste dispositivo". Estado terminal, sem
  animação de loading. Sem necessidade de gerar assets.
- **Escopo extra:** corrigir também o aviso de LCP do logo (above the fold).

## Arquitetura

### 1. Util de detecção — `isWebGLAvailable()`

Novo arquivo (ex.: `components/modelo3d/hooks/webglSupport.ts`).

- Cria um `<canvas>` descartável e tenta `getContext('webgl2')` e, em fallback,
  `getContext('webgl')`.
- Retorna `boolean`. Resultado memoizado em módulo (executa uma vez por sessão).
- SSR-safe: se `typeof window === 'undefined'`, assume `true` (otimista; a
  reavaliação real ocorre no client). A detecção definitiva roda em `useEffect`.

### 2. `useOptimized3DModel` — novo estado `webglSupported`

- Em `useEffect` (client-only), define `webglSupported: boolean | null`
  (`null` = ainda não verificado).
- A `useEffect` que importa `@google/model-viewer` (linha ~96) passa a só
  executar quando `webglSupported === true`. Se `false`, **não importa a lib**
  e **nunca renderiza** `<model-viewer>`.
- O hook expõe `webglSupported` no retorno para os componentes.

### 3. Componentes — três estados explícitos

`CaixaHome3d` e `OptimizedEmbalagem3d` passam a tratar:

| Estado            | Condição                              | Render                          |
|-------------------|---------------------------------------|---------------------------------|
| Carregando        | `webglSupported !== false && !isLoaded`| spinner / placeholder atual     |
| Carregado         | `isLoaded`                            | `<model-viewer>`                |
| **Indisponível**  | `webglSupported === false`            | placeholder de fallback novo    |

- O `<model-viewer>` só renderiza com `webglSupported === true`.
- Novo placeholder de fallback (componente compartilhado, ex.:
  `WebGLFallback`): card estilizado consistente com o placeholder existente,
  com ícone e a mensagem "Visualização 3D indisponível neste dispositivo".

### 4. Fix de LCP do logo

Adicionar `priority` ao `<Image>` do logo above the fold em
`components/layout/navbarDesktop.tsx` e `components/layout/navbarMobile.tsx`
(o logo `logo-branco.png`). `next/image` com `priority` aplica `loading="eager"`
e `fetchpriority="high"`.

## O que NÃO entra (YAGNI)

- Geração de imagens-poster a partir dos `.glb`.
- Tratamento de perda de contexto WebGL no meio da sessão (`webglcontextlost`) —
  caso raro; pode ser endereçado depois se ocorrer.
- Listener global de `unhandledrejection` — seria mascarar sintoma; a detecção
  na raiz já impede a rejection.

## Testes

- `webglSupport.ts`: testar branch sem `window` (SSR) e mock de canvas
  retornando contexto `null` vs. válido.
- `useOptimized3DModel`: com `webglSupported === false`, garantir que o import
  dinâmico não é chamado e `shouldRender` permanece sem o model-viewer.
- `caixaHome3d.test.tsx` (já existe): adicionar caso de WebGL indisponível →
  renderiza o fallback, não o spinner.
- Verificação manual: `bun dev` num navegador sem GPU/WebGL → terminal limpo,
  sem `unhandledRejection`; fallback visível na página.

## Arquivos afetados

- `components/modelo3d/hooks/webglSupport.ts` (novo)
- `components/modelo3d/hooks/useOptimized3DModel.ts`
- `components/modelo3d/caixaHome3d.tsx`
- `components/modelo3d/optimizedEmbalagem3d.tsx`
- `components/modelo3d/WebGLFallback.tsx` (novo — placeholder compartilhado)
- `components/layout/navbarDesktop.tsx`
- `components/layout/navbarMobile.tsx`
- testes correspondentes
