/* Global imports */
import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {CiudadEntity} from "../ciudad/ciudad.entity";

/* Entities imports */

/** Persistence entity corresponding to supermercado */
@Entity()
export class SupermercadoEntity {
  /** Unique id as UUID of supermercado */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** nombre as STRING of ciudad */
  @Column()
  nombre: string;

  /** longitud as STRING of ciudad */
  @Column()
  longitud: string;

  /** longitud as STRING of ciudad */
  @Column()
  latitud: string;

  /** paginaWeb as STRING of ciudad */
  @Column()
  paginaWeb: string;

  @ManyToMany(() => CiudadEntity, (ciudades: CiudadEntity) => ciudades.supermercados)
  ciudades: CiudadEntity[];

}
