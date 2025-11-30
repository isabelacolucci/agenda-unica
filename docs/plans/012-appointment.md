# Plano de Ação – Criação de Agendamento (TWAgenda)

## Visão Geral
Implementar a funcionalidade de criação de agendamento, permitindo que o cliente selecione um serviço, visualize as datas e horários disponíveis (com base na tabela Schedule) e preencha um formulário para concluir o agendamento. O fluxo será iniciado ao clicar no card de um serviço na página pública do prestador.

**Observações importantes:**
- O sistema deve permitir agendamentos conflitantes (vários clientes podem agendar o mesmo dia e horário).
- Todas as mensagens para o usuário devem ser exibidas com Toastify.
- As validações de formulário devem ser feitas com Zod e React Hook Form.

---

## 1. Navegação e UX
- **Ao clicar no card de um serviço:**
  - Redirecionar para `/business/[publicUrl]/services/[serviceId]/appointment`.
- **Página de agendamento:**
  - Exibir calendário com datas disponíveis (consultando Schedule do prestador).
  - Ao selecionar uma data, exibir horários disponíveis para aquele dia.
  - Ao selecionar um horário, abrir modal com formulário para:
    - Nome do cliente
    - E-mail
    - Telefone
    - Observações (opcional)
  - Botão para confirmar agendamento.
  - Mensagens de sucesso/erro exibidas via Toastify.
  - Validação do formulário com Zod + React Hook Form.

## 2. Back-end (API Routes)
- **Endpoints necessários:**
  1. `GET /api/services/[serviceId]/available-dates` – Retorna as datas disponíveis para o serviço (baseado no Schedule do prestador).
  2. `GET /api/services/[serviceId]/available-times?date=YYYY-MM-DD` – Retorna horários disponíveis para a data selecionada, considerando agendamentos já existentes.
  3. `POST /api/appointments` – Cria um novo agendamento (valida disponibilidade antes de criar).

- **Validações:**
  - Não é necessário bloquear agendamentos conflitantes (não verificar se o horário já está ocupado).
  - Validar dados do cliente (nome, e-mail, telefone) usando Zod e React Hook Form.
  - Mensagens de erro ou sucesso sempre via Toastify.
  - Enviar e-mail de confirmação para cliente e prestador (pode ser implementado em etapa posterior).

## 3. Front-end
- **Componentes:**
  - Página de agendamento do serviço (`/business/[publicUrl]/services/[serviceId]/appointment`)
    - Calendário de datas disponíveis
    - Lista de horários disponíveis
    - Modal de formulário de agendamento
  - Reutilizar componentes de UI existentes (inputs, modal, botão)

- **Fluxo:**
  1. Usuário acessa a página de agendamento do serviço.
  2. Front-end faz requisição para buscar datas disponíveis.
  3. Ao selecionar uma data, busca horários disponíveis.
  4. Ao selecionar horário, exibe modal com formulário.
  5. Ao submeter, faz POST para criar agendamento.
  6. Exibe feedback de sucesso ou erro via Toastify.

## 4. Banco de Dados
- Utilizar tabela `Schedule` para determinar datas/horários disponíveis.
- Não é necessário verificar conflitos na tabela `Appointment` (permitir agendamentos duplicados no mesmo horário).

## 5. Tarefas Detalhadas
1. **Back-end:**
   - [ ] Criar rota para buscar datas disponíveis.
   - [ ] Criar rota para buscar horários disponíveis.
   - [ ] Criar rota para criar agendamento.
  - [ ] Validar dados do cliente (Zod + React Hook Form).
2. **Front-end:**
   - [ ] Adicionar navegação ao clicar no card do serviço.
   - [ ] Criar página de agendamento do serviço.
   - [ ] Implementar calendário de datas disponíveis.
   - [ ] Implementar seleção de horários.
   - [ ] Implementar modal de formulário.
   - [ ] Consumir rotas de API e tratar respostas.
   - [ ] Exibir feedback ao usuário.
3. **Extra:**
   - [ ] (Opcional) Enviar e-mail de confirmação.
   - [ ] (Opcional) Testes automatizados.

## 6. Critérios de Aceitação
- Cliente consegue agendar serviço em menos de 1 minuto.
- Não é possível agendar em horários já ocupados.
- Feedback claro em caso de sucesso ou erro (Toastify).
- Dados do agendamento são persistidos corretamente.

---

**Observações:**
- Seguir padrões de código e arquitetura definidos no projeto.
- Utilizar stack e bibliotecas já adotadas (Next.js, Prisma, shadcn/ui, zod, etc).
- Garantir responsividade e boa experiência mobile.

---

*Dúvidas ou ajustes, revisar este plano antes de iniciar a implementação.*
