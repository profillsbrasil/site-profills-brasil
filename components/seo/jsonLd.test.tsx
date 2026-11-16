import { render } from '@testing-library/react';

import { JsonLd } from './jsonLd';
import { describe, expect, it } from 'vitest';

describe('JsonLd', () => {
  it('título com </script> não fecha a tag e volta intacto no JSON', () => {
    const headline = 'Feira</script><script>alert(1)</script>';

    const { container } = render(
      <JsonLd data={{ '@type': 'BlogPosting', headline }} />
    );

    const scripts = container.querySelectorAll('script');

    expect(scripts).toHaveLength(1);
    expect(scripts[0].innerHTML).not.toContain('</script');
    expect(JSON.parse(scripts[0].textContent ?? '')).toEqual({
      '@type': 'BlogPosting',
      headline
    });
  });
});
