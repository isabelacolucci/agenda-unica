# Plano de Ação – Cadastro de Serviço (Agenda Única)

## 1. Objetivo
Implementar a funcionalidade de cadastro de serviço, permitindo que o prestador crie novos serviços via modal, com validação, feedback ao usuário e atualização automática da lista.

## 2. Requisitos e Referências
- **Requisitos Funcionais:** Cadastro de serviços (nome, descrição, duração, valor, ativo)
- **Stack:** Next.js (API Route), React, Prisma, Zod, Toastify, shadcn/ui
- **Referências:** docs/levantamento-requisitos.md, docs/decisoes-tecnicas-mvp.md

## 3. Passos Técnicos

### Backend (API Route)
1. **Criar rota POST `/api/services`**
   - Local: `src/app/api/services/route.ts`
   - Receber dados do serviço (nome, descrição, duração, valor, ativo)
   - Validar payload com Zod
   - Criar serviço no banco via Prisma
   - Retornar o serviço criado ou erro

### Frontend
2. **Criar Modal de Cadastro de Serviço**
   - Local: `src/components/services/create-service-modal.tsx`
   - Formulário com campos: nome, descrição (opcional), duração (min), valor, ativo
   - Validação com Zod (mesmas regras do backend)
   - Usar React Hook Form + zodResolver
   - Botões: Cancelar, Cadastrar

3. **Integrar Modal ao Botão "Novo Serviço"**
   - Local: `src/components/services/services-list.tsx`
   - Ao clicar em "Novo Serviço" abrir o modal de cadastro

4. **Fazer requisição para a API**
   - Ao submeter o formulário, enviar POST para `/api/services`
   - Exibir loading durante a requisição
   - Em caso de sucesso:
     - Fechar modal
     - Exibir toast de sucesso
     - Adicionar novo serviço à lista (atualizar estado)
   - Em caso de erro:
     - Exibir toast de erro

5. **Atualizar Lista de Serviços**
   - Adicionar o novo serviço ao array de serviços no estado do componente `ServicesList`

6. **Mensagens ao Usuário**
   - Usar Toastify para feedback de sucesso/erro

## 4. Validações (Zod)
- Nome: obrigatório, até 100 caracteres
- Descrição: opcional, até 500 caracteres
- Duração: obrigatório, 1 a 600 minutos
- Preço: obrigatório, > 0
- Ativo: boolean

## 5. Observações
- Seguir padrões de código e UI já existentes
- Garantir acessibilidade e responsividade do modal
- Testar fluxo completo: cadastro, feedback, atualização da lista

---

**Próximos passos:**
1. Implementar rota de API
2. Criar modal de cadastro
3. Integrar modal ao botão e à lista
4. Testar e ajustar UX
