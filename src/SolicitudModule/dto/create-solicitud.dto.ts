import { IsNotEmpty, IsDate, IsString, IsNumber } from 'class-validator';

export class CreateSolicitudDto {
  @IsNotEmpty()
  estudiante_id: number;

  @IsNotEmpty()
  materia_id: number;

  @IsNotEmpty()
  @IsDate()
  fecha_solicitada: Date;

  @IsNotEmpty()
  @IsString()
  hora_solicitada: string;
}