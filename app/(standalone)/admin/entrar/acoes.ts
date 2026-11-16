'use server';

import { redirect } from 'next/navigation';

import { entrar, sair } from '@/lib/admin/sessao';

import { horaMinuto } from '../blog/_components/datas';
import { voltaSegura } from './volta';

export type EstadoEntrada = { erro: string } | null;

const texto = (valor: FormDataEntryValue | null) =>
  valor instanceof File ? '' : (valor ?? '');

export async function entrarNoAdmin(
  _anterior: EstadoEntrada,
  dados: FormData
): Promise<EstadoEntrada> {
  const resultado = await entrar(
    texto(dados.get('usuario')).trim(),
    texto(dados.get('senha'))
  );

  switch (resultado.tipo) {
    case 'recusado':
      return { erro: 'Usuário ou senha não conferem.' };
    case 'bloqueado':
      return {
        erro: `Muitas tentativas seguidas. O login volta às ${horaMinuto(resultado.ate.toISOString())}.`
      };
    case 'indisponivel':
      return {
        erro: 'O login está fora do ar agora. Tente de novo em alguns minutos.'
      };
    case 'ok':
      redirect(voltaSegura(dados.get('volta')));
  }
}

export async function sairDoAdmin() {
  await sair();
  redirect('/admin/entrar');
}
