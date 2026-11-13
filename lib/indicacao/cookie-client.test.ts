import {
  extrairTokenIndicacao,
  lerCookieIndicacaoDoBrowser
} from './cookie-client';
import type { IndicacaoPayload } from './tipos';
import { describe, expect, it } from 'vitest';

// Parcial: um dos casos grava payload sem os campos obrigatórios.
function jwtFalso(payload: Partial<IndicacaoPayload>) {
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

  it('aceita contato null e recusa campo de tipo errado ou JSON inválido', () => {
    const semContato = { ...payload, contato: null };
    expect(
      lerCookieIndicacaoDoBrowser(`profills_indicacao=${jwtFalso(semContato)}`)
    ).toEqual(semContato);

    const contatoNumero = `{"alg":"HS256"}.${Buffer.from(
      JSON.stringify({ ...payload, contato: 11987654321 })
    ).toString('base64url')}.assinatura`;

    expect(
      lerCookieIndicacaoDoBrowser(`profills_indicacao=${contatoNumero}`)
    ).toBeNull();

    const jsonNull = `x.${Buffer.from('null').toString('base64url')}.y`;

    expect(
      lerCookieIndicacaoDoBrowser(`profills_indicacao=${jsonNull}`)
    ).toBeNull();

    const jsonInvalido = `x.${Buffer.from('{codigo:').toString('base64url')}.y`;
    expect(
      lerCookieIndicacaoDoBrowser(`profills_indicacao=${jsonInvalido}`)
    ).toBeNull();
  });
});
