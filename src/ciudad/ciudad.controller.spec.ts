/* Global imports */
import {CallHandler, ExecutionContext, HttpException, HttpStatus} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {throwError} from 'rxjs';
import {Repository} from 'typeorm';
/* ciudad imports */
import {BusinessError, BusinessErrorsInterceptor, TypeOrmTestingConfig} from '../shared';
import {CiudadController} from './ciudad.controller';
import {CiudadService} from './ciudad.service';
import {CiudadEntity} from './ciudad.entity';

describe('ciudad controller', () => {
  let controller: CiudadController;
  let repository: Repository<CiudadEntity>;
  let ciudadesList: CiudadEntity[];
  let interceptor: BusinessErrorsInterceptor;
  const ciudadMock: CiudadEntity = {
    nombre: faker.lorem.sentence(),
    pais: faker.lorem.sentence(1),
    habitantes: faker.number.int(),
    supermercados: []
  } as CiudadEntity;

  const seedDatabase = async () => {
    repository.clear();
    ciudadesList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({...ciudadMock} as CiudadEntity);
      ciudadesList.push(ciudad);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService, BusinessErrorsInterceptor],
      controllers: [CiudadController]
    }).compile();
    controller = module.get<CiudadController>(CiudadController);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    interceptor = module.get<BusinessErrorsInterceptor>(BusinessErrorsInterceptor);
    await seedDatabase();
  });

  describe('controller', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should return all ciudad', async () => {
      const ciudades: CiudadEntity[] = await controller.findAll();
      expect(ciudades.length).toBe(ciudadesList.length);
    });

    it('should return the first ciudad', async () => {
      const ciudad: CiudadEntity = await controller.findOne(ciudadesList[0].id);
      expect(ciudad.nombre).toBe(ciudadesList[0].nombre);
    });

    it('should create a ciudad', async () => {
      const ciudad: CiudadEntity = {...ciudadMock} as CiudadEntity;
      const ciudadCreated: CiudadEntity = await controller.create(ciudad);
      expect(ciudadCreated).not.toBeNull();
    });

    it('should update the first ciudad', async () => {
      const ciudad: CiudadEntity = {...ciudadMock, nombre: 'new ciudad name'} as CiudadEntity;
      const ciudadUpdate: CiudadEntity = await controller.update(ciudadesList[0].id, ciudad);
      expect(ciudadUpdate.nombre).toBe(ciudad.nombre);
    });

    it('should delete a ciudad', async () => {
      await controller.delete(ciudadesList[0].id);
      const ciudades: CiudadEntity[] = await controller.findAll();
      expect(ciudades.length).toBe(4);
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
