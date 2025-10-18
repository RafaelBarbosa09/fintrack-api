# FinTrack API - Arquitetura

Este projeto segue **Clean Architecture**, **Hexagonal Architecture (Ports & Adapters)** e princípios **SOLID**.

## 🎯 Princípios Aplicados

### 1. Clean Architecture

As dependências seguem a regra de dependência:

```
Interface Adapters → Application → Domain
Infrastructure → Application → Domain
```

- **Domain**: Núcleo da aplicação, sem dependências externas
- **Application**: Casos de uso que orquestram o domínio
- **Infrastructure**: Implementações concretas (Prisma, etc)
- **Interface Adapters**: Conversores (Controllers, DTOs)

### 2. Hexagonal Architecture (Ports & Adapters)

**Ports (Portas)**: Interfaces que definem contratos

- `ITransactionRepository` - Define o que o repositório deve fazer

**Adapters (Adaptadores)**: Implementações concretas

- `PrismaTransactionRepository` - Implementa o repositório usando Prisma

Esta arquitetura permite:

- Trocar Prisma por outro ORM sem afetar o domínio
- Testar use cases com mocks
- Isolar lógica de negócio de detalhes técnicos

## 📦 Benefícios

1. **Independência de Frameworks**: O domínio não conhece NestJS ou Prisma
2. **Testabilidade**: Fácil mockar dependências
3. **Manutenibilidade**: Código organizado e separado por responsabilidades
4. **Flexibilidade**: Fácil trocar implementações (Prisma → TypeORM)
5. **Escalabilidade**: Estrutura preparada para crescer

## 📚 Referências

- Clean Architecture (Robert C. Martin)
- Hexagonal Architecture (Alistair Cockburn)
- SOLID Principles
- Refactoring (Martin Fowler)
