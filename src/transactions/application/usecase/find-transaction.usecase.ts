import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from '../../domain/entity/transaction.entity';
import { ITransactionRepository } from '../../domain/repository/transaction-repository.interface';

@Injectable()
export class FindTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return transaction;
  }
}
