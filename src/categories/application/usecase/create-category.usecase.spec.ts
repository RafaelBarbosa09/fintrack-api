import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCategoryUseCase } from './create-category.usecase';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../domain/repository/category-repository.interface';
import { Category } from '../../domain/entity/category.entity';

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
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
        CreateCategoryUseCase,
        {
          provide: CATEGORY_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateCategoryUseCase>(CreateCategoryUseCase);
    repository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);

    vi.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('deve criar uma categoria com sucesso', async () => {
      const input = {
        name: 'Alimentação',
        description: 'Gastos com comida',
      };

      const expectedCategory = Category.create(input);
      vi.mocked(repository.create).mockResolvedValue(expectedCategory);

      const result = await useCase.execute(input);

      expect(result).toEqual(expectedCategory);
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: input.name,
          description: input.description,
        }),
      );
    });

    it('deve criar categoria sem descrição', async () => {
      const input = {
        name: 'Transporte',
      };

      const expectedCategory = Category.create(input);
      vi.mocked(repository.create).mockResolvedValue(expectedCategory);

      const result = await useCase.execute(input);

      expect(result.name).toBe('Transporte');
      expect(result.description).toBeUndefined();
    });

    it('deve propagar erro do repositório', async () => {
      const input = {
        name: 'Teste',
      };

      const error = new Error('Database error');
      vi.mocked(repository.create).mockRejectedValue(error);

      await expect(useCase.execute(input)).rejects.toThrow('Database error');
    });
  });
});
