//para validar que los parámetros sean correctos

import { IsBooleanString, IsDateString, IsOptional, IsNumberString, } from 'class-validator';

export class FiltroSesionesDto {
  @IsOptional()
  @IsNumberString({}, { message: 'El tutor deber ser un número' })
  tutor_id?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'El materia  debe ser un número' })
  materia_id?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener formato YYYY-MM-DD' })
  fecha?: string;

  @IsOptional()
  @IsBooleanString({ message: 'El campo completada debe ser true o false' })
  completada?: string;
}
