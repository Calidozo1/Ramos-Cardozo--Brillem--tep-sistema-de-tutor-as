export class SolicitudResponseDto {
  id: number;
  estudiante_id: number;
  materia_id: number;
  fecha_solicitada: Date;
  hora_solicitada: string;
  estado: string;
  fecha_creacion: Date;
  tutor_id?: number;
  tutor_nombre?: string;
}