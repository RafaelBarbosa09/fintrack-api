import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITransactionRepository } from '../../domain/repository/transaction-repository.interface';

@Injectable()
export class DeleteTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    await this.transactionRepository.delete(id);
  }
}
