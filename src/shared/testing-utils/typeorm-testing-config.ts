/* Global imports */
import {TypeOrmModule} from '@nestjs/typeorm';
/* Entities imports */
import {ENTITIES} from '../constants';

/** TypeORM testing configuration in sqlite */
export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: ENTITIES,
    synchronize: true,
    keepConnectionAlive: true
  }),
  TypeOrmModule.forFeature(ENTITIES)
];
