"use client";

import { motion, useReducedMotion } from "motion/react";
import type React from "react";

type TriggerMode = "inView" | "mount";

export type AnimatedContainerProps = {
  delay?: number;
  className?: React.ComponentProps<"div">["className"];
  children: React.ReactNode;
  /** "inView" = anima ao entrar na viewport; "mount" = anima ao montar (bom p/ tabs, modais, carrosséis) */
  trigger?: TriggerMode;
  /** Se usar inView, permitir reanimar quando voltar a aparecer */
  once?: boolean;
  /** Fração do elemento visível para disparar (0–1). Padrão mais estável que margin negativa. */
  amount?: number;
};

export function AnimatedContainer({
  className,
  delay = 0.1,
  children,
  trigger = "inView",
  once = true,
  amount = 0.15,
}: AnimatedContainerProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  if (trigger === "mount") {
    // Garante que aparece sempre, mesmo em tabs/modais/carrosséis
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // Modo padrão: anima ao entrar na viewport (sem margin negativa)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
