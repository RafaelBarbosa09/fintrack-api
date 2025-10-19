import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from '../../domain/entity/transaction.entity';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repository/transaction-repository.interface';

@Injectable()
export class FindTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new NotFoundException(`Transação não encontrada`);
    }

    return transaction;
  }
}
