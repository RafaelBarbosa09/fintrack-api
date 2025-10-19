import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from './create-transaction.usecase';
import { ITransactionRepository } from '../../domain/repository/transaction-repository.interface';
import { Transaction } from '../../domain/entity/transaction.entity';
import { TransactionType } from '../../domain/enum/transaction-type.enum';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
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
        CreateTransactionUseCase,
        {
          provide: 'ITransactionRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    repository = module.get<ITransactionRepository>('ITransactionRepository');

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a transaction successfully', async () => {
      const input = {
        title: 'Salário',
        amount: 5000,
        type: TransactionType.INCOME,
        category: 'Trabalho',
      };

      const expectedTransaction = Transaction.create(input);

      repository.create = vi.fn().mockResolvedValue(expectedTransaction);

      const result = await useCase.execute(input);

      expect(result).toEqual(expectedTransaction);
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: input.title,
          amount: input.amount,
          type: input.type,
          categoryId: input.categoryId,
        }),
      );
    });

    it('should create a transaction of type EXPENSE', async () => {
      const input = {
        title: 'Aluguel',
        amount: 1500,
        type: TransactionType.EXPENSE,
        categoryId: 'category-id-456',
      };

      const expectedTransaction = Transaction.create(input);
      repository.create = vi.fn().mockResolvedValue(expectedTransaction);

      const result = await useCase.execute(input);

      expect(result).toEqual(expectedTransaction);
      expect(result.type).toBe(TransactionType.EXPENSE);
    });

    it('should throw an error if the repository fails', async () => {
      const input = {
        title: 'Salário',
        amount: 5000,
        type: TransactionType.INCOME,
        category: 'Trabalho',
      };

      const error = new Error('Database error');
      repository.create = vi.fn().mockRejectedValue(error);

      await expect(useCase.execute(input)).rejects.toThrow('Database error');
    });
  });
});
