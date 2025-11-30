# Plano de Ação – Atualização de Senha

## 1. Objetivo
Permitir que o prestador de serviço (usuário autenticado) atualize sua senha de forma segura, através de um formulário com validação adequada e feedback ao usuário, seguindo as decisões técnicas e requisitos do projeto.

## 2. Requisitos
- **Campos do formulário:**
  - Senha atual
  - Nova senha
  - Confirmação da nova senha
- **Validações:**
  - Todos os campos obrigatórios
  - Nova senha deve ter requisitos mínimos (seguir exemplo de `src/lib/validation/provider.ts`)
  - Nova senha e confirmação devem ser iguais
  - Senha atual deve ser validada no back-end
- **Feedback ao usuário:**
  - Mensagens de erro e sucesso exibidas via Toastify
- **Segurança:**
  - Senhas nunca devem ser logadas ou expostas
  - Troca de senha só permitida para usuário autenticado

## 3. Passos de Implementação

### 3.1. Back-end (API Route)
1. **Criar rota de API:**
   - Exemplo: `src/app/api/auth/update-password/route.ts`
   - Método: `PATCH` ou `POST`
2. **Validação de autenticação:**
   - Garantir que apenas usuários autenticados possam acessar
3. **Receber e validar dados:**
   - Receber `{ currentPassword, newPassword, confirmPassword }`
   - Validar com zod (no back-end também)
   - Verificar se `newPassword` e `confirmPassword` coincidem
   - Verificar se `currentPassword` está correta (comparar hash)
4. **Atualizar senha:**
   - Gerar novo hash para `newPassword`
   - Atualizar no banco de dados (Provider)
5. **Retornar resposta adequada:**
   - Sucesso: mensagem de confirmação
   - Erro: mensagem específica (ex: senha atual incorreta)

### 3.2. Front-end (Formulário)
1. **Criar componente de formulário:**
   - Exemplo: `src/components/config/update-password-form.tsx`
   - Três campos: senha atual, nova senha, confirmação
2. **Validação com zod + react-hook-form:**
   - Schema zod para validação dos campos
   - Integração com react-hook-form
3. **Exibir mensagens com Toastify:**
   - Erros de validação
   - Sucesso ou falha na atualização
4. **Consumir API Route:**
   - Enviar dados via fetch/axios para a rota criada
   - Tratar respostas e exibir feedback

### 3.3. Integração na UI
1. **Adicionar o formulário na página de configurações:**
   - Exemplo: `src/app/dashboard/config/page.tsx`
   - Incluir o novo componente abaixo do formulário de dados pessoais

## 4. Testes e Validação
- Testar todos os fluxos (sucesso, erro de senha atual, erro de confirmação, validação de força de senha)
- Garantir que mensagens são exibidas corretamente via Toastify
- Verificar atualização no banco de dados

## 5. Observações
- Seguir padrões de código e UI já utilizados no projeto
- Garantir que a senha seja armazenada de forma segura (hash, nunca em texto puro)
- Não expor detalhes sensíveis em mensagens de erro

---

**Próximos passos:**
1. Implementar API Route de atualização de senha
2. Criar componente de formulário e integrar validações
3. Integrar Toastify para feedback ao usuário
4. Testar fluxo completo e revisar segurança
