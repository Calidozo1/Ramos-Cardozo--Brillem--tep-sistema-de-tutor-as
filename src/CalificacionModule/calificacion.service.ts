import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from './calificacion.entity';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';

@Injectable()
export class CalificacionService {
  constructor(
    @InjectRepository(Calificacion)
    private readonly repo: Repository<Calificacion>,
  ) {}

  async create(dto: CreateCalificacionDto): Promise<Calificacion> {
    const calificacion = this.repo.create(dto);
    return this.repo.save(calificacion);
  }

  async findBySesion(id: number): Promise<Calificacion> {
    const calificacion = await this.repo.findOneBy({ sesion_id: id });
    if (!calificacion) throw new Error('Calificación no encontrada');
    return calificacion;
  }
}