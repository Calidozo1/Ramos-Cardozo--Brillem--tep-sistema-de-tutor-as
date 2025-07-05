import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coordinador } from './coordinador.entity';
import { CreateCoordinadorDto } from './dto/create-coordinador.dto';
import { UpdateCoordinadorDto } from './dto/update-coordinador.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CoordinadorService {
  constructor(
    @InjectRepository(Coordinador)
    private readonly coordinadorRepository: Repository<Coordinador>,
  ) {}

  async create(createCoordinadorDto: CreateCoordinadorDto) {
    const { nombre, correo, contrasena, ...coordinadorData } =
      createCoordinadorDto;

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoCoordinador = this.coordinadorRepository.create({
      ...coordinadorData,
      usuario: {
        nombre,
        correo,
        contrasena: hashedPassword,
      },
    });

    const coordinadorGuardado =
      await this.coordinadorRepository.save(nuevoCoordinador);
    return coordinadorGuardado;
  }

  findAll(): Promise<Coordinador[]> {
    return this.coordinadorRepository.find();
  }

  async findOne(id: number): Promise<Coordinador> {
    const coordinador = await this.coordinadorRepository.findOneBy({ id });
    if (!coordinador) {
      throw new NotFoundException(`Coordinador con ID #${id} no encontrado`);
    }
    return coordinador;
  }

  async update(id: number, updateCoordinadorDto: UpdateCoordinadorDto) {
    const { nombre, correo, contrasena, ...coordinadorData } =
      updateCoordinadorDto;

    const payload: any = { ...coordinadorData };

    if (nombre || correo || contrasena) {
      payload.usuario = {};
      if (nombre) payload.usuario.nombre = nombre;
      if (correo) payload.usuario.correo = correo;
      if (contrasena) {
        payload.usuario.contrasena = await bcrypt.hash(contrasena, 10);
      }
    }

    const coordinador = await this.coordinadorRepository.preload({ id, ...payload });

    if (!coordinador) {
      throw new NotFoundException(`Coordinador con ID #${id} no encontrado`);
    }
    return this.coordinadorRepository.save(coordinador);
  }

  async remove(id: number) {
    const coordinador = await this.findOne(id);
    return this.coordinadorRepository.remove(coordinador);
  }
}
