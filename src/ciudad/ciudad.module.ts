/* Global imports */
import {TypeOrmModule} from '@nestjs/typeorm';
import {Module} from '@nestjs/common';
/* Ciudad imports */
import {CiudadService} from './ciudad.service';
import {CiudadEntity} from './ciudad.entity';
import {CiudadController} from './ciudad.controller';

/** Product module*/
@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity])],
  providers: [CiudadService],
  controllers: [CiudadController]
})
export class CiudadModule {}
