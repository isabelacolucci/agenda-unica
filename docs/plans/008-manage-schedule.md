# Plano de Ação – Gerenciamento de Disponibilidade (Schedule)

## Visão Geral
Permitir que o prestador de serviço cadastre, edite e exclua suas disponibilidades de atendimento (dias e horários) através de uma interface dedicada no painel. O gerenciamento será feito com base no model `Schedule` já definido no Prisma. O fluxo segue as decisões técnicas e requisitos do MVP.

---

## 1. Back-end (API Routes)
- **Criar rotas RESTful em `/api/schedules`**:
  - `GET /api/schedules` – Listar todas as disponibilidades do prestador autenticado
  - `POST /api/schedules` – Cadastrar nova disponibilidade (dia da semana, horário inicial e final)
  - `PUT /api/schedules/[id]` – Editar disponibilidade existente
  - `DELETE /api/schedules/[id]` – Excluir disponibilidade
- **Validação**:
  - Garantir que não haja sobreposição de horários para o mesmo dia
  - Validar formato dos horários e dias da semana
  - Restringir acesso apenas ao prestador autenticado
- **Reutilizar validações com Zod**
- **Atualizar seed e testes se necessário**

## 2. Front-end
- **Novo link de navegação**:
  - Adicionar "Disponibilidade" no menu do dashboard (`/dashboard/schedule`)
- **Página `/dashboard/schedule`**:
  - Listar todas as disponibilidades cadastradas
  - Formulário para cadastrar nova disponibilidade (dia da semana, horário inicial e final)
  - Permitir editar e excluir cada disponibilidade
  - Exibir mensagens de sucesso/erro utilizando o Toastify
  - UI consistente com o restante do painel (shadcn/ui)
- **Consumo das rotas de API**:
  - Utilizar fetch/Axios para interagir com as rotas criadas
  - Atualizar lista em tempo real após operações

## 3. Permissões e Segurança
- Garantir que apenas o prestador autenticado possa gerenciar suas disponibilidades
- Validar no back-end o `providerId` vinculado à sessão

## 4. UX/UI
- Interface simples e responsiva
- Feedback visual para ações (loading, sucesso, erro)
- Prevenir cadastro de horários sobrepostos

---

## Resumo dos Passos
1. Criar rotas de API para CRUD de Schedule
2. Adicionar link "Disponibilidade" no menu do dashboard
3. Implementar página `/dashboard/schedule` com listagem, cadastro, edição e exclusão
4. Garantir validações e segurança
5. Testar fluxos principais
6. Atualizar documentação

---

**Observações:**
- Seguir padrões de código e UI já definidos no projeto
- Validar regras de negócio conforme requisitos do MVP
- Priorizar experiência do usuário e segurança dos dados
