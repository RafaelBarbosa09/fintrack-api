import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindTransactionUseCase } from './find-transaction.usecase';
import { ITransactionRepository } from '../../domain/repository/transaction-repository.interface';
import { Transaction } from '../../domain/entity/transaction.entity';
import { TransactionType } from '../../domain/enum/transaction-type.enum';

describe('FindTransactionUseCase', () => {
  let useCase: FindTransactionUseCase;
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
        FindTransactionUseCase,
        {
          provide: 'ITransactionRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindTransactionUseCase>(FindTransactionUseCase);
    repository = module.get<ITransactionRepository>('ITransactionRepository');

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a transaction by ID', async () => {
      const transaction = Transaction.create({
        title: 'Salário',
        amount: 5000,
        type: TransactionType.INCOME,
        category: 'Trabalho',
      });

      repository.findById = vi.fn().mockResolvedValue(transaction);

      const result = await useCase.execute(transaction.id);

      expect(result).toEqual(transaction);
      expect(repository.findById).toHaveBeenCalledWith(transaction.id);
      expect(repository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if transaction does not exist', async () => {
      const id = 'non-existent-id';
      repository.findById = vi.fn().mockResolvedValue(null);

      await expect(useCase.execute(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the repository fails', async () => {
      const error = new Error('Database error');
      repository.findById = vi.fn().mockRejectedValue(error);

      await expect(useCase.execute('some-id')).rejects.toThrow(
        'Database error',
      );
    });
  });
});

