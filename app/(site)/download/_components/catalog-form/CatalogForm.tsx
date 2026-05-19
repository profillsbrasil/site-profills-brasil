'use client';

import { Button } from '@/components/ui/button';

import { CatalogFields } from './components/CatalogFields';
import { SuccessPanel } from './components/SuccessPanel';
import { useCatalogForm } from './hooks/useCatalogForm';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';

export function CatalogForm() {
  const { form, status, submittedEmail, onSubmit, restart } = useCatalogForm();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = form;

  const submitting = status === 'submitting';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className='w-full max-w-md rounded-2xl border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-xl sm:p-10'>
      <AnimatePresence mode='wait'>
        {status === 'success' ? (
          <SuccessPanel
            key='success'
            email={submittedEmail}
            onRestart={restart}
          />
        ) : (
          <form
            key='form'
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
            noValidate>
            <CatalogFields control={control} errors={errors} />

            <Button
              type='submit'
              disabled={!isValid || submitting}
              className='h-11 w-full bg-blue-600 text-white hover:bg-blue-500 disabled:!bg-white/10 disabled:!text-slate-400'>
              {submitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Enviando...
                </>
              ) : (
                <>
                  Solicitar Catálogo
                  <ArrowRight className='ml-2 h-4 w-4' />
                </>
              )}
            </Button>
          </form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
