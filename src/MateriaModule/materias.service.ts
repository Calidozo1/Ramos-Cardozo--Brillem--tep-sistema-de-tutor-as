// src/materias/materias.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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


  async findByNombre(nombre: string): Promise<Materia> {
    const materia = await this.materiaRepository.findOne({
      where: { nombre }
    });
    if (!materia) {
      throw new NotFoundException(`No se encontró la materia: ${nombre}`);
    }
    return materia;
  }

  async findOne(id: number): Promise<Materia> {
    const materia = await this.materiaRepository.findOne({ where: { id } });
    if (!materia) {
      throw new NotFoundException(`Materia con ID ${id} no encontrada`);
    }
    return materia;
  }


}
