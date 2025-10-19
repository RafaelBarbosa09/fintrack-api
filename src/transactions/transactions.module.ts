import { Module } from '@nestjs/common';

import { TransactionsController } from './infrastructure/controller/transactions.controller';

import { CreateTransactionUseCase } from './application/usecase/create-transaction.usecase';
import { GetTransactionsUseCase } from './application/usecase/get-transactions.usecase';
import { FindTransactionUseCase } from './application/usecase/find-transaction.usecase';
import { UpdateTransactionUseCase } from './application/usecase/update-transaction.usecase';
import { DeleteTransactionUseCase } from './application/usecase/delete-transaction.usecase';

import { PrismaService } from './infrastructure/database/prisma.service';
import { PrismaTransactionRepository } from './infrastructure/repository/prisma-transaction.repository';
import { TRANSACTION_REPOSITORY } from './domain/repository/transaction-repository.interface';

@Module({
  controllers: [TransactionsController],
  providers: [
    PrismaService,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
    CreateTransactionUseCase,
    GetTransactionsUseCase,
    FindTransactionUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
  ],
  exports: [TRANSACTION_REPOSITORY],
})
export class TransactionsModule {}
