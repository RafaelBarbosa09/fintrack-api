import { TransactionType } from '../../../domain/enum/transaction-type.enum';

/**
 * DTO - Data Transfer Object para atualização
 * Todos os campos são opcionais
 */
export class UpdateTransactionDto {
  title?: string;
  amount?: number;
  type?: TransactionType;
  category?: string;
}
