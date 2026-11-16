import { semBancoDiretoRule } from './sem-banco-direto.ts';
import { RuleTester } from 'oxlint/plugins-dev';

const tester = new RuleTester({
  cwd: '/repo',
  languageOptions: { parserOptions: { lang: 'tsx' } }
});

const acao = '/repo/app/(standalone)/admin/blog/acoes.ts';
const editor = '/repo/app/(standalone)/admin/blog/_components/editor-blog.tsx';

tester.run('profills/sem-banco-direto', semBancoDiretoRule, {
  valid: [
    {
      code: "import { abrirAdminBlog } from '@/lib/blog/admin';",
      filename: acao
    },
    {
      code: "import { lerPublicado } from '@/lib/blog/leitura';",
      filename: acao
    },
    {
      code: "import type { Consulta } from '@/lib/banco/tipos';",
      filename: acao
    },
    {
      code: "import { type RepositorioBlog } from '@/lib/blog/repositorio';",
      filename: acao
    },
    {
      code: "import { consultar } from '@/lib/banco/conexao';",
      filename: '/repo/lib/blog/repositorio.ts'
    },
    {
      code: "import { repositorioBlog } from './repositorio';",
      filename: '/repo/lib/blog/admin.ts'
    },
    {
      code: "import { migrar } from '../lib/banco/migrar.mjs';",
      filename: '/repo/scripts/banco-migrar.mjs'
    },
    {
      code: "import { abrirPglite } from '@/lib/banco/pglite';",
      filename: '/repo/app/(standalone)/admin/blog/acoes.test.ts'
    },
    { code: "import pg from 'pg';", filename: acao }
  ],
  invalid: [
    {
      code: "import { repositorioBlog } from '@/lib/blog/repositorio';",
      filename: acao,
      errors: [{ messageId: 'interno' }]
    },
    {
      code: "import { consultar } from '@/lib/banco/conexao';",
      filename: acao,
      errors: [{ messageId: 'interno' }]
    },
    {
      code: "import { repositorioBlog } from '../../../../../lib/blog/repositorio';",
      filename: editor,
      errors: [{ messageId: 'interno' }]
    },
    {
      code: "import { consultar } from '../../../../../lib/banco/conexao.ts';",
      filename: acao.replace('acoes.ts', 'x/y.ts'),
      errors: [{ messageId: 'interno' }]
    },
    {
      code: "import { criarArmazemDisco } from '@/lib/armazem/armazem';",
      filename: '/repo/components/qualquer.tsx',
      errors: [{ messageId: 'interno' }]
    },
    {
      code: "const banco = import('@/lib/banco/conexao');",
      filename: '/repo/app/(site)/blog/page.tsx',
      errors: [{ messageId: 'interno' }]
    },
    {
      code: "export { consultar } from '@/lib/banco/conexao';",
      filename: '/repo/lib/utils/banco.ts',
      errors: [{ messageId: 'interno' }]
    }
  ]
});
