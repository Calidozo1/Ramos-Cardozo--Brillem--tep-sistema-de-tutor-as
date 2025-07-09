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

  async findByEstudiante(estudianteId: number): Promise<Sesion[]> {
    return this.sesionRepo.find({
      where: { estudiante: { id: estudianteId } },
      relations: ['materia', 'tutor', 'solicitud'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

}