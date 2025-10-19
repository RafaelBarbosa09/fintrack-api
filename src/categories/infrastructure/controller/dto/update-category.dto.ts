import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Alimentação Atualizada',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Nova descrição',
    required: false,
  })
  description?: string;
}
