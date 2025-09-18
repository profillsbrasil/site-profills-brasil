"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactFormData } from "@/lib/schemas/contact-form";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface FormStep2Props {
  control: Control<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
}

export function FormStep2({ control, errors }: FormStep2Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Endereço</h2>
        <p className="text-muted-foreground">
          Complete os dados do seu endereço
        </p>
      </div>

      <div className="space-y-4">
        {/* Rua */}
        <div className="space-y-2">
          <Label htmlFor="street">Rua/Logradouro</Label>
          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="street"
                placeholder="Rua das Flores"
                disabled
                className="!bg-muted"
              />
            )}
          />
        </div>

        {/* Número e Complemento */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="number">Número *</Label>
            <Controller
              name="number"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="number"
                  type="number"
                  placeholder="123"
                  className={cn(
                    "!bg-muted",
                    errors.number
                      ? "border-red-500 focus-visible:ring-red-500/20"
                      : "",
                  )}
                />
              )}
            />
            {errors.number && (
              <p className="text-sm text-red-500">{errors.number.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="complement">Complemento</Label>
            <Controller
              name="complement"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="complement"
                  placeholder="Apto 405 B"
                  className="!bg-muted"
                />
              )}
            />
          </div>
        </div>

        {/* Bairro */}
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Controller
            name="neighborhood"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="neighborhood"
                placeholder="Centro"
                disabled
                className="!bg-muted"
              />
            )}
          />
        </div>

        {/* Cidade e Estado */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade *</Label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="city"
                  placeholder="São Paulo"
                  disabled
                  className={cn(
                    "!bg-muted",
                    errors.city
                      ? "border-red-500 focus-visible:ring-red-500/20"
                      : "",
                  )}
                />
              )}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">Estado *</Label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="state"
                  placeholder="SP"
                  disabled
                  className={cn(
                    "!bg-muted",
                    errors.state
                      ? "border-red-500 focus-visible:ring-red-500/20"
                      : "",
                  )}
                />
              )}
            />
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state.message}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
