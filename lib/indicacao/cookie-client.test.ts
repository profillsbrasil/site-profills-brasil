import {
  extrairTokenIndicacao,
  lerCookieIndicacaoDoBrowser
} from './cookie-client';
import { describe, expect, it } from 'vitest';

function jwtFalso(payload: unknown) {
  const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64url');
  return `${b64('{"alg":"HS256"}')}.${b64(JSON.stringify(payload))}.assinatura`;
}

const payload = {
  codigo: 'MARIA-10',
  nome: 'Maria Conceição',
  email: 'maria@profills.com.br',
  contato: '11987654321',
  consultadoEm: '2026-09-02T12:00:00.000Z'
};

describe('extrairTokenIndicacao', () => {
  it('devolve só o valor do cookie da Indicação', () => {
    const token = jwtFalso(payload);
    expect(extrairTokenIndicacao(`_ga=abc; profills_indicacao=${token}`)).toBe(
      token
    );
    expect(extrairTokenIndicacao('_ga=abc; outro=1')).toBeNull();
    expect(extrairTokenIndicacao('')).toBeNull();
  });

  it('não confunde com um cookie de nome parecido', () => {
    expect(extrairTokenIndicacao('nao_profills_indicacao=x')).toBeNull();
  });
});

describe('lerCookieIndicacaoDoBrowser', () => {
  it('lê o payload do cookie, com acento, entre outros cookies', () => {
    const header = `_ga=abc; profills_indicacao=${jwtFalso(payload)}; outro=1`;
    expect(lerCookieIndicacaoDoBrowser(header)).toEqual(payload);
  });

  it('devolve null sem cookie, com payload ilegível ou sem os campos', () => {
    expect(lerCookieIndicacaoDoBrowser('')).toBeNull();
    expect(lerCookieIndicacaoDoBrowser('profills_indicacao=lixo')).toBeNull();
    expect(
      lerCookieIndicacaoDoBrowser(
        `profills_indicacao=${jwtFalso({ nome: 'x' })}`
      )
    ).toBeNull();
  });
});
