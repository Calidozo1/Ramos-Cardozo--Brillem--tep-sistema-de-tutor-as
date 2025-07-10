import { IsNotEmpty, IsNumber, IsString, IsOptional, Max, Min, IsInt } from 'class-validator';

export class CreateCalificacionDto {
  @IsInt()
  @Min(1)
  @Max(5)

  @IsNumber()
  @IsNotEmpty()
  sesion_id: number;
  
  @IsNumber()
  @IsNotEmpty()
  calificacion: number;

  @IsString()
  @IsOptional()
  comentario?: string;

}