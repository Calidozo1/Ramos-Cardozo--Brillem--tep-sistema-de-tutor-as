import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsPositive,
} from 'class-validator';

export class CreateEstudianteDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @IsNotEmpty()
  @MinLength(8)
  contrasena: string;

  @IsNotEmpty()
  @IsString()
  cedula: string;
}
