import { describe, it, expect } from 'vitest';
import { Transaction } from './transaction.entity';
import { TransactionType } from '../enum/transaction-type.enum';

describe('Transaction Entity', () => {
  describe('create', () => {
    it('deve criar transação do tipo INCOME com valores corretos', () => {
      const transaction = Transaction.create({
        title: 'Salário',
        amount: 5000,
        type: TransactionType.INCOME,
        categoryId: 'category-id-123',
      });

      expect(transaction).toBeDefined();
      expect(transaction.id).toBeDefined();
      expect(transaction.title).toBe('Salário');
      expect(transaction.amount).toBe(5000);
      expect(transaction.type).toBe(TransactionType.INCOME);
      expect(transaction.categoryId).toBe('category-id-123');
      expect(transaction.createdAt).toBeInstanceOf(Date);
      expect(transaction.updatedAt).toBeUndefined();
    });

    it('deve criar transação do tipo EXPENSE com valores corretos', () => {
      const transaction = Transaction.create({
        title: 'Aluguel',
        amount: 1500,
        type: TransactionType.EXPENSE,
        categoryId: 'category-id-456',
      });

      expect(transaction.type).toBe(TransactionType.EXPENSE);
      expect(transaction.amount).toBe(1500);
      expect(transaction.categoryId).toBe('category-id-456');
    });

    it('deve gerar ID único automaticamente', () => {
      const transaction1 = Transaction.create({
        title: 'Test 1',
        amount: 100,
        type: TransactionType.INCOME,
        category: 'Test',
      });

      const transaction2 = Transaction.create({
        title: 'Test 2',
        amount: 200,
        type: TransactionType.INCOME,
        category: 'Test',
      });

      expect(transaction1.id).toBeDefined();
      expect(transaction2.id).toBeDefined();
      expect(transaction1.id).not.toBe(transaction2.id);
    });

    it('deve usar ID fornecido se passado', () => {
      const customId = 'custom-id-123';
      const transaction = Transaction.create({
        id: customId,
        title: 'Test',
        amount: 100,
        type: TransactionType.INCOME,
        category: 'Test',
      });

      expect(transaction.id).toBe(customId);
    });

    it('deve usar createdAt fornecido se passado', () => {
      const customDate = new Date('2024-01-01');
      const transaction = Transaction.create({
        title: 'Test',
        amount: 100,
        type: TransactionType.INCOME,
        category: 'Test',
        createdAt: customDate,
      });

      expect(transaction.createdAt).toEqual(customDate);
    });

    it('deve aceitar updatedAt se fornecido', () => {
      const updatedDate = new Date('2024-01-02');
      const transaction = Transaction.create({
        title: 'Test',
        amount: 100,
        type: TransactionType.INCOME,
        category: 'Test',
        updatedAt: updatedDate,
      });

      expect(transaction.updatedAt).toEqual(updatedDate);
    });
  });

  describe('restore', () => {
    it('deve restaurar transação do banco de dados', () => {
      const dbData = {
        id: 'db-id-123',
        title: 'Salário DB',
        amount: 6000,
        type: 'RECEITA',
        categoryId: 'category-id-789',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      const transaction = Transaction.restore(dbData);

      expect(transaction.id).toBe(dbData.id);
      expect(transaction.title).toBe(dbData.title);
      expect(transaction.amount).toBe(dbData.amount);
      expect(transaction.type).toBe(TransactionType.INCOME);
      expect(transaction.categoryId).toBe(dbData.categoryId);
      expect(transaction.createdAt).toEqual(dbData.createdAt);
      expect(transaction.updatedAt).toEqual(dbData.updatedAt);
    });

    it('deve restaurar transação do tipo EXPENSE', () => {
      const dbData = {
        id: 'db-id-456',
        title: 'Compras',
        amount: 300,
        type: 'DESPESA',
        categoryId: 'category-id-101',
        createdAt: new Date(),
        updatedAt: null,
      };

      const transaction = Transaction.restore(dbData);

      expect(transaction.type).toBe(TransactionType.EXPENSE);
      expect(transaction.categoryId).toBe('category-id-101');
      expect(transaction.updatedAt).toBeUndefined();
    });

    it('deve lidar com updatedAt nulo', () => {
      const dbData = {
        id: 'test-id',
        title: 'Test',
        amount: 100,
        type: 'RECEITA',
        categoryId: null,
        createdAt: new Date(),
        updatedAt: null,
      };

      const transaction = Transaction.restore(dbData);

      expect(transaction.updatedAt).toBeUndefined();
      expect(transaction.categoryId).toBeUndefined();
    });
  });
});
