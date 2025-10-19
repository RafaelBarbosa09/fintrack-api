import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UpdateCategoryUseCase } from './update-category.usecase';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../domain/repository/category-repository.interface';
import { Category } from '../../domain/entity/category.entity';

describe('UpdateCategoryUseCase', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: ICategoryRepository;

  const mockRepository: ICategoryRepository = {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCategoryUseCase,
        {
          provide: CATEGORY_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateCategoryUseCase>(UpdateCategoryUseCase);
    repository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);

    vi.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('deve atualizar categoria com sucesso', async () => {
      const existingCategory = Category.create({
        name: 'Alimentação',
        description: 'Gastos com comida',
      });

      const updateData = {
        name: 'Alimentação Atualizada',
        description: 'Nova descrição',
      };

      const updatedCategory = Category.create({
        ...existingCategory,
        ...updateData,
      });

      vi.mocked(repository.findById).mockResolvedValue(existingCategory);
      vi.mocked(repository.update).mockResolvedValue(updatedCategory);

      const result = await useCase.execute(existingCategory.id, updateData);

      expect(result.name).toBe('Alimentação Atualizada');
      expect(result.description).toBe('Nova descrição');
      expect(repository.findById).toHaveBeenCalledWith(existingCategory.id);
      expect(repository.update).toHaveBeenCalledWith(
        existingCategory.id,
        expect.objectContaining({
          name: updateData.name,
          description: updateData.description,
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('deve atualizar apenas campos fornecidos', async () => {
      const existingCategory = Category.create({
        name: 'Transporte',
        description: 'Gastos com transporte',
      });

      const updateData = { name: 'Transporte Atualizado' };

      const updatedCategory = Category.create({
        ...existingCategory,
        name: 'Transporte Atualizado',
      });

      vi.mocked(repository.findById).mockResolvedValue(existingCategory);
      vi.mocked(repository.update).mockResolvedValue(updatedCategory);

      const result = await useCase.execute(existingCategory.id, updateData);

      expect(result.name).toBe('Transporte Atualizado');
      expect(repository.update).toHaveBeenCalledWith(
        existingCategory.id,
        expect.objectContaining({
          name: 'Transporte Atualizado',
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('deve lançar NotFoundException quando categoria não existir', async () => {
      const id = 'non-existent-id';
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(useCase.execute(id, { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
      await expect(useCase.execute(id, { name: 'Test' })).rejects.toThrow(
        `Category with id ${id} not found`,
      );
    });

    it('deve propagar erro do repositório', async () => {
      const category = Category.create({ name: 'Test' });

      vi.mocked(repository.findById).mockResolvedValue(category);

      const error = new Error('Database error');
      vi.mocked(repository.update).mockRejectedValue(error);

      await expect(
        useCase.execute(category.id, { name: 'Updated' }),
      ).rejects.toThrow('Database error');
    });
  });
});
