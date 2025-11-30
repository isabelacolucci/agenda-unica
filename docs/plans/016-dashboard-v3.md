# Plano de Ação – Dashboard v3 (Gráfico de Agendamentos dos Últimos 30 Dias)

## Objetivo
Adicionar ao dashboard um card com um gráfico de linhas mostrando o resumo diário de agendamentos realizados nos últimos 30 dias. Para cada dia, a tooltip do gráfico deve exibir o total de agendamentos cancelados, não comparecidos e concluídos.

---

## 1. Análise de Contexto
- **Stack:** Next.js (fullstack), Prisma, PostgreSQL, React, shadcn/ui, Auth.js
- **Requisitos Relacionados:**
  - Dashboard com resumo de agendamentos (Levantamento de Requisitos)
  - API Routes para backend (Decisões Técnicas)
  - Visualização clara de agendamentos e faturamento

---

## 2. Back-end (API Route)
### 2.1. Nova rota: `/api/dashboard/daily-summary`
- **Método:** GET
- **Autenticação:** Obrigatória (session/cookie)
- **Responsabilidade:**
  - Retornar, para os últimos 30 dias, um array de objetos com:
    - data (YYYY-MM-DD)
    - totalCompleted
    - totalCanceled
    - totalNoShow
    - total (soma dos três)
- **Implementação:**
  - Utilizar Prisma para agrupar agendamentos por data e status, filtrando por providerId do usuário logado.
  - Preencher dias sem agendamentos com zero.

---

## 3. Front-end (Dashboard)
### 3.1. Novo Card: `AppointmentLineChartCard`
- **Local:** Dashboard principal (`/dashboard`)
- **Responsabilidade:**
  - Exibir gráfico de linhas (Line Chart) com o total de agendamentos por dia (últimos 30 dias).
  - Tooltip customizada mostrando, para cada dia:
    - Total concluídos
    - Total cancelados
    - Total não comparecidos
- **Implementação:**
  - Consumir a rota `/api/dashboard/daily-summary` via hook (ex: `useDashboardDailySummary`)
  - Utilizar biblioteca de gráficos (ex: `recharts`, `victory`, `nivo`, ou `@tremor/react` se já usada no projeto)
  - Responsivo e integrado ao design do dashboard.

---

## 4. Passos Detalhados
1. **Back-end:**
   - [ ] Criar rota `/api/dashboard/daily-summary` com autenticação.
   - [ ] Implementar lógica de agregação dos agendamentos por dia e status.
   - [ ] Testar resposta da API com dados reais e mockados.
2. **Front-end:**
   - [ ] Criar hook para consumir a nova API (`useDashboardDailySummary`).
   - [ ] Criar componente `AppointmentLineChartCard` com gráfico de linhas e tooltip customizada.
   - [ ] Adicionar o card ao layout do dashboard.
   - [ ] Garantir responsividade e integração visual.
3. **Testes e Validação:**
   - [ ] Testar fluxo completo (dados reais e mockados).
   - [ ] Validar tooltips e dados exibidos.
   - [ ] Revisar acessibilidade e responsividade.

---

## 5. Observações
- Seguir padrões de código e arquitetura definidos no projeto.
- Utilizar componentes e estilos já existentes sempre que possível.
- Documentar a API e o componente para facilitar manutenção.
- Caso necessário, adicionar testes automatizados para a API e o hook.

---

## 6. Critérios de Aceitação
- O card do gráfico deve ser exibido no dashboard principal.
- O gráfico deve mostrar corretamente o total diário de agendamentos dos últimos 30 dias.
- A tooltip deve detalhar os totais de concluídos, cancelados e não comparecidos para cada dia.
- A API deve ser protegida por autenticação e retornar dados corretos para o prestador logado.

---

**Próximos passos:**
- Implementar a API route
- Implementar o card e hook no front-end
- Testar e validar a funcionalidade
