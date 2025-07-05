import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutor } from './tutor.entity';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TutorService {
  constructor(
    @InjectRepository(Tutor)
    private readonly tutorRepository: Repository<Tutor>,
  ) {}

  async create(createTutorDto: CreateTutorDto) {
    const { nombre, correo, contrasena, materiaId, ...tutorData } =
      createTutorDto;

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoTutor = this.tutorRepository.create({
      ...tutorData,
      usuario: {
        nombre,
        correo,
        contrasena: hashedPassword,
      },
      materia: { id: materiaId }, // Así se enlaza la materia
    });

    const tutorGuardado = await this.tutorRepository.save(nuevoTutor);
    return tutorGuardado;
  }

  findAll(): Promise<Tutor[]> {
    // Cargamos la relación con materia explícitamente
    return this.tutorRepository.find({
      relations: {
        materia: true,
      },
    });
  }

  async findOne(id: number): Promise<Tutor> {
    const tutor = await this.tutorRepository.findOne({
      where: { id },
      relations: { materia: true },
    });

    if (!tutor) {
      throw new NotFoundException(`Tutor con ID #${id} no encontrado`);
    }
    return tutor;
  }

  async update(id: number, updateTutorDto: UpdateTutorDto) {
    const { nombre, correo, contrasena, materiaId, ...tutorData } =
      updateTutorDto;

    const payload: any = { ...tutorData };

    if (materiaId) payload.materia = { id: materiaId };

    if (nombre || correo || contrasena) {
      payload.usuario = {};
      if (nombre) payload.usuario.nombre = nombre;
      if (correo) payload.usuario.correo = correo;
      if (contrasena) {
        payload.usuario.contrasena = await bcrypt.hash(contrasena, 10);
      }
    }

    const tutor = await this.tutorRepository.preload({ id, ...payload });

    if (!tutor) {
      throw new NotFoundException(`Tutor con ID #${id} no encontrado`);
    }
    return this.tutorRepository.save(tutor);
  }

  async remove(id: number) {
    const tutor = await this.findOne(id);
    return this.tutorRepository.remove(tutor);
  }
}
