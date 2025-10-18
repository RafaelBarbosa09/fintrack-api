import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteTransactionUseCase } from './delete-transaction.usecase';
import { ITransactionRepository } from '../../domain/repository/transaction-repository.interface';
import { Transaction } from '../../domain/entity/transaction.entity';
import { TransactionType } from '../../domain/enum/transaction-type.enum';

describe('DeleteTransactionUseCase', () => {
  let useCase: DeleteTransactionUseCase;
  let repository: ITransactionRepository;

  const mockRepository: ITransactionRepository = {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTransactionUseCase,
        {
          provide: 'ITransactionRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteTransactionUseCase>(DeleteTransactionUseCase);
    repository = module.get<ITransactionRepository>('ITransactionRepository');

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should delete a transaction successfully', async () => {
      const transaction = Transaction.create({
        title: 'Salário',
        amount: 5000,
        type: TransactionType.INCOME,
        category: 'Trabalho',
      });

      repository.findById = vi.fn().mockResolvedValue(transaction);
      repository.delete = vi.fn().mockResolvedValue(undefined);

      await useCase.execute(transaction.id);

      expect(repository.findById).toHaveBeenCalledWith(transaction.id);
      expect(repository.delete).toHaveBeenCalledWith(transaction.id);
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if transaction does not exist', async () => {
      const id = 'non-existent-id';
      repository.findById = vi.fn().mockResolvedValue(null);

      await expect(useCase.execute(id)).rejects.toThrow(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if the repository fails to find the transaction', async () => {
      const error = new Error('Database connection failed');
      repository.findById = vi.fn().mockRejectedValue(error);

      await expect(useCase.execute('some-id')).rejects.toThrow(
        'Database connection failed',
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if the repository fails to delete the transaction', async () => {
      const transaction = Transaction.create({
        title: 'Test',
        amount: 100,
        type: TransactionType.INCOME,
        category: 'Test',
      });

      repository.findById = vi.fn().mockResolvedValue(transaction);

      const error = new Error('Delete failed');
      repository.delete = vi.fn().mockRejectedValue(error);

      await expect(useCase.execute(transaction.id)).rejects.toThrow(
        'Delete failed',
      );
    });
  });
});
