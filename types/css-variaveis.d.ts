import 'react';

/** Custom property CSS (`--nome`) no `style` de um elemento. */
declare module 'react' {
  interface CSSProperties {
    [variavel: `--${string}`]: string | number | undefined;
  }
}
