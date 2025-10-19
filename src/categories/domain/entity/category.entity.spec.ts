import { describe, it, expect } from 'vitest';
import { Category } from './category.entity';

describe('Category Entity', () => {
  describe('create', () => {
    it('deve criar categoria com nome e descrição', () => {
      const category = Category.create({
        name: 'Alimentação',
        description: 'Gastos com comida',
      });

      expect(category).toBeDefined();
      expect(category.id).toBeDefined();
      expect(category.name).toBe('Alimentação');
      expect(category.description).toBe('Gastos com comida');
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(category.updatedAt).toBeUndefined();
    });

    it('deve criar categoria sem descrição', () => {
      const category = Category.create({
        name: 'Transporte',
      });

      expect(category.name).toBe('Transporte');
      expect(category.description).toBeUndefined();
    });

    it('deve gerar ID único automaticamente', () => {
      const category1 = Category.create({ name: 'Test 1' });
      const category2 = Category.create({ name: 'Test 2' });

      expect(category1.id).toBeDefined();
      expect(category2.id).toBeDefined();
      expect(category1.id).not.toBe(category2.id);
    });

    it('deve usar ID fornecido se passado', () => {
      const customId = 'custom-id-123';
      const category = Category.create({
        id: customId,
        name: 'Test',
      });

      expect(category.id).toBe(customId);
    });

    it('deve usar createdAt fornecido se passado', () => {
      const customDate = new Date('2024-01-01');
      const category = Category.create({
        name: 'Test',
        createdAt: customDate,
      });

      expect(category.createdAt).toEqual(customDate);
    });

    it('deve aceitar updatedAt se fornecido', () => {
      const updatedDate = new Date('2024-01-02');
      const category = Category.create({
        name: 'Test',
        updatedAt: updatedDate,
      });

      expect(category.updatedAt).toEqual(updatedDate);
    });
  });

  describe('restore', () => {
    it('deve restaurar categoria do banco de dados', () => {
      const dbData = {
        id: 'db-id-123',
        name: 'Alimentação DB',
        description: 'Descrição do banco',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      const category = Category.restore(dbData);

      expect(category.id).toBe(dbData.id);
      expect(category.name).toBe(dbData.name);
      expect(category.description).toBe(dbData.description);
      expect(category.createdAt).toEqual(dbData.createdAt);
      expect(category.updatedAt).toEqual(dbData.updatedAt);
    });

    it('deve restaurar categoria sem descrição', () => {
      const dbData = {
        id: 'db-id-456',
        name: 'Transporte',
        description: null,
        createdAt: new Date(),
        updatedAt: null,
      };

      const category = Category.restore(dbData);

      expect(category.description).toBeNull();
      expect(category.updatedAt).toBeNull();
    });
  });
});
