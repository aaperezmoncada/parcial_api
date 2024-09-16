/* Global imports */
import {IsNotEmpty, IsOptional, IsString, MinLength} from 'class-validator';

/** DTO for ciudad entitie */
export class SupermercadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  readonly nombre: string;
}
/** DTO for update supermercado entitie */
export class SupermercadoUpdateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10 )
  @IsOptional()
  readonly nombre: string;

  @IsString()
  @IsOptional()
  readonly longitud: string;

  @IsString()
  @IsOptional()
  readonly latitud: string;


  @IsString()
  @IsOptional()
  readonly paginaWeb: string;

}