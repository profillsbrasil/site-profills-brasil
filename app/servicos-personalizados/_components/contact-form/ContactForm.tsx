"use client";

import { Button } from "@/components/ui/button";
import corteLaser from "@/lib/images/extras/cortador.jpg";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, CircleCheck } from "lucide-react";
import Image from "next/image";
import { FormStep1 } from "./components/FormStep1";
import { FormStep2 } from "./components/FormStep2";
import { FormStep3 } from "./components/FormStep3";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { useContactForm } from "./hooks/useContactForm";

export default function ContactForm() {
  const {
    form,
    currentStep,
    isLoadingCep,
    handleCepComplete,
    nextStep,
    prevStep,
    onSubmit,
  } = useContactForm();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const handleContinue = async () => {
    if (currentStep === 3) {
      // Última etapa - enviar formulário
      await handleSubmit(onSubmit)();
    } else {
      // Próxima etapa
      await nextStep();
    }
  };

  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep1
            control={control}
            errors={errors}
            isLoadingCep={isLoadingCep}
            onCepComplete={handleCepComplete}
          />
        );
      case 2:
        return <FormStep2 control={control} errors={errors} />;
      case 3:
        return <FormStep3 control={control} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div
      id="entre-em-contato"
      className="flex w-full items-center justify-center"
    >
      {/* Imagem lateral */}
      <div className="flex h-full min-h-[65vh] w-1/2 items-center justify-center">
        <div className="flex h-full w-full">
          <Image
            src={corteLaser}
            alt="Corte Laser"
            className="z-10 h-full w-full rounded-sm object-contain"
          />
        </div>
      </div>

      {/* Formulário */}
      <div className="flex h-full min-h-[65vh] w-1/2 items-center justify-center">
        <div className="mx-auto flex h-fit max-w-md flex-col items-center justify-center gap-10 rounded-sm">
          {/* Indicador de progresso */}
          <div className="relative">
            <ProgressIndicator currentStep={currentStep} />
          </div>

          {/* Etapas do formulário */}
          <div className="w-full">{getCurrentStepComponent()}</div>

          {/* Botões de navegação */}
          <div className="w-full">
            <motion.div
              className="flex items-center gap-3"
              animate={{
                justifyContent: currentStep === 1 ? "center" : "space-between",
              }}
            >
              {/* Botão Voltar */}
              {currentStep > 1 && (
                <motion.div
                  initial={{ opacity: 0, width: 0, scale: 0.8 }}
                  animate={{ opacity: 1, width: "auto", scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    mass: 0.8,
                    duration: 0.6,
                  }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center gap-2 hover:text-slate-900"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft size={16} />
                    Voltar
                  </Button>
                </motion.div>
              )}

              {/* Botão Continuar/Finalizar */}
              <Button
                type="button"
                onClick={handleContinue}
                disabled={isSubmitting || isLoadingCep}
                className={cn(
                  "bg-slate-900 text-white transition-colors hover:bg-slate-800",
                  currentStep === 1 ? "w-full" : "flex-1",
                )}
              >
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white">
                  {currentStep === 3 && !isSubmitting && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                        mass: 0.5,
                      }}
                    >
                      <CircleCheck size={16} />
                    </motion.div>
                  )}
                  {isSubmitting
                    ? "Enviando..."
                    : currentStep === 3
                      ? "Finalizar"
                      : "Continuar"}
                </div>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
