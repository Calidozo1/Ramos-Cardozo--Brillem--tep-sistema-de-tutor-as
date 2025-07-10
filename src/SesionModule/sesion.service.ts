import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sesion } from './sesion.entity';
import { CreateSesionDto } from './dto/create-sesion.dto';

@Injectable()
export class SesionService {
  constructor(
    @InjectRepository(Sesion)
    private readonly sesionRepo: Repository<Sesion>,
  ) {}

  async findAll(): Promise<Sesion[]> {
    return this.sesionRepo.find();
  }

  async create(dto: CreateSesionDto): Promise<Sesion> {
    const sesion = this.sesionRepo.create(dto);
    return this.sesionRepo.save(sesion);
  }

  async findOne(id: number): Promise<Sesion> {
    const sesion = await this.sesionRepo.findOneBy({ id });
    if (!sesion) throw new Error('Sesión no encontrada');
    return sesion;
  }

  async marcarCompletada(id: number): Promise<Sesion> {
    const result = await this.sesionRepo.update(id, { completada: true });

    if (result.affected === 0) {
      throw new Error('No se encontró la sesión para marcar como completada');
    }

    const sesion = await this.sesionRepo.findOneBy({ id });

    if (!sesion) {
      throw new Error('La sesión no fue encontrada después de actualizar');
    }

    return sesion;
  }

  async findByTutor(tutorId: number): Promise<Sesion[]> {
    return this.sesionRepo.find({
      where: { tutor: { id: tutorId } },
      relations: ['materia', 'estudiante', 'solicitud'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  /// Filtro de sesiones
  async obtenerSesionesFiltradas(filtros: {
    tutor_id?: string;
    materia_id?: string;
    fecha?: string;
    completada?: string;
  }) {
    const query = this.sesionRepo
      .createQueryBuilder('sesion')
      .leftJoinAndSelect('sesion.estudiante', 'estudiante')
      .leftJoinAndSelect('sesion.tutor', 'tutor')
      .leftJoinAndSelect('sesion.materia', 'materia')
      .leftJoinAndSelect('sesion.solicitud', 'solicitud');

    if (filtros.tutor_id) {
      const tutorId = parseInt(filtros.tutor_id);
      if (isNaN(tutorId)) {
        throw new BadRequestException('Tutor o ID invalido');
      }
      query.andWhere('sesion.tutor_id = :tutorId', { tutorId });
    }

    if (filtros.materia_id) {
      const materiaId = parseInt(filtros.materia_id);
      if (isNaN(materiaId)) {
        throw new BadRequestException('ID de materia invalido');
      }
      query.andWhere('sesion.materia = :materiaId', { materiaId });
    }

    if (filtros.fecha) {
      query.andWhere('DATE(sesion.fecha) = :fecha', { fecha: filtros.fecha });
    }

    if (filtros.completada != undefined) {
      const completada = filtros.completada === 'true';
      query.andWhere('sesion.completada = :completada', { completada });
    }
    return await query.getMany();
  }

  async findByEstudiante(estudianteId: number): Promise<Sesion[]> {
    return this.sesionRepo.find({
      where: { estudiante: { id: estudianteId } },
      relations: ['materia', 'tutor', 'solicitud'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  //estadisticas por tutor
  async estadisticasPorTutor() {
    return this.sesionRepo
      .createQueryBuilder('sesion')
      .select('tutor.id', 'tutor_id') // agrupaos por id de tutor
      .addSelect('COUNT(sesion.id)', 'total') // contar cuantas sesioens tiene
      .addSelect('usuario.nombre', 'tutor_nombre')
      .leftJoin('sesion.tutor', 'tutor')
      .leftJoin('tutor.usuario', 'usuario')
      .groupBy('tutor.id, usuario.nombre')
      .getRawMany();
  }

  // estadisticas por materia
  async estadisticasPorMateria() {
    return this.sesionRepo
      .createQueryBuilder('sesion')
      .select('materia.id', 'materia_id')
      .addSelect('COUNT(sesion.id)', 'total')
      .addSelect('materia.nombre', 'materia_nombre')
      .leftJoin('sesion.materia', 'materia')
      .groupBy('materia.id, materia.nombre')
      .getRawMany();
  }
}
