# FinTrack API - Setup

## 📋 Pré-requisitos

- Node.js (v18+)
- PostgreSQL
- Yarn ou NPM

## 🚀 Instalação

### 1. Instale as dependências:

```bash
yarn install
```

### 2. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto baseado no `env.example`

Substitua:

- `user`: seu usuário do PostgreSQL
- `password`: sua senha do PostgreSQL
- `localhost:5432`: host e porta do PostgreSQL
- `fintrack`: nome do banco de dados

### 3. Crie o container do banco de dados:
```bash
docker run -d --name fintrack-db \
  -e POSTGRES_DB=fintrack \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=root \
  -p 5432:5432 \
  postgres
```

### 4. Execute a aplicação:

```bash
# Desenvolvimento
yarn start:dev

# Produção
yarn build
yarn start:prod
```

## 🧪 Testes

```bash
# Executar testes
yarn test

# Executar testes com coverage
yarn test:coverage

# Abrir interface de testes
yarn test:ui
```

## 📡 API Endpoints

A API estará disponível em `http://localhost:3333`

## 🗄️ Comandos do Prisma

```bash
# Gera o Prisma Client
yarn db:generate

# Criar nova migration
yarn db:migrate --name nome_da_migration

# Aplicar migrations pendentes
yarn migrate:deploy

```
