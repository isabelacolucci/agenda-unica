# Decisões Técnicas – Agenda Única (MVP)

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
- **JWT + Cookies** (Auth.js com Credentials Provider)
- Justificativa: Autenticação stateless usando JWT, sem necessidade de tabelas de sessão no banco de dados. Mais simples para MVP, com credenciais armazenadas diretamente na tabela Provider (email/senha com bcrypt).

## 7. Deploy e Infraestrutura
- **Vercel** (deploy Next.js)
- **Neon Database** (PostgreSQL serverless)
- **Docker Compose** (PostgreSQL local para dev)
- Justificativa: Deploy simples, CI/CD integrado, fácil de escalar.

## 8. Bibliotecas Principais
- **ORM:** Prisma
- **Autenticação:** Auth.js (next-auth v5+) com Credentials Provider
- **Hash de Senhas:** bcrypt
- **Ícones:** Lucide
- **UI:** shadcn/ui (Radix UI + Tailwind)
- **Validação:** zod
- **E-mail:** nodemailer + SMTP MailTrap

## 9. Modelo de Dados
O sistema utiliza 4 tabelas principais no PostgreSQL:

1. **providers**: Dados dos profissionais/estabelecimentos, incluindo credenciais de autenticação (email/senha) e token de recuperação de senha
2. **services**: Serviços oferecidos pelos profissionais
3. **schedules**: Horários de funcionamento por dia da semana
4. **appointments**: Agendamentos realizados pelos clientes

**Nota**: O sistema não utiliza as tabelas padrão do Auth.js (Account, Session, User, VerificationToken) pois a autenticação é feita diretamente com a tabela `providers` usando JWT.

## 10. DevOps e Observabilidade
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
