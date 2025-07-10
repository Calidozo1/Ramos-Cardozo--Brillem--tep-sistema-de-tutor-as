import { IsNotEmpty, IsDate, IsString, IsNumber, Matches } from 'class-validator';

export class CreateSolicitudDto {
  @IsNotEmpty({ message: 'El campo estudiante_id no puede estar vacío' })
  @IsNumber({}, { message: 'El ID del estudiante debe ser un número' })
  estudiante_id: number;

  @IsNotEmpty({ message: 'El nombre de la materia no puede estar vacío' })
  @IsString({ message: 'El nombre de la materia debe ser texto' })
  nombre_materia: string;


  @IsNotEmpty({ message: 'El campo fecha_solicitada no puede estar vacío' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener el formato YYYY-MM-DD'
  })
  fecha_solicitada: string;

  @IsNotEmpty({ message: 'El campo hora_solicitada no puede estar vacío' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora debe ser una cadena de texto (ej. "10:00")'
  })
  hora_solicitada: string;
}
