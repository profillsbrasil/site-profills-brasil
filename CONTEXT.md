# Site Profills Brasil

Site institucional que apresenta as máquinas da Profills e converte visitantes em leads para o time comercial. Este glossário fixa os termos do domínio; decisões de implementação ficam em `docs/superpowers/specs/`.

## Language

### Indicação

**Vendedor**:
Pessoa do time comercial da Profills cadastrada no CRM, dona de no máximo um Código de indicação.
_Avoid_: consultor, representante, afiliado

**Código de indicação**:
Identificador curto e público (ex.: `MARIA-10`) que o Vendedor divulga; aponta para ele no CRM e pode ser trocado a qualquer momento.
_Avoid_: referral code, ref, cupom, token

**Link de indicação**:
Qualquer URL do site com `?ref=<Código de indicação>`; é a única forma de o visitante entrar numa Indicação.

**Indicação**:
Vínculo de 30 dias entre um visitante e um Vendedor, criado pelo Link de indicação e substituído pelo último link aberto.
_Avoid_: atribuição, sessão do vendedor, afiliação

**Visitante indicado**:
Visitante cuja Indicação está ativa; vê os Contatos comerciais do Vendedor e tem seus Leads enviados a ele.

### Contatos

**Contato comercial**:
Telefone, WhatsApp ou e-mail do site cujo destino é vender ao cliente: botões "Falar com um especialista", card Vendas/Peças do rodapé e destinatário dos formulários.
_Avoid_: contato de vendas, contato do consultor

**Contato padrão**:
Telefone, WhatsApp ou e-mail institucional da Profills; é o que todo visitante sem Indicação vê e o que substitui um dado ausente ou inválido do Vendedor.
_Avoid_: contato default, fallback

**Contato de suporte**:
Canal que nunca muda com a Indicação: Suporte e Assistência Técnica, Compras (fornecedores), dados de SEO (JSON-LD) e campanhas standalone.
_Avoid_: contato fixo, contato interno

### Leads

**Lead**:
Envio de qualquer um dos formulários do site (orçamento, catálogo, montar máquina, monte fábrica, especificações) por um visitante.
_Avoid_: contato, mensagem, pedido

**Caixa padrão**:
E-mail institucional que recebe todo Lead sem Indicação válida.
_Avoid_: receiver, e-mail da Profills
