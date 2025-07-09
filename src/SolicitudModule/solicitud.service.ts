import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud } from './solicitud.entity';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { MateriasService } from '../MateriaModule/materias.service';
import { Sesion } from '../SesionModule/sesion.entity';
import { EstadoSolicitud } from './estado-solicitud.enum';
import { SolicitudResponseDto } from './dto/solicitud-response.dto';

@Injectable()
export class SolicitudService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepo: Repository<Solicitud>,
    @InjectRepository(Sesion)
    private readonly sesionRepo: Repository<Sesion>,
    private readonly materiasService: MateriasService, // Inyecta el servicio de materias
  ) {
  }



  async findAll(): Promise<Solicitud[]> {
    return this.solicitudRepo.find();
  }

  async create(dto: CreateSolicitudDto): Promise<SolicitudResponseDto> {
    const materia = await this.materiasService.findByNombre(dto.nombre_materia);
    if (!materia) {
      throw new NotFoundException(`Materia con nombre ${dto.nombre_materia} no encontrada`);
    }

    const tutor = await this.solicitudRepo.manager
      .getRepository('Tutor')
      .findOne({
        where: { materia: { id: materia.id } },
        relations: ['materia', 'usuario'], // importante si quieres el nombre
      });

    const solicitud = this.solicitudRepo.create({
      estudiante_id: dto.estudiante_id,
      materia_id: materia.id,
      fecha_solicitada: dto.fecha_solicitada,
      hora_solicitada: dto.hora_solicitada,
      tutor: tutor ?? undefined,
    });

    const saved = await this.solicitudRepo.save(solicitud);

    return {
      id: saved.id,
      estudiante_id: saved.estudiante_id,
      materia_id: saved.materia_id,
      fecha_solicitada: saved.fecha_solicitada,
      hora_solicitada: saved.hora_solicitada,
      estado: saved.estado,
      fecha_creacion: saved.fecha_creacion,
      tutor_id: tutor?.id,
      tutor_nombre: tutor?.usuario?.nombre,
    };
  }



  async update(id: number, dto: UpdateSolicitudDto): Promise<Solicitud> {
    const result = await this.solicitudRepo.update(id, dto);

    if (result.affected === 0) {
      throw new Error('No se encontró la solicitud para actualizar');
    }

    const updated = await this.solicitudRepo.findOneBy({ id });

    if (!updated) {
      throw new Error('La solicitud actualizada no fue encontrada');
    }

    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.solicitudRepo.delete(id);
  }


  async findOne(id: number): Promise<Solicitud> {
    const solicitud = await this.solicitudRepo.findOneBy({ id });
    if (!solicitud) throw new Error('Solicitud no encontrada');
    return solicitud;
  }

  // Obtener solicitudes asignadas a un tutor
  async getSolicitudesByTutor (userId: number) {
    const tutor = await this.solicitudRepo.manager
      .getRepository('Tutor')
      .findOne({
        where: { id: userId },
        relations: ['usuario'],
      });

    if (!tutor) {
      throw new NotFoundException('No se encontró un tutor con este usuario');
    }

    return this.solicitudRepo.find({
      where: { tutor: { id: tutor.id } },
      relations: ['tutor', 'estudiante', 'materia'],
    });
  }

  async actualizarEstadoSolicitud(
    id: number,
    tutorId: number,
    updateDto: UpdateSolicitudDto
  ): Promise<Solicitud> {
    const solicitud = await this.solicitudRepo.findOne({
      where: {
        id,
        tutor: { id: tutorId }
      },
      relations: ['estudiante', 'materia', 'tutor']
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada o no asignada a este tutor');
    }

    if (solicitud.estado !== EstadoSolicitud.Pendiente) {
      throw new BadRequestException('Solo se pueden actualizar solicitudes pendientes');
    }

    // Verificar que estado venga definido
    if (!updateDto.estado) {
      throw new BadRequestException('El estado es obligatorio');
    }

    const nuevoEstado = updateDto.estado;

    if (![EstadoSolicitud.Aceptada, EstadoSolicitud.Rechazada].includes(nuevoEstado)) {
      throw new BadRequestException('El estado solo puede ser "aceptada" o "rechazada"');
    }

    solicitud.estado = nuevoEstado;

    const solicitudActualizada = await this.solicitudRepo.save(solicitud);

    if (nuevoEstado === EstadoSolicitud.Aceptada) {
      const sesion = this.sesionRepo.create({
        solicitud: solicitud,
        tutor: solicitud.tutor,
        estudiante: solicitud.estudiante,
        materia: solicitud.materia,
        fecha: solicitud.fecha_solicitada,
        hora: solicitud.hora_solicitada,
        completada: false
      });

      await this.sesionRepo.save(sesion);
    }

    return solicitudActualizada;
  }

  
}