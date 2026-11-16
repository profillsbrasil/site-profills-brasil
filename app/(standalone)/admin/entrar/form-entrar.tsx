'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  classeBotaoCheio,
  classeCampo,
  classeRotulo
} from '../blog/_components/estilos';
import { entrarNoAdmin } from './acoes';

export function FormEntrar({ volta }: { volta: string }) {
  const [estado, enviar, enviando] = useActionState(entrarNoAdmin, null);

  return (
    <form action={enviar} className='grid gap-4'>
      <input type='hidden' name='volta' value={volta} />

      <div className='grid gap-2'>
        <Label htmlFor='entrar-usuario' className={classeRotulo}>
          Usuário
        </Label>
        <Input
          id='entrar-usuario'
          name='usuario'
          autoComplete='username'
          required
          className={classeCampo}
        />
      </div>

      <div className='grid gap-2'>
        <Label htmlFor='entrar-senha' className={classeRotulo}>
          Senha
        </Label>
        <Input
          id='entrar-senha'
          name='senha'
          type='password'
          autoComplete='current-password'
          required
          aria-describedby={estado ? 'entrar-erro' : undefined}
          className={classeCampo}
        />
      </div>

      {estado ? (
        <p id='entrar-erro' role='alert' className='text-[#b42318]'>
          {estado.erro}
        </p>
      ) : null}

      <Button type='submit' disabled={enviando} className={classeBotaoCheio}>
        {enviando ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  );
}
