import robots from '../robots';
import { describe, expect, it } from 'vitest';

describe('robots.txt', () => {
  it('tira o admin do índice', () => {
    expect(robots().rules).toMatchObject({
      disallow: expect.arrayContaining(['/admin/'])
    });
  });
});
