# Seção "Conheça também" no footer

**Data:** 2026-06-11
**Escopo:** Adicionar uma nova seção no `Footer` exibindo um logo de empresa parceira (Profills Cartoons Ranca) como divisor entre os cards de contato e o bloco de redes sociais.

## Contexto

O footer atual (`components/layout/footer.tsx`) tem 4 blocos sequenciais:

1. Logo Profills + descrição da empresa
2. Grid 3 colunas com cards de contato (vendas, suporte, compras)
3. Bloco "Conecte-se conosco" (label + redes sociais)
4. Copyright + CNPJ copiável

Falta um ponto pra apresentar o vínculo com a empresa parceira. A solução precisa se integrar visualmente com o footer existente (`bg-secondary`, `BlurFade` em cascata, accent verde nos hovers).

## Decisões de design

| Aspecto | Decisão | Justificativa |
|---|---|---|
| **Posição** | Entre os cards de contato (2) e o bloco "Conecte-se conosco" (3) | Funciona como ponte entre conteúdo de relacionamento (contatos) e comunidade (social). Não empurra o conteúdo principal pra baixo. |
| **Tratamento visual** | Divisor central: logo centralizado com duas linhas finas em gradiente nos lados | Cria uma divisória elegante e dá destaque ao logo sem competir com a hierarquia existente. |
| **Tamanho do logo** | `h-8` mobile / `h-10` desktop (~32–40px), `w-auto` | Escala média — não compete com o logo Profills principal no topo (`h-12`/`h-16`) e não some como detalhe. |
| **Label** | "Conheça também" acima do logo, uppercase, tracking 0.2em, cor `secondary-foreground/45` | Discreto e consistente com a tipografia secundária do footer. |
| **Link** | `href="#"` (destino ainda não definido) | Aprovado pelo usuário. Trocar quando o site da parceira existir. |
| **Hover** | `group-hover:brightness-110` no logo + `group-hover:text-accent` no label | Sutil, consistente com os hovers existentes do footer (cards e ícones de social usam o mesmo accent). |
| **Animação de entrada** | `BlurFade delay={0.4}` | Encaixa no ritmo: cards de contato vão de 0.2 a 0.4, social é 0.5. |

## Implementação

### Asset

Reutilizar o arquivo existente `public/profills-cartoons-ranca.png` (1678×395, RGBA, ~31KB). Não criar arquivo novo.

### Mudanças em `components/layout/footer.tsx`

1. **Novo import** logo após o import de `logoProfills` (linha 9):

   ```tsx
   import logoCartoonsRanca from '@/public/profills-cartoons-ranca.png';
   ```

2. **Novo bloco JSX** entre o fechamento do grid de contatos (linha 154) e o `BlurFade` do bloco social (linha 156):

   ```tsx
   <BlurFade delay={0.4} inView>
     <div className='mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:mt-10 md:gap-6'>
       <div className='h-px bg-gradient-to-r from-transparent via-secondary-foreground/15 to-transparent' />
       <Link
         href='#'
         aria-label='Conheça também: Profills Cartoons Ranca'
         className='group flex flex-col items-center'>
         <span className='mb-3 text-[10px] font-medium tracking-[0.2em] text-secondary-foreground/45 uppercase transition-colors group-hover:text-accent md:text-xs'>
           Conheça também
         </span>
         <Image
           src={logoCartoonsRanca}
           alt='Profills Cartoons Ranca'
           className='h-8 w-auto transition duration-300 group-hover:brightness-110 md:h-10'
         />
       </Link>
       <div className='h-px bg-gradient-to-r from-transparent via-secondary-foreground/15 to-transparent' />
     </div>
   </BlurFade>
   ```

### Verificação

- `bun check-types` deve passar (sem erros novos).
- Verificação visual: a seção aparece entre os cards de contato e o bloco social, com as duas linhas decorativas nos lados, e responde ao hover.

## Fora de escopo

- Adicionar mais parceiros (decidido: apenas 1 por enquanto).
- Definir destino real do link (`href="#"` aprovado como placeholder).
- Criar página interna sobre a parceira.
- Componente reutilizável `<PartnerBadge>` (não vale a abstração pra 1 uso).
