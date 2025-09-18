"use client";

import { MutableRefObject, useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  rootMargin?: string;
  once?: boolean;
}

export function useInView<T extends Element>(
  options: UseInViewOptions = { rootMargin: "200px", once: true },
): { ref: MutableRefObject<T | null>; inView: boolean } {
  const targetRef = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
          if (options.once !== false) observer.disconnect();
        } else if (options.once === false) {
          setInView(false);
        }
      },
      {
        root: null,
        rootMargin: options.rootMargin ?? "200px",
        threshold: 0.01,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.rootMargin, options.once]);

  return { ref: targetRef, inView };
}
