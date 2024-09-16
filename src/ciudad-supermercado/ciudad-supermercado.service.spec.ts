/* Global imports */
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {Repository} from 'typeorm';
/* Ciudad-Supermercado imports */
import {SupermercadoEntity} from '../supermercado/supermercado.entity';
import {CiudadEntity} from '../ciudad/ciudad.entity';
import {CiudadSupermercadoService} from './ciudad-supermercado.service';
import {TypeOrmTestingConfig, MESSAGES} from '../shared';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let CiudadRepository: Repository<CiudadEntity>;
  let SupermercadoRepository: Repository<SupermercadoEntity>;
  let Ciudad: CiudadEntity;
  let SupermercadosList: SupermercadoEntity[];

  const seedDatabase = async () => {
    SupermercadoRepository.clear();
    CiudadRepository.clear();
    SupermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await SupermercadoRepository.save({
        nombre: faker.company.name(),
        longitud: faker.lorem.sentence(),
        latitud: faker.company.name(),
        paginaWeb: faker.company.name(),
        ciudades: []
      });
      SupermercadosList.push(supermercado);
    }
    Ciudad = await CiudadRepository.save({
      nombre: faker.company.name(),
      pais: faker.lorem.sentence(),
      habitantes: faker.number.int(),
      supermercados: SupermercadosList,
    } as CiudadEntity);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService]
    }).compile();
    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    CiudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    SupermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermercadoCiudad should add an Supermercado to a Ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await SupermercadoRepository.save({
      nombre: faker.company.name(),
      longitud: faker.lorem.sentence(),
      latitud: faker.company.name(),
      paginaWeb: faker.company.name(),
      ciudades: []
    });
    const newCiudad: CiudadEntity = await CiudadRepository.save({
      nombre: faker.lorem.sentence(),
      pais: faker.lorem.sentence(),
      habitantes: faker.number.int(),
      supermercados: SupermercadosList
    });
    const result: CiudadEntity = await service.addSupermercadoCiudad(newCiudad.id, newSupermercado.id);
    expect(result.supermercados.length).toBe(6);
    expect(result.supermercados[5]).not.toBeNull();
    expect(result.supermercados[5].nombre).toBe(newSupermercado.nombre);
  });

  it('addSupermercadoCiudad should thrown exception for an invalid Supermercado', async () => {
    const newCiudad: CiudadEntity = await CiudadRepository.save({
      nombre: faker.lorem.sentence(),
      pais: faker.lorem.sentence(),
      habitantes: faker.number.int(),
      supermercados: SupermercadosList
    });
    await expect(() => service.addSupermercadoCiudad(newCiudad.id, '0')).rejects.toHaveProperty('message', MESSAGES.SUPERMERCADONOTFOUND);
  });

  it('addSupermercadoCiudad should throw an exception for an invalid Ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await SupermercadoRepository.save({
      nombre: faker.company.name(),
      longitud: faker.lorem.sentence(),
      latitud: faker.lorem.sentence(),
      paginaWeb: faker.lorem.sentence(),
      ciudades:[]
    });
    await expect(() => service.addSupermercadoCiudad('0', newSupermercado.id)).rejects.toHaveProperty('message', MESSAGES.CIUDADNOTFOUND);
  });

  it('findSupermercadoByCiudadIdSupermercadoId should return Supermercado by Ciudad', async () => {
    const Supermercado: SupermercadoEntity = SupermercadosList[0];
    const storedSupermercado: SupermercadoEntity = await service.findSupermercadoByCiudadIdSupermercadoId(Ciudad.id, Supermercado.id);
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toBe(Supermercado.nombre);
  });

  it('findSupermercadoByCiudadIdSupermercadoId should throw an exception for an invalid Supermercado', async () => {
    await expect(() => service.findSupermercadoByCiudadIdSupermercadoId(Ciudad.id, '0')).rejects.toHaveProperty(
      'message',
      MESSAGES.SUPERMERCADONOTFOUND
    );
  });

  it('findSupermercadoByCiudadIdSupermercadoId should throw an exception for an invalid Ciudad', async () => {
    const Supermercado: SupermercadoEntity = SupermercadosList[0];
    await expect(() => service.findSupermercadoByCiudadIdSupermercadoId('0', Supermercado.id)).rejects.toHaveProperty(
      'message',
      MESSAGES.CIUDADNOTFOUND
    );
  });

  it('findSupermercadoByCiudadIdSupermercadoId should throw an exception for an Supermercado not associated to the Ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await SupermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.lorem.sentence(),
      latitud: faker.lorem.sentence(),
      paginaWeb: faker.lorem.sentence(),
      ciudades: []
    });
    await expect(() => service.findSupermercadoByCiudadIdSupermercadoId(Ciudad.id, newSupermercado.id)).rejects.toHaveProperty(
      'message',
      MESSAGES.CIUDADNOASSOCIATEDSUPERMERCADO
    );
  });

  it('findSupermercadosByCiudadId should return Supermercados by Ciudad', async () => {
    const supermercados: SupermercadoEntity[] = await service.findSupermercadosByCiudadId(Ciudad.id);
    expect(supermercados.length).toBe(5);
  });

  it('findSupermercadosByCiudadId should throw an exception for an invalid Ciudad', async () => {
    await expect(() => service.findSupermercadosByCiudadId('0')).rejects.toHaveProperty('message', MESSAGES.CIUDADNOTFOUND);
  });

  it('associateSupermercadosCiudad should update Supermercados list for a Ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await SupermercadoRepository.save({
      nombre: faker.company.name(),
      longitud: faker.company.name(),
      latitud: faker.company.name(),
      paginaWeb: faker.company.name()
    });
    const updatedCiudad: CiudadEntity = await service.associateSupermercadosCiudad(Ciudad.id, [newSupermercado]);
    expect(updatedCiudad.supermercados.length).toBe(1);
    expect(updatedCiudad.supermercados[0].ciudades).toBe(newSupermercado.ciudades);
  });

  it('associateSupermercadosCiudad should throw an exception for an invalid Ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await SupermercadoRepository.save({
      nombre: faker.company.name(),
      longitud: faker.company.name(),
      latitud: faker.company.name(),
      paginaWeb: faker.company.name()
    });
    await expect(() => service.associateSupermercadosCiudad('0', [newSupermercado])).rejects.toHaveProperty(
      'message',
      MESSAGES.CIUDADNOTFOUND
    );
  });

  it('associateSupermercadosCiudad should throw an exception for an invalid Supermercado', async () => {
    const newSupermercado: SupermercadoEntity = SupermercadosList[0];
    newSupermercado.id = '0';
    await expect(() => service.associateSupermercadosCiudad(Ciudad.id, [newSupermercado])).rejects.toHaveProperty(
      'message',
      MESSAGES.SUPERMERCADONOTFOUND
    );
  });

  it('deleteSupermercadoToCiudad should remove an Supermercado from a Ciudad', async () => {
    const Supermercado: SupermercadoEntity = SupermercadosList[0];
    await service.deleteSupermercadoCiudad(Ciudad.id, Supermercado.id);
    const storedCiudad: CiudadEntity = await CiudadRepository.findOne({
      where: {id: Ciudad.id},
      relations: ['supermercados']
    });
    const deletedSupermercado: SupermercadoEntity = storedCiudad.supermercados.find((a) => a.id === Supermercado.id);
    expect(deletedSupermercado).toBeUndefined();
  });

  it('deleteSupermercadoToCiudad should thrown an exception for an invalid Supermercado', async () => {
    await expect(() => service.deleteSupermercadoCiudad(Ciudad.id, '0')).rejects.toHaveProperty('message', MESSAGES.SUPERMERCADONOTFOUND);
  });

  it('deleteSupermercadoToCiudad should thrown an exception for an invalid Ciudad', async () => {
    const Supermercado: SupermercadoEntity = SupermercadosList[0];
    await expect(() => service.deleteSupermercadoCiudad('0', Supermercado.id)).rejects.toHaveProperty('message', MESSAGES.CIUDADNOTFOUND);
  });

  it('deleteSupermercadoToCiudad should thrown an exception for an non asocciated Supermercado', async () => {
    const newSupermercado: SupermercadoEntity = await SupermercadoRepository.save({
      nombre: faker.company.name(),
      longitud: faker.company.name(),
      latitud: faker.company.name(),
      paginaWeb: faker.company.name()
    });
    await expect(() => service.deleteSupermercadoCiudad(Ciudad.id, newSupermercado.id)).rejects.toHaveProperty(
      'message',
      MESSAGES.CIUDADNOASSOCIATEDSUPERMERCADO
    );
  });
});
