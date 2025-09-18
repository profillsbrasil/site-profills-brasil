"use client";

import { GridPattern } from "@/components/layout/gridPatternBg";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import CardMaquina from "./_components/cardMaquinas/cardMaquina";
import {
  categorias,
  maquinasData,
  tiposEmbalagem,
} from "./_components/cardMaquinas/maquinasData";

export default function Maquinas() {
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("Todas");
  const [embalagemFiltro, setEmbalagemFiltro] = useState<string>("Todas");

  const maquinasFiltradas = useMemo(() => {
    return maquinasData.filter((maquina) => {
      const categoriaPassa =
        categoriaFiltro === "Todas" || maquina.categoria === categoriaFiltro;
      const embalagemPassa =
        embalagemFiltro === "Todas" ||
        maquina.embalagensCompativeis.includes(embalagemFiltro);

      return categoriaPassa && embalagemPassa;
    });
  }, [categoriaFiltro, embalagemFiltro]);

  // Tipos de embalagem dinâmicos com base nas máquinas filtradas por categoria
  const tiposVisiveis = useMemo(() => {
    if (categoriaFiltro === "Todas") return tiposEmbalagem;
    const set = new Set<string>();
    maquinasData.forEach((m) => {
      if (m.categoria === categoriaFiltro) {
        m.embalagensCompativeis.forEach((e) => set.add(e));
      }
    });
    const lista = Array.from(set);
    // Mantém ordem base de tiposEmbalagem para UX consistente
    return tiposEmbalagem.filter((t) => lista.includes(t));
  }, [categoriaFiltro]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-slate-900 py-10">
      <GridPattern />

      {/* Navegação superior - visível em desktop */}
      <div className="sticky top-16 left-0 z-20 hidden h-14 w-full items-center justify-center gap-3 bg-slate-900 py-2 text-white md:flex">
        <GridPattern />
        <Button
          variant="ghost"
          onClick={() => setCategoriaFiltro("Todas")}
          className={`border-border/20 z-11 rounded-xs border text-xs md:text-sm ${
            categoriaFiltro === "Todas" ? "bg-slate-700" : "bg-slate-900"
          }`}
        >
          Todas
        </Button>
        {categorias.map((categoria) => (
          <Button
            key={categoria}
            variant="ghost"
            onClick={() => setCategoriaFiltro(categoria)}
            className={`border-border/20 z-11 rounded-xs border text-xs md:text-sm ${
              categoriaFiltro === categoria ? "bg-slate-700" : "bg-slate-900"
            }`}
          >
            {categoria}
          </Button>
        ))}
      </div>

      {/* Scroll horizontal mobile - apenas tipos de máquinas */}
      <div className="scrollbar-hide sticky top-16 left-0 z-20 w-full bg-slate-900 px-4 py-2 md:hidden">
        <div className="scrollbar-hide flex gap-3 overflow-x-auto">
          <Button
            variant="ghost"
            onClick={() => setCategoriaFiltro("Todas")}
            className={`border-border/20 flex-shrink-0 rounded-xs border text-xs whitespace-nowrap text-white ${
              categoriaFiltro === "Todas" ? "bg-slate-700" : "bg-slate-800"
            }`}
          >
            Todas
          </Button>
          {categorias.map((categoria) => (
            <Button
              key={categoria}
              variant="ghost"
              onClick={() => setCategoriaFiltro(categoria)}
              className={`border-border/20 flex-shrink-0 rounded-xs border text-xs whitespace-nowrap text-white ${
                categoriaFiltro === categoria ? "bg-slate-700" : "bg-slate-800"
              }`}
            >
              {categoria}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex w-full gap-5 pr-0 md:pr-3">
        {/* Sidebar desktop */}
        <div className="sticky top-32 left-0 z-10 ml-2 hidden h-full w-1/6 flex-col items-center justify-start gap-2 rounded-xs bg-transparent text-white md:flex">
          <Button
            onClick={() => {
              setEmbalagemFiltro("Todas");
              setCategoriaFiltro("Todas");
            }}
            variant="ghost"
            className="border-border/20 mb-2 w-full rounded-xs border bg-slate-900 py-2 text-center text-sm font-semibold"
          >
            Embalagens Compatíveis
          </Button>
          <div className="flex w-3/4 flex-col gap-2">
            <Button
              variant="ghost"
              onClick={() => setEmbalagemFiltro("Todas")}
              className={`border-border/20 z-11 rounded-xs border text-xs ${
                embalagemFiltro === "Todas" ? "bg-slate-700" : "bg-slate-900"
              }`}
            >
              Todas
            </Button>
            {tiposVisiveis.map((tipo) => (
              <Button
                key={tipo}
                variant="ghost"
                onClick={() => setEmbalagemFiltro(tipo)}
                className={`border-border/20 z-11 rounded-xs border text-xs ${
                  embalagemFiltro === tipo ? "bg-slate-700" : "bg-slate-900"
                }`}
              >
                {tipo}
              </Button>
            ))}
          </div>
        </div>

        {maquinasFiltradas.length === 0 ? (
          <div className="z-10 mt-8 mr-2 grid min-h-screen w-full grid-cols-12 grid-rows-12 rounded-xs px-4 md:max-w-5/6 md:px-0">
            <div className="border-border/20 col-span-12 col-start-1 row-span-1 row-start-1 flex w-full max-w-md flex-col items-center justify-center gap-3 place-self-center border border-dashed bg-slate-900 p-4 text-white md:col-span-4 md:col-start-5 md:row-span-2 md:row-start-2 md:p-6">
              <p className="text-center text-sm md:text-base">
                Nenhum card encontrado para os filtros selecionados.
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setEmbalagemFiltro("Todas");
                  setCategoriaFiltro("Todas");
                }}
                className="border-border/20 z-20 w-full rounded-xs border text-xs md:w-auto md:text-sm"
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        ) : (
          <CardMaquina maquinas={maquinasFiltradas} />
        )}
      </div>
    </div>
  );
}
