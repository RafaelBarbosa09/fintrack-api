import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindCategoryUseCase } from './find-category.usecase';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../domain/repository/category-repository.interface';
import { Category } from '../../domain/entity/category.entity';

describe('FindCategoryUseCase', () => {
  let useCase: FindCategoryUseCase;
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
        FindCategoryUseCase,
        {
          provide: CATEGORY_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindCategoryUseCase>(FindCategoryUseCase);
    repository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);

    vi.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar categoria por ID', async () => {
      const category = Category.create({
        name: 'Alimentação',
        description: 'Gastos com comida',
      });

      vi.mocked(repository.findById).mockResolvedValue(category);

      const result = await useCase.execute(category.id);

      expect(result).toEqual(category);
      expect(repository.findById).toHaveBeenCalledWith(category.id);
      expect(repository.findById).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando categoria não existir', async () => {
      const id = 'non-existent-id';
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(useCase.execute(id)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(id)).rejects.toThrow(
        `Category with id ${id} not found`,
      );
    });

    it('deve propagar erro do repositório', async () => {
      const error = new Error('Database error');
      vi.mocked(repository.findById).mockRejectedValue(error);

      await expect(useCase.execute('some-id')).rejects.toThrow(
        'Database error',
      );
    });
  });
});
