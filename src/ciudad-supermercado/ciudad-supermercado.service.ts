/* Global imports */
import {InjectRepository} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
/* Ciudad-Supermercado imports */
import {SupermercadoEntity} from '../supermercado/supermercado.entity';
import {CiudadEntity} from '../ciudad/ciudad.entity';
import {BusinessError, BusinessLogicException, MESSAGES} from '../shared';

/** Ciudad-Supermercado service logic */
@Injectable()
export class CiudadSupermercadoService {
  /** Relations Array constant of Supermercado */
  private relations: string[] = ['supermercados'];

  constructor(
    @InjectRepository(CiudadEntity)
    private readonly CiudadRepository: Repository<CiudadEntity>,
    @InjectRepository(SupermercadoEntity)
    private readonly SupermercadoRepository: Repository<SupermercadoEntity>
  ) {}

  async addSupermercadoCiudad(CiudadId: string, SupermercadoId: string): Promise<CiudadEntity> {
    const Supermercado: SupermercadoEntity = await this.SupermercadoRepository.findOne({where: {id: SupermercadoId}});
    if (!Supermercado) throw new BusinessLogicException(MESSAGES.SUPERMERCADONOTFOUND, BusinessError.NOT_FOUND);
    const Ciudad: CiudadEntity = await this.CiudadRepository.findOne({
      where: {id: CiudadId},
      relations: this.relations
    });
    if (!Ciudad) throw new BusinessLogicException(MESSAGES.CIUDADNOTFOUND, BusinessError.NOT_FOUND);
    Ciudad.supermercados = [...Ciudad.supermercados, Supermercado];
    return await this.CiudadRepository.save(Ciudad);
  }

  async findSupermercadoByCiudadIdSupermercadoId(CiudadId: string, SupermercadoId: string): Promise<SupermercadoEntity> {
    const Supermercado: SupermercadoEntity = await this.SupermercadoRepository.findOne({where: {id: SupermercadoId}});
    if (!Supermercado) throw new BusinessLogicException(MESSAGES.SUPERMERCADONOTFOUND, BusinessError.NOT_FOUND);
    const Ciudad: CiudadEntity = await this.CiudadRepository.findOne({
      where: {id: CiudadId},
      relations: this.relations
    });
    if (!Ciudad) throw new BusinessLogicException(MESSAGES.CIUDADNOTFOUND, BusinessError.NOT_FOUND);
    const CiudadSupermercado: SupermercadoEntity = Ciudad.supermercados.find((e) => e.id === Supermercado.id);
    if (!CiudadSupermercado) throw new BusinessLogicException(MESSAGES.CIUDADNOASSOCIATEDSUPERMERCADO, BusinessError.PRECONDITION_FAILED);
    return CiudadSupermercado;
  }

  async findSupermercadosByCiudadId(CiudadId: string): Promise<SupermercadoEntity[]> {
    const Ciudad: CiudadEntity = await this.CiudadRepository.findOne({
      where: {id: CiudadId},
      relations: this.relations
    });
    if (!Ciudad) throw new BusinessLogicException(MESSAGES.CIUDADNOTFOUND, BusinessError.NOT_FOUND);
    return Ciudad.supermercados;
  }

  async associateSupermercadosCiudad(CiudadId: string, supermercados: SupermercadoEntity[]): Promise<CiudadEntity> {
    const Ciudad: CiudadEntity = await this.CiudadRepository.findOne({
      where: {id: CiudadId},
      relations: this.relations
    });
    if (!Ciudad) throw new BusinessLogicException(MESSAGES.CIUDADNOTFOUND, BusinessError.NOT_FOUND);
    for (const supermercado of supermercados) {
      const Supermercado: SupermercadoEntity = await this.SupermercadoRepository.findOne({where: {id: supermercado.id}});
      if (!Supermercado) throw new BusinessLogicException(MESSAGES.SUPERMERCADONOTFOUND, BusinessError.NOT_FOUND);
    }
    Ciudad.supermercados = supermercados;
    return await this.CiudadRepository.save(Ciudad);
  }

  async deleteSupermercadoCiudad(CiudadId: string, SupermercadoId: string): Promise<void> {
    const Supermercado: SupermercadoEntity = await this.SupermercadoRepository.findOne({where: {id: SupermercadoId}});
    if (!Supermercado) throw new BusinessLogicException(MESSAGES.SUPERMERCADONOTFOUND, BusinessError.NOT_FOUND);
    const Ciudad: CiudadEntity = await this.CiudadRepository.findOne({
      where: {id: CiudadId},
      relations: this.relations
    });
    if (!Ciudad) throw new BusinessLogicException(MESSAGES.CIUDADNOTFOUND, BusinessError.NOT_FOUND);
    const CiudadSupermercado: SupermercadoEntity = Ciudad.supermercados.find((e) => e.id === Supermercado.id);
    if (!CiudadSupermercado) throw new BusinessLogicException(MESSAGES.CIUDADNOASSOCIATEDSUPERMERCADO, BusinessError.PRECONDITION_FAILED);
    Ciudad.supermercados = Ciudad.supermercados.filter((e) => e.id !== SupermercadoId);
    await this.CiudadRepository.save(Ciudad);
  }
}
