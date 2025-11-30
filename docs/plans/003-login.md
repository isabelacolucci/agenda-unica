# Plano de Ação – Implementação da Página de Login (Agenda Única)

## Objetivo
Implementar a página de login para prestadores de serviço, conforme requisitos do MVP, garantindo autenticação e autorização básicas. O login permitirá acesso ao dashboard (página em branco inicialmente, apenas para validação do fluxo).

## 1. Análise de Contexto
- **Stack:** Next.js (fullstack), TypeScript, Prisma, Auth.js (next-auth), PostgreSQL
- **Requisitos:**
  - Login apenas para prestadores de serviço
  - Validação dos dados de login
  - Redirecionamento para dashboard após login
  - Dashboard pode ser uma página em branco (placeholder)
- **Referências:**
  - [docs/levantamento-requisitos.md](../levantamento-requisitos.md)
  - [docs/decisoes-tecnicas-mvp.md](../decisoes-tecnicas-mvp.md)

## 2. Etapas do Plano de Ação

### 2.1. Preparação
- [ ] Instalar e configurar o Auth.js (next-auth v5+) para autenticação baseada em credenciais (e-mail/senha)
- [ ] Garantir que o modelo `Provider` (prestador) está criado no banco de dados (Prisma)

### 2.2. Backend (API de Login)
- [ ] Criar rota de autenticação usando Next.js API Route (`/api/auth/[...nextauth].ts`)
- [ ] Implementar provider de autenticação com validação de e-mail e senha do prestador (usando Prisma)
- [ ] Configurar sessões e cookies conforme decisões técnicas
- [ ] Implementar tratamento de erros para credenciais inválidas

### 2.3. Frontend (Página de Login)
- [ ] Criar página `/login` com formulário de login (e-mail e senha)
- [ ] Utilizar componentes de UI existentes (`input`, `form`, `button`, `label`)
- [ ] Validar campos obrigatórios no frontend
- [ ] Exibir mensagens de erro em caso de falha no login
- [ ] Integrar formulário com Auth.js (next-auth) para autenticação

### 2.4. Redirecionamento e Proteção de Rotas
- [ ] Após login bem-sucedido, redirecionar usuário para `/dashboard`
- [ ] Criar página `/dashboard` (pode ser em branco, apenas para validação)
- [ ] Proteger a rota `/dashboard` para acesso apenas de usuários autenticados
- [ ] Implementar redirecionamento para `/login` caso o usuário não esteja autenticado

## 3. Observações
- Utilizar boas práticas de segurança (hash de senha, cookies httpOnly, etc.)
- O fluxo de cadastro de prestador não faz parte deste plano (assumir prestador já cadastrado)
- O dashboard será expandido em etapas futuras

## 4. Referências
- [NextAuth.js Documentation](https://authjs.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Próximos passos:**
1. Executar as etapas acima, iniciando pela configuração do Auth.js e criação do formulário de login.
2. Validar o fluxo de autenticação e autorização.
3. Evoluir o dashboard conforme próximos requisitos do MVP.
