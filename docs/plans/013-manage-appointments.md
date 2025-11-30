# Plano de Ação – Gerenciamento de Agendamentos (Dashboard)

## Visão Geral
Implementar a funcionalidade de gerenciamento de agendamentos para o profissional no dashboard, conforme requisitos do MVP. O profissional poderá visualizar todos os agendamentos realizados, acessar detalhes e alterar o status de cada agendamento. O back-end será exposto via API Routes (Next.js) e o front-end consumirá essas rotas.

---

## 1. Navegação
- Adicionar novo link "Agendamentos" na barra de navegação do dashboard (`/dashboard/appointments`).
- O link deve ser destacado quando ativo.

## 2. Página de Listagem de Agendamentos
- Criar página `/dashboard/appointments`.
- Exibir lista de agendamentos do profissional logado, mostrando:
  - Nome do cliente
  - Serviço
  - Data e hora
  - Status atual
- Permitir clicar em um agendamento para ver detalhes.
- Paginação ou scroll infinito se necessário.

## 3. Página de Detalhes do Agendamento
- Exibir informações completas do agendamento:
  - Dados do cliente (nome, e-mail, telefone)
  - Serviço
  - Data e hora
  - Status
  - Notas
- Permitir alteração do status para: "concluído", "cancelado", "não compareceu".
- Botão para salvar alteração de status.
- Exibir confirmação de sucesso/erro com o Toastify.

## 4. API Routes (Back-end)
- Criar rotas em `/api/appointments`:
  - `GET /api/appointments` – Listar agendamentos do profissional autenticado (filtros opcionais: data, status).
  - `GET /api/appointments/[id]` – Detalhes de um agendamento específico.
  - `PATCH /api/appointments/[id]` – Alterar status do agendamento.
- Garantir autenticação e autorização nas rotas.
- Utilizar Prisma para acesso ao banco.

## 5. Integração Front-end x Back-end
- Consumir as rotas de API usando fetch/Axios no front-end.
- Exibir loading, erros e mensagens de feedback ao usuário.

## 6. Componentização e UI
- Criar componentes reutilizáveis para:
  - Lista de agendamentos
  - Card/linha de agendamento
  - Modal ou página de detalhes
  - Formulário de alteração de status
- Seguir padrão visual do dashboard (shadcn/ui, Tailwind).

## 7. Testes e Validação
- Testar fluxo completo: listagem, visualização e alteração de status.
- Validar regras de negócio (ex: só permitir alteração de status para agendamentos futuros ou "scheduled").

## 8. Documentação e Checklist
- Documentar endpoints criados e exemplos de uso.
- Atualizar README se necessário.

---

## Referências
- [Levantamento de Requisitos](../levantamento-requisitos.md)
- [Decisões Técnicas](../decisoes-tecnicas-mvp.md)

---

**Próximos Passos:**
1. Adicionar link "Agendamentos" na navegação do dashboard
2. Criar página e componentes de listagem
3. Implementar API Routes para agendamentos
4. Criar página/modal de detalhes e alteração de status
5. Testar e validar fluxo completo
6. Documentar endpoints e atualizar documentação
