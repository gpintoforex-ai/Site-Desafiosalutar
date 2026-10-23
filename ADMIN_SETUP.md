# Administração de email

> **22/10/2026:** o formulário de recomendação foi suspenso e substituído por uma ligação WhatsApp para informações gerais. O endpoint antigo está bloqueado. Consulte [a alteração temporária e o tratamento dos dados antigos](PEDIDOS-ACONSELHAMENTO.md). As instruções históricas abaixo não reativam a recolha.

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

## Contactos gerais, sem recolha clinica

O modulo de recolha de saude foi removido em 23/10/2026: formulario, campos, validadores e suporte de anexos. Nao executar antigos scripts de criacao de anexos. A rota antiga de submissao e a de download devolvem HTTP 410 sem ler o corpo ou a base.

A caixa de entrada lista e permite operar apenas sobre registos com formType contacto, incluindo pesquisa, contagens e acesso por identificador. Registos antigos de outros tipos ficam inacessiveis por esta aplicacao. As respostas nao incluem automaticamente o conteudo original.

A remocao de modelos no schema Prisma nao apaga as tabelas existentes. Nao executar prisma db push ou migracoes destrutivas para aplicar esta alteracao. Basta gerar o cliente durante o build. Dados, emails, downloads e backups antigos continuam a exigir um procedimento separado e aprovado.

Validacao isolada, sem base real ou envio de emails: node --experimental-test-module-mocks --import tsx --test scripts/inbox-isolation.test.mts.
