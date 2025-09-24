"use client";

import { GridPattern } from "@/components/layout/gridPatternBg";
import { Highlighter } from "@/components/magicui/highlighter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import imgFabricaCompleta from "@/lib/images/extras/FabricaRemderNew.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schema simplificado para o formulário da página Monte sua Fábrica
const monteFabricaSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  empresa: z.string().min(2, "Nome da empresa é obrigatório"),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type MonteFabricaData = z.infer<typeof monteFabricaSchema>;

export default function MonteSuaFabrica() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MonteFabricaData>({
    resolver: zodResolver(monteFabricaSchema),
  });

  const onSubmit = async (data: MonteFabricaData) => {
    setIsSubmitting(true);
    try {
      // Simular envio - adaptar para sua API
      console.log("Dados do formulário:", data);

      // Aqui você pode integrar com sua API existente ou criar uma nova
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Solicitação enviada com sucesso!", {
        description:
          "Entraremos em contato em breve para elaborar seu projeto.",
        duration: 5000,
      });

      reset();
    } catch (error) {
      toast.error("Erro ao enviar solicitação", {
        description: "Tente novamente em alguns instantes.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-900">
      <GridPattern />

      {/* Container principal */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Título principal */}
        <div className="absolute top-28 right-1/2 z-10 flex w-full translate-x-1/2 justify-center">
          <h1 className="text-center">
            <Highlighter
              action="underline"
              color="#2d62ef"
              animationDuration={4000}
              textColor="text-2xl font-bold tracking-wider text-white uppercase md:text-4xl"
            >
              Monte sua Fábrica
            </Highlighter>
          </h1>
        </div>

        {/* Primeira seção - Layout atual (conforme aprovado) */}
        <div className="flex w-full items-center justify-center px-4">
          <div className="h-full w-full md:w-2/3">
            <Image
              src={imgFabricaCompleta}
              loading="eager"
              alt="Monte sua fábrica"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="z-20 h-full w-full md:w-1/3 md:pr-10">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border-border/20 flex flex-col items-start justify-center rounded-xs border border-dashed bg-slate-900 p-5 shadow-xl shadow-black/10"
            >
              <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                Como funciona?
              </h2>
              <p className="mb-3 text-sm leading-relaxed text-white md:text-base">
                Nossa equipe acompanha todo o processo: do{" "}
                <span className="text-accent font-semibold">
                  planejamento do seu projeto
                </span>{" "}
                até a{" "}
                <span className="text-accent font-semibold">
                  instalação das máquinas
                </span>
                .
              </p>
              <p className="text-sm leading-relaxed text-white md:text-base">
                Fornecemos{" "}
                <span className="text-accent font-semibold">
                  consultoria técnica
                </span>
                , <span className="text-accent font-semibold">fabricação</span>{" "}
                e <span className="text-accent font-semibold">suporte</span>,
                garantindo uma solução completa e personalizada para{" "}
                <span className="text-accent font-semibold">o seu negócio</span>
                .
              </p>
            </motion.div>
          </div>
        </div>
        {/* Segunda seção - Formulário e informações */}
        <div className="flex flex-1 items-center justify-center px-4 py-16 md:px-8">
          <div className="relative mx-auto w-full max-w-7xl">
            <div className="flex flex-col gap-8 md:flex-row md:gap-12">
              {/* Coluna do formulário */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full md:w-1/2"
              >
                <div className="border-border/20 flex h-full flex-col justify-between rounded-xs border border-dashed bg-slate-900/80 p-6 shadow-xl backdrop-blur">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="mb-6 flex items-center gap-3">
                      <Building2 className="text-accent h-6 w-6" />
                      <h2 className="text-2xl font-bold text-white">
                        Solicite seu Orçamento
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="nome"
                          className="flex items-center gap-2 text-white"
                        >
                          <User className="h-4 w-4" />
                          Nome completo
                        </Label>
                        <Input
                          id="nome"
                          {...register("nome")}
                          className="border-border/20 focus:ring-accent/80 placeholder:text-muted-foreground rounded-xs border !bg-slate-900/80 text-white"
                          placeholder="Seu nome completo"
                        />
                        {errors.nome && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.nome.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="empresa"
                          className="flex items-center gap-2 text-white"
                        >
                          <Building2 className="h-4 w-4" />
                          Empresa
                        </Label>
                        <Input
                          id="empresa"
                          {...register("empresa")}
                          className="border-border/20 focus:ring-accent/80 placeholder:text-muted-foreground rounded-xs border !bg-slate-900/80 text-white"
                          placeholder="Nome da sua empresa"
                        />
                        {errors.empresa && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.empresa.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="flex items-center gap-2 text-white"
                        >
                          <Mail className="h-4 w-4" />
                          E-mail
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          className="border-border/20 focus:ring-accent/80 placeholder:text-muted-foreground rounded-xs border !bg-slate-900/80 text-white"
                          placeholder="seu@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="telefone"
                          className="flex items-center gap-2 text-white"
                        >
                          <Phone className="h-4 w-4" />
                          Telefone
                        </Label>
                        <Input
                          id="telefone"
                          {...register("telefone")}
                          className="border-border/20 focus:ring-accent/80 placeholder:text-muted-foreground rounded-xs border !bg-slate-900/80 text-white"
                          placeholder="(11) 99999-9999"
                        />
                        {errors.telefone && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.telefone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensagem" className="text-white">
                        Conte-nos sobre seu projeto
                      </Label>
                      <Textarea
                        id="mensagem"
                        {...register("mensagem")}
                        className="border-border/20 focus:ring-accent/80 placeholder:text-muted-foreground min-h-[100px] rounded-xs border !bg-slate-900/80 text-white"
                        placeholder="Descreva o tipo de fábrica que deseja montar, produtos que irá processar, capacidade de produção desejada..."
                      />
                      {errors.mensagem && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.mensagem.message}
                        </p>
                      )}
                    </div>
                  </form>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent hover:bg-accent/90 w-full py-3 font-semibold text-white"
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        Solicitar Orçamento
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Coluna de informações */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="w-full space-y-6 md:w-1/2"
              >
                <div className="border-border/20 rounded-xs border border-dashed bg-slate-900/80 p-6 shadow-xl backdrop-blur">
                  <h3 className="mb-4 text-xl font-bold text-white">
                    Como começar?
                  </h3>
                  <div className="space-y-3 text-sm text-white/90">
                    <div className="flex items-start gap-3">
                      <div className="bg-accent/20 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                        <span className="text-accent text-xs font-bold">1</span>
                      </div>
                      <p>
                        Preencha o formulário com suas informações e
                        necessidades
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-accent/20 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                        <span className="text-accent text-xs font-bold">2</span>
                      </div>
                      <p>Nossa equipe técnica analisará seu projeto</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-accent/20 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                        <span className="text-accent text-xs font-bold">3</span>
                      </div>
                      <p>
                        Desenvolveremos uma proposta personalizada para sua
                        fábrica
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-border/20 rounded-xs border border-dashed bg-slate-900/80 p-6 shadow-xl backdrop-blur">
                  <h3 className="mb-4 text-xl font-bold text-white">
                    O que oferecemos?
                  </h3>
                  <div className="space-y-2 text-sm text-white/90">
                    <p>
                      •{" "}
                      <span className="text-accent font-semibold">
                        Consultoria técnica
                      </span>{" "}
                      especializada
                    </p>
                    <p>
                      •{" "}
                      <span className="text-accent font-semibold">
                        Projeto personalizado
                      </span>{" "}
                      para sua necessidade
                    </p>
                    <p>
                      •{" "}
                      <span className="text-accent font-semibold">
                        Fabricação
                      </span>{" "}
                      de máquinas sob medida
                    </p>
                    <p>
                      •{" "}
                      <span className="text-accent font-semibold">
                        Instalação
                      </span>{" "}
                      e treinamento completo
                    </p>
                    <p>
                      •{" "}
                      <span className="text-accent font-semibold">
                        Suporte técnico
                      </span>{" "}
                      contínuo
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
