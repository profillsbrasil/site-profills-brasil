import '@testing-library/jest-dom/vitest';

import { vi } from 'vitest';

class IntersectionObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '';
  thresholds = [];
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);

if ('Element' in globalThis) {
  Element.prototype.setPointerCapture = () => undefined;

  Element.prototype.releasePointerCapture = () => undefined;
}

if ('window' in globalThis && !window.matchMedia) {
  window.matchMedia = (media) =>
    Object.assign(new EventTarget(), {
      media,
      matches: false,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined
    });
}
