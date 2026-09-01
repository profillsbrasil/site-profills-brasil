import { ImageResponse } from 'next/og';

export const alt =
  'Profills Brasil: máquinas envasadoras e embaladoras industriais';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Card social padrão do site. Só texto e formas: nada é lido do disco, então a
 * imagem é gerada no build sem depender dos assets excluídos do output tracing.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#141C31',
        padding: 72,
        fontFamily: 'sans-serif'
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20
        }}>
        <div
          style={{
            width: 14,
            height: 56,
            background: '#3B82F6',
            borderRadius: 4
          }}
        />
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: -1
          }}>
          Profills Brasil
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 940
          }}>
          Máquinas envasadoras e embaladoras industriais
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#93A7CE',
            lineHeight: 1.3,
            maxWidth: 900
          }}>
          Líquidos, pastosos, pós e sólidos, do sachê ao fim de linha.
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(148,178,235,0.25)',
          paddingTop: 28,
          fontSize: 26,
          color: '#93A7CE'
        }}>
        <div style={{ display: 'flex' }}>www.profills.com</div>
        <div style={{ display: 'flex' }}>Curitiba · PR · Brasil</div>
      </div>
    </div>,
    size
  );
}
