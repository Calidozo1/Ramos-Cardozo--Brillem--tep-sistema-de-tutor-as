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
      query.andWhere('sesion.tutor = :tutor_id', {
        tutor_id: parseInt(filtros.tutor_id),
      });
    }
    if (filtros.materia_id) {
      query.andWhere('sesion.materia = :materia_id', {
        materia_id: parseInt(filtros.materia_id),
      });
    }
    if (filtros.fecha) {
      query.andWhere('DATE(sesion.fecha) = :fecha', { fecha: filtros.fecha });
    }
    if (filtros.completada) {
      query.andWhere('sesion.completada = :completada', {
        completada: filtros.completada === 'true',
      });
    }
    return query.getMany();
  }

  //estadisticas por tutor
  async estadisticasPorTutor() {
    return this.sesionRepo
      .createQueryBuilder('sesion')
      .select('sesion.tutor_id', 'tutor_id') // agrupaos por id de tutor
      .addSelect('COUNT(*)', 'total') // contar cuantas sesioens tiene
      .groupBy('sesion.tutor_id')
      .getRawMany();
  }

  // estadisticas por materia
  async estadisticasPorMateria() {
    return this.sesionRepo
      .createQueryBuilder('sesion')
      .select('sesion.materia_id', 'materia_id')
      .addSelect('COUNT(*)', 'total')
      .groupBy('sesion.materia_id')
      .getRawMany();
  }
}
