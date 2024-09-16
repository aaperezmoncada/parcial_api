/* Global imports */
import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
/* ciudad-supermercado imports */
import {CiudadSupermercadoService} from './ciudad-supermercado.service';
import {SupermercadoEntity} from '../supermercado/supermercado.entity';
import {CiudadEntity} from '../ciudad/ciudad.entity';
import {SupermercadoDto} from '../supermercado/supermercado.dto';
import {BusinessErrorsInterceptor} from '../shared';

/** ciudad-supermercado controller logic */
@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
  constructor(private readonly ciudadSupermercadoService: CiudadSupermercadoService) {}

  /**
   * Attatched a supermercado to ciudad endpoint POST /api/v1/ciudad/:ciudadId/supermarkets/:supermercadoId
   * @param {string} ciudadId ciudad Identity
   * @param {string} supermercadoId supermercado Identity
   * @returns {Promise<CiudadEntity>} product with supermercado
   */
  @Post(':ciudadId/supermarkets/:supermercadoId')
  async addSupermercadoCiudad(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string): Promise<CiudadEntity> {
    return await this.ciudadSupermercadoService.addSupermercadoCiudad(ciudadId, supermercadoId);
  }

  /**
   * Get a supermercado of ciudad endpoint GET /api/v1/ciudad/:ciudadId/supermarkets/:supermercadoId
   * @param {string} ciudadId ciudad Identity
   * @param {string} supermercadoId supermercado Identity
   * @returns {Promise<CiudadEntity>} supermercado
   */
  @Get(':ciudadId/supermarkets/:supermercadoId')
  async findSupermercadoByCiudadIdSupermercadoId(
    @Param('ciudadId') ciudadId: string,
    @Param('supermercadoId') supermercadoId: string
  ): Promise<SupermercadoEntity> {
    return await this.ciudadSupermercadoService.findSupermercadoByCiudadIdSupermercadoId(ciudadId, supermercadoId);
  }

  /**
   * Get all supermercados of ciudad endpoint GET /api/v1/ciudad/:ciudadId/supermarkets
   * @param {string} ciudadId ciudad Identity
   * @returns {Promise<SupermercadoEntity[]>} supermercados
   */
  @Get(':ciudadId/supermarkets')
  async findSupermercadosByCiudadId(@Param('ciudadId') ciudadId: string): Promise<SupermercadoEntity[]> {
    return await this.ciudadSupermercadoService.findSupermercadosByCiudadId(ciudadId);
  }

  /**
   * Update the supermercados of ciudad endpoint PUT /api/v1/ciudad/:ciudadId/supermarkets
   * @param {SupermercadoDto[]} supermercadosDto supermercados DTO
   * @param {string} ciudadId ciudad Identity
   * @returns {Promise<CiudadEntity>} Ciudad updated with category
   */
  @Put(':ciudadId/supermarkets')
  async associateSupermercadosCiudad(
    @Body() supermercadosDto: SupermercadoDto[],
    @Param('ciudadId') ciudadId: string
  ): Promise<CiudadEntity> {
    const supermercado = plainToInstance(SupermercadoEntity, supermercadosDto);
    return await this.ciudadSupermercadoService.associateSupermercadosCiudad(ciudadId, supermercado);
  }

  /**
   * Delete a supermercado of ciudad endpoint DELETE /api/v1/ciudad/:ciudadId/supermarkets/:supermercadoId
   * @param {string} ciudadId ciudad Identity
   * @param {string} supermercadoId supermercado Identity
   * @returns {Promise<void>} Void
   */
  @Delete(':ciudadId/supermarkets/:supermercadoId')
  @HttpCode(204)
  async deleteSupermercadoCiudad(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string): Promise<void> {
    return await this.ciudadSupermercadoService.deleteSupermercadoCiudad(ciudadId, supermercadoId);
  }
}
