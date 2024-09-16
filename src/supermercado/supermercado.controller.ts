/* Global imports */
import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
/* Supermercado imports */
import {SupermercadoService} from './supermercado.service';
import {SupermercadoEntity} from './supermercado.entity';
import {SupermercadoDto, SupermercadoUpdateDto} from './supermercado.dto';
import {BusinessErrorsInterceptor} from '../shared';


/** Supermercado controller logic */
@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
  constructor(private readonly supermercadoService: SupermercadoService) {}

  /**
   * Get all the supermercados GET /api/v1/supermarkets
   * @returns {Promise<SupermercadoEntity[]>} supermercados array
   */
  @Get()
  async findAll(): Promise<SupermercadoEntity[]> {
    return await this.supermercadoService.findAll();
  }

  /**
   * Create a supermercado endpoint GET /api/v1/supermarkets/:supermercadoId
   * @param {string} supermercadoId supermercado Identity
   * @returns {Promise<SupermercadoEntity>} Found supermercado
   */
  @Get(':supermercadoId')
  async findOne(@Param('supermercadoId') supermercadoId: string): Promise<SupermercadoEntity> {
    return await this.supermercadoService.findOne(supermercadoId);
  }

  /**
   * Create a supermercado endpoint POST /api/v1/supermarkets
   * @param {SupermercadoDto} supermercadoDto supermercado DTO
   * @returns {Promise<SupermercadoEntity>} supermercado already created
   */

  @Post()
  async create(@Body() supermercadoDto: SupermercadoDto): Promise<SupermercadoEntity> {
    const supermercado: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermercadoDto);
    return await this.supermercadoService.create(supermercado);
  }

  /**
   * Update a supermercado endpoint PUT /api/v1/supermarkets/:supermercadoId
   * @param {string} supermercadoId supermercado Identity
   * @param {SupermercadoUpdateDto} supermercadoDto supermercado DTO
   * @returns {Promise<SupermercadoEntity>} supermercado already updated
   */
  @Put(':supermercadoId')
  async update(@Param('supermercadoId') supermercadoId: string, @Body() supermercadoDto: SupermercadoUpdateDto): Promise<SupermercadoEntity> {
    const supermercado: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermercadoDto);
    return await this.supermercadoService.update(supermercadoId, supermercado);
  }

  /**
   * Delete a supermercado endpoint DELETE /api/v1/supermarkets/:supermercadoId
   * @param {string} supermercadoId supermercado Identity
   */
  @Delete(':supermercadoId')
  @HttpCode(204)
  async delete(@Param('supermercadoId') supermercadoId: string): Promise<void> {
    return await this.supermercadoService.delete(supermercadoId);
  }
}
