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

// O jsdom não implementa a captura de ponteiro que o vaul pede no toque dentro da folha.
Element.prototype.setPointerCapture = () => undefined;

Element.prototype.releasePointerCapture = () => undefined;
