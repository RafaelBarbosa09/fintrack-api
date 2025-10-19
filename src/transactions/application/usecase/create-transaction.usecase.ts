import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entity/transaction.entity';
import { ITransactionRepository } from '../../domain/repository/transaction-repository.interface';
import { TransactionType } from '../../domain/enum/transaction-type.enum';

type CreateTransactionInput = {
  title: string;
  amount: number;
  type: TransactionType;
  categoryId?: string;
};

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(input: CreateTransactionInput): Promise<Transaction> {
    const transaction = Transaction.create({
      title: input.title,
      amount: input.amount,
      type: input.type,
      categoryId: input.categoryId,
    });

    return await this.transactionRepository.create(transaction);
  }
}
