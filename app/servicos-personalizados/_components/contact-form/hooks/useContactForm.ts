"use client";

import {
  contactFormSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  type ContactFormData,
} from "@/lib/schemas/contact-form";
import { fetchAddressByCep } from "@/lib/utils/cep-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function useContactForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      phone: "",
      cep: "",
      number: "",
      complement: "",
      city: "",
      state: "",
      material: "",
      service: "",
      finish: "",
      details: "",
    },
  });

  // Função para buscar CEP
  const handleCepComplete = async (cep: string) => {
    if (cep.replace(/\D/g, "").length === 8) {
      setIsLoadingCep(true);
      try {
        const data = await fetchAddressByCep(cep);
        if (data) {
          form.setValue("street", data.logradouro);
          form.setValue("neighborhood", data.bairro);
          form.setValue("city", data.localidade);
          form.setValue("state", data.uf);

          // Limpa erro de CEP se existir
          form.clearErrors("cep");
        }
      } catch (error) {
        form.setError("cep", {
          message:
            error instanceof Error ? error.message : "Erro ao buscar CEP",
        });
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  // Validação por etapa
  const validateStep = async (step: number): Promise<boolean> => {
    const values = form.getValues();

    try {
      let schema;
      let fieldsToValidate: (keyof ContactFormData)[] = [];

      switch (step) {
        case 1:
          schema = step1Schema;
          fieldsToValidate = ["email", "phone", "cep"];
          break;
        case 2:
          schema = step2Schema;
          fieldsToValidate = ["number", "city", "state"];
          break;
        case 3:
          schema = step3Schema;
          fieldsToValidate = ["material", "service", "finish"];
          break;
        default:
          return false;
      }

      // Valida o schema
      schema.parse(values);

      // Limpa erros dos campos da etapa atual
      fieldsToValidate.forEach((field) => {
        form.clearErrors(field);
      });

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Define os erros específicos da etapa
        error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as keyof ContactFormData;
          form.setError(fieldName, {
            type: "manual",
            message: issue.message,
          });
        });
      }
      return false;
    }
  };

  // Navegação entre etapas
  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Força a revalidação dos campos para mostrar erros
      const fieldsToTrigger = getFieldsForStep(currentStep);
      fieldsToTrigger.forEach((field) => {
        form.trigger(field);
      });
    }
  };

  // Função auxiliar para obter campos de cada etapa
  const getFieldsForStep = (step: number): (keyof ContactFormData)[] => {
    switch (step) {
      case 1:
        return ["email", "phone", "cep"];
      case 2:
        return ["number", "city", "state"];
      case 3:
        return ["material", "service", "finish"];
      default:
        return [];
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Envio do formulário
  const onSubmit = async (data: ContactFormData) => {
    try {
      console.log("Enviando dados do formulário:", data);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao enviar solicitação");
      }

      console.log("✅ Solicitação enviada com sucesso:", result);

      // Feedback visual de sucesso
      toast.success("Solicitação enviada com sucesso!", {
        description:
          "Entraremos em contato em breve para elaborar seu orçamento personalizado.",
        duration: 5000,
      });

      // Reset do formulário após sucesso
      form.reset();
      setCurrentStep(1);
    } catch (error) {
      console.error("❌ Erro ao enviar solicitação:", error);

      // Feedback visual de erro
      toast.error("Erro ao enviar solicitação", {
        description:
          error instanceof Error
            ? error.message
            : "Tente novamente em alguns instantes.",
        duration: 5000,
      });
    }
  };

  return {
    form,
    currentStep,
    isLoadingCep,
    handleCepComplete,
    validateStep,
    nextStep,
    prevStep,
    onSubmit,
  };
}
