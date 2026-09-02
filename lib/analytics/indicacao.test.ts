import { sendGAEvent } from '@next/third-parties/google';

import {
  marcarChegadaNaSessao,
  registrarChegadaIndicacao,
  registrarLeadIndicacao
} from './indicacao';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@next/third-parties/google', () => ({
  sendGAEvent: vi.fn()
}));

const ga = vi.mocked(sendGAEvent);

beforeEach(() => {
  ga.mockReset();
  window.fbq = vi.fn();
  window.sessionStorage.clear();
});

afterEach(() => {
  delete window.fbq;
  window.sessionStorage.clear();
});

describe('registrarChegadaIndicacao', () => {
  it('manda o evento de chegada para GA e Meta só com o código', () => {
    registrarChegadaIndicacao('MARIA-10');

    expect(ga).toHaveBeenCalledWith('event', 'indicacao_chegada', {
      codigo_vendedor: 'MARIA-10'
    });
    expect(window.fbq).toHaveBeenCalledWith('trackCustom', 'IndicacaoChegada', {
      codigo_vendedor: 'MARIA-10'
    });
  });
});

describe('validação do código antes de emitir', () => {
  it('aceita código só de dígitos, no formato do CRM', () => {
    registrarChegadaIndicacao('41999998888');

    expect(ga).toHaveBeenCalledWith('event', 'indicacao_chegada', {
      codigo_vendedor: '41999998888'
    });
  });

  it('não dispara chegada quando o código está fora do formato', () => {
    registrarChegadaIndicacao('MARIA.SILVA@X');

    expect(ga).not.toHaveBeenCalled();
    expect(window.fbq).not.toHaveBeenCalled();
  });

  it('lead com código fora do formato vira "nenhum"', () => {
    registrarLeadIndicacao('contato', 'MARIA.SILVA@X');

    expect(ga).toHaveBeenCalledWith('event', 'indicacao_lead', {
      codigo_vendedor: 'nenhum',
      formulario: 'contato'
    });
    expect(window.fbq).toHaveBeenCalledWith('trackCustom', 'IndicacaoLead', {
      codigo_vendedor: 'nenhum',
      formulario: 'contato'
    });
  });
});

describe('registrarLeadIndicacao', () => {
  it('manda o evento de lead com código e formulário', () => {
    registrarLeadIndicacao('catalogo', 'MARIA-10');

    expect(ga).toHaveBeenCalledWith('event', 'indicacao_lead', {
      codigo_vendedor: 'MARIA-10',
      formulario: 'catalogo'
    });
    expect(window.fbq).toHaveBeenCalledWith('trackCustom', 'IndicacaoLead', {
      codigo_vendedor: 'MARIA-10',
      formulario: 'catalogo'
    });
  });

  it('sem indicação manda codigo_vendedor "nenhum"', () => {
    registrarLeadIndicacao('contato', null);

    expect(ga).toHaveBeenCalledWith('event', 'indicacao_lead', {
      codigo_vendedor: 'nenhum',
      formulario: 'contato'
    });
    expect(window.fbq).toHaveBeenCalledWith('trackCustom', 'IndicacaoLead', {
      codigo_vendedor: 'nenhum',
      formulario: 'contato'
    });
  });

  it('não lança quando o Pixel não carregou', () => {
    delete window.fbq;
    expect(() => registrarLeadIndicacao('contato', null)).not.toThrow();
    expect(ga).toHaveBeenCalledTimes(1);
  });

  it('não lança quando o GA falha, e ainda manda para o Meta', () => {
    ga.mockImplementation(() => {
      throw new Error('GA não carregado');
    });

    expect(() => registrarLeadIndicacao('contato', 'MARIA-10')).not.toThrow();
    expect(window.fbq).toHaveBeenCalledTimes(1);
  });
});

describe('marcarChegadaNaSessao', () => {
  it('devolve true na primeira chamada e false na segunda', () => {
    expect(marcarChegadaNaSessao('MARIA-10')).toBe(true);
    expect(marcarChegadaNaSessao('MARIA-10')).toBe(false);
  });

  it('marca por código: outro código volta a ser primeira vez', () => {
    expect(marcarChegadaNaSessao('MARIA-10')).toBe(true);
    expect(marcarChegadaNaSessao('JOAO-7')).toBe(true);
  });

  it('devolve false quando o sessionStorage está bloqueado', () => {
    const setItem = vi
      .spyOn(window.sessionStorage.__proto__, 'setItem')
      .mockImplementation(() => {
        throw new Error('storage bloqueado');
      });

    expect(marcarChegadaNaSessao('MARIA-10')).toBe(false);

    setItem.mockRestore();
  });
});
