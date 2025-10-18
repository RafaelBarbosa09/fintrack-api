import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { GetTransactionsUseCase } from './get-transactions.usecase';
import {
  ITransactionRepository,
} from '../../domain/repository/transaction-repository.interface';
import { Transaction } from '../../domain/entity/transaction.entity';
import { TransactionType } from '../../domain/enum/transaction-type.enum';

describe('GetTransactionsUseCase', () => {
  let useCase: GetTransactionsUseCase;
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
        GetTransactionsUseCase,
        {
          provide: 'ITransactionRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetTransactionsUseCase>(GetTransactionsUseCase);
    repository = module.get<ITransactionRepository>('ITransactionRepository');

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a list of transactions', async () => {
      const transactions = [
        Transaction.create({
          title: 'Salário',
          amount: 5000,
          type: TransactionType.INCOME,
          category: 'Trabalho',
        }),
        Transaction.create({
          title: 'Aluguel',
          amount: 1500,
          type: TransactionType.EXPENSE,
          category: 'Moradia',
        }),
      ];

      repository.findAll = vi.fn().mockResolvedValue(transactions);

      const result = await useCase.execute();

      expect(result).toEqual(transactions);
      expect(result).toHaveLength(2);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty list when there are no transactions', async () => {
      repository.findAll = vi.fn().mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the repository fails', async () => {
      const error = new Error('Database connection failed');
      repository.findAll = vi.fn().mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});

