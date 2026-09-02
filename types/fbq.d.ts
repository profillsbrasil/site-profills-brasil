/** Meta Pixel: o snippet do fbevents.js instala `fbq` em window depois da
    hidratação. Fica aqui, e não no componente, para `lib/analytics` enxergar
    o tipo sem importar a casca do layout. */
interface Window {
  fbq?: (...args: unknown[]) => void;
}
