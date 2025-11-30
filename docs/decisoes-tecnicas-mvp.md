# Decisões Técnicas – TWAgenda (MVP)

## 1. Arquitetura Geral
- **Monolito Modular** (Next.js fullstack)
- Justificativa: Simplicidade, agilidade, menor custo e fácil manutenção para MVP. Permite evolução futura para arquitetura mais complexa se necessário.

## 2. Linguagem e Stack Principal
- **Node.js** (JavaScript/TypeScript)
- **React + Next.js** (SSR/híbrido)
- Justificativa: Stack moderno, produtivo, com grande comunidade e integração nativa entre front e back.

## 3. Framework Back-end
- **Next.js API Routes**
- Justificativa: Permite backend e frontend juntos, menos configuração, ideal para MVPs.

## 4. Framework Front-end
- **React (Next.js)**
- Justificativa: SPA/SSR, ótima experiência de usuário, SEO e performance.

## 5. Banco de Dados
- **PostgreSQL**
  - Produção: Neon Database (serverless)
  - Desenvolvimento: Docker Compose (PostgreSQL local)
- Justificativa: Relacional, robusto, ótimo para relatórios e relacionamentos complexos.

## 6. Autenticação e Autorização
- **Sessions + Cookies** (Auth.js)
- Justificativa: Mais seguro para web, integração nativa com Next.js, menos risco de vazamento de credenciais.

## 7. Deploy e Infraestrutura
- **Vercel** (deploy Next.js)
- **Neon Database** (PostgreSQL serverless)
- **Docker Compose** (PostgreSQL local para dev)
- Justificativa: Deploy simples, CI/CD integrado, fácil de escalar.

## 8. Bibliotecas Principais
- **ORM:** Prisma
- **Autenticação:** Auth.js (next-auth v5+)
- **Ícones:** Lucide
- **UI:** shadcn/ui (Radix UI + Tailwind)
- **Validação:** zod
- **E-mail:** nodemailer + SMTP MailTrap

## 9. DevOps e Observabilidade
- Não implementado no MVP inicial
- Justificativa: Foco em agilidade e entrega rápida

---

## Resumo dos Benefícios
- Entrega rápida, baixo custo e fácil manutenção
- Stack moderno, seguro e escalável
- Facilidade de evolução futura

## Próximos Passos Sugeridos
1. Prototipação técnica (setup inicial do projeto Next.js)
2. Definir convenções de código e estrutura de pastas
3. Implementar modelos de dados e autenticação
4. Criar as primeiras rotas/pages do MVP

Se desejar revisar ou reavaliar algum ponto, basta solicitar!
