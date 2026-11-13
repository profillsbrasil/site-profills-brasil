# Proveniência do anti-slop

- Repositório: https://github.com/dmmulroy/anti-slop
- Commit: `13909c9e07590f5a85d93c62712259fe14a883f7`
- Caminho de origem: `skills/install-anti-slop/assets/anti-slop/`
- Destino: `tools/oxlint/anti-slop/`, copiado pelo `scripts/install.mjs` da skill `install-anti-slop`.
- Conferência: `diff -r` entre o destino e a origem no commit acima só mostra os arquivos locais listados em "Desvios intencionais" (13 de novembro de 2026).

## Arquivos

- `index.ts`: plugin genérico `anti-slop`, registrado em `.oxlintrc.json`.
- `rules/`, `shared/`: regras e helpers do plugin genérico.
- `vendor/eslint-stylistic/`: `padding-line-between-statements` do ESLint Stylistic, com `LICENSE` (MIT) e o próprio `UPSTREAM.md`.
- `effect/`: plugin opcional `anti-slop-effect`. Veio na cópia e fica sem registro, porque o site não depende de `effect`.

A origem não traz os testes das regras (`*.test.ts`); eles ficam só no repositório upstream.

## Desvios intencionais

- Nenhum arquivo da origem foi alterado.
- `package.json` é local e só declara `"type": "module"`, como em `tools/oxlint/profills/`. Sem ele, o Node avisa `MODULE_TYPELESS_PACKAGE_JSON` a cada lint.
- O plugin `anti-slop-effect` não está registrado.
- A pasta fica fora do Prettier (`.prettierignore`) e do lint do site (`ignorePatterns`), porque segue o estilo do upstream (tabs, aspas duplas).

## Atualizar

Siga `skills/install-anti-slop/references/update.md` do upstream: monte a nova versão numa pasta temporária, compare com esta cópia e porte as mudanças revisadas. Nunca rode o instalador sobre `tools/oxlint/anti-slop/`. Depois, atualize este arquivo com o commit novo.
