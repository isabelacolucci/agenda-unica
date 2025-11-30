# Plano de Ação – Listagem de Serviços (MVP)

## Objetivo
Implementar a página de listagem de serviços para o painel do profissional, conforme requisitos do MVP e decisões técnicas do projeto Agenda Única.

---

## 1. Contexto e Referências
- **Requisitos**: Listagem dos serviços cadastrados pelo profissional, com informações principais e ações básicas (edição e ativação/desativação futura).
- **Decisões Técnicas**: Next.js (fullstack), React, Prisma, shadcn/ui, Tailwind, arquitetura modular, dashboard com navegação.
- **Escopo**: Não implementar ainda as funcionalidades de cadastro, edição e ativação/desativação, apenas a estrutura visual e navegação.

---

## 2. Etapas do Plano de Ação

### 2.1. Estrutura de Navegação
- **Atualizar o layout do dashboard** (`DashboardLayout`):
  - Adicionar uma barra de navegação lateral ou superior.
  - Incluir link para a página de listagem de serviços (ex: "Serviços").
  - Garantir responsividade e integração visual com o restante do dashboard.

### 2.2. Página de Listagem de Serviços
- **Criar página** `src/app/dashboard/services/page.tsx`:
  - Estrutura básica da página, protegida por autenticação.
  - Título e botão de adição de novo serviço (ainda sem funcionalidade).
  - Listagem dos serviços do profissional (mock ou consulta real, se já houver dados).

### 2.3. Componente Card de Serviço
- **Criar componente** `ServiceCard` em `src/components/services/service-card.tsx`:
  - Exibir as informações:
    - `name`
    - `description` (truncado, ex: 2 linhas)
    - `durationMinutes`
    - `price`
    - Toggle de `isActive` (apenas visual, sem funcionalidade)
    - Botão de edição (sem funcionalidade)
  - Layout responsivo, visual agradável (usar shadcn/ui + Tailwind).

### 2.4. Integração e UX
- Exibir lista de cards de serviço na página.
- Exibir mensagem amigável caso não haja serviços cadastrados.
- Garantir que o botão de adicionar novo serviço esteja visível e destacado.

### 2.5. Boas Práticas
- Seguir padrões de código e arquitetura definidos no projeto.
- Utilizar componentes reutilizáveis e tipagem com TypeScript.
- Garantir acessibilidade e responsividade.

---

## 3. Arquivos e Estruturas Envolvidas
- `src/components/dashboard-layout.tsx` (atualizar para incluir navegação)
- `src/app/dashboard/services/page.tsx` (nova página de listagem)
- `src/components/services/service-card.tsx` (novo componente)
- `src/components/services/` (criar pasta se necessário)

---

## 4. Observações
- Não implementar ainda as funcionalidades de cadastro, edição e ativação/desativação.
- Utilizar dados mockados caso não haja integração pronta com o backend.
- Validar visual e usabilidade com o time antes de avançar para as próximas etapas.

---

## 5. Próximos Passos
1. Atualizar o layout do dashboard com navegação.
2. Criar a página de listagem de serviços.
3. Implementar o componente de card de serviço.
4. Integrar e ajustar a experiência visual.
5. Revisar com o time e planejar as próximas funcionalidades (cadastro, edição, toggle).
