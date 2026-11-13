'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import dynamic from 'next/dynamic';

import { cn } from '@/lib/utils';
import { logger } from '@/lib/utils/logger';

import { useReducedMotion } from 'motion/react';
import type { GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';

const Globe3D = dynamic(() => import('react-globe.gl'), { ssr: false });

const ACCENT = '#2d62ef';
const COUNTRIES_URL = '/data/countries-110m.geojson';

type Marker = { lat: number; lng: number; size: number; label: string };

type CountryFeature = {
  type: 'Feature';
  properties: { ISO_A2?: string };
  geometry: { type: string; coordinates: unknown };
};

const MARKERS: Marker[] = [
  { lat: -25.4284, lng: -49.2733, size: 0.7, label: 'Curitiba' },
  { lat: -22.792, lng: -49.1655, size: 0.6, label: 'Cerqueira César' }
];

const TRANSPARENT = () => 'rgba(0,0,0,0)';
const POLYGON_STROKE_COLOR = () => 'rgba(45, 98, 239, 0.55)';
const POINT_COLOR = () => ACCENT;

let cachedCountries: CountryFeature[] | null = null;
let pendingCountries: Promise<CountryFeature[]> | null = null;

function loadCountries(): Promise<CountryFeature[]> {
  if (cachedCountries) return Promise.resolve(cachedCountries);
  if (pendingCountries) return pendingCountries;
  pendingCountries = fetch(COUNTRIES_URL)
    .then((r) => r.json())
    .then((data: { features: CountryFeature[] }) => {
      cachedCountries = data.features;
      return cachedCountries;
    })
    .catch((error: unknown) => {
      logger.error('Erro ao carregar os países do globo:', error);
      pendingCountries = null;
      return [];
    });
  return pendingCountries;
}

type Controles = {
  autoRotate: boolean;
  autoRotateSpeed: number;
  enableZoom: boolean;
  enablePan: boolean;
};

/**
 * Globo 3D pesado (three + react-globe.gl): quem usa decide quando montar,
 * importando este módulo só quando o bloco entra na tela.
 */
export function Globe({
  className,
  onPronto
}: {
  className?: string;
  /** Chamado quando o globo termina de carregar e pinta o primeiro quadro */
  onPronto?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const reduzirMovimento = Boolean(useReducedMotion());
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const [countries, setCountries] = useState<CountryFeature[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      if (w > 0 && h > 0) setSize({ w, h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    void loadCountries().then((features) => {
      if (!cancelled) setCountries(features);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !globeRef.current) return;
    const ctrls = globeRef.current.controls() as Controles;
    ctrls.autoRotateSpeed = 0.5;
    ctrls.enableZoom = false;
    ctrls.enablePan = false;
    globeRef.current.pointOfView({ lat: -10, lng: -45, altitude: 2.4 });

    const renderer = (
      globeRef.current as unknown as {
        renderer: () => { setPixelRatio: (r: number) => void };
      }
    ).renderer();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  }, [ready]);

  useEffect(() => {
    if (!ready || !globeRef.current) return;
    (globeRef.current.controls() as Controles).autoRotate = !reduzirMovimento;
  }, [ready, reduzirMovimento]);

  // Fora da tela ou com a aba oculta, o laço de render para (giro incluso)
  useEffect(() => {
    const globo = globeRef.current;
    const el = containerRef.current;
    if (!ready || !globo || !el) return;

    let naTela = true;
    const aplicar = () => {
      if (naTela && document.visibilityState === 'visible') {
        globo.resumeAnimation();
      } else {
        globo.pauseAnimation();
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      naTela = entry.isIntersecting;
      aplicar();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', aplicar);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', aplicar);
    };
  }, [ready]);

  const globeMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: new THREE.Color('#ffffff'),
        transparent: true,
        opacity: 0.6,
        shininess: 6,
        specular: new THREE.Color('#c4d3ff')
      }),
    []
  );

  const rendererConfig = useMemo(
    () => ({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power' as const
    }),
    []
  );

  return (
    <div
      ref={containerRef}
      className={cn('relative size-full overflow-hidden', className)}>
      {size.w > 0 && size.h > 0 && (
        <Globe3D
          ref={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor='rgba(0,0,0,0)'
          globeMaterial={globeMaterial}
          showAtmosphere
          atmosphereColor={ACCENT}
          atmosphereAltitude={0.08}
          showGraticules={false}
          animateIn={!reduzirMovimento}
          waitForGlobeReady
          onGlobeReady={() => {
            setReady(true);
            onPronto?.();
          }}
          enablePointerInteraction={false}
          rendererConfig={rendererConfig}
          polygonsData={countries}
          polygonAltitude={0}
          polygonCapColor={TRANSPARENT}
          polygonSideColor={TRANSPARENT}
          polygonStrokeColor={POLYGON_STROKE_COLOR}
          polygonCapCurvatureResolution={12}
          polygonsTransitionDuration={0}
          pointsData={MARKERS}
          pointLat='lat'
          pointLng='lng'
          pointAltitude={0.015}
          pointRadius='size'
          pointColor={POINT_COLOR}
          pointResolution={6}
          pointsMerge
        />
      )}
    </div>
  );
}
