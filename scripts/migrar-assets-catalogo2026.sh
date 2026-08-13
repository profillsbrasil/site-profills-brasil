#!/usr/bin/env bash
# Migração dos assets do catálogo 2026 (Task 1, fase 1).
# Script temporário — removido na fase 4 (ver task-1-brief.md).
#
# Fonte: .superpowers/sdd/2026-08-13-pagina-maquina-fases1-2-assets-dados/tabelas.md
# (tabela mestra — autoritativa para os nomes de origem, inclusive typos reais).
#
# Linha 1 (piloto) e linhas 34/35 (sem foto) ficam de fora — já tratadas/fora de escopo.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/arquivos-referencia/Imagens"
DST="$ROOT/lib/images/catalogo2026"

MAQUINAS_SRC="$SRC/Maquinas"
EMBALAGENS_SRC="$SRC/embalagens"
MAQUINAS_DST="$DST/maquinas"
EMBALAGENS_DST="$DST/embalagens"
PRODUTOS_DST="$DST/produtos"

mkdir -p "$MAQUINAS_DST" "$EMBALAGENS_DST"

# Formato de cada linha: slug|origem_maquina|origem_embalagem|resize
# resize=1200 → normaliza a imagem de máquina para largura 1200px (nota ※1 da tabela).
LINHAS=(
  "envasadora-stand-up-pouch-pre-formado-com-tampa|envasadora-stand-up-pouch-preformado-profills.webp|envasadora-pouch-pre-formado-embalagem.webp|"
  "envasadora-pouch-compacta-pre-formado|envasadora-pouch-pronto-compacta-profills.webp|envassadora-pouch-pronto-compacto-profills-embalagem.webp|1200"
  "envasadora-mini-stand-up-pouch|envasadora-mini-pouch-profills.webp|envassadora-mini-pouch-profills-embalagem.webp|"
  "envasadora-seladora-bisnagas|envasadora-bisnagas-profills.webp|envasadora-bisnagas-profills-embalagem.webp|"
  "envasadora-gable-top-gt|envasadora-gt3000-cartonados-gabletop-profills.webp|envasagora-gt3000-gabletop-embalagem.webp|"
  "envasadora-caixas-assepticas-leite-sucos|envasadora-uth-cartonada-profills.webp|envasadora-uht-profills-embalagem.webp|"
  "envasadora-rotativa-potes-copos|envasadora-potes-calipo-profills.webp|envasadora-profills-pote-embalagem.webp|1200"
  "envasadora-stand-up-pouch-cartonado|pouch-mecanica-profills.webp|envasadora-pouch-mecanica-profills-embalagem.webp|"
  "envasadora-saches-liquidos-linha-tp|envassadora-tp-saches-profills.webp|envasadora-tp-profills-embalagem.webp|"
  "envasadora-saches-liquidos-tp-4-vias|envassadora-tp-saches-4-vias-profills.webp|envasadora-tp-4vias-profills-embalagem.webp|"
  "envasadora-saches-4-soldas-tc4s-1-via|envasadora-linhaTC4S1via-profills.webp|envasadora-tc4s-1via-profills-embalagem.webp|"
  "envasadora-saches-4-soldas-tc4s-2-vias|envasadora-linhaTC4S2vias-profills.webp|envasadora-tc4s-2vias-profills-embalagem.webp|"
  "envasadora-saches-4-soldas-tc4s-3-vias|envasadora-linhaTC4S3vias-profills.webp|envasadora-tc4s-3vias-profills-embalagem.webp|1200"
  "envasadora-saches-formatados-tc4s-3-vias|envasadora-linhaTC4S3vias-formatado-profills.webp|envasadora-tc-4s-formatado-embalagem.webp|"
  "envasadora-saches-3-soldas-pos-solidos-tc3sc|envasadora-tc3sc-pos-e-solidos-profills.webp|embalagem-tc-3sc-embalagem-pos-e-solidos.webp|1200"
  "envasadora-saches-3-soldas-liquidos-tc3sc|envasadora-tc3sc-liquidos-profills.webp|embalagem-tc-3sc-embalagem-liquidos.webp|"
  "envasadora-stick-tc3sc-1-a-4-vias|envasadora-tc3sc-stick-profills.webp|envasasdora-stick-profills-embalagem.webp|1200"
  "envasadora-saches-3-soldas-tc3sl|envasadora-TC3SL-profills.webp|envasadora-tc3sl-profills-embalagem.webp|"
  "envasadora-saches-pos-solidos-tcv|envasadora-linha-tcv-profills.webp|envasadora-linhatcv-solidos-profills-embalagem.webp|1200"
  "enfardadeira-produtos-acabados-tc4u|envasadora-linha-tcu-profills.webp|envasadora-tc4u-embalagem.webp|"
  "empacotadeira-vertical-ptc-speed|envasadora-linha-ptc-speed.webp|envasadora-ptc-speed-profills-embalagem.webp|"
  "envasadora-bags-liquidos-tc3sc|envasadora-tc3sc-bag.webp|envasadora-tc3scbag-profills-embalagem.webp|"
  "embaladora-horizontal-flowpack|flowpack.webp|flowpack-profills-embalagem.webp|"
  "envasadora-horizontal-linear-frascos|envasadora-linha-frascos-horizontal-linear.webp|envasdora-horitzontal-linear-frascos-profills-embalagem.webp|"
  "envasadora-horizontal-tribloc-frascos|envasadora-linha-frascos-horizontal-tribloc.webp|envasadora-horizontal-tribloc-profills-embalagem.webp|"
  "envasadora-horizontal-rotativa-frascos|envasadora-linha-frascos-horizontal-rotativa.webp|linha-de-frascos-rotativa-embalagem.webp|"
  "envasadora-frascos-tubulares|envasadora-linha-frascos-tubulares.webp|linha-de-frascos-tubulares-embalagem.webp|"
  "envasadora-horizontal-galoes-25-litros|envasadora-horizontal-galao-profills.webp|envasadora-horizontal-galao-embalagens.webp|"
  "envasadora-linear-frascos-fechamento-automatico|envasadora-linha-frascos-horizontal-linear.webp|envasdora-horitzontal-linear-frascos-profills-embalagem.webp|"
  "envasadora-semiautomatica-baldes|envasadora-linha-baldes-semiautomatica-profills.webp|envasadora-baldes-semiautomatica-embalagem copiar.webp|"
  "maquina-lavagem-galoes|lavadora-de-galoes-profills.webp|lavadora-galao-embalagem.webp|"
  "envolvedora-overlap-embalagens-pet|envolvedor-profills.webp|envolvedora-embalagem.webp|"
)
# NOTA linha 30 (envasadora-linear-frascos-fechamento-automatico): reusa as
# origens da linha 25 (decisão do usuário 2026-08-13, ※5 da tabela).
# NOTA linha 31 (embalagem): origem tem " copiar" no nome — a cópia usa o
# nome do slug, então o " copiar" some no destino (※6 da tabela).

