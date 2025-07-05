// src/materias/materias.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materia } from './materia.entity';

@Injectable()
export class MateriasService {
  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>,
  ) {}

  create(nombre: string, codigo: string): Promise<Materia> {
    const nuevaMateria = this.materiaRepository.create({
      nombre,
      codigo,
    });
    return this.materiaRepository.save(nuevaMateria);
  }

  findAll(): Promise<Materia[]> {
    return this.materiaRepository.find();
  }

  // Aquí irían otros métodos como findOne, update, remove...
}
