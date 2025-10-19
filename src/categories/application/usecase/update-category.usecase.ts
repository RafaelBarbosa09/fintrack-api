import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '../../domain/entity/category.entity';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../domain/repository/category-repository.interface';

type UpdateCategoryInput = {
  name?: string;
  description?: string;
};

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(id: string, input: UpdateCategoryInput): Promise<Category> {
    const existingCategory = await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    const updatedData: Partial<Category> = {
      ...input,
      updatedAt: new Date(),
    };

    return await this.categoryRepository.update(id, updatedData);
  }
}
