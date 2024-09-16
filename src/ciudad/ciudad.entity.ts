/* Global imports */
import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {SupermercadoEntity} from "../supermercado/supermercado.entity";

/* Entities imports */

/** Persistence entity corresponding to ciudad */
@Entity()
export class CiudadEntity {
  /** Unique id as UUID of ciudad */
  @PrimaryGeneratedColumn('uuid')
  id: string;
  /** nombre as STRING of ciudad */
  @Column()
  nombre: string;
  /** pais as STRING of ciudad */
  @Column()
  pais: string;
  /** habitantes as NUMBRE of ciudad */
  @Column()
  habitantes: number;

  /** Supermercados [SupermercadoEntity] that belong to this ciudad, This is a ManyToMany association */
  @ManyToMany(() => SupermercadoEntity, (supermercado: SupermercadoEntity) => supermercado.ciudades)
  @JoinTable()
  supermercados: SupermercadoEntity[];

}
