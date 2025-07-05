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
  // --- Campos de Usuario ---
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  contrasena: string;

  // --- Campos de Estudiante ---
  @IsString()
  @IsNotEmpty()
  cedula: string;

  @IsString()
  @IsOptional()
  carrera?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  semestre?: number;

  @IsString()
  @IsOptional()
  telefono?: string;
}
