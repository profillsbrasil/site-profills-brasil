import { useState } from 'react';

import { cn } from '@/lib/utils';

import { motion } from 'framer-motion';
import { CircleCheck } from 'lucide-react';

const ProgressIndicator = () => {
  const [step, setStep] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
      setIsExpanded(false);
    }
  };

  const handleBack = () => {
    if (step == 2) {
      setIsExpanded(true);
    }
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progressScale = step === 1 ? 0.25 : step === 2 ? 0.625 : 1;

  return (
    <div className='flex flex-col items-center justify-center gap-8'>
      <div className='relative flex items-center gap-6'>
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={cn(
              'relative z-10 h-3 w-3 rounded-full',
              dot <= step ? 'bg-secondary-foreground' : 'bg-muted'
            )}
          />
        ))}

        <motion.div
          initial={{ scaleX: 0.125 }}
          animate={{ scaleX: progressScale }}
          style={{ transformOrigin: 'left' }}
          className='absolute -top-[8px] -left-[8px] h-3 w-[96px] -translate-y-1/2 rounded-full bg-accent'
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            mass: 0.8
          }}
        />
      </div>

      <div className='w-full max-w-sm'>
        <div className={cn('flex items-center gap-1', !isExpanded && 'justify-between')}>
          {!isExpanded && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 15,
                mass: 0.8,
                opacity: { duration: 0.2 }
              }}
              onClick={handleBack}
              className='flex w-16 items-center justify-center rounded-full bg-muted px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/80'>
              Voltar
            </motion.button>
          )}
          <motion.button
            onClick={handleContinue}
            animate={{
              flex: isExpanded ? 1 : 'inherit'
            }}
            className={cn(
              'w-56 flex-1 rounded-full bg-primary px-4 py-3 text-primary-foreground transition-colors',
              !isExpanded && 'w-44'
            )}>
            <div className='flex items-center justify-center gap-2 text-sm font-[600]'>
              {step === 3 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 15,
                    mass: 0.5
                  }}>
                  <CircleCheck size={16} />
                </motion.div>
              )}
              {step === 3 ? 'Finalizar' : 'Continuar'}
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
