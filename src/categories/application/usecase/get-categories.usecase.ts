import { Inject, Injectable } from '@nestjs/common';
import { Category } from '../../domain/entity/category.entity';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from '../../domain/repository/category-repository.interface';

@Injectable()
export class GetCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }
}
