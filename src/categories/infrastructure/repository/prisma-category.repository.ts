import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entity/category.entity';
import { ICategoryRepository } from '../../domain/repository/category-repository.interface';
import { PrismaService } from '../../../transactions/infrastructure/database/prisma.service';

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(category: Category): Promise<Category> {
    const created = await this.prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
        createdAt: category.createdAt,
      },
    });

    return Category.restore(created);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return categories.map((cat) => Category.restore(cat));
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return null;
    }

    return Category.restore(category);
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        updatedAt: data.updatedAt,
      },
    });

    return Category.restore(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
