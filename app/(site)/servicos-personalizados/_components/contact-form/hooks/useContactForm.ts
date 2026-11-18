'use client';

import { useState } from 'react';

import { registrarLeadIndicacao } from '@/lib/analytics/indicacao';
import {
  type ContactFormData,
  contactFormSchema,
  step1Schema,
  step2Schema,
  step3Schema
} from '@/lib/schemas/contact-form';
import { fetchAddressByCep } from '@/lib/utils/cep-utils';
import { logger } from '@/lib/utils/logger';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export function useContactForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      phone: '',
      cep: '',
      number: '',
      complement: '',
      city: '',
      state: '',
      material: '',
      service: '',
      finish: '',
      details: ''
    }
  });

  const handleCepComplete = async (cep: string) => {
    if (cep.replace(/\D/g, '').length === 8) {
      setIsLoadingCep(true);

      try {
        const data = await fetchAddressByCep(cep);

        if (data) {
          form.setValue('street', data.logradouro);
          form.setValue('neighborhood', data.bairro);
          form.setValue('city', data.localidade);
          form.setValue('state', data.uf);

          form.clearErrors('cep');
        }
      } catch (error) {
        form.setError('cep', {
          message: error instanceof Error ? error.message : 'Erro ao buscar CEP'
        });
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const validateStep = async (step: number) => {
    const values = form.getValues();
    let fieldsToValidate: (keyof ContactFormData)[] = [];

    try {
      let schema;

      switch (step) {
        case 1:
          schema = step1Schema;
          fieldsToValidate = ['email', 'phone', 'cep'];
          break;
        case 2:
          schema = step2Schema;
          fieldsToValidate = ['number', 'city', 'state'];
          break;
        case 3:
          schema = step3Schema;
          fieldsToValidate = ['material', 'service', 'finish'];
          break;
        default:
          return false;
      }

      schema.parse(values);

      fieldsToValidate.forEach((field) => {
        form.clearErrors(field);
      });

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          const fieldName = fieldsToValidate.find(
            (campo) => campo === issue.path[0]
          );

          if (fieldName === undefined) return;
          form.setError(fieldName, {
            type: 'manual',
            message: issue.message
          });
        });
      }

      return false;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      const fieldsToTrigger = getFieldsForStep(currentStep);
      fieldsToTrigger.forEach((field) => {
        void form.trigger(field);
      });
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ['email', 'phone', 'cep'] satisfies (keyof ContactFormData)[];
      case 2:
        return ['number', 'city', 'state'] satisfies (keyof ContactFormData)[];
      case 3:
        return [
          'material',
          'service',
          'finish'
        ] satisfies (keyof ContactFormData)[];
      default:
        return [] satisfies (keyof ContactFormData)[];
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      logger.info('Enviando dados do formulário:', data);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao enviar solicitação');
      }

      logger.info('✅ Solicitação enviada com sucesso:', result);

      registrarLeadIndicacao('contato', result?.indicacao?.codigo ?? null);

      toast.success('Solicitação enviada com sucesso!', {
        description:
          'Entraremos em contato em breve para elaborar seu orçamento personalizado.',
        duration: 5000
      });

      form.reset();
      setCurrentStep(1);
    } catch (error) {
      logger.error('❌ Erro ao enviar solicitação:', error);

      toast.error('Erro ao enviar solicitação', {
        description:
          error instanceof Error
            ? error.message
            : 'Tente novamente em alguns instantes.',
        duration: 5000
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
    onSubmit
  };
}
