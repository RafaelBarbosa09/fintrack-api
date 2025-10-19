import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateCategoryUseCase } from '../../application/usecase/create-category.usecase';
import { GetCategoriesUseCase } from '../../application/usecase/get-categories.usecase';
import { FindCategoryUseCase } from '../../application/usecase/find-category.usecase';
import { UpdateCategoryUseCase } from '../../application/usecase/update-category.usecase';
import { DeleteCategoryUseCase } from '../../application/usecase/delete-category.usecase';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly findCategoryUseCase: FindCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova categoria' })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.createCategoryUseCase.execute(createCategoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
  })
  async findAll() {
    return await this.getCategoriesUseCase.execute();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  async findOne(@Param('id') id: string) {
    return await this.findCategoryUseCase.execute(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.updateCategoryUseCase.execute(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar categoria' })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria',
  })
  @ApiResponse({
    status: 204,
    description: 'Categoria deletada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  async remove(@Param('id') id: string) {
    return await this.deleteCategoryUseCase.execute(id);
  }
}