for linha in "${LINHAS[@]}"; do
  IFS='|' read -r slug maquina_src embalagem_src resize <<<"$linha"

  maquina_dst="$MAQUINAS_DST/$slug.webp"
  embalagem_dst="$EMBALAGENS_DST/$slug.webp"

  if [[ "$resize" == "1200" ]]; then
    magick "$MAQUINAS_SRC/$maquina_src" -resize 1200x "$maquina_dst"
  else
    cp "$MAQUINAS_SRC/$maquina_src" "$maquina_dst"
  fi

  cp "$EMBALAGENS_SRC/$embalagem_src" "$embalagem_dst"

  echo "migrado: $slug"
done

# ※4 — variante 6 bicos da linha 25, extra para a QA visual da fase 5 escolher.
cp "$MAQUINAS_SRC/envasadora-linha-frascos-horizontal-linear-6-bicos.webp" \
  "$MAQUINAS_DST/envasadora-horizontal-linear-frascos--alt6bicos.webp"
echo "migrado: envasadora-horizontal-linear-frascos--alt6bicos (variante ※4)"

# Produtos: PNG → WEBP quality 82, remove o PNG original.
for f in "$PRODUTOS_DST"/*.png; do
  [[ -e "$f" ]] || continue
  base="${f%.png}"
  magick "$f" -quality 82 "$base.webp"
  rm "$f"
  echo "produto convertido: $(basename "$base.webp")"
done

echo "Migração concluída."
