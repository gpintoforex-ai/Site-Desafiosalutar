# Aconselhamento: suspensão temporária da recolha

Em 22 de outubro de 2026, por indicação do responsável, o formulário de recomendação foi substituído por uma ligação WhatsApp para **informações gerais ou combinação de um contacto**. Não se solicita o envio de dados de saúde por esse canal.

- `/pedido-recomendacao` mantém a ligação e o endereço existentes, mas não apresenta formulário, campos clínicos, seleção de ficheiros ou câmara. Oferece também telefone e contactos da loja.
- O botão abre `wa.me/351910419820` apenas mediante ação do visitante. A mensagem predefinida é genérica; nenhum dado do formulário é transportado para a ligação e nenhuma mensagem é enviada automaticamente.
- `POST /api/recomendacao` devolve sempre HTTP 410 e não lê o corpo, consulta a base, grava pedidos ou envia notificações. Isto impede que um formulário antigo em cache continue a enviar pedidos depois da publicação. Não há redirecionamento de uploads para o WhatsApp.
- A página avisa para não enviar sintomas, medicação, diagnósticos, documentos ou análises clínicas pelo WhatsApp. A substituição do canal não isenta do RGPD se forem efetivamente enviados dados de saúde.
- O chat externo continua excluído desta página e da administração. A navegação a partir de uma página que já carregou o chat obriga a um novo documento antes de montar a área protegida. Em produção, estas páginas têm CSP que restringe recursos externos, além de no-referrer, nosniff e bloqueio de iframe.
- As notificações do formulário geral passam a ser genéricas, sem copiar o conteúdo ou dados pessoais para o email. Os erros não imprimem o objeto com eventuais dados pessoais.

## Dados antigos e medidas ainda necessárias

Esta alteração **não elimina nem cifra retroativamente** dados, anexos, emails, downloads ou backups já existentes. A administração anterior permanece disponível para tratar e eliminar os pedidos existentes; o controlo individual de acesso, o prazo de conservação, as cópias de segurança e a gestão dos pedidos de direitos continuam a precisar de revisão. Não foram executadas operações sobre a base de produção nesta entrega.

A preparação anterior de cifragem, acesso individual, auditoria e manutenção foi preservada na pasta privada do ambiente de trabalho para eventual retoma, mas **não integra esta solução temporária nem exige migrações ou novos segredos**. Antes de reativar qualquer recolha clínica, é necessário concluir essa revisão técnica e organizativa, definir utilizadores autorizados e conservação e verificar fornecedor/região, contratos, backups e restauros.

## Validação

`node --import tsx --test scripts/advice-whatsapp.test.ts` verifica a página sem campos, o destino e mensagem genérica da ligação, a alternativa telefónica e a recusa do endpoint antigo sem leitura do corpo ou devolução de dados clínicos. A compilação e as verificações de TypeScript/ESLint devem passar antes da publicação.
