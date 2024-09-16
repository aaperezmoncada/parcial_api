/* Global imports */
import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
/* Ciudad imports */
import {CiudadService} from './ciudad.service';
import {CiudadEntity} from './ciudad.entity';
import {CiudadDto, CiudadUpdateDto} from './ciudad.dto';
import {BusinessErrorsInterceptor} from '../shared';


/** Ciudad controller logic */
@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
  constructor(private readonly ciudadService: CiudadService) {}

  /**
   * Get all the ciudads GET /api/v1/ciudad
   * @returns {Promise<CiudadEntity[]>} ciudads array
   */
  @Get()
  async findAll(): Promise<CiudadEntity[]> {
    return await this.ciudadService.findAll();
  }

  /**
   * Create a ciudad endpoint GET /api/v1/ciudad/:ciudadId
   * @param {string} ciudadId ciudad Identity
   * @returns {Promise<CiudadEntity>} Found ciudad
   */
  @Get(':ciudadId')
  async findOne(@Param('ciudadId') ciudadId: string): Promise<CiudadEntity> {
    return await this.ciudadService.findOne(ciudadId);
  }

  /**
   * Create a ciudad endpoint POST /api/v1/ciudad
   * @param {CiudadDto} ciudadDto ciudad DTO
   * @returns {Promise<CiudadEntity>} ciudad already created
   */

  @Post()
  async create(@Body() ciudadDto: CiudadDto): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.create(ciudad);
  }

  /**
   * Update a ciudad endpoint PUT /api/v1/ciudad/:ciudadId
   * @param {string} ciudadId ciudad Identity
   * @param {CiudadUpdateDto} ciudadDto ciudad DTO
   * @returns {Promise<CiudadEntity>} ciudad already updated
   */
  @Put(':ciudadId')
  async update(@Param('ciudadId') ciudadId: string, @Body() ciudadDto: CiudadUpdateDto): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.update(ciudadId, ciudad);
  }

  /**
   * Delete a ciudad endpoint DELETE /api/v1/ciudad/:ciudadId
   * @param {string} ciudadId ciudad Identity
   */
  @Delete(':ciudadId')
  @HttpCode(204)
  async delete(@Param('ciudadId') ciudadId: string): Promise<void> {
    return await this.ciudadService.delete(ciudadId);
  }
}
