"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactFormData } from "@/lib/schemas/contact-form";
import { cn } from "@/lib/utils";
import { IMaskInput } from "react-imask";
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

      <div className="w-full space-y-4 md:min-w-[450px]">
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
              <IMaskInput
                id="phone"
                mask={["(00) 0000-0000", "(00) 00000-0000"]}
                value={field.value as unknown as string}
                onAccept={(val: unknown) => field.onChange(String(val))}
                placeholder="(11) 99999-9999"
                type="tel"
                inputMode="numeric"
                className={cn(
                  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input bg-muted flex h-9 w-full min-w-0 rounded-xs border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
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
                <IMaskInput
                  {...field}
                  id="cep"
                  mask="00000-000"
                  placeholder="12345-678"
                  onAccept={(value: unknown) => {
                    const v = String(value);
                    field.onChange(v);
                    onCepComplete(v);
                  }}
                  className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input bg-muted flex h-9 w-full min-w-0 rounded-xs border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
                    "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
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
