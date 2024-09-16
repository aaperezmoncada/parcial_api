/* Global imports */
import {InjectRepository} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
/* Ciudad imports */
import {CiudadEntity} from './ciudad.entity';
import {BusinessError, BusinessLogicException, MESSAGES} from '../shared';

/** Ciudad service logic */
@Injectable()
export class CiudadService {
  /** Relations Array constant of Ciudad */
  private relations: string[] = ['supermercados'];

  /** Service constructor */
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>
  ) {}

  /**
   * Get all the ciudades
   * @returns {Promise<CiudadEntity[]>} ciudades
   */
  async findAll(): Promise<CiudadEntity[]> {
    return await this.ciudadRepository.find({relations: this.relations});
  }

  /**
   * Get one ciudad by its id
   * @param {string} id ciudad identity (id)
   * @returns {Promise<CiudadEntity>} ciudad if it exist
   */
  async findOne(id: string): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: this.relations});
    if (!ciudad) throw new BusinessLogicException(MESSAGES.CIUDADNOTFOUND, BusinessError.NOT_FOUND);
    return ciudad;
  }

  /**
   * Create a ciudad
   * @param {CiudadEntity} ciudad ciudad DTO to create the entity in the DB
   * @returns {Promise<CiudadEntity>} the ciudad that has been created
   */
  async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    return await this.ciudadRepository.save(ciudad);
  }

  /**
   * Update a ciudad
   * @param {string} id ciudad identity (id)
   * @param {CiudadEntity} ciudad ciudad DTO to update the entity in the DB
   * @returns {Promise<CiudadEntity>} the ciudad that has been updated
   */
  async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
    const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}});
    if (!persistedCiudad) throw new BusinessLogicException(MESSAGES.CIUDADNOTFOUND, BusinessError.NOT_FOUND);
    return await this.ciudadRepository.save({...persistedCiudad, ...ciudad});
  }

  /**
   * delete a ciudad
   * @param {string} id ciudad identity (id)
   */
  async delete(id: string): Promise<void> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}});
    if (!ciudad) throw new BusinessLogicException(MESSAGES.CIUDADNOTFOUND, BusinessError.NOT_FOUND);
    await this.ciudadRepository.remove(ciudad);
  }
}
