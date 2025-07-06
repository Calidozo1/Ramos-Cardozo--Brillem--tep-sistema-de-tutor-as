import { IsNotEmpty, IsNumber, IsDate, IsString, IsBoolean } from 'class-validator';

export class CreateSesionDto {
  @IsNumber()
  @IsNotEmpty()
  solicitud_id: number;

  @IsNumber()
  @IsNotEmpty()
  tutor_id: number;

  @IsNumber()
  @IsNotEmpty()
  estudiante_id: number;

  @IsNumber()
  @IsNotEmpty()
  materia_id: number;

  @IsDate()
  @IsNotEmpty()
  fecha: Date;

  @IsString()
  @IsNotEmpty()
  hora: string;

  @IsBoolean()
  completada?: boolean;
}