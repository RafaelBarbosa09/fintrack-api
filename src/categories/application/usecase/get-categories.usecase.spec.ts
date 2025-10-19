import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { GetCategoriesUseCase } from './get-categories.usecase';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../domain/repository/category-repository.interface';
import { Category } from '../../domain/entity/category.entity';

describe('GetCategoriesUseCase', () => {
  let useCase: GetCategoriesUseCase;
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
        GetCategoriesUseCase,
        {
          provide: CATEGORY_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetCategoriesUseCase>(GetCategoriesUseCase);
    repository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);

    vi.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar lista de categorias', async () => {
      const categories = [
        Category.create({ name: 'Alimentação' }),
        Category.create({ name: 'Transporte' }),
      ];

      vi.mocked(repository.findAll).mockResolvedValue(categories);

      const result = await useCase.execute();

      expect(result).toEqual(categories);
      expect(result).toHaveLength(2);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não há categorias', async () => {
      vi.mocked(repository.findAll).mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('deve propagar erro do repositório', async () => {
      const error = new Error('Database connection failed');
      vi.mocked(repository.findAll).mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
