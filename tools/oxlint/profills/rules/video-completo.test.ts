import { videoCompletoRule } from './video-completo.ts';
import { RuleTester } from 'oxlint/plugins-dev';

const tester = new RuleTester({
  languageOptions: { parserOptions: { lang: 'tsx' } }
});

tester.run('profills/video-completo', videoCompletoRule, {
  valid: [
    "<video controls preload='metadata' poster={video.poster} src={video.src} />",
    "<video autoPlay muted loop preload='metadata' poster='/videos/a.webp' />",
    "<video autoPlay={false} poster='/videos/a.webp' />",
    '<video {...props} />'
  ],
  invalid: [
    {
      code: "<video controls src='/videos/a.mp4' />",
      errors: [{ messageId: 'semPoster' }]
    },
    {
      code: "<video autoPlay muted poster='/videos/a.webp' />",
      errors: [{ messageId: 'autoplaySemPreload' }]
    },
    {
      code: "<video src='/videos/a.mp4' autoPlay loop muted playsInline />",
      errors: [{ messageId: 'semPoster' }, { messageId: 'autoplaySemPreload' }]
    }
  ]
});
