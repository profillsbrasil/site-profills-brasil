'use client';

import { useState } from 'react';

import { registrarLeadIndicacao } from '@/lib/analytics/indicacao';
import {
  type CatalogRequestData,
  catalogRequestSchema
} from '@/lib/schemas/catalog-request';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Status = 'idle' | 'submitting' | 'success';

export function useCatalogForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [submittedEmail, setSubmittedEmail] = useState<string>('');

  const form = useForm<CatalogRequestData>({
    resolver: zodResolver(catalogRequestSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      document: '',
      phone: '',
      email: ''
    }
  });

  const onSubmit = async (values: CatalogRequestData) => {
    setStatus('submitting');
    try {
      const res = await fetch('/api/download-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(
          payload?.message || 'Não foi possível enviar. Tente novamente.'
        );
      }

      const corpo = await res.json().catch(() => ({}));
      registrarLeadIndicacao('catalogo', corpo?.indicacao?.codigo ?? null);

      setSubmittedEmail(values.email);
      setStatus('success');
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Erro inesperado. Tente novamente em instantes.'
      );
      setStatus('idle');
    }
  };

  const restart = () => {
    form.reset();
    setSubmittedEmail('');
    setStatus('idle');
  };

  return { form, status, submittedEmail, onSubmit, restart };
}
