'use client';

import type React from 'react';
import { useEffect, useRef } from 'react';

import { useInView } from 'motion/react';
import { annotate } from 'rough-notation';

type AnnotationAction =
  | 'highlight'
  | 'underline'
  | 'box'
  | 'circle'
  | 'strike-through'
  | 'crossed-off'
  | 'bracket';

interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  isView?: boolean;
  textColor?: string;
}

function resolveColor(color: string): string {
  if (typeof window === 'undefined') return color;
  if (color.startsWith('var(')) {
    const varName = color.slice(4, -1).trim();
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    return resolved || color;
  }
  return color;
}

export function Highlighter({
  children,
  action = 'highlight',
  color = 'var(--accent)',
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = true,
  textColor = 'text-white'
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, {
    once: true,
    margin: '-10%'
  });

  // Wait for element to be in view before showing animation if isView is enabled
  const shouldShow = isView ? isInView : true;

  useEffect(() => {
    if (!shouldShow) return;

    const element = elementRef.current;
    if (!element) return;

    const resolvedColor = resolveColor(color);

    const annotation = annotate(element, {
      type: action,
      color: resolvedColor,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline
    });

    annotation.show();

    return () => {
      if (element) {
        annotate(element, { type: action }).remove();
      }
    };
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline
  ]);

  return (
    <span
      ref={elementRef}
      className={`relative inline-block w-fit bg-transparent ${textColor}`}>
      {children}
    </span>
  );
}
