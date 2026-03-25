import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getFallbackReasonFromModelViewerError,
  parseStoredModel3DSupport,
  resolveModel3DRenderMode
} from '../../components/modelo3d/model3dSupport.ts';

test('parseStoredModel3DSupport returns supported state', () => {
  assert.deepEqual(parseStoredModel3DSupport('supported'), {
    reason: null,
    status: 'supported'
  });
});

test('parseStoredModel3DSupport returns unsupported state for webgl context loss', () => {
  assert.deepEqual(parseStoredModel3DSupport('webglcontextlost'), {
    reason: 'webglcontextlost',
    status: 'unsupported'
  });
});

test('getFallbackReasonFromModelViewerError treats webglcontextlost as terminal', () => {
  const event = {
    detail: {
      type: 'webglcontextlost'
    }
  };

  assert.equal(
    getFallbackReasonFromModelViewerError(event),
    'webglcontextlost'
  );
});

test('resolveModel3DRenderMode prefers poster while support is unresolved', () => {
  assert.equal(
    resolveModel3DRenderMode({
      shouldMountModelViewer: false,
      shouldShowPoster: true,
      supportStatus: 'unknown'
    }),
    'poster'
  );
});
