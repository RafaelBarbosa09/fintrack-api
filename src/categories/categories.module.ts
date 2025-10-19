import { Module } from '@nestjs/common';
import { CategoriesController } from './infrastructure/controller/categories.controller';
import { CreateCategoryUseCase } from './application/usecase/create-category.usecase';
import { GetCategoriesUseCase } from './application/usecase/get-categories.usecase';
import { FindCategoryUseCase } from './application/usecase/find-category.usecase';
import { UpdateCategoryUseCase } from './application/usecase/update-category.usecase';
import { DeleteCategoryUseCase } from './application/usecase/delete-category.usecase';
import { CATEGORY_REPOSITORY } from './domain/repository/category-repository.interface';
import { PrismaCategoryRepository } from './infrastructure/repository/prisma-category.repository';
import { PrismaService } from '../transactions/infrastructure/database/prisma.service';

@Module({
  controllers: [CategoriesController],
  providers: [
    PrismaService,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: PrismaCategoryRepository,
    },
    CreateCategoryUseCase,
    GetCategoriesUseCase,
    FindCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
  ],
  exports: [CATEGORY_REPOSITORY],
})
export class CategoriesModule {}
