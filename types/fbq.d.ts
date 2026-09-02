/** Meta Pixel e GA: os snippets do fbevents.js e do gtag.js instalam essas
    globais em window depois da hidratação. Fica aqui, e não no componente,
    para `lib/analytics` enxergar o tipo sem importar a casca do layout. */
interface Window {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}
