/* Global imports */
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {Repository} from 'typeorm';
/* Categorie imports */
import {CiudadService} from './ciudad.service';
import {CiudadEntity} from './ciudad.entity';
import {MESSAGES, TypeOrmTestingConfig} from '../shared';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadesList: CiudadEntity[];

  const seedDatabase = async () => {
    repository.clear();
    ciudadesList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.location.city(),
        pais: faker.location.country(),
        habitantes: faker.number.int()
      });
        ciudadesList.push(ciudad);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService]
    }).compile();
    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all Ciudades', async () => {
    const Ciudades: CiudadEntity[] = await service.findAll();
    expect(Ciudades).not.toBeNull();
    expect(Ciudades).toHaveLength(ciudadesList.length);
  });

  it('findOne should return a Ciudad by id', async () => {
    const storedCiudad: CiudadEntity = ciudadesList[0];
    const Ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(Ciudad).not.toBeNull();
    expect(Ciudad.nombre).toEqual(storedCiudad.nombre);
  });

  it('findOne should throw an exception for an invalid Ciudad', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', MESSAGES.CIUDADNOTFOUND);
  });

  it('create should return a new Ciudad', async () => {
    const ciudad: CiudadEntity = {
      id: '',
      nombre: faker.lorem.word(),
      pais: faker.lorem.word(),
      habitantes: faker.number.int(),
      supermercados: []
    };
    const newCiudad: CiudadEntity = await service.create(ciudad);
    expect(newCiudad).not.toBeNull();
    const storedCiudad: CiudadEntity = await repository.findOne({
      where: {id: newCiudad.id}
    });
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(newCiudad.nombre);
  });

  it('update should modify a Ciudad', async () => {
    const Ciudad: CiudadEntity = ciudadesList[0];
    Ciudad.nombre = 'New name';
    const updatedCiudad: CiudadEntity = await service.update(Ciudad.id, Ciudad);
    expect(updatedCiudad).not.toBeNull();
    const storedCiudad: CiudadEntity = await repository.findOne({
      where: {id: Ciudad.id}
    });
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(Ciudad.nombre);
  });

  it('update should throw an exception for an invalid Ciudad', async () => {
    let Ciudad: CiudadEntity = ciudadesList[0];
    Ciudad = {
      ...Ciudad,
      nombre: 'New name'
    };
    await expect(() => service.update('0', Ciudad)).rejects.toHaveProperty('message', MESSAGES.CIUDADNOTFOUND);
  });

  it('delete should remove a Ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await service.delete(ciudad.id);
    const deletedCiudad: CiudadEntity = await repository.findOne({
      where: {id: ciudad.id}
    });
    expect(deletedCiudad).toBeNull();
  });

  it('delete should throw an exception for an invalid Ciudad', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty('message', MESSAGES.CIUDADNOTFOUND);
  });
});
