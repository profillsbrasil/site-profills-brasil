"use client";

import { GridPattern } from "@/components/layout/gridPatternBg";
import imgFabricaCompleta from "@/lib/images/extras/FabricaCompleta.png";
import Image from "next/image";

export default function MonteSuaFabrica() {
  return (
    <div className="relative flex h-screen min-h-screen w-full items-center justify-start bg-slate-900">
      <GridPattern />

      <div className="z-20 h-full w-4/6">
        <Image
          src={imgFabricaCompleta}
          alt="Monte sua fábrica"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Título principal melhorado */}
      <h1 className="absolute top-28 left-1/2 z-10 w-full -translate-x-1/2 text-center text-5xl font-bold text-white uppercase">
        <span className="w-full">Monte sua Fábrica</span>
      </h1>
    </div>
  );
}
