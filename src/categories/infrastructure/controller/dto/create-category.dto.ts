import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Alimentação',
  })
  name: string;

  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Gastos com comida e restaurantes',
    required: false,
  })
  description?: string;
}
