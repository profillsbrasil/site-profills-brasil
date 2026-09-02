/** `gtag` e `dataLayer` são criados pelo script inline do `<GoogleAnalytics>`
    (não pelo gtag.js externo); `fbq`, pelo snippet do Pixel em
    `components/layout/metaPixel.tsx`. Ambos instalam essas globais em
    window depois da hidratação. Fica aqui, e não no componente, para
    `lib/analytics` enxergar o tipo sem importar a casca do layout. */
interface Window {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}
