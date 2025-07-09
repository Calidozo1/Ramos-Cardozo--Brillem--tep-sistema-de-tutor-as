import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsInt,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { Rol } from '../../AuthModule/roles/rol.enum';

export class CreateUsuarioConRolDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  contrasena: string;

  @IsEnum(Rol)
  @IsNotEmpty()
  rol: Rol;

  @IsString()
  @IsNotEmpty()
  cedula: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @ValidateIf((o) => o.rol === Rol.Estudiante)
  @IsString()
  @IsNotEmpty({ message: 'La carrera es obligatoria para el rol de estudiante.' })
  carrera?: string;

  @ValidateIf((o) => o.rol === Rol.Estudiante)
  @IsInt()
  @IsNotEmpty({ message: 'El semestre es obligatorio para el rol de estudiante.' })
  semestre?: number;

  @ValidateIf((o) => o.rol === Rol.Tutor)
  @IsInt()
  @IsNotEmpty({ message: 'El materiaId es obligatorio para el rol de tutor.' })
  materiaId?: number;
  
  @ValidateIf((o) => o.rol === Rol.Tutor)
  @IsString()
  @IsOptional()
  profesion?: string;

  @ValidateIf((o) => o.rol === Rol.Tutor)
  @IsString()
  @IsOptional()
  experiencia?: string;

  @ValidateIf((o) => o.rol === Rol.Coordinador)
  @IsString()
  @IsNotEmpty({ message: 'El departamento es obligatorio para el rol de coordinador.' })
  departamento?: string;
}
