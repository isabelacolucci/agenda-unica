# Plano de Ação – Dashboard v2 (Faturamento)

## Objetivo
Implementar no dashboard um card de faturamento que exiba:
- Faturamento do mês anterior
- Faturamento do mês atual (realizado)
- Faturamento previsto para o mês atual (considerando agendamentos futuros marcados como "scheduled")
- Porcentagem de previsão: (faturamento previsto do mês atual) / (faturamento do mês anterior)

## 1. Back-end (API Routes)
### 1.1. Nova rota de API
- Criar rota `GET /api/dashboard/billing`.
- A rota deve:
  - Validar autenticação do prestador (session).
  - Calcular:
    - **Faturamento mês anterior:** Somar o valor dos agendamentos com status `completed` e data dentro do mês anterior.
    - **Faturamento mês atual (realizado):** Somar o valor dos agendamentos com status `completed` e data dentro do mês atual.
    - **Faturamento previsto mês atual:** Somar o valor dos agendamentos com status `scheduled` e data dentro do mês atual (incluindo os já realizados).
    - **Porcentagem previsão:** (faturamento previsto mês atual) / (faturamento mês anterior) * 100.
  - Retornar os valores no formato JSON.

### 1.2. Query Prisma
- Utilizar Prisma para buscar e somar os valores dos agendamentos conforme os critérios acima.
- Considerar o campo `price` do serviço relacionado ao agendamento.

## 2. Front-end (Dashboard)
### 2.1. Componente Card de Faturamento
- Criar componente `AppointmentStatsCard` (ou similar) em `src/components/dashboard/`.
- O card deve exibir:
  - Faturamento mês anterior
  - Faturamento mês atual (realizado)
  - Faturamento previsto mês atual
  - Porcentagem previsão (com indicação visual: positiva/negativa)
- Exibir valores formatados em moeda (R$).

### 2.2. Consumo da API
- Utilizar hook (ex: `use-dashboard-summary.ts` ou novo hook) para buscar os dados da rota `/api/dashboard/billing`.
- Exibir loading/skeleton enquanto carrega.

### 2.3. Integração no Dashboard
- Adicionar o card de faturamento na página principal do dashboard (`/dashboard`).
- Garantir responsividade e integração visual com o restante do layout.

## 3. Testes e Validação
- Testar com diferentes cenários de agendamentos (sem agendamentos, só agendamentos futuros, só concluídos, etc).
- Validar cálculos e exibição dos valores.

## 4. Observações
- Seguir padrões de código, autenticação e estrutura já definidos no projeto.
- Utilizar as decisões técnicas e requisitos levantados como referência.

---

**Próximos passos:**
1. Implementar rota de API `/api/dashboard/billing`.
2. Criar/atualizar hook para buscar dados de faturamento.
3. Criar componente visual do card de faturamento.
4. Integrar o card ao dashboard.
5. Testar e validar.
