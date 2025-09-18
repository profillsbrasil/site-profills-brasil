import { Highlighter } from "@/components/magicui/highlighter";
import CardGridSket from "./cardsGridMaquinas";

export default function MaquinasDestaque() {
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center gap-5 pt-5 pb-10">
      <div className="w-full max-w-6xl">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor=" text-3xl font-bold mb-3"
        >
          Máquinas em Destaque
        </Highlighter>
        <p className="text-muted-foreground text-base">
          Conheça algumas das nossas linhas de máquinas em destaque
        </p>
      </div>
      <CardGridSket />
    </div>
  );
}
