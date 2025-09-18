"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  specificationFormSchema,
  type SpecificationFormData,
} from "@/lib/schemas/specification-form";
import { applyPhoneMask } from "@/lib/utils/input-masks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { MaquinaData } from "../../_components/cardMaquinas/maquinasData";

interface SpecificationModalProps {
  maquina: MaquinaData;
}

export default function SpecificationModal({
  maquina,
}: SpecificationModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SpecificationFormData>({
    resolver: zodResolver(
      specificationFormSchema,
    ) as Resolver<SpecificationFormData>,
    defaultValues: {
      maquinaId: maquina.id,
      maquinaNome: maquina.name,
    },
  });

  const telefoneValue = watch("telefone");

  const onSubmit = async (data: SpecificationFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/specifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar solicitação");
      }

      toast.success(
        <p className="font-bold">Solicitação enviada com sucesso!</p>,
        {
          description: (
            <p className="">
              Entraremos em contato em breve com as especificações da máquina.
            </p>
          ),
        },
      );

      reset();
      setOpen(false);
    } catch (error) {
      console.error("Erro ao enviar especificação:", error);

      toast.error(<p className="font-bold">Erro ao enviar solicitação</p>, {
        description: <p>Tente novamente em alguns instantes.</p>,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyPhoneMask(e.target.value);
    setValue("telefone", maskedValue);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="border-border/30 rounded-xs border bg-emerald-600/90 px-8 py-5 text-lg font-semibold text-white hover:bg-emerald-600/80">
          Solicitar Especificações
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Solicitar Especificações
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Preencha os dados abaixo para receber as especificações técnicas da
            máquina{" "}
            <span className="text-accent font-semibold">{maquina.name}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label
                htmlFor="nome"
                className="text-sm font-medium text-slate-700"
              >
                Nome Completo *
              </Label>
              <Input
                id="nome"
                {...register("nome")}
                placeholder="Seu nome completo"
                className="focus:border-accent focus:ring-accent border-slate-300"
              />
              {errors.nome && (
                <p className="text-xs text-red-600">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                E-mail *
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="seu@email.com"
                className="focus:border-accent focus:ring-accent border-slate-300"
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label
                htmlFor="telefone"
                className="text-sm font-medium text-slate-700"
              >
                Telefone *
              </Label>
              <Input
                id="telefone"
                value={telefoneValue || ""}
                onChange={handlePhoneChange}
                placeholder="(11) 99999-9999"
                type="tel"
                maxLength={15}
                className="focus:border-accent focus:ring-accent border-slate-300"
              />
              {errors.telefone && (
                <p className="text-xs text-red-600">
                  {errors.telefone.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="empresa"
                className="text-sm font-medium text-slate-700"
              >
                Empresa
              </Label>
              <Input
                id="empresa"
                {...register("empresa")}
                placeholder="Nome da sua empresa"
                className="focus:border-accent focus:ring-accent border-slate-300"
              />
              {errors.empresa && (
                <p className="text-xs text-red-600">{errors.empresa.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="observacoes"
              className="text-sm font-medium text-slate-700"
            >
              Observações Adicionais
            </Label>
            <Textarea
              id="observacoes"
              {...register("observacoes")}
              placeholder="Informações adicionais sobre sua necessidade..."
              rows={3}
              className="focus:border-accent border-slate-300"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="text-slate-700 hover:text-slate-900"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Solicitar Especificações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
