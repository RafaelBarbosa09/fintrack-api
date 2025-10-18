import { Module } from '@nestjs/common';

// Interface Adapters - Controllers
import { TransactionsController } from './infrastructure/controller/transactions.controller';

// Application - Use Cases
import { CreateTransactionUseCase } from './application/usecase/create-transaction.usecase';
import { GetTransactionsUseCase } from './application/usecase/get-transactions.usecase';
import { FindTransactionUseCase } from './application/usecase/find-transaction.usecase';
import { UpdateTransactionUseCase } from './application/usecase/update-transaction.usecase';
import { DeleteTransactionUseCase } from './application/usecase/delete-transaction.usecase';

// Infrastructure - Adapters (Implementations)
import { PrismaService } from './infrastructure/database/prisma.service';
import { PrismaTransactionRepository } from './infrastructure/repository/prisma-transaction.repository';

/**
 * MÓDULO DE TRANSAÇÕES
 *
 * Configuração de Injeção de Dependências seguindo SOLID (DIP - Dependency Inversion Principle)
 * e Hexagonal Architecture (Ports & Adapters)
 *
 * Estrutura:
 *
 * 1. DOMAIN (Núcleo - sem dependências externas)
 *    - Entities: Transaction
 *    - Enums: TransactionType
 *    - Ports (Interfaces): ITransactionRepository
 *
 * 2. APPLICATION (Casos de Uso - lógica de negócio)
 *    - Use Cases: CreateTransaction, GetTransactions, etc.
 *    - Dependem apenas de abstrações (Ports do Domain)
 *
 * 3. INFRASTRUCTURE (Frameworks & Drivers - detalhes de implementação)
 *    - Adapters: PrismaTransactionRepository (implementa ITransactionRepository)
 *    - Database: PrismaService
 *    - A camada mais externa, pode ser trocada sem afetar o Domain/Application
 *
 * 4. INTERFACE ADAPTERS (Conversores)
 *    - Controllers: TransactionsController
 *    - DTOs: CreateTransactionDto, UpdateTransactionDto
 *    - Convertem requisições externas em chamadas para Use Cases
 *
 * Inversão de Dependências:
 * - Use Cases dependem de ITransactionRepository (abstração)
 * - PrismaTransactionRepository implementa ITransactionRepository (concreção)
 * - O NestJS injeta a implementação usando o token TRANSACTION_REPOSITORY
 * - Isso permite trocar a implementação (ex: de Prisma para TypeORM) sem alterar os Use Cases
 */
@Module({
  controllers: [
    // Interface Adapters - Camada de entrada
    TransactionsController,
  ],
  providers: [
    // Infrastructure - Database Service
    PrismaService,

    // Infrastructure - Repository Implementation (ADAPTER)
    // Aqui aplicamos Inversão de Dependências (SOLID - DIP)
    // O token 'ITransactionRepository' é a abstração (PORT)
    // PrismaTransactionRepository é a implementação concreta (ADAPTER)
    {
      provide: 'ITransactionRepository',
      useClass: PrismaTransactionRepository,
    },

    // Application - Use Cases
    // Estes dependem apenas da interface ITransactionRepository
    // Não conhecem a implementação concreta (Prisma)
    CreateTransactionUseCase,
    GetTransactionsUseCase,
    FindTransactionUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
  ],
  exports: [
    // Exportamos o repositório caso outros módulos precisem
    'ITransactionRepository',
  ],
})
export class TransactionsModule {}
