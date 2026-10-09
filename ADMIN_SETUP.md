# Administração de email

A página `/admin` configura o envio de notificações pelo Gmail. As mensagens continuam guardadas em `ContactSubmission`, mesmo quando o Gmail rejeita uma notificação. Não há reenvio automático das mensagens antigas.

## Preparação

1. Execute `node scripts/admin-setup.mjs`. Os valores privados ficam em `.env.admin`, ignorado pelo Git.
2. Na Cloudflare, em **Workers & Pages → site-desafiosalutar → Configurações → Variáveis e segredos → Produção**, copie como segredos `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` e `SMTP_ENCRYPTION_KEY`. Não copie `ADMIN_LOGIN_PASSWORD`: essa é a password que usará no navegador.
3. Guarde a chave `SMTP_ENCRYPTION_KEY` num local seguro. Alterá-la impede a leitura da password Gmail guardada, que terá de ser novamente introduzida.
4. No SQL Editor do Neon, execute `scripts/create-smtp-settings.sql`. O script cria apenas a tabela de configurações e preserva os contactos existentes.
5. Publique o código atualizado e abra `https://desafiosalutar.pt/admin`.
6. Entre com `ADMIN_LOGIN_PASSWORD` do ficheiro local. Configure `desafiosalutar@gmail.com`, a password de aplicação Google e o destinatário `desafiosalutar@hotmail.com`.
7. Guarde e clique em **Enviar email de teste**. A confirmação significa que o servidor Gmail aceitou a mensagem; confirme a receção, incluindo a pasta de spam.

O remetente usa a própria conta Gmail; a opção Responder no email de contacto aponta para o endereço do cliente. A password normal do Gmail não é usada. A verificação em dois passos e uma password de aplicação são necessárias: https://support.google.com/accounts/answer/185833

## Segurança e operação

- Cookies de sessão HttpOnly, SameSite=Strict, Secure em HTTPS, com validade de oito horas.
- Password SMTP cifrada com AES-256-GCM; não é incluída na resposta da API, no HTML ou nos logs.
- Os pedidos que alteram configurações exigem uma sessão válida e origem igual à do site.
- O destino SMTP é fixo em `smtp.gmail.com:465` com TLS e validação de certificados.
- Proteja também `/admin` e `/api/admin` com Cloudflare Access, ou configure rate limiting na Cloudflare. A proteção contra tentativas de login em memória é apenas por instância e não substitui um limite global.
- Não exponha a página de configuração através de iframe nem partilhe os segredos.

## Desenvolvimento local

Copie os três segredos para `.env` (e `.dev.vars` se usar o runtime Workers). A criação das tabelas e os testes reais de envio são etapas separadas; não envie dados pessoais de teste sem necessidade.

O comando de desenvolvimento usa webpack: o Turbopack desta instalação devolveu 404 nas rotas de desenvolvimento. `yarn dev` funciona com webpack. A configuração de build de produção não foi alterada.

Para verificar a lógica sem enviar emails: `node --import tsx --test scripts/admin-mail.test.ts`.
Com o servidor local a correr e os segredos configurados: `node --env-file=.env.admin scripts/admin-smoke.mjs`.

Se publicar através de GitHub Actions, configure também os três segredos de administração no repositório, além de `DATABASE_URL`, `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`. A publicação pelo painel Cloudflare usa os segredos de Produção do Worker.

## Limitações

O envio usa `node:tls`, suportado pela Cloudflare com a configuração de compatibilidade atual. O teste com a password real deve ser feito depois da publicação; o Gmail pode recusar uma conta, limitar envios ou filtrar mensagens como spam.
# Caixa de entrada

## Pedidos de recomendação e anexos

Antes de publicar, execute `scripts/create-recommendation-attachments.sql` na mesma base de dados. Os anexos ficam em BYTEA no PostgreSQL, separados dos metadados, sem pasta pública nem serviço de armazenamento adicional. Limites: dois ficheiros por pedido, 5 MB cada; PDF, JPG ou PNG. Extensão, MIME e assinatura são verificados; isso não constitui análise antivírus.

O formulário `/pedido-recomendacao` recolhe dados de adultos e consentimento explícito, com campos de saúde e anexos opcionais. As notificações SMTP só avisam de um novo pedido. Os detalhes e ficheiros são consultados na administração. O descarregamento exige sessão admin válida, com resposta no-store, attachment e nosniff. Ao eliminar o pedido, os anexos também são eliminados; backups do fornecedor seguem a retenção dele.

As ligações para o formulário fazem navegação completa para não transportar scripts de chat carregados noutras páginas. O chat não carrega no formulário. As respostas a pedidos de recomendação não incluem automaticamente o texto original com os dados de saúde.

A proteção por IP é local ao Worker; configure rate limiting na Cloudflare para `/api/recomendacao` se quiser limites globais contra abuso. Não existe limpeza automática por idade nem sincronização Gmail. A equipa deve eliminar pedidos quando deixarem de ser necessários. Nunca imprima documentos ou conteúdo de saúde nos logs.

Validação: `node node_modules/tsx/dist/cli.mjs --test scripts/recommendation.test.ts`. A criação de um pedido com ficheiros e a leitura em produção precisam de confirmação depois de executar o SQL; os testes locais de rejeição não criam pedidos nem enviam emails.

Execute também `scripts/create-inbox.sql` no editor SQL da mesma base de dados antes de publicar esta versão. Cria o histórico de respostas sem alterar as mensagens existentes.

Em `/admin`, a aba **Mensagens** permite pesquisar, filtrar, ler, marcar como não lida, eliminar com confirmação e responder ao email do cliente. Cada página mostra 20 mensagens. A eliminação é permanente e inclui o histórico de respostas. As respostas usam o Gmail configurado e precisam de envio SMTP ativo.

A caixa de entrada contém mensagens do formulário do site. Não sincroniza a caixa Gmail: respostas posteriores dos clientes chegam ao Gmail. O estado “Aceite pelo Gmail” confirma aceitação SMTP, não entrega na caixa do cliente. Se um envio ficar por confirmar, consulte os Enviados do Gmail antes de repetir.

