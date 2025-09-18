"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ContactFormData } from "@/lib/schemas/contact-form";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface FormStep3Props {
  control: Control<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
}

const materials = [
  { value: "aco-inox", label: "Aço Inox" },
  { value: "aco-carbono", label: "Aço Carbono" },
];

const services = [
  { value: "corte", label: "Corte" },
  { value: "corte-dobra", label: "Corte + Dobra" },
  { value: "corte-dobra-solda", label: "Corte + Dobra + Solda" },
];

const finishes = [
  { value: "escovado", label: "Escovado" },
  { value: "polido", label: "Polido" },
  { value: "sem-acabamento", label: "Sem Acabamento" },
];

export function FormStep3({ control, errors }: FormStep3Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Sua Ideia</h2>
        <p className="text-muted-foreground">
          Conte-nos sobre o projeto que você tem em mente
        </p>
      </div>

      <div className="space-y-4">
        {/* Material */}
        <div className="space-y-2">
          <Label htmlFor="material">Material *</Label>
          <Controller
            name="material"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={cn(
                    "!bg-muted w-full",
                    errors.material
                      ? "border-red-500 focus:ring-red-500/20"
                      : "",
                  )}
                >
                  <SelectValue placeholder="Selecione o material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material.value} value={material.value}>
                      {material.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.material && (
            <p className="text-sm text-red-500">{errors.material.message}</p>
          )}
        </div>

        {/* Serviço */}
        <div className="space-y-2">
          <Label htmlFor="service">Serviços *</Label>
          <Controller
            name="service"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={cn(
                    "!bg-muted w-full",
                    errors.service
                      ? "border-red-500 focus:ring-red-500/20"
                      : "",
                  )}
                >
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.service && (
            <p className="text-sm text-red-500">{errors.service.message}</p>
          )}
        </div>

        {/* Acabamento */}
        <div className="space-y-2">
          <Label htmlFor="finish">Acabamento *</Label>
          <Controller
            name="finish"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={cn(
                    "!bg-muted w-full",
                    errors.finish ? "border-red-500 focus:ring-red-500/20" : "",
                  )}
                >
                  <SelectValue placeholder="Selecione o acabamento" />
                </SelectTrigger>
                <SelectContent>
                  {finishes.map((finish) => (
                    <SelectItem key={finish.value} value={finish.value}>
                      {finish.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.finish && (
            <p className="text-sm text-red-500">{errors.finish.message}</p>
          )}
        </div>

        {/* Detalhes */}
        <div className="space-y-2">
          <Label htmlFor="details">Detalhes Adicionais</Label>
          <Controller
            name="details"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                id="details"
                placeholder="Descreva detalhes específicos do seu projeto, medidas, quantidades, prazo desejado, etc."
                className="!bg-muted min-h-24"
              />
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}
