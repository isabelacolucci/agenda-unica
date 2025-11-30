# Plano de Ação – Implementação da Página de Registro do Prestador de Serviço

## 1. Objetivo
Implementar uma página de registro para prestadores de serviço, permitindo o cadastro completo dos dados necessários, com validação e persistência no banco de dados PostgreSQL (via Docker Compose), conforme requisitos do MVP e decisões técnicas do projeto.

## 2. Etapas do Plano de Ação

### 2.1. Modelagem e Infraestrutura
- [ ] **Revisar o modelo `Provider`** no diagrama ER e garantir que todos os campos necessários estejam contemplados.
- [ ] **Configurar o banco de dados PostgreSQL local** via Docker Compose, se ainda não estiver pronto.
- [ ] **Configurar o Prisma**:
  - [ ] Definir o modelo `Provider` no `schema.prisma`.
  - [ ] Executar as migrações para criar a tabela no banco.

### 2.2. Backend (API)
- [ ] **Criar rota de API** (`POST /api/register` ou similar) para receber os dados do formulário.
- [ ] **Validar os dados recebidos** usando Zod, conforme regras de negócio e requisitos (campos obrigatórios, formatos, unicidade de e-mail, etc).
- [ ] **Gerar automaticamente a URL pública** com base no nome do negócio, convertendo para slug (ex: "Barbearia do João" → "barbearia-do-joao").
- [ ] **Verificar duplicidade da URL pública**: caso já exista, adicionar um hash curto ao final para garantir unicidade (ex: "barbearia-do-joao-4f2a").
- [ ] **Persistir os dados** no banco de dados via Prisma.
- [ ] **Retornar respostas apropriadas** (sucesso, erro de validação, erro de duplicidade, etc).

### 2.3. Frontend (Página de Registro)
- [ ] **Criar página `/register`** em `src/app/register/page.tsx`.
- [ ] **Implementar formulário** com campos:
  - Nome
  - Nome do negócio
  - E-mail
  - Telefone
  - Endereço
  - (Outros campos obrigatórios do modelo)
- [ ] **Adicionar validação client-side** (usando Zod + React Hook Form ou similar):
  - Campos obrigatórios
  - Formato de e-mail
  - Tamanho mínimo/máximo
  - Máscara para telefone
- [ ] **Exibir mensagens de erro amigáveis** para o usuário.
- [ ] **Enviar dados para a API** ao submeter o formulário.
- [ ] **Exibir feedback de sucesso ou erro** após o envio.
- [ ] **Após registro bem-sucedido, redirecionar o usuário automaticamente para a página de login.**

### 2.4. Testes
- [ ] **Testar fluxo completo** de registro (formulário → API → banco).
- [ ] **Testar casos de erro** (campos inválidos, e-mail duplicado, etc).
- [ ] **Testar responsividade** da página.

### 2.5. Documentação e Ajustes Finais
- [ ] **Documentar endpoints e regras de validação**.
- [ ] **Revisar código e realizar ajustes de UX/UI**.
- [ ] **Atualizar README e documentação técnica, se necessário**.

## 3. Observações e Boas Práticas
- Utilizar stack definida: Next.js, Prisma, Zod, shadcn/ui, PostgreSQL.
- Garantir segurança dos dados (não expor informações sensíveis).
- Seguir convenções de código e estrutura de pastas do projeto.
- Validar unicidade de e-mail e URL pública no backend.
- Preparar para evolução futura (ex: autenticação, confirmação por e-mail).

## 4. Critérios de Aceitação
- Prestador consegue se registrar preenchendo todos os campos obrigatórios.
- Dados são validados e persistidos corretamente no banco.
- Mensagens de erro são claras e amigáveis.
- Página responsiva e de fácil uso.
- Não é possível registrar e-mail duplicado.
- A URL pública é gerada automaticamente a partir do nome do negócio, sendo única (com hash em caso de duplicidade).
- Após o registro, o usuário é redirecionado para a página de login.

---

**Próximos passos:**
1. Implementar modelo e migração no banco.
2. Criar API de registro com validação.
3. Desenvolver página e formulário de registro.
4. Testar e documentar o fluxo.
