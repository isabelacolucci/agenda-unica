# Plano de Ação – Edição de Serviço (Update Service)

## Objetivo
Permitir que o prestador edite os dados de um serviço já cadastrado, garantindo validação, feedback ao usuário e atualização em tempo real da lista de serviços.

---

## 1. Back-end: Rota de API para Edição de Serviço

- **Criar rota:** `PATCH /api/services/[id]`
- **Local:** `src/app/api/services/[id]/route.ts`
- **Responsabilidades:**
  - Receber dados do serviço a ser atualizado (name, description, durationMinutes, price, isActive).
  - Validar payload com Zod (campos obrigatórios, tipos, limites).
  - Atualizar o serviço no banco via Prisma.
  - Retornar o serviço atualizado ou erro apropriado.
- **Validações:**
  - Nome: obrigatório, string, tamanho mínimo/máximo.
  - Descrição: opcional, string, tamanho máximo.
  - Duração: obrigatório, inteiro positivo.
  - Preço: obrigatório, float positivo.
  - isActive: boolean.
- **Restrições:**
  - Apenas o provider dono pode editar seu serviço.
  - Retornar erros amigáveis para o front.

---

## 2. Front-end: Integração e UI

### 2.1. Botão "Editar"
- No componente `ServiceCard`, ao clicar em "Editar":
  - Abrir modal com formulário de edição pré-preenchido com os dados do serviço.

### 2.2. Modal de Edição
- Criar componente de modal reutilizável (se não existir).
- Formulário com campos:
  - Nome (input)
  - Descrição (textarea)
  - Duração (input number)
  - Preço (input number)
  - Ativo/Inativo (switch)
- Usar Zod para validação dos campos no front-end.
- Exibir mensagens de erro inline nos campos.

### 2.3. Submissão do Formulário
- Ao submeter:
  - Validar com Zod.
  - Fazer requisição PATCH para `/api/services/[id]` com os dados.
  - Exibir loading/spinner enquanto aguarda resposta.
  - Se sucesso:
    - Fechar modal.
    - Atualizar lista de serviços (atualizar apenas o serviço editado no estado do React).
    - Exibir toast de sucesso (Toastify).
  - Se erro:
    - Exibir toast de erro (Toastify) com mensagem apropriada.

---

## 3. Validações e Feedback
- **Zod**: Usar tanto no back quanto no front para garantir consistência.
- **Toastify**: Para feedback de sucesso/erro global.
- **Mensagens inline**: Para erros de validação de campos.

---

## 4. Atualização da Lista de Serviços
- Após edição bem-sucedida:
  - Atualizar o serviço editado no array de serviços do estado (`setServices`).
  - Garantir que a UI reflita imediatamente a alteração sem recarregar a página.

---

## 5. Segurança e Permissões
- Garantir que apenas o provider dono do serviço possa editar.
- Validar autenticação na rota de API.

---

## 6. Testes e Critérios de Aceitação
- O modal deve abrir com os dados corretos ao clicar em "Editar".
- O formulário deve validar corretamente os campos.
- O serviço deve ser atualizado no banco e refletido na UI sem reload.
- Mensagens de sucesso/erro devem ser exibidas conforme o caso.
- Não deve ser possível editar serviço de outro provider.

---

## 7. Referências
- [Levantamento de Requisitos](../levantamento-requisitos.md)
- [Decisões Técnicas](../decisoes-tecnicas-mvp.md)

---

**Próximos passos:**
1. Implementar rota PATCH no back-end.
2. Criar/ajustar modal e formulário de edição no front-end.
3. Integrar validação Zod e Toastify.
4. Testar fluxo completo e ajustar UX.
