import { Transaction } from '../entity/transaction.entity';

/**
 * PORT - Interface que define o contrato para o repositório de transações
 * Seguindo Hexagonal Architecture, este é o PORT que será implementado por um ADAPTER
 * Esta interface pertence ao Domain e não conhece detalhes de implementação
 */
export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  findAll(): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
  update(id: string, transaction: Partial<Transaction>): Promise<Transaction>;
  delete(id: string): Promise<void>;
}

export const TRANSACTION_REPOSITORY = 'ITransactionRepository';
