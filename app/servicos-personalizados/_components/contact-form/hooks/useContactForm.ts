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
      switch (step) {
        case 1:
          step1Schema.parse(values);
          break;
        case 2:
          step2Schema.parse(values);
          break;
        case 3:
          step3Schema.parse(values);
          break;
        default:
          return false;
      }
      return true;
    } catch {
      // Os erros já estão sendo gerenciados pelo react-hook-form
      return false;
    }
  };

  // Navegação entre etapas
  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Envio do formulário
  const onSubmit = async (data: ContactFormData) => {
    console.log("Dados do formulário:", data);
    // TODO: Implementar envio de e-mail
    // await sendContactEmail(data);
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
