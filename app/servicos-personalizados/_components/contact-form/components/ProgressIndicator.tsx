"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export function ProgressIndicator({
  currentStep,
  totalSteps = 3,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={cn(
            "relative z-10 flex h-2 w-2 rounded-full transition-colors duration-300",
            step <= currentStep ? "bg-white" : "bg-slate-900",
          )}
        />
      ))}

      {/* Barra de progresso animada */}
      <motion.div
        initial={{ width: "12px" }}
        animate={{
          width:
            currentStep === 1 ? "24px" : currentStep === 2 ? "60px" : "96px",
        }}
        className="bg-accent absolute top-1/2 -left-[8px] h-6 -translate-y-1/2 rounded-full"
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.8,
          duration: 0.6,
        }}
      />
    </div>
  );
}
