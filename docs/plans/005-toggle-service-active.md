# Plano de Ação – Toggle de Ativação de Serviço (`isActive`)

## Contexto
- O sistema TWAgenda permite que prestadores cadastrem serviços e definam se estão ativos ou inativos.
- Atualmente, o campo `isActive` existe no modelo `Service`, mas não há funcionalidade para alternar seu valor via interface ou API.
- O objetivo é permitir que o prestador ative/inative um serviço pelo painel, conforme requisitos do MVP.

## Requisitos
- O prestador deve conseguir ativar ou inativar um serviço pelo painel administrativo.
- A alteração deve ser refletida imediatamente na interface.
- Apenas o prestador dono do serviço pode alterar o status.
- O backend deve garantir a segurança e integridade da operação.

## Passos para Implementação

### 1. Back-end (API Route)
- [ ] Criar rota `PATCH /api/services/[id]/toggle-active`.
  - Recebe o ID do serviço e alterna o valor de `isActive`.
  - Verifica se o usuário autenticado é o dono do serviço.
  - Retorna o novo status do serviço.
- [ ] Atualizar validações e autenticação conforme padrão do projeto (Auth.js, zod, etc).

### 2. Front-end
- [ ] No componente `ServiceCard`, tornar o switch de ativação interativo.
  - Ao clicar, faz requisição para a rota de toggle.
  - Exibe feedback de carregamento e erro.
  - Atualiza o estado do serviço na UI após resposta da API.
- [ ] Garantir que apenas o dono do serviço veja e possa interagir com o toggle.
- [ ] Ajustar listagem para refletir mudanças imediatamente (optimistic update ou refetch).

### 3. Segurança e UX
- [ ] Garantir que apenas usuários autenticados e donos do serviço possam alternar o status.
- [ ] Exibir mensagens de sucesso/erro para o usuário.
- [ ] Garantir acessibilidade do toggle.

## Observações
- Seguir padrões de código, autenticação e validação já definidos no projeto.
- Utilizar Prisma para atualização do campo `isActive`.
- Garantir resposta rápida (<2s) conforme requisitos não funcionais.

---

**Próximos passos:**
1. Implementar rota de API.
2. Integrar toggle no front-end.
3. Testar fluxo completo.
4. Documentar e revisar.
