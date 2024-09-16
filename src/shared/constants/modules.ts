/* Modules imports */
import {CiudadModule} from '../../ciudad/ciudad.module';
import {SupermercadoModule} from '../../supermercado/supermercado.module';
import {CiudadSupermercadoModule} from '../../ciudad-supermercado/ciudad-supermercado.module';

/** Modules array to be passed in any configuration */
export const MODULES = [
  CiudadModule,
  SupermercadoModule,
  CiudadSupermercadoModule
];
