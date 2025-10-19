import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from '../../domain/entity/transaction.entity';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repository/transaction-repository.interface';
import { TransactionType } from '../../domain/enum/transaction-type.enum';

type UpdateTransactionInput = {
  title?: string;
  amount?: number;
  type?: TransactionType;
  category?: string;
};

@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateTransactionInput,
  ): Promise<Transaction> {
    const existingTransaction = await this.transactionRepository.findById(id);
    if (!existingTransaction) {
      throw new NotFoundException(`Transação não encontrada`);
    }

    const updatedData: Partial<Transaction> = {
      ...input,
      updatedAt: new Date(),
    };

    return await this.transactionRepository.update(id, updatedData);
  }
}
