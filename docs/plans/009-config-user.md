# Plano de Ação – Configuração do Usuário (Config User)

## Objetivo
Implementar a funcionalidade de configuração do usuário (Provider), permitindo a edição dos dados básicos do prestador de serviço e preparando o front-end para futura atualização de senha.

---

## 1. Escopo da Funcionalidade
- Página de configuração acessível via novo link de navegação no dashboard.
- Edição dos campos básicos do Provider: `name`, `businessName`, `publicUrl`, `email`, `address`.
- Validação de unicidade para `publicUrl` e `email`.
- Placeholder para atualização de senha (não implementado nesta iteração).
- Utilização de API Routes para operações de leitura e atualização.

---

## 2. Passos para Implementação

### 2.1. Back-end (API Routes)
- [ ] Criar rota GET `/api/config` para retornar os dados do Provider autenticado.
- [ ] Criar rota PUT `/api/config` para atualizar os dados do Provider autenticado.
  - [ ] Validar unicidade de `publicUrl` e `email`.
  - [ ] Validar formato dos campos.
  - [ ] Validação feita com o Zod.
  - [ ] Retornar erros amigáveis em caso de conflito ou dados inválidos.

### 2.2. Front-end
- [ ] Adicionar novo link "Configurações" na navegação do dashboard.
- [ ] Criar página `/dashboard/config`:
  - [ ] Exibir formulário pré-preenchido com os dados atuais do Provider.
  - [ ] Permitir edição dos campos: `name`, `businessName`, `publicUrl`, `email`, `address`.
  - [ ] Validar unicidade de `publicUrl` e `email` ao submeter.
  - [ ] Validar formulário com Zod e React Hook Form.
  - [ ] Exibir mensagens de sucesso/erro com o Toastify.
  - [ ] Adicionar card/box de placeholder para futura funcionalidade de alteração de senha.

### 2.3. Validação e Segurança
- [ ] Garantir que apenas o Provider autenticado possa acessar e editar seus dados.
- [ ] Validar todos os dados no back-end (além do front-end).
- [ ] Proteger rotas com autenticação (Auth.js).

---

## 3. Detalhes Técnicos
- **Stack:** Next.js (API Routes), React, Prisma, Auth.js, zod (validação), shadcn/ui.
- **Banco:** PostgreSQL (campos únicos já definidos em `schema.prisma`).
- **Validação:**
  - Front-end: feedback imediato ao usuário.
  - Back-end: validação final e mensagens de erro específicas.
- **Placeholder de senha:** Card visual informando que a funcionalidade estará disponível em breve.

---

## 4. Critérios de Aceitação
- [ ] Usuário pode acessar a página de configurações pelo dashboard.
- [ ] Usuário pode editar e salvar os campos permitidos.
- [ ] Sistema impede duplicidade de `publicUrl` e `email`.
- [ ] Mensagens de erro e sucesso são exibidas adequadamente.
- [ ] Card de alteração de senha visível, mas desabilitado/placeholder.

---

## 5. Próximos Passos
1. Implementar rotas de API para leitura e atualização dos dados do Provider.
2. Adicionar link de navegação e criar página de configuração no front-end.
3. Implementar formulário de edição e validações.
4. Testar fluxo completo e validar critérios de aceitação.
5. Planejar próxima iteração para funcionalidade de alteração de senha.

---

Caso deseje detalhar algum passo ou revisar o escopo, basta solicitar.
