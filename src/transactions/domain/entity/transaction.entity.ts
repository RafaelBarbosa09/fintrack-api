import { TransactionType } from '../enum/transaction-type.enum';
import { TransactionDatabase } from '../type/transaction-database.type';

type TransactionProps = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId?: string;
  createdAt: Date;
  updatedAt?: Date;
};

export class Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId?: string;
  createdAt: Date;
  updatedAt?: Date;

  private constructor({
    id,
    title,
    amount,
    type,
    categoryId,
    createdAt,
    updatedAt,
  }: TransactionProps) {
    this.id = id;
    this.title = title;
    this.amount = amount;
    this.type = type;
    this.categoryId = categoryId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({
    id,
    title,
    amount,
    type,
    categoryId,
    createdAt,
    updatedAt,
  }: Omit<TransactionProps, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Transaction {
    const transaction = new Transaction({
      id: id ?? crypto.randomUUID(),
      title,
      amount,
      type,
      categoryId,
      createdAt: createdAt ?? new Date(),
      updatedAt,
    });

    return transaction;
  }

  static restore({
    id,
    title,
    amount,
    type,
    categoryId,
    createdAt,
    updatedAt,
  }: TransactionDatabase): Transaction {
    return new Transaction({
      id,
      title,
      amount,
      type: type as TransactionType,
      categoryId: categoryId ?? undefined,
      createdAt,
      updatedAt: updatedAt ?? undefined,
    });
  }
}
