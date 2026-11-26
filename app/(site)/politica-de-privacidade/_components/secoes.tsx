import { WhatsAppIcon } from '@/components/layout/socialLinks';
import { CONTATO_PADRAO } from '@/lib/data/contatos';
import desenhoArquivo from '@/lib/images/privacidade/arquivo.webp';
import desenhoCaixa from '@/lib/images/privacidade/caixa-lacrada.webp';
import desenhoCarimbo from '@/lib/images/privacidade/carimbo.webp';
import desenhoCelular from '@/lib/images/privacidade/celular.webp';
import desenhoChave from '@/lib/images/privacidade/chave-vertical.webp';
import desenhoCofre from '@/lib/images/privacidade/cofre.webp';
import desenhoEnvelope from '@/lib/images/privacidade/envelope.webp';
import desenhoInterruptor from '@/lib/images/privacidade/interruptor.webp';
import desenhoMonitor from '@/lib/images/privacidade/monitor.webp';
import desenhoPrancheta from '@/lib/images/privacidade/prancheta.webp';
import desenhoRelatorio from '@/lib/images/privacidade/relatorio.webp';
import desenhoValvula from '@/lib/images/privacidade/valvula.webp';
import { waLink } from '@/lib/utils/whatsapp';

import { Bloco, Folha, classeLink } from './folha';
import { Mail } from 'lucide-react';

export const secoes = [
  { id: 'dados-coletados', titulo: 'Quais dados coletamos' },
  { id: 'uso-dos-dados', titulo: 'Para que usamos os dados' },
  { id: 'compartilhamento', titulo: 'Com quem compartilhamos' },
  {
    id: 'aplicativo-de-metricas',
    titulo: 'Aplicativo interno de métricas das redes sociais'
  },
  { id: 'prazo-de-guarda', titulo: 'Por quanto tempo guardamos' },
  { id: 'seguranca', titulo: 'Segurança' },
  { id: 'seus-direitos', titulo: 'Seus direitos' },
  { id: 'cookies', titulo: 'Cookies' },
  { id: 'contato', titulo: 'Contato' },
  { id: 'alteracoes', titulo: 'Alterações' }
] as const;

type IdSecao = (typeof secoes)[number]['id'];

const dadosColetados = [
  {
    nome: 'Dados que você nos envia',
    texto:
      'Nome, empresa, e-mail, telefone ou WhatsApp, cidade e informações sobre o seu produto, quando você preenche um formulário, pede uma proposta ou fala com a nossa equipe.'
  },
  {
    nome: 'Dados de navegação',
    texto:
      'Endereço IP, tipo de navegador, páginas visitadas e cookies necessários para o site funcionar e para entendermos, de forma agregada, como ele é usado.'
  }
];

const usos = [
  'Responder a contatos, preparar propostas técnicas e comerciais e prestar suporte e pós-venda;',
  'enviar informações sobre máquinas e serviços, quando você pedir ou autorizar;',
  'melhorar o site, o nosso conteúdo e o atendimento;',
  'cumprir obrigações legais e fiscais.'
];

const direitos = [
  'confirmação de que tratamos seus dados',
  'acesso',
  'correção',
  'anonimização',
  'portabilidade',
  'eliminação',
  'informação sobre compartilhamento',
  'revogação do consentimento'
];

const revogacao = [
  { rede: 'Instagram e Facebook', caminho: 'Configurações › Apps e sites' },
  {
    rede: 'TikTok',
    caminho: 'Configurações › Segurança › Apps com permissão'
  }
];

const URL_PERMISSOES_GOOGLE = 'https://myaccount.google.com/permissions';

const EMAIL_PRIVACIDADE = CONTATO_PADRAO.privacidade.email;

const WHATSAPP_PRIVACIDADE = CONTATO_PADRAO.privacidade.telefone.replace(
  /^(\d{2})(\d{2})(\d{5})(\d{4})$/,
  '+$1 $2 $3-$4'
);

const classeItem =
  "relative pl-5 before:absolute before:top-[0.72em] before:left-0 before:size-1.5 before:bg-accent before:content-['']";

const classeBotaoContato =
  'flex min-w-0 items-center gap-3.5 rounded-xs border border-dashed border-[rgba(148,178,235,0.55)] bg-[#172038] px-4 py-3.5 transition-colors hover:border-solid hover:border-accent focus-visible:border-solid focus-visible:border-accent focus-visible:outline-none';

