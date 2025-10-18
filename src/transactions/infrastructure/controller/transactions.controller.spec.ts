import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransactionsController } from './transactions.controller';
import { CreateTransactionUseCase } from '../../application/usecase/create-transaction.usecase';
import { GetTransactionsUseCase } from '../../application/usecase/get-transactions.usecase';
import { FindTransactionUseCase } from '../../application/usecase/find-transaction.usecase';
import { UpdateTransactionUseCase } from '../../application/usecase/update-transaction.usecase';
import { DeleteTransactionUseCase } from '../../application/usecase/delete-transaction.usecase';
import { Transaction } from '../../domain/entity/transaction.entity';
import { TransactionType } from '../../domain/enum/transaction-type.enum';
import { NotFoundException } from '@nestjs/common';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let createUseCase: CreateTransactionUseCase;
  let getUseCase: GetTransactionsUseCase;
  let findUseCase: FindTransactionUseCase;
  let updateUseCase: UpdateTransactionUseCase;
  let deleteUseCase: DeleteTransactionUseCase;

  beforeEach(() => {
    createUseCase = {
      execute: vi.fn(),
    } as any;

    getUseCase = {
      execute: vi.fn(),
    } as any;

    findUseCase = {
      execute: vi.fn(),
    } as any;

    updateUseCase = {
      execute: vi.fn(),
    } as any;

    deleteUseCase = {
      execute: vi.fn(),
    } as any;

    controller = new TransactionsController(
      createUseCase,
      getUseCase,
      findUseCase,
      updateUseCase,
      deleteUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const dto = {
        title: 'Salário',
        amount: 5000,
        type: TransactionType.INCOME,
        category: 'Trabalho',
      };

      const transaction = Transaction.create(dto);
      createUseCase.execute = vi.fn().mockResolvedValue(transaction);

      const result = await controller.create(dto);

      expect(result).toEqual(transaction);
      expect(createUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return a list of transactions', async () => {
      const transactions = [
        Transaction.create({
          title: 'Salário',
          amount: 5000,
          type: TransactionType.INCOME,
          category: 'Trabalho',
        }),
      ];

      getUseCase.execute = vi.fn().mockResolvedValue(transactions);

      const result = await controller.findAll();

      expect(result).toEqual(transactions);
      expect(getUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a transaction by ID', async () => {
      const transaction = Transaction.create({
        title: 'Salário',
        amount: 5000,
        type: TransactionType.INCOME,
        category: 'Trabalho',
      });

      findUseCase.execute = vi.fn().mockResolvedValue(transaction);

      const result = await controller.findOne(transaction.id);

      expect(result).toEqual(transaction);
      expect(findUseCase.execute).toHaveBeenCalledWith(transaction.id);
    });

    it('should throw NotFoundException if transaction does not exist', async () => {
      findUseCase.execute = vi
        .fn()
        .mockRejectedValue(
          new NotFoundException('Transaction with id 123 not found'),
        );

      await expect(controller.findOne('123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const updateDto = {
        title: 'Salário Atualizado',
        amount: 6000,
      };

      const updatedTransaction = Transaction.create({
        title: 'Salário Atualizado',
        amount: 6000,
        type: TransactionType.INCOME,
        category: 'Trabalho',
      });

      updateUseCase.execute = vi.fn().mockResolvedValue(updatedTransaction);

      const result = await controller.update('123', updateDto);

      expect(result).toEqual(updatedTransaction);
      expect(updateUseCase.execute).toHaveBeenCalledWith('123', updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a transaction', async () => {
      deleteUseCase.execute = vi.fn().mockResolvedValue(undefined);

      await controller.remove('123');

      expect(deleteUseCase.execute).toHaveBeenCalledWith('123');
    });
  });
});
