import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entity/transaction.entity';
import { ITransactionRepository } from '../../domain/repository/transaction-repository.interface';
import { PrismaService } from '../database/prisma.service';

/**
 * ADAPTER - Implementação do repositório usando Prisma
 * Esta classe é um ADAPTER que implementa o PORT (ITransactionRepository)
 * Seguindo Hexagonal Architecture:
 * - O Domain define o PORT (interface)
 * - A Infrastructure fornece o ADAPTER (implementação)
 * - Inversão de Dependências (SOLID - DIP): depende de abstração, não de implementação
 */
@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const created = await this.prisma.transaction.create({
      data: {
        id: transaction.id,
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        createdAt: transaction.createdAt,
      },
    });

    return Transaction.restore({
      id: created.id,
      title: created.title,
      amount: created.amount,
      type: created.type,
      category: created.category,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async findAll(): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map((transaction) =>
      Transaction.restore({
        id: transaction.id,
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      }),
    );
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return null;
    }

    return Transaction.restore({
      id: transaction.id,
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  }

  async update(id: string, data: Partial<Transaction>): Promise<Transaction> {
    const updated = await this.prisma.transaction.update({
      where: { id },
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: data.category,
        updatedAt: data.updatedAt,
      },
    });

    return Transaction.restore({
      id: updated.id,
      title: updated.title,
      amount: updated.amount,
      type: updated.type,
      category: updated.category,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id },
    });
  }
}
