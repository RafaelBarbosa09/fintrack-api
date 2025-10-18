import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UpdateTransactionUseCase } from './update-transaction.usecase';
import { ITransactionRepository } from '../../domain/repository/transaction-repository.interface';
import { Transaction } from '../../domain/entity/transaction.entity';
import { TransactionType } from '../../domain/enum/transaction-type.enum';

describe('UpdateTransactionUseCase', () => {
  let useCase: UpdateTransactionUseCase;
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
        UpdateTransactionUseCase,
        {
          provide: 'ITransactionRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateTransactionUseCase>(UpdateTransactionUseCase);
    repository = module.get<ITransactionRepository>('ITransactionRepository');

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a transaction successfully', async () => {
      const existingTransaction = Transaction.create({
        title: 'Salário',
        amount: 5000,
        type: TransactionType.INCOME,
        category: 'Trabalho',
      });

      const updateData = {
        title: 'Salário Atualizado',
        amount: 6000,
      };

      const updatedTransaction = Transaction.create({
        ...existingTransaction,
        ...updateData,
      });

      repository.findById = vi.fn().mockResolvedValue(existingTransaction);
      repository.update = vi.fn().mockResolvedValue(updatedTransaction);

      const result = await useCase.execute(existingTransaction.id, updateData);

      expect(result.title).toBe('Salário Atualizado');
      expect(result.amount).toBe(6000);
      expect(repository.findById).toHaveBeenCalledWith(existingTransaction.id);
      expect(repository.update).toHaveBeenCalledWith(
        existingTransaction.id,
        expect.objectContaining({
          title: updateData.title,
          amount: updateData.amount,
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should update only provided fields', async () => {
      const existingTransaction = Transaction.create({
        title: 'Salário',
        amount: 5000,
        type: TransactionType.INCOME,
        category: 'Trabalho',
      });

      const updateData = { amount: 7000 };

      const updatedTransaction = Transaction.create({
        ...existingTransaction,
        amount: 7000,
      });

      repository.findById = vi.fn().mockResolvedValue(existingTransaction);
      repository.update = vi.fn().mockResolvedValue(updatedTransaction);

      const result = await useCase.execute(existingTransaction.id, updateData);

      expect(result.amount).toBe(7000);
      expect(repository.update).toHaveBeenCalledWith(
        existingTransaction.id,
        expect.objectContaining({
          amount: 7000,
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should throw NotFoundException if transaction does not exist', async () => {
      const id = 'non-existent-id';
      repository.findById = vi.fn().mockResolvedValue(null);

      await expect(useCase.execute(id, { amount: 1000 })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if the repository fails', async () => {
      const transaction = Transaction.create({
        title: 'Test',
        amount: 100,
        type: TransactionType.INCOME,
        category: 'Test',
      });

      repository.findById = vi.fn().mockResolvedValue(transaction);

      const error = new Error('Database error');
      repository.update = vi.fn().mockRejectedValue(error);

      await expect(
        useCase.execute(transaction.id, { amount: 200 }),
      ).rejects.toThrow('Database error');
    });
  });
});
