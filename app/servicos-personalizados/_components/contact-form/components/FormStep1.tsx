"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactFormData } from "@/lib/schemas/contact-form";
import { cn } from "@/lib/utils";
import { applyCepMask, applyPhoneMask } from "@/lib/utils/input-masks";
import { motion } from "framer-motion";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface FormStep1Props {
  control: Control<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
  isLoadingCep: boolean;
  onCepComplete: (cep: string) => void;
}

export function FormStep1({
  control,
  errors,
  isLoadingCep,
  onCepComplete,
}: FormStep1Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Solicite seu Orçamento</h2>
        <p className="text-muted-foreground">
          Vamos começar com seus dados básicos
        </p>
      </div>

      <div className="space-y-4">
        {/* E-mail */}
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="seu@email.com"
                className={cn(
                  "!bg-muted",
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500/20"
                    : "",
                )}
              />
            )}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                maxLength={15}
                onChange={(e) => {
                  const maskedValue = applyPhoneMask(e.target.value);
                  field.onChange(maskedValue);
                }}
                className={cn(
                  "!bg-muted",
                  errors.phone
                    ? "border-red-500 focus-visible:ring-red-500/20"
                    : "",
                )}
              />
            )}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* CEP */}
        <div className="space-y-2">
          <Label htmlFor="cep">CEP *</Label>
          <div className="relative">
            <Controller
              name="cep"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="cep"
                  type="text"
                  placeholder="12345-678"
                  maxLength={9}
                  onChange={(e) => {
                    const maskedValue = applyCepMask(e.target.value);
                    field.onChange(maskedValue);
                    onCepComplete(maskedValue);
                  }}
                  className={cn(
                    "!bg-muted",
                    errors.cep
                      ? "border-red-500 focus-visible:ring-red-500/20"
                      : "",
                  )}
                />
              )}
            />
            {isLoadingCep && (
              <div className="absolute top-1/2 right-3 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              </div>
            )}
          </div>
          {errors.cep && (
            <p className="text-sm text-red-500">{errors.cep.message}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
