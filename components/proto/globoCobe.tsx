'use client';

import { useEffect, useRef } from 'react';

import createGlobe from 'cobe';

const ACCENT: [number, number, number] = [45 / 255, 98 / 255, 239 / 255];
// phi inicial que põe o Brasil de frente (lng -49)
const PHI_BRASIL = 4.15;

export default function GloboCobe({ girar }: { girar: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const lado = canvas.offsetWidth;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let phi = PHI_BRASIL;
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: lado * dpr,
      height: lado * dpr,
      phi,
      theta: 0.25,
      dark: 0,
      diffuse: 1.1,
      mapSamples: 14000,
      mapBrightness: 5,
      mapBaseBrightness: 0.05,
      baseColor: [0.94, 0.95, 0.98],
      markerColor: ACCENT,
      glowColor: [0.85, 0.89, 1],
      markers: [
        { location: [-25.43, -49.27], size: 0.06 },
        { location: [-22.79, -49.17], size: 0.05 }
      ]
    });

    let raf = 0;
    let visivel = true;
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel && girar && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);
    function tick() {
      raf = 0;
      if (!visivel) return;
      phi += 0.004;
      globe.update({ phi });
      raf = requestAnimationFrame(tick);
    }
    if (girar) raf = requestAnimationFrame(tick);
    canvas.style.opacity = '1';

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      globe.destroy();
    };
  }, [girar]);

  return (
    <canvas
      ref={canvasRef}
      data-proto-cobe
      className='aspect-square h-full max-h-full w-auto max-w-full opacity-0 transition-opacity duration-500 motion-reduce:transition-none'
    />
  );
}
