-- Limite de tentativas do login do admin. Nesta entrega só existe a chave 'global';
-- a chave por IP entra depois de medir o cabeçalho que o proxy da Railway repassa.
create table admin_tentativas_login (
  chave text primary key,
  inicio timestamptz not null,
  tentativas integer not null
    constraint tentativas_nao_negativas check (tentativas >= 0)
);
