import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTutorDto {
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

  // --- Campos de Tutor ---
  @IsString()
  @IsNotEmpty()
  cedula: string;

  @IsString()
  @IsOptional()
  profesion?: string;

  @IsString()
  @IsOptional()
  experiencia?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  // --- Relación ---
  @IsInt()
  @IsPositive()
  materiaId: number;
}
