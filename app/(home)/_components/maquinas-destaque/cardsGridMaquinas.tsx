"use client";

import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import embalagensProfills from "@/public/images/caixinha-profills.png";
import maquinaMaisLonga from "@/public/images/maquinas/gt3000.png";
import maquinaEmbalagensCartonadas from "@/public/images/maquinas/tc4S-embalagem.jpg";
import { ArrowRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import type React from "react";

type FeatureData = {
  imagensCard: StaticImageData[];
  title: string;
  isLarge?: boolean;
};

export type FeatureCardProps = React.ComponentProps<"div"> & {
  feature: FeatureData;
};

const features = [
  {
    title: "Máquina Mais Compacta",
    imagensCard: [maquinaMaisLonga, embalagensProfills],
    isLarge: true,
  },
  {
    title: "Máquina Mais Compacta",
    imagensCard: [maquinaEmbalagensCartonadas, embalagensProfills],
    isLarge: false,
  },
  {
    title: "Embalagens Cartonadas",
    imagensCard: [maquinaEmbalagensCartonadas, embalagensProfills],
  },
  {
    title: "Linha TC 4S",
    imagensCard: [maquinaEmbalagensCartonadas, embalagensProfills],
  },
  {
    title: "Stand-Up Pouch",
    imagensCard: [maquinaEmbalagensCartonadas, embalagensProfills],
  },
];

export default function CardGridSket() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
        {/* Large card - spans 2 columns */}
        <AnimatedContainer delay={0} className="md:col-span-2 md:row-span-1">
          <FeatureCard feature={features[0]} className="h-80" />
        </AnimatedContainer>

        {/* Medium card - spans 1 column */}
        <AnimatedContainer delay={0.1} className="md:col-span-1 md:row-span-1">
          <FeatureCard feature={features[1]} className="h-80" />
        </AnimatedContainer>

        {/* Bottom 3 cards - equal columns */}
        <AnimatedContainer delay={0.2} className="md:col-span-1">
          <FeatureCard feature={features[2]} className="h-80" />
        </AnimatedContainer>

        <AnimatedContainer delay={0.3} className="md:col-span-1">
          <FeatureCard feature={features[3]} className="h-80" />
        </AnimatedContainer>

        <AnimatedContainer delay={0.4} className="md:col-span-1">
          <FeatureCard feature={features[4]} className="h-80" />
        </AnimatedContainer>
      </div>

      <AnimatedContainer delay={0.3} className="flex justify-center pt-4">
        <Link href="/maquinas" className="z-10">
          <Button
            variant="outline"
            size="lg"
            className="group border-border !bg-background hover:border-accent/30 hover:bg-accent/10 hover:text-accent z-10 rounded-sm border font-semibold shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            Ver catálogo completo
            <ArrowRight className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </AnimatedContainer>
    </div>
  );
}

export function FeatureCard({
  feature,
  className,
  ...props
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group bg-background relative z-10 flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-sm border shadow-lg transition-all duration-300 hover:shadow-xl",
        className,
      )}
      {...props}
    >
      <Carousel className="relative flex-1">
        <CarouselContent className="h-full">
          {feature.imagensCard.map((image, index) => (
            <CarouselItem
              key={index}
              className="flex items-center justify-center p-4"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={image}
                  alt={feature.title}
                  fill
                  className="rounded-sm object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hover:bg absolute top-1/2 left-3 h-8 w-8 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:text-black" />
        <CarouselNext className="hover:bg absolute top-1/2 right-3 h-8 w-8 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:text-black" />
      </Carousel>

      <div className="border-t p-4">
        <h3 className="text-center text-base font-semibold tracking-wide">
          {feature.title}
        </h3>
      </div>
    </div>
  );
}
