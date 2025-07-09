import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class AsignarMateriaDto {
  @IsNumber()
  @IsNotEmpty()
  materiaId: number;

  @IsString()
  @IsNotEmpty()
  cedulaTutor: string;
}
