/* Global imports */
import {CallHandler, ExecutionContext, HttpException, HttpStatus} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {throwError} from 'rxjs';
import {Repository} from 'typeorm';
/* supermercado imports */
import {BusinessError, BusinessErrorsInterceptor, TypeOrmTestingConfig} from '../shared';
import {SupermercadoController} from './supermercado.controller';
import {SupermercadoService} from './supermercado.service';
import {SupermercadoEntity} from './supermercado.entity';

describe('supermercado controller', () => {
  let controller: SupermercadoController;
  let repository: Repository<SupermercadoEntity>;
  let supermercadosList: SupermercadoEntity[];
  let interceptor: BusinessErrorsInterceptor;
  const supermercadoMock: SupermercadoEntity = {
    nombre: faker.lorem.sentence(),
    longitud: faker.lorem.sentence(1),
    latitud: faker.lorem.sentence(1),
    paginaWeb: faker.lorem.sentence(),
    ciudades: []
  } as SupermercadoEntity;

  const seedDatabase = async () => {
    repository.clear();
    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await repository.save({...supermercadoMock} as SupermercadoEntity);
      supermercadosList.push(supermercado);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService, BusinessErrorsInterceptor],
      controllers: [SupermercadoController]
    }).compile();
    controller = module.get<SupermercadoController>(SupermercadoController);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    interceptor = module.get<BusinessErrorsInterceptor>(BusinessErrorsInterceptor);
    await seedDatabase();
  });

  describe('controller', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should return all supermercado', async () => {
      const supermercados: SupermercadoEntity[] = await controller.findAll();
      expect(supermercados.length).toBe(supermercadosList.length);
    });

    it('should return the first supermercado', async () => {
      const supermercado: SupermercadoEntity = await controller.findOne(supermercadosList[0].id);
      expect(supermercado.nombre).toBe(supermercadosList[0].nombre);
    });

    it('should create a supermercado', async () => {
      const supermercado: SupermercadoEntity = {...supermercadoMock} as SupermercadoEntity;
      const supermercadoCreated: SupermercadoEntity = await controller.create(supermercado);
      expect(supermercadoCreated).not.toBeNull();
    });

    it('should update the first supermercado', async () => {
      const supermercado: SupermercadoEntity = {...supermercadoMock, nombre: 'new supermercado name'} as SupermercadoEntity;
      const supermercadoUpdate: SupermercadoEntity = await controller.update(supermercadosList[0].id, supermercado);
      expect(supermercadoUpdate.nombre).toBe(supermercado.nombre);
    });

    it('should delete a supermercado', async () => {
      await controller.delete(supermercadosList[0].id);
      const supermercados: SupermercadoEntity[] = await controller.findAll();
      expect(supermercados.length).toBe(4);
    });
  });

  describe('interceptor', () => {
    it('should be defined', () => {
      expect(interceptor).toBeDefined();
    });

    it('should handle BusinessError.NOT_FOUND correctly', () => {
      const executionContext: ExecutionContext = {} as ExecutionContext;
      const error = {type: BusinessError.NOT_FOUND, message: 'Resource not found'};
      const callHandler: CallHandler = {handle: () => throwError(() => error)};
      interceptor.intercept(executionContext, callHandler).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.getStatus()).toBe(HttpStatus.NOT_FOUND);
          expect(err.message).toBe(error.message);
        }
      });
    });

    it('should handle BusinessError.PRECONDITION_FAILED correctly', () => {
      const executionContext: ExecutionContext = {} as ExecutionContext;
      const error = {type: BusinessError.PRECONDITION_FAILED, message: 'Precondition failed'};
      const callHandler: CallHandler = {handle: () => throwError(() => error)};
      interceptor.intercept(executionContext, callHandler).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.getStatus()).toBe(HttpStatus.PRECONDITION_FAILED);
          expect(err.message).toBe(error.message);
        }
      });
    });

    it('should handle BusinessError.BAD_REQUEST correctly', () => {
      const executionContext: ExecutionContext = {} as ExecutionContext;
      const error = {type: BusinessError.BAD_REQUEST, message: 'Bad request'};
      const callHandler: CallHandler = {handle: () => throwError(() => error)};
      interceptor.intercept(executionContext, callHandler).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
          expect(err.message).toBe(error.message);
        }
      });
    });

    it('should rethrow unexpected errors', () => {
      const executionContext: ExecutionContext = {} as ExecutionContext;
      const error = {type: 'UNKNOWN_ERROR', message: 'Unknown error'};
      const callHandler: CallHandler = {
        handle: () => throwError(() => error)
      };
      interceptor.intercept(executionContext, callHandler).subscribe({
        error: (err) => {
          expect(err).toEqual(error);
        }
      });
    });
  });
});
