/* Global imports */
import {TypeOrmModule} from '@nestjs/typeorm';
import {Module} from '@nestjs/common';
/* Supermercado imports */
import {SupermercadoEntity} from './supermercado.entity';
import {SupermercadoController} from './supermercado.controller';
import {SupermercadoService} from './supermercado.service';
/** Product module*/
@Module({
  imports: [TypeOrmModule.forFeature([SupermercadoEntity])],
  providers: [SupermercadoService],
  controllers: [SupermercadoController]
})
export class SupermercadoModule {}
