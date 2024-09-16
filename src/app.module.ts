/* Global imports */
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {Module} from '@nestjs/common';
/* Custom imports */
import {AppController} from './app.controller';
import {ENTITIES, MODULES} from './shared';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: '.env'}),
    ...MODULES,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'c1a11a76',
      database: 'supermercados',
      entities: ENTITIES,
      dropSchema: process.env.DROP_SCHEMA === undefined ? true : process.env.DROP_SCHEMA === 'true',
      synchronize: process.env.SYNCHRONIZE === undefined ? true : process.env.SYNCHRONIZE === 'true',
      keepConnectionAlive: true
    })
  ],
  controllers: [AppController]
})
export class AppModule {}