function Lista({ itens, className }: { itens: string[]; className?: string }) {
  return (
    <ul className={className ?? 'flex flex-col gap-2'}>
      {itens.map((item) => (
        <li key={item} className={classeItem}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function LinkSecao({
  id,
  children
}: {
  id: IdSecao;
  children: React.ReactNode;
}) {
  return (
    <a href={`#${id}`} className={classeLink}>
      {children}
    </a>
  );
}

function Revogacao() {
  const classeLinhaTabela =
    'grid gap-x-6 gap-y-0.5 border-t border-dashed border-[rgba(148,178,235,0.3)] px-4 py-3 first:border-t-0 sm:grid-cols-[11.5rem_minmax(0,1fr)] sm:items-baseline';

  const classeCaminho = 'font-mono text-sm leading-normal wrap-anywhere';

  return (
    <dl className='max-w-[38rem] rounded-xs border border-dashed border-[rgba(148,178,235,0.3)]'>
      {revogacao.map(({ rede, caminho }) => (
        <div key={rede} className={classeLinhaTabela}>
          <dt className='font-semibold text-white'>{rede}</dt>
          <dd className={classeCaminho}>{caminho}</dd>
        </div>
      ))}
      <div className={classeLinhaTabela}>
        <dt className='font-semibold text-white'>Google e YouTube</dt>
        <dd className={classeCaminho}>
          <a
            href={URL_PERMISSOES_GOOGLE}
            target='_blank'
            rel='noopener noreferrer'
            className={classeLink}>
            myaccount.google.com/permissions
          </a>
        </dd>
      </div>
    </dl>
  );
}

function Contatos() {
  return (
    <div className='grid max-w-[38rem] gap-3 sm:grid-cols-2'>
      <a href={`mailto:${EMAIL_PRIVACIDADE}`} className={classeBotaoContato}>
        <Mail aria-hidden='true' className='size-5.5 shrink-0 text-accent' />
        <span className='flex min-w-0 flex-col leading-[1.3]'>
          <span className='text-xs text-[#b6c5e2]'>E-mail</span>
          <span className='font-semibold wrap-anywhere text-white'>
            {EMAIL_PRIVACIDADE}
          </span>
        </span>
      </a>
      <a
        href={waLink(
          CONTATO_PADRAO.privacidade.telefone,
          'Olá! Quero falar sobre os meus dados pessoais.'
        )}
        target='_blank'
        rel='noopener noreferrer'
        className={classeBotaoContato}>
        <WhatsAppIcon className='size-5.5 shrink-0 text-accent' />
        <span className='flex min-w-0 flex-col leading-[1.3]'>
          <span className='text-xs text-[#b6c5e2]'>WhatsApp</span>
          <span className='font-semibold text-white tabular-nums'>
            {WHATSAPP_PRIVACIDADE}
          </span>
        </span>
      </a>
    </div>
  );
}

function AplicativoDeMetricas() {
  return (
    <>
      <Bloco desenho={desenhoCelular} alto primeiro>
        <p>
          A Profills usa um aplicativo interno, o Profills Métricas, para
          acompanhar o desempenho das suas próprias contas no Instagram, TikTok
          e YouTube. Sobre esse aplicativo:
        </p>
        <p>
          Ele acessa, somente em modo leitura, dados das contas da própria
          Profills e dos seus colaboradores que autorizaram o acesso: número de
          seguidores, visualizações, curtidas, comentários, compartilhamentos,
          salvamentos e tempo assistido dos conteúdos publicados.
        </p>
        <p className='font-semibold text-white'>
          Ele não publica, não comenta, não envia mensagens e não apaga nada em
          nenhuma rede.
        </p>
      </Bloco>
      <Bloco desenho={desenhoRelatorio} invertido>
        <p>
          Os dados são usados apenas para gerar relatórios internos de
          desempenho de conteúdo. Não são vendidos, não são usados para
          publicidade e não são compartilhados com terceiros.
        </p>
        <p>
          O uso de dados obtidos pelas APIs do Google (YouTube Data API e
          YouTube Analytics API) segue a Política de Dados do Usuário dos
          Serviços de API do Google, incluindo os requisitos de Uso Limitado.
          Também seguimos os termos da Meta (Instagram) e do TikTok.
        </p>
        <p>
          As credenciais de acesso ficam guardadas em ambiente interno e
          protegido da Profills.
        </p>
      </Bloco>
      <Bloco desenho={desenhoInterruptor}>
        <p>A autorização pode ser revogada a qualquer momento:</p>
        <Revogacao />
        <p>Após a revogação, ou a pedido, os dados coletados são apagados.</p>
      </Bloco>
    </>
  );
}

const conteudo: Record<
  IdSecao,
  Omit<React.ComponentProps<typeof Folha>, 'id' | 'numero' | 'total' | 'titulo'>
> = {
  'dados-coletados': {
    desenho: desenhoCaixa,
    children: (
      <dl className='flex max-w-[38rem] flex-col gap-4'>
        {dadosColetados.map(({ nome, texto }) => (
          <div key={nome}>
            <dt className='font-semibold text-white'>{nome}</dt>
            <dd>{texto}</dd>
          </div>
        ))}
        <div>
          <dt className='font-semibold text-white'>
            Dados das nossas próprias redes sociais
          </dt>
          <dd>
            Números de desempenho das contas da Profills (veja a{' '}
            <LinkSecao id='aplicativo-de-metricas'>seção 4</LinkSecao>).
          </dd>
        </div>
      </dl>
    )
  },
  'uso-dos-dados': {
    desenho: desenhoPrancheta,
    children: (
      <>
        <Lista itens={usos} />
        <p className='grid min-h-26 place-items-center rounded-xs border border-[rgba(148,178,235,0.3)] bg-[#172038] px-6 py-5 text-center text-xl leading-[1.3] font-bold tracking-tight text-balance text-white'>
          Não vendemos nem alugamos os seus dados.
        </p>
      </>
    )
  },
  compartilhamento: {
    desenho: desenhoValvula,
    children: (
      <p>
        Somente com prestadores que nos ajudam a operar (por exemplo: hospedagem
        do site, e-mail, sistema de gestão de clientes), que tratam os dados
        apenas para essa finalidade, e com autoridades quando a lei exigir.
      </p>
    )
  },
  'aplicativo-de-metricas': {
    semRecuo: true,
    children: <AplicativoDeMetricas />
  },
  'prazo-de-guarda': {
    desenho: desenhoArquivo,
    children: (
      <p>
        Pelo tempo necessário para as finalidades acima ou pelo prazo exigido em
        lei. Depois disso, os dados são apagados ou anonimizados.
      </p>
    )
  },
  seguranca: {
    desenho: desenhoCofre,
    children: (
      <p>
        Adotamos medidas técnicas e administrativas razoáveis para proteger os
        dados contra acesso não autorizado, perda ou alteração.
      </p>
    )
  },
  'seus-direitos': {
    desenho: desenhoChave,
    alto: true,
    children: (
      <>
        <p>Você pode, a qualquer momento, pedir:</p>
        <Lista
          itens={direitos}
          className='grid gap-x-10 gap-y-2 sm:grid-cols-2'
        />
        <p>
          Basta escrever para o contato da{' '}
          <LinkSecao id='contato'>seção 9</LinkSecao>.
        </p>
      </>
    )
  },
  cookies: {
    desenho: desenhoMonitor,
    children: (
      <p>
        Usamos cookies necessários ao funcionamento do site e, se houver,
        cookies de medição de audiência. Você pode bloqueá-los nas configurações
        do seu navegador; algumas partes do site podem não funcionar
        corretamente.
      </p>
    )
  },
  contato: {
    desenho: desenhoEnvelope,
    children: (
      <>
        <p>Dúvidas ou pedidos sobre seus dados:</p>
        <Contatos />
      </>
    )
  },
  alteracoes: {
    desenho: desenhoCarimbo,
    children: (
      <p>
        Podemos atualizar esta política. A versão vigente estará sempre nesta
        página, com a data da última atualização.
      </p>
    )
  }
};

export function Secoes() {
  return secoes.map(({ id, titulo }, i) => (
    <Folha
      key={id}
      id={id}
      numero={i + 1}
      total={secoes.length}
      titulo={titulo}
      {...conteudo[id]}
    />
  ));
}
