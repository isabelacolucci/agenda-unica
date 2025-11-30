# Plano de Ação – Página Pública do Prestador de Serviço

## Objetivo
Implementar a página pública do prestador de serviço, acessível por `/business/[publicUrl]`, onde clientes poderão visualizar as informações do prestador e seus serviços ativos. Apenas serviços com `isActive = true` devem ser exibidos.

## 1. Requisitos
- Exibir informações públicas do prestador (nome, nome do negócio, endereço, telefone, etc.).
- Listar todos os serviços ativos do prestador em formato de cards.
- Acesso via URL amigável: `/business/[publicUrl]`.
- Apenas serviços com `isActive = true` devem aparecer.
- Implementação fullstack: API Routes (back-end) + página React (front-end).

## 2. Back-end (API Routes)
- Criar rota GET `/api/public-provider/[publicUrl]`:
  - Buscar o prestador pelo campo `publicUrl`.
  - Retornar dados públicos do prestador e lista de serviços ativos (`isActive = true`).
  - Retornar 404 se não encontrado.
- Garantir que apenas campos públicos sejam retornados (não incluir e-mail, senha, etc.).
- Utilizar Prisma para consultas.

## 3. Front-end (Página Pública)
- Criar página dinâmica em `/src/app/business/[publicUrl]/page.tsx`:
  - Consumir a API criada para buscar dados do prestador e serviços.
  - Exibir informações do prestador de forma destacada.
  - Listar serviços ativos em cards, mostrando nome, descrição, duração e preço.
  - Tratar estados de loading, erro e não encontrado.
- Utilizar componentes de UI já existentes (ex: cards, layouts) para manter padrão visual.

## 4. Integração e Validação
- Testar navegação direta para `/business/[publicUrl]` com prestadores existentes e inexistentes.
- Garantir que apenas serviços ativos aparecem.
- Validar responsividade e usabilidade da página.

## 5. Checklist de Implementação
- [ ] Criar rota API GET `/api/public-provider/[publicUrl]`
- [ ] Implementar busca segura e retorno de dados públicos
- [ ] Criar página `/business/[publicUrl]` no front-end
- [ ] Exibir informações do prestador
- [ ] Exibir cards de serviços ativos
- [ ] Tratar estados de loading, erro e 404
- [ ] Testar fluxo completo (API + página)

## 6. Observações
- Seguir padrões de código e arquitetura definidos no projeto.
- Utilizar apenas dados públicos do prestador.
- Não permitir ações administrativas nesta página.
- Futuras melhorias podem incluir agendamento direto pelo cliente.

---

**Referências:**
- [Levantamento de Requisitos](../levantamento-requisitos.md)
- [Decisões Técnicas](../decisoes-tecnicas-mvp.md)
