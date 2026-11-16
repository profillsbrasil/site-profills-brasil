# Docs do domínio

Como as skills de engenharia leem a documentação de domínio deste repo.

## Antes de explorar, leia

- **`GLOSSARY.md`**, na raiz: glossário do domínio (Indicação, Vendedor, Contato comercial e os demais).
- **`docs/adr/`**: leia os ADRs da área em que você vai mexer.

Layout de contexto único: um `GLOSSARY.md` e um `docs/adr/` na raiz. Não há `GLOSSARY-MAP.md`.

As decisões de design e os planos ficam em `docs/superpowers/specs/` e `docs/superpowers/plans/`; o `CLAUDE.md` explica quando consultar.

## Use o vocabulário do glossário

Quando o texto nomear um conceito do domínio (título de issue, proposta de refatoração, hipótese, nome de teste), use o termo como está no `GLOSSARY.md`, e não os sinônimos que ele manda evitar.

Conceito que falta no glossário é sinal: ou o termo é inventado e não pertence ao projeto, ou existe uma lacuna real, que vai para o `/domain-modeling`.

## Aponte conflito com ADR

Se a proposta contraria um ADR, diga isso no texto, com o número do ADR e o motivo para reabrir, em vez de passar por cima em silêncio.
