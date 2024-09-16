/* Global imports */
import {InjectRepository} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
/* Supermercado imports */
import {SupermercadoEntity} from './supermercado.entity';
import {BusinessError, BusinessLogicException, MESSAGES} from '../shared';

/** Supermercado service logic */
@Injectable()
export class SupermercadoService {
  /** Relations Array constant of Supermercado */
  private relations: string[] = ['ciudades'];

  /** Service constructor */
  constructor(
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>
  ) {}

  /**
   * Get all the supermercados
   * @returns {Promise<SupermercadoEntity[]>} supermercados
   */
  async findAll(): Promise<SupermercadoEntity[]> {
    return await this.supermercadoRepository.find({relations: this.relations});
  }

  /**
   * Get one supermercado by its id
   * @param {string} id supermercado identity (id)
   * @returns {Promise<SupermercadoEntity>} supermercado if it exist
   */
  async findOne(id: string): Promise<SupermercadoEntity> {
    const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id}, relations: this.relations});
    if (!supermercado) throw new BusinessLogicException(MESSAGES.SUPERMERCADONOTFOUND, BusinessError.NOT_FOUND);
    return supermercado;
  }

  /**
   * Create a supermercado
   * @param {SupermercadoEntity} supermercado supermercado DTO to create the entity in the DB
   * @returns {Promise<SupermercadoEntity>} the supermercado that has been created
   */
  async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
    return await this.supermercadoRepository.save(supermercado);
  }

  /**
   * Update a supermercado
   * @param {string} id supermercado identity (id)
   * @param {SupermercadoEntity} supermercado supermercado DTO to update the entity in the DB
   * @returns {Promise<SupermercadoEntity>} the supermercado that has been updated
   */
  async update(id: string, supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
    const persistedSupermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id}});
    if (!persistedSupermercado) throw new BusinessLogicException(MESSAGES.SUPERMERCADONOTFOUND, BusinessError.NOT_FOUND);
    return await this.supermercadoRepository.save({...persistedSupermercado, ...supermercado});
  }

  /**
   * delete a supermercado
   * @param {string} id supermercado identity (id)
   */
  async delete(id: string): Promise<void> {
    const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id}});
    if (!supermercado) throw new BusinessLogicException(MESSAGES.SUPERMERCADONOTFOUND, BusinessError.NOT_FOUND);
    await this.supermercadoRepository.remove(supermercado);
  }
}
