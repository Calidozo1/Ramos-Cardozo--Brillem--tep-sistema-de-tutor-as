import { IsNotEmpty, IsDate, IsString, IsNumber } from 'class-validator';

export class CreateSolicitudDto {
  @IsNumber({}, { message: 'El ID del estudiante debe ser un número' })
  @IsNotEmpty({ message: 'El campo estudiante_id no puede estar vacío' })
  estudiante_id: number;

  @IsNumber({}, { message: 'El ID de la materia debe ser un número' })
  @IsNotEmpty({ message: 'El campo materia_id no puede estar vacío' })
  materia_id: number;

  @IsDate({ message: 'La fecha solicitada debe ser una fecha válida' })
  @IsNotEmpty({ message: 'El campo fecha_solicitada no puede estar vacío' })
  fecha_solicitada: Date;

  @IsString({ message: 'La hora debe ser una cadena de texto (ej. "10:00")' })
  @IsNotEmpty({ message: 'El campo hora_solicitada no puede estar vacío' })
  hora_solicitada: string;
}