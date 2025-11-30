# Agenda Única

## 📋 Sobre o Projeto

Agenda Única é uma aplicação web de agendamento voltada para negócios locais, como barbearias, salões de beleza, consultórios e outros profissionais autônomos. A solução permite que profissionais cadastrem seus serviços e horários de atendimento, enquanto clientes podem agendar facilmente através de uma página pública exclusiva.

### 🎯 Objetivos

- **Previsibilidade de Faturamento**: Dashboard com resumo dos agendamentos e previsão de receita
- **Presença Digital**: Página pública personalizada para cada profissional
- **Facilidade de Agendamento**: Processo simples e rápido para clientes, sem necessidade de cadastro
- **Gestão Eficiente**: Painel administrativo para gerenciar serviços, horários e agendamentos

### ✨ Principais Funcionalidades

- 🔐 **Autenticação** de profissionais
- 👤 **Cadastro e edição** de dados do estabelecimento
- 💼 **Gerenciamento de serviços** (nome, descrição, duração, valor)
- 🕒 **Definição de horários** de atendimento por dia/turno
- 📅 **Agendamento online** para clientes (sem cadastro prévio)
- 📊 **Dashboard** com previsão de faturamento e resumo dos agendamentos
- ✅ **Controle de status** dos agendamentos (compareceu, cancelou, faltou)
- 🌐 **Página pública** personalizada para cada profissional

## 🛠️ Stack Tecnológica

- **Frontend/Backend**: Next.js 15 com TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: Auth.js (next-auth v5+)
- **UI**: shadcn/ui + Tailwind CSS
- **Validação**: Zod
- **Ícones**: Lucide React
- **Gráficos**: Recharts

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ instalado
- Docker e Docker Compose instalados
- Git instalado

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd agenda-unica
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

Inicie o PostgreSQL usando Docker Compose:

```bash
docker compose up -d
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://agenda_unica:agenda_unica123@localhost:5432/agenda_unica"

# Auth
AUTH_SECRET="seu-auth-secret-aqui"
AUTH_URL="http://localhost:3000"
```

### 5. Execute as migrações do banco

```bash
npx prisma migrate dev
```

### 6. (Opcional) Execute o seed do banco

```bash
npm run db:seed
```

### 7. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
agenda-unica/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── api/               # API Routes
│   │   ├── dashboard/         # Páginas do painel administrativo
│   │   ├── business/          # Páginas públicas dos profissionais
│   │   ├── login/            # Página de login
│   │   └── register/         # Página de cadastro
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes base (shadcn/ui)
│   │   ├── dashboard/        # Componentes do dashboard
│   │   ├── appointments/     # Componentes de agendamentos
│   │   └── services/         # Componentes de serviços
│   ├── lib/                  # Utilitários e configurações
│   │   ├── actions/          # Server Actions
│   │   ├── auth/             # Configuração de autenticação
│   │   └── validations/      # Schemas de validação Zod
│   └── types/                # Definições de tipos TypeScript
├── prisma/                   # Schema e migrações do banco
├── docs/                     # Documentação do projeto
└── public/                   # Arquivos estáticos
```

## 📖 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera o build de produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o ESLint
- `npm run db:seed` - Executa o seed do banco de dados

## 🔑 Funcionalidades por Tipo de Usuário

### Para Profissionais (Dashboard)

1. **Cadastro/Login**: Criação de conta e autenticação
2. **Configuração do Perfil**: Dados do estabelecimento e URL pública
3. **Gestão de Serviços**: CRUD completo de serviços oferecidos
4. **Horários de Atendimento**: Definição de disponibilidade por dia
5. **Dashboard**: Visão geral dos agendamentos e faturamento
6. **Gestão de Agendamentos**: Controle de status e detalhes

### Para Clientes (Página Pública)

1. **Visualização de Serviços**: Lista de serviços disponíveis
2. **Seleção de Horário**: Calendário com horários disponíveis
3. **Agendamento**: Formulário simples (nome, email, telefone, observações)
4. **Confirmação**: Feedback imediato do agendamento realizado

## 🗄️ Modelo de Dados

O projeto utiliza 4 tabelas principais no PostgreSQL:

### Provider (Profissionais)
Armazena os dados dos profissionais/estabelecimentos, incluindo:
- Informações básicas (nome, nome do negócio, telefone, endereço)
- Credenciais de autenticação (email, senha com bcrypt)
- URL pública personalizada
- Tokens para recuperação de senha

### Service (Serviços)
Serviços oferecidos pelos profissionais:
- Nome, descrição e duração em minutos
- Preço do serviço
- Status ativo/inativo
- Relacionamento com Provider

### Schedule (Horários)
Horários de funcionamento semanais:
- Dia da semana
- Horário de início e término
- Relacionamento com Provider

### Appointment (Agendamentos)
Agendamentos realizados pelos clientes:
- Data e hora do agendamento
- Status (agendado, concluído, cancelado, não compareceu)
- Dados do cliente (nome, email, telefone)
- Observações opcionais
- Relacionamento com Provider e Service

**Observação**: O sistema utiliza autenticação JWT com Auth.js e não utiliza as tabelas padrão do Auth.js (Account, Session, User, VerificationToken). A autenticação é feita diretamente com a tabela `providers`.

## 📄 Documentação Adicional

Para mais detalhes sobre o projeto, consulte a documentação na pasta `docs/`:

- [Levantamento de Requisitos](./docs/levantamento-requisitos.md)
- [Decisões Técnicas](./docs/decisoes-tecnicas-mvp.md)
- [Ideia Refinada](./docs/ideia-refinada.md)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

Desenvolvido por Isa Colucci para a disciplina "Projeto de Extensão em Software Fullstack" 🚀