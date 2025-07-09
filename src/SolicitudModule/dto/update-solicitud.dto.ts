import {
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { EstadoSolicitud } from '../estado-solicitud.enum';

export class UpdateSolicitudDto {
  @IsEnum(EstadoSolicitud)
  @IsNotEmpty()
  estado: EstadoSolicitud;
}