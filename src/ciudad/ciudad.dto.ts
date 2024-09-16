/* Global imports */
import {IsIn, IsNotEmpty, IsOptional, IsString, MinLength} from 'class-validator';
const paises = ['Argentina', 'Ecuador', 'Paraguay'];

/** DTO for ciudad entitie */
export class CiudadDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly nombre: string;
  @IsIn(paises)
  readonly pais: string;
}
/** DTO for update ciudad entitie */
export class CiudadUpdateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @IsOptional()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @IsOptional()
  @IsIn(paises)
  readonly pais: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @IsOptional()
  readonly habitantes: number;
}