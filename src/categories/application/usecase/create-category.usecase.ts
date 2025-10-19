import { Inject, Injectable } from '@nestjs/common';
import { Category } from '../../domain/entity/category.entity';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../domain/repository/category-repository.interface';

type CreateCategoryInput = {
  name: string;
  description?: string;
};

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(input: CreateCategoryInput): Promise<Category> {
    const category = Category.create({
      name: input.name,
      description: input.description,
    });

    return await this.categoryRepository.create(category);
  }
}
