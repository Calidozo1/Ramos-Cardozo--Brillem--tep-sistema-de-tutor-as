import { IsOptional, IsIn, IsNumber } from 'class-validator';

export class UpdateSolicitudDto {
  @IsOptional()
  @IsIn(['pendiente', 'aceptada', 'rechazada'])
  estado?: string;

  @IsOptional()
  tutor_id?: number;
}