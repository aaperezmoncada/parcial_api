/* Global imports */
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {Repository} from 'typeorm';
/* Categorie imports */
import {SupermercadoService} from './supermercado.service';
import {SupermercadoEntity} from './supermercado.entity';
import {MESSAGES, TypeOrmTestingConfig} from '../shared';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadosList: SupermercadoEntity[];

  const seedDatabase = async () => {
    repository.clear();
    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await repository.save({
        nombre: faker.lorem.word(),
        longitud: faker.lorem.word(),
        latitud: faker.lorem.word(),
        paginaWeb: faker.lorem.word()
      });
      supermercadosList.push(supermercado);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService]
    }).compile();
    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all Supermercados', async () => {
    const Supermercados: SupermercadoEntity[] = await service.findAll();
    expect(Supermercados).not.toBeNull();
    expect(Supermercados).toHaveLength(supermercadosList.length);
  });

  it('findOne should return a Supermercado by id', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadosList[0];
    const supermercado: SupermercadoEntity = await service.findOne(storedSupermercado.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre);
    expect(supermercado.latitud).toEqual(storedSupermercado.latitud);
    expect(supermercado.longitud).toEqual(storedSupermercado.longitud);
    expect(supermercado.paginaWeb).toEqual(storedSupermercado.paginaWeb);
  });

  it('findOne should throw an exception for an invalid supermercado', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', MESSAGES.SUPERMERCADONOTFOUND);
  });

  it('create should return a new Supermercado', async () => {
    const supermercado: SupermercadoEntity = {
      id: '',
      nombre: faker.lorem.word(),
      longitud: faker.lorem.word(),
      latitud: faker.lorem.word(),
      paginaWeb: faker.lorem.word(),
      ciudades: []
    };
    const newSupermercado: SupermercadoEntity = await service.create(supermercado);
    expect(newSupermercado).not.toBeNull();
    const storedSupermercado: SupermercadoEntity = await repository.findOne({
      where: {id: newSupermercado.id}
    });
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(newSupermercado.nombre);
  });

  it('update should modify a Supermercado', async () => {
    const Supermercado: SupermercadoEntity = supermercadosList[0];
    Supermercado.nombre = 'New name';
    const updatedSupermercado: SupermercadoEntity = await service.update(Supermercado.id, Supermercado);
    expect(updatedSupermercado).not.toBeNull();
    const storedSupermercado: SupermercadoEntity = await repository.findOne({
      where: {id: Supermercado.id}
    });
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(Supermercado.nombre);
  });

  it('update should throw an exception for an invalid Supermercado', async () => {
    let Supermercado: SupermercadoEntity = supermercadosList[0];
    Supermercado = {
      ...Supermercado,
      nombre: 'New name'
    };
    await expect(() => service.update('0', Supermercado)).rejects.toHaveProperty('message', MESSAGES.SUPERMERCADONOTFOUND);
  });

  it('delete should remove a Supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermercado.id);
    const deletedSupermercado: SupermercadoEntity = await repository.findOne({
      where: {id: supermercado.id}
    });
    expect(deletedSupermercado).toBeNull();
  });

  it('delete should throw an exception for an invalid Supermercado', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty('message', MESSAGES.SUPERMERCADONOTFOUND);
  });
});
