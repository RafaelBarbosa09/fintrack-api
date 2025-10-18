import { TransactionType } from '../../../domain/enum/transaction-type.enum';

/**
 * DTO - Data Transfer Object
 * Camada de Interface Adapters
 * Define o contrato da API (entrada de dados)
 */
export class CreateTransactionDto {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
}
