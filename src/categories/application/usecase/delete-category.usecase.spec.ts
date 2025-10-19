import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteCategoryUseCase } from './delete-category.usecase';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../domain/repository/category-repository.interface';
import { Category } from '../../domain/entity/category.entity';

describe('DeleteCategoryUseCase', () => {
  let useCase: DeleteCategoryUseCase;
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
        DeleteCategoryUseCase,
        {
          provide: CATEGORY_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteCategoryUseCase>(DeleteCategoryUseCase);
    repository = module.get<ICategoryRepository>(CATEGORY_REPOSITORY);

    vi.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('deve deletar categoria com sucesso', async () => {
      const category = Category.create({
        name: 'Alimentação',
        description: 'Gastos com comida',
      });

      vi.mocked(repository.findById).mockResolvedValue(category);
      vi.mocked(repository.delete).mockResolvedValue(undefined);

      await useCase.execute(category.id);

      expect(repository.findById).toHaveBeenCalledWith(category.id);
      expect(repository.delete).toHaveBeenCalledWith(category.id);
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando categoria não existir', async () => {
      const id = 'non-existent-id';
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(useCase.execute(id)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(id)).rejects.toThrow(
        `Category with id ${id} not found`,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('deve propagar erro do repositório ao buscar', async () => {
      const error = new Error('Database connection failed');
      vi.mocked(repository.findById).mockRejectedValue(error);

      await expect(useCase.execute('some-id')).rejects.toThrow(
        'Database connection failed',
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('deve propagar erro do repositório ao deletar', async () => {
      const category = Category.create({ name: 'Test' });

      vi.mocked(repository.findById).mockResolvedValue(category);

      const error = new Error('Delete failed');
      vi.mocked(repository.delete).mockRejectedValue(error);

      await expect(useCase.execute(category.id)).rejects.toThrow(
        'Delete failed',
      );
    });
  });
});
