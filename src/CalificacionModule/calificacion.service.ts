import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from './calificacion.entity';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { Sesion } from '../SesionModule/sesion.entity';
import { CalificacionResponseDto } from './dto/calificacion-response.dto';

@Injectable()
export class CalificacionService {
  constructor(
    @InjectRepository(Calificacion)
    private readonly repo: Repository<Calificacion>,
    @InjectRepository(Sesion)
    private readonly sesionRepo: Repository<Sesion>,
  ) {}
  async findBySesion(id: number): Promise<CalificacionResponseDto> {
    const calificacion = await this.repo.findOne({
      where: { sesion_id: id },
      relations: ['estudiante', 'estudiante.usuario', 'tutor', 'tutor.usuario'],
    });

    if (!calificacion) throw new Error('Calificación no encontrada');

    return {
      id: calificacion.id,
      calificacion: calificacion.calificacion,
      comentario: calificacion.comentario,
      fecha: calificacion.fecha,
      estudianteNombre: calificacion.estudiante.usuario.nombre,
      tutorNombre: calificacion.tutor.usuario.nombre,
    };
  }



  async create(dto: CreateCalificacionDto): Promise<CalificacionResponseDto> {
    const sesion = await this.sesionRepo.findOne({
      where: { id: dto.sesion_id },
      relations: ['estudiante', 'tutor', 'calificacion'],
    });

    if (!sesion) throw new Error('Sesión no encontrada');
    if (!sesion.completada)
      throw new Error('No se puede calificar una sesión no completada');
    if (sesion.calificacion) {
      throw new BadRequestException('La sesión ya fue calificada');
    }

    const calificacion = this.repo.create({
      sesion,
      estudiante: sesion.estudiante,
      tutor: sesion.tutor,
      calificacion: dto.calificacion,
      comentario: dto.comentario,
      sesion_id: sesion.id,
      tutor_id: sesion.tutor.id,
      estudiante_id: sesion.estudiante.id,
    });

    const saved = await this.repo.save(calificacion);

    // Recargar con relaciones necesarias para respuesta
    const calificacionConRelaciones = await this.repo.findOne({
      where: { id: saved.id },
      relations: ['estudiante', 'estudiante.usuario', 'tutor', 'tutor.usuario'],
    });

    if (!calificacionConRelaciones) {
      throw new Error('Calificación no encontrada tras guardar');
    }

    return {
      id: calificacionConRelaciones.id,
      calificacion: calificacionConRelaciones.calificacion,
      comentario: calificacionConRelaciones.comentario,
      fecha: calificacionConRelaciones.fecha,
      estudianteNombre: calificacionConRelaciones.estudiante.usuario.nombre,
      tutorNombre: calificacionConRelaciones.tutor.usuario.nombre,
    };
  }
}