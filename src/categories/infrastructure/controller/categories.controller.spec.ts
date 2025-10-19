import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CategoriesController } from './categories.controller';
import { CreateCategoryUseCase } from '../../application/usecase/create-category.usecase';
import { GetCategoriesUseCase } from '../../application/usecase/get-categories.usecase';
import { FindCategoryUseCase } from '../../application/usecase/find-category.usecase';
import { UpdateCategoryUseCase } from '../../application/usecase/update-category.usecase';
import { DeleteCategoryUseCase } from '../../application/usecase/delete-category.usecase';
import { Category } from '../../domain/entity/category.entity';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let createUseCase: CreateCategoryUseCase;
  let getUseCase: GetCategoriesUseCase;
  let findUseCase: FindCategoryUseCase;
  let updateUseCase: UpdateCategoryUseCase;
  let deleteUseCase: DeleteCategoryUseCase;

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

    controller = new CategoriesController(
      createUseCase,
      getUseCase,
      findUseCase,
      updateUseCase,
      deleteUseCase,
    );
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma categoria', async () => {
      const dto = {
        name: 'Alimentação',
        description: 'Gastos com comida',
      };

      const category = Category.create(dto);
      vi.mocked(createUseCase.execute).mockResolvedValue(category);

      const result = await controller.create(dto);

      expect(result).toEqual(category);
      expect(createUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de categorias', async () => {
      const categories = [
        Category.create({ name: 'Alimentação' }),
        Category.create({ name: 'Transporte' }),
      ];

      vi.mocked(getUseCase.execute).mockResolvedValue(categories);

      const result = await controller.findAll();

      expect(result).toEqual(categories);
      expect(getUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma categoria por ID', async () => {
      const category = Category.create({
        name: 'Alimentação',
        description: 'Gastos com comida',
      });

      vi.mocked(findUseCase.execute).mockResolvedValue(category);

      const result = await controller.findOne(category.id);

      expect(result).toEqual(category);
      expect(findUseCase.execute).toHaveBeenCalledWith(category.id);
    });

    it('deve lançar NotFoundException se categoria não existir', async () => {
      vi.mocked(findUseCase.execute).mockRejectedValue(
        new NotFoundException('Category with id 123 not found'),
      );

      await expect(controller.findOne('123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar uma categoria', async () => {
      const updateDto = {
        name: 'Alimentação Atualizada',
        description: 'Nova descrição',
      };

      const updatedCategory = Category.create(updateDto);

      vi.mocked(updateUseCase.execute).mockResolvedValue(updatedCategory);

      const result = await controller.update('123', updateDto);

      expect(result).toEqual(updatedCategory);
      expect(updateUseCase.execute).toHaveBeenCalledWith('123', updateDto);
    });
  });

  describe('remove', () => {
    it('deve deletar uma categoria', async () => {
      vi.mocked(deleteUseCase.execute).mockResolvedValue(undefined);

      await controller.remove('123');

      expect(deleteUseCase.execute).toHaveBeenCalledWith('123');
    });
  });
});
