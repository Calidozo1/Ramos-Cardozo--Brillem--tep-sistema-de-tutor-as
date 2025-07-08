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
   /// Filtro de sesiones por parametros
  async filtrarSesiones(filtros: {tutorId?: number, materiaId?: number; fecha?: string; completada?:boolean; })
  {
    const query = this. sesionRepo
      .createQueryBuilder('sesion')
      .leftJoinAndSelect('sesion.tutor', 'tutor')
      .leftJoinAndSelect('sesion.materia', 'materia')
      .leftJoinAndSelect('sesion.estudiante','estudiante');

    // si se envia un filtro, aplicamos
    if(filtros.tutorId) {
      query.andWhere('sesion.tutor_id = : tutorId', {tutorId: filtros.tutorId});
    }

    if(filtros.materiaId) {
      query.andWhere('sesion.materia_id = : materiaId', {materiaId: filtros.materiaId});
    }

    if(filtros.fecha) {
      query.andWhere('sesion.fecha =: fecha', {fecha: filtros.fecha});
    }
    if(filtros.completada != undefined) {
      query.andWhere('sesion.completada = :completada', {completada: filtros. completada});
    }
    return query.getMany();
  }
  //estadisticas por tutor
  async estadisticasPorTutor() {
    return this.sesionRepo
      .createQueryBuilder('sesion')
        .select('sesion.tutor_id', 'tutor_id')  // agrupaos por id de tutor
       .addSelect('COUNT(*)', 'total') // contar cuantas sesioens tiene
      .groupBy('sesion.tutor_id')
      .getRawMany();
  }
  // estadisticas por materia
  async estadisticasPorMateria() {
    return this.sesionRepo
      .createQueryBuilder('sesion')
      .select('sesion.materia_id', 'materias_id')
      .addSelect('COUNT(*)', 'total')
      .groupBy('sesion.materia_id')
      .getRawMany();
  }

}