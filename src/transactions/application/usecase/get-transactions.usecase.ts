import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entity/transaction.entity';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repository/transaction-repository.interface';

@Injectable()
export class GetTransactionsUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(): Promise<Transaction[]> {
    return await this.transactionRepository.findAll();
  }
}
