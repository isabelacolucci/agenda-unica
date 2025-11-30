# Plano de Ação – Implementação do Fluxo "Esqueci a Senha"

## 1. Objetivo
Permitir que prestadores de serviço recuperem o acesso à plataforma caso esqueçam a senha, de forma segura e amigável, utilizando o stack definido (Next.js, Prisma, Zod, nodemailer, PostgreSQL).

## 2. Etapas do Plano de Ação

### 2.1. Modelagem e Infraestrutura
- [ ] **Revisar modelo de dados do usuário (`Provider`)** e adicionar, se necessário, campos para:
  - Token de recuperação de senha (string, opcional)
  - Data de expiração do token (datetime, opcional)
- [ ] **Criar/atualizar migração Prisma** para refletir os novos campos.

### 2.2. Backend (API)
- [ ] **Criar rota de API** (`POST /api/auth/forgot-password`) para receber o e-mail do usuário e:
  - Validar o e-mail informado (existência e formato).
  - Gerar token seguro e salvar no banco com data de expiração.
  - Enviar e-mail com link de recuperação (contendo o token).
- [ ] **Criar rota de API** (`POST /api/auth/reset-password`) para:
  - Receber token e nova senha.
  - Validar token (existência, expiração, correspondência com usuário).
  - Atualizar senha do usuário (hash) e limpar token/expiração.
- [ ] **Adicionar validações com Zod** para ambos os fluxos.

### 2.3. Frontend (Páginas e UI)
- [ ] **Adicionar link "Esqueci a senha"** na tela de login (`/login`), redirecionando para página de recuperação.
- [ ] **Criar página `/forgot-password`** com formulário para informar o e-mail.
- [ ] **Criar página `/reset-password?token=...`** com formulário para definir nova senha.
- [ ] **Adicionar validação client-side** (Zod + React Hook Form) nos formulários.
- [ ] **Exibir mensagens de sucesso/erro** apropriadas em cada etapa.

### 2.4. E-mail
- [ ] **Configurar template de e-mail** para envio do link de recuperação, usando nodemailer e MailTrap (ou SMTP configurado).
- [ ] **Garantir que o link enviado contenha o token e expire após tempo determinado (ex: 1h).**

### 2.5. Testes
- [ ] **Testar fluxo completo**: solicitação, recebimento do e-mail, redefinição da senha.
- [ ] **Testar casos de erro**: e-mail inexistente, token inválido/expirado, senha fraca, etc.
- [ ] **Testar responsividade e UX das páginas.**

### 2.6. Documentação e Ajustes Finais
- [ ] **Documentar endpoints, regras de validação e fluxo de recuperação.**
- [ ] **Revisar código, UX/UI e mensagens exibidas.**
- [ ] **Atualizar README e documentação técnica, se necessário.**

## 3. Observações e Boas Práticas
- Utilizar stack definida: Next.js, Prisma, Zod, nodemailer, PostgreSQL.
- Garantir segurança dos tokens (criptografia, expiração, uso único).
- Não informar se o e-mail existe ou não na plataforma (mensagem genérica).
- Seguir convenções de código e estrutura do projeto.
- Preparar para evolução futura (ex: autenticação multifator).

## 4. Critérios de Aceitação
- Link "Esqueci a senha" visível e funcional na tela de login.
- Usuário recebe e-mail com link de recuperação ao solicitar.
- Usuário consegue redefinir a senha com token válido.
- Mensagens de erro e sucesso claras e amigáveis.
- Tokens expiram corretamente e não podem ser reutilizados.
- Página responsiva e de fácil uso.

---

Se desejar, posso detalhar a implementação de cada etapa!
