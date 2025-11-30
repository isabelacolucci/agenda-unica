# Plano de Ação – Atualização do Telefone e Indicação de WhatsApp na Configuração do Usuário

## 1. Objetivo
Permitir que o usuário (Provider) edite seu número de telefone na tela de configurações, com máscara adequada, e adicione um checkbox para indicar se o número informado é WhatsApp.

---

## 2. Etapas do Plano de Ação

### 2.1. Modelagem e Infraestrutura
- [ ] **Revisar o modelo `Provider`** no `schema.prisma`:
  - [ ] Garantir que o campo `phone` exista.
  - [ ] Adicionar campo booleano `isWhatsapp` (ex: `is_whatsapp Boolean @default(false)`).
  - [ ] Executar migração para atualizar o banco de dados.

### 2.2. Backend (API)
- [ ] **Atualizar rotas de API** (`GET` e `PUT /api/config`):
  - [ ] Incluir o campo `isWhatsapp` na resposta e atualização.
  - [ ] Permitir atualização dos campos `phone` e `isWhatsapp`.
  - [ ] Validar formato do telefone (usando Zod).
  - [ ] Garantir que apenas o usuário autenticado possa editar seu telefone.

### 2.3. Frontend (Página de Configuração)
- [ ] **Atualizar formulário em `/dashboard/config`**:
  - [ ] Exibir campo de telefone com máscara (igual ao registro).
  - [ ] Adicionar checkbox "Este número é WhatsApp?" ao lado do campo telefone.
  - [ ] Preencher o valor do checkbox conforme o valor salvo.
  - [ ] Permitir edição e submissão dos campos.
  - [ ] Validar telefone no client-side (Zod + React Hook Form).
  - [ ] Exibir mensagens de sucesso/erro.

### 2.4. Testes
- [ ] **Testar fluxo completo** de edição do telefone e marcação do WhatsApp.
- [ ] **Testar máscara e validação** do campo telefone.
- [ ] **Testar persistência e exibição correta** do checkbox.

### 2.5. Documentação e Ajustes Finais
- [ ] **Documentar novo campo e regras de validação**.
- [ ] **Atualizar README e documentação técnica, se necessário**.

---

## 3. Observações e Boas Práticas
- Utilizar o mesmo padrão de máscara do campo telefone do registro.
- Garantir feedback claro ao usuário.
- Seguir convenções de código e UX do projeto.

---

## 4. Critérios de Aceitação
- Usuário pode editar o telefone e marcar/desmarcar se é WhatsApp.
- Máscara e validação do telefone são aplicadas corretamente.
- Alterações são persistidas e refletidas na tela.
- Mensagens de sucesso/erro são exibidas adequadamente.

---
