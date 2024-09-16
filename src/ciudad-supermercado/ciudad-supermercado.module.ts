/* Global imports */
import {TypeOrmModule} from '@nestjs/typeorm';
import {Module} from '@nestjs/common';
/* Ciudad-Supermercado imports */
import {CiudadSupermercadoService} from './ciudad-supermercado.service';
import {CiudadService} from '../ciudad/ciudad.service';
import {SupermercadoEntity} from '../supermercado/supermercado.entity';
import {CiudadEntity} from '../ciudad/ciudad.entity';
import {CiudadSupermercadoController} from './ciudad-supermercado.controller';

/** Ciudad-Supermercado module*/
@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity])],
  providers: [CiudadService, CiudadSupermercadoService],
  controllers: [CiudadSupermercadoController]
})
export class CiudadSupermercadoModule {}
