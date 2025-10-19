import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../../../domain/enum/transaction-type.enum';

/**
 * DTO - Data Transfer Object para atualização
 * Todos os campos são opcionais
 */
export class UpdateTransactionDto {
  @ApiProperty({
    description: 'Título da transação',
    example: 'Salário Atualizado',
  })
  title?: string;

  @ApiProperty({
    description: 'Valor da transação',
    example: 1000,
  })
  amount?: number;

  @ApiProperty({
    description: 'Tipo da transação',
    example: TransactionType.INCOME,
  })
  type?: TransactionType;

  @ApiProperty({
    description: 'ID da categoria',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  categoryId?: string;
}
