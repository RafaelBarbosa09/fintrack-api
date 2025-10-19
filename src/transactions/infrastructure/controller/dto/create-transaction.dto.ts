import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../../../domain/enum/transaction-type.enum';

/**
 * DTO - Data Transfer Object
 * Camada de Interface Adapters
 * Define o contrato da API (entrada de dados)
 */
export class CreateTransactionDto {
  @ApiProperty({
    description: 'Título da transação',
    example: 'Salário',
  })
  title: string;

  @ApiProperty({
    description: 'Valor da transação',
    example: 1000,
  })
  amount: number;

  @ApiProperty({
    description: 'Tipo da transação',
    example: TransactionType.INCOME,
  })
  type: TransactionType;

  @ApiProperty({
    description: 'ID da categoria',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  categoryId?: string;
}
