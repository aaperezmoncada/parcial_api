/* Global imports */
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {Repository} from 'typeorm';
/* ciudad-supermercado imports */
import {CiudadSupermercadoController} from './ciudad-supermercado.controller';
import {CiudadSupermercadoService} from './ciudad-supermercado.service';
import {SupermercadoEntity} from '../supermercado/supermercado.entity';
import {CiudadEntity} from '../ciudad/ciudad.entity';
import {SupermercadoDto} from '../supermercado/supermercado.dto';
import {TypeOrmTestingConfig} from '../shared';

describe('ciudad-supermercado', () => {
  let controller: CiudadSupermercadoController;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudadesList: CiudadEntity[];
  let supermercadosList: SupermercadoEntity[];

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();
    supermercadosList = [];
    ciudadesList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await supermercadoRepository.save({
        nombre: faker.company.name(),
        longitud: faker.lorem.sentence(),
        latitud: faker.lorem.sentence(),
        paginaWeb: faker.lorem.sentence(),
        ciudades: []
      } as SupermercadoEntity);
      supermercadosList.push(supermercado);
    }
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await ciudadRepository.save({
        nombre: faker.company.name(),
        pais: faker.lorem.sentence(),
        habitantes: faker.number.int(),
        supermercados: []
      } as CiudadEntity);
      ciudadesList.push(ciudad);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
      controllers: [CiudadSupermercadoController]
    }).compile();
    controller = module.get<CiudadSupermercadoController>(CiudadSupermercadoController);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add a supermercado to ciudad', async () => {
    const ciudadId: string = ciudadesList[0].id;
    const supermercadoId: string = supermercadosList[0].id;
    const ciudad: CiudadEntity = await controller.addSupermercadoCiudad(ciudadId, supermercadoId);
    expect(ciudad.supermercados.length).toBe(1);
  });

  it('should get a supermercado of ciudad', async () => {
    const ciudadId: string = ciudadesList[0].id;
    const supermercadoId: string = supermercadosList[0].id;
    await controller.addSupermercadoCiudad(ciudadId, supermercadoId);
    const supermercado: SupermercadoEntity = await controller.findSupermercadoByCiudadIdSupermercadoId(ciudadId, supermercadoId);
    expect(supermercado.id).toBe(supermercadoId);
  });

  it('should get all the supermercados of ciudad', async () => {
    const ciudadId: string = ciudadesList[0].id;
    await controller.addSupermercadoCiudad(ciudadId, supermercadosList[0].id);
    await controller.addSupermercadoCiudad(ciudadId, supermercadosList[1].id);
    const supermercados: SupermercadoEntity[] = await controller.findSupermercadosByCiudadId(ciudadId);
    expect(supermercados.length).toBe(2);
  });

  it('should update the supermercados of ciudad', async () => {
    const supermercadosDto: SupermercadoDto[] = [{...supermercadosList[2]}];
    const ciudadId: string = ciudadesList[0].id;
    await controller.addSupermercadoCiudad(ciudadId, supermercadosList[0].id);
    await controller.addSupermercadoCiudad(ciudadId, supermercadosList[1].id);
    const ciudad: CiudadEntity = await controller.associateSupermercadosCiudad(supermercadosDto, ciudadId);
    expect(ciudad.supermercados.length).toBe(1);
    expect(ciudad.supermercados[0].id).toBe(supermercadosList[2].id);
  });

  it('should delete a supermercado of ciudad', async () => {
    const ciudadId: string = ciudadesList[0].id;
    const supermercadoId: string = supermercadosList[0].id;
    await controller.addSupermercadoCiudad(ciudadId, supermercadosList[0].id);
    await controller.addSupermercadoCiudad(ciudadId, supermercadosList[1].id);
    await controller.addSupermercadoCiudad(ciudadId, supermercadosList[2].id);
    await controller.deleteSupermercadoCiudad(ciudadId, supermercadoId);
    const supermercados: SupermercadoEntity[] = await controller.findSupermercadosByCiudadId(ciudadId);
    expect(supermercados.length).toBe(2);
  });
});
