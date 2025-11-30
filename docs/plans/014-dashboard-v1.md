# Plano de Ação – Dashboard v1 (TWAgenda)

## Objetivo
Implementar a primeira versão do dashboard do prestador de serviço, exibindo:
- Card com o link público do prestador (com funcionalidade de copiar ao clicar)
- Card com informações dos agendamentos: total, cancelados, concluídos e não comparecimentos

## 1. Levantamento de Requisitos
- Exibir o link público do prestador no padrão `/business/[publicLink]`, usando o host da aplicação da variável de ambiente `NEXTAUTH_URL`.
- Exibir estatísticas dos agendamentos do prestador: total, cancelados, concluídos, não comparecimentos.
- Funcionalidade de copiar o link ao clicar no card do link público.
- Utilizar API Routes para fornecer os dados ao front-end.
- O front-end deve consumir as rotas via fetch/React hooks.
- Seguir stack e padrões definidos nos documentos técnicos.

## 2. Back-end (API Routes)
### 2.1. Endpoint: `/api/dashboard/summary`
- **Método:** GET
- **Autenticação:** Requer sessão do prestador
- **Retorno:**
  - `publicUrl`: string (slug público do prestador)
  - `stats`: objeto com:
    - `total`: número total de agendamentos
    - `completed`: número de agendamentos concluídos
    - `canceled`: número de agendamentos cancelados
    - `noShow`: número de agendamentos marcados como não comparecimento
- **Implementação:**
  - Buscar o prestador autenticado
  - Consultar o banco de dados (Prisma) para obter o `publicUrl` e os totais de agendamentos por status

## 3. Front-end (Dashboard)
### 3.1. Card: Link Público
- Exibir a URL completa (`${NEXTAUTH_URL}/business/[publicUrl]`)
- Ao clicar no card, copiar o link para a área de transferência e exibir feedback visual (ex: toast ou tooltip "Copiado!")

### 3.2. Card: Estatísticas de Agendamentos
- Exibir os totais retornados pela API:
  - Total de agendamentos
  - Total de concluídos
  - Total de cancelados
  - Total de não comparecimentos
- Layout responsivo e visualmente agradável (usar shadcn/ui ou Tailwind)

### 3.3. Consumo da API
- Utilizar React hooks (ex: `useEffect`/`useState` ou SWR/React Query se já estiver no projeto)
- Exibir loading e tratamento de erro

## 4. Testes e Validação
- Testar com prestadores com e sem agendamentos
- Validar cópia do link e feedback visual
- Validar autenticação e proteção da rota

## 5. Checklist de Entrega
- [ ] API `/api/dashboard/summary` implementada e protegida
- [ ] Card de link público funcional com cópia
- [ ] Card de estatísticas de agendamentos
- [ ] Consumo da API no front-end
- [ ] Layout responsivo e feedback visual
- [ ] Testes manuais realizados

---

**Referências:**
- [docs/levantamento-requisitos.md](../levantamento-requisitos.md)
- [docs/decisoes-tecnicas-mvp.md](../decisoes-tecnicas-mvp.md)
