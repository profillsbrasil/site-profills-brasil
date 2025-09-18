import { Highlighter } from "@/components/magicui/highlighter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import meninaSuporte from "@/lib/images/extras/suport-img.png";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
type FAQ = {
  pergunta: string;
  resposta: string;
  topicos?: string[];
};

export const faqQuestoes: FAQ[] = [
  {
    pergunta: "Por que automatizar sua produção?",
    resposta:
      "Para ganhar escala com qualidade, reduzir perdas e liberar seu time para o que gera mais receita.",
    topicos: [
      "Envase higiênico e padronizado (boas práticas sanitárias).",
      "Mais produtividade e previsibilidade de volume.",
      "Dosagem precisa e menos desperdício.",
      "Rastreabilidade: lote, validade e conformidade.",
    ],
  },
  {
    pergunta: "Como escolher o modelo de embalagem ideal?",
    resposta:
      "A Profills avalia produto, objetivo comercial e custos para indicar o melhor formato.",
    topicos: [
      "Perfil do produto: líquido, pastoso ou sólido.",
      "Vida útil, logística e apresentação.",
      "Opções: sachê 4 soldas, stand-up pouch, garrafas e formatos especiais.",
    ],
  },
  {
    pergunta: "Quais os benefícios das máquinas Profills?",
    resposta:
      "Equipamentos projetados para eficiência, higiene e controle total da linha.",
    topicos: [
      "Automação e painel touchscreen (Indústria 4.0).",
      "Dosagem e comprimento configuráveis.",
      "Datador para lote/validade e conformidade.",
      "Componentes de alta qualidade.",
      "Suporte técnico e treinamento operacional.",
    ],
  },
  {
    pergunta: "Por que a Profills?",
    resposta:
      "Especialistas em envase com fábrica própria e foco em soluções sob medida.",
    topicos: [
      "Experiência em diferentes portes e segmentos.",
      "+300 clientes no Brasil e América do Sul.",
      "Instalação, garantia de 6 meses e reposição de peças.",
      "Projetos especiais e consultoria de layout fabril.",
      "Compromisso com prazos e qualidade.",
    ],
  },

  // Perguntas extras úteis
  {
    pergunta: "Vocês fazem instalação e treinamento?",
    resposta:
      "Sim. Entregamos a máquina pronta para operar e treinamos sua equipe.",
    topicos: [
      "Instalação no local e start-up da linha.",
      "Treinamento operacional e de manutenção.",
      "Manuais e boas práticas de uso.",
    ],
  },
  {
    pergunta: "Qual é o prazo de entrega?",
    resposta:
      "Depende do modelo e da personalização. O prazo é informado na proposta.",
    topicos: [
      "Disponibilidade de componentes.",
      "Nível de customização do projeto.",
      "Cronograma acordado com o cliente.",
    ],
  },
  {
    pergunta: "Há assistência técnica e peças de reposição?",
    resposta:
      "Sim. Oferecemos suporte remoto e presencial, além de reposição de peças.",
    topicos: [
      "Atendimento técnico dedicado.",
      "Manutenção preventiva (opcional).",
      "Envio ágil de peças.",
    ],
  },
  {
    pergunta: "Atendem pequenos e grandes volumes?",
    resposta:
      "Sim. Nosso portfólio cobre linhas compactas até operações industriais.",
    topicos: [
      "Máquinas modulares e escaláveis.",
      "Adequação à capacidade desejada.",
      "Planos de expansão futura.",
    ],
  },
];

export default function CardFaq() {
  return (
    <div id="faq" className="flex h-full max-w-7xl flex-col gap-8 py-10">
      <div className="flex w-full justify-center">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-4xl font-bold"
        >
          FAQ - Perguntas Frequentes
        </Highlighter>
      </div>
      <div className="flex w-full gap-5">
        <div className="flex h-full w-1/2">
          <Accordion
            type="single"
            collapsible
            className="z-10 flex w-full flex-col gap-2"
            defaultValue="item-0"
          >
            {faqQuestoes.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background border-border border transition-all duration-300 hover:shadow-md"
              >
                <AccordionTrigger className="hover:text-accent flex w-full border-b bg-slate-50 px-6 py-4 text-left text-lg font-semibold text-slate-900 transition-colors">
                  {faq.pergunta}
                </AccordionTrigger>
                <AccordionContent className="bg-background flex w-full flex-col gap-4 px-6 pt-2 pb-6">
                  <p className="leading-relaxed text-slate-700">
                    {faq.resposta}
                  </p>
                  {faq.topicos && faq.topicos.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-sm font-medium text-slate-800">
                        Principais pontos:
                      </h4>
                      <ul className="space-y-1">
                        {faq.topicos.map((topico, topicoIndex) => (
                          <li
                            key={topicoIndex}
                            className="flex items-start gap-2 text-sm text-slate-600"
                          >
                            <span className="bg-accent mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full" />
                            {topico}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="relative flex h-full w-1/2 flex-col items-center justify-center">
          <Image
            src={meninaSuporte}
            alt="Menina Suporte"
            className="h-full w-full object-contain"
          />
          <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
            <h3 className="text-lg font-semibold">Ainda está com dúvidas?</h3>
            <Link className="cursor-pointer" href="#">
              <Button
                variant="outline"
                size="lg"
                className="!bg-background hover:border-accent group hover:bg-accent/10 hover:text-accent border-border rounded-sm px-8 py-4 font-semibold shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              >
                Entre em contato
                <ArrowRight className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
