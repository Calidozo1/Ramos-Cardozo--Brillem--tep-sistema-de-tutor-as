import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}

  async create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
    const { nombre, correo, contrasena, ...estudianteData } = createEstudianteDto;

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoEstudiante = this.estudianteRepository.create({
      ...estudianteData,
      usuario: {
        nombre,
        correo,
        contrasena: hashedPassword,
      },
    });

    return this.estudianteRepository.save(nuevoEstudiante);
  }

  findAll(): Promise<Estudiante[]> {
    return this.estudianteRepository.find();
  }

  async findOne(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOneBy({ id });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID #${id} no encontrado`);
    }
    return estudiante;
  }

  async update(id: number, updateEstudianteDto: UpdateEstudianteDto) {
    const {
      nombre,
      correo,
      contrasena,
      ...estudianteData
    } = updateEstudianteDto;

    const payload: any = { ...estudianteData };
    if (nombre || correo || contrasena) {
      payload.usuario = {};
      if (nombre) payload.usuario.nombre = nombre;
      if (correo) payload.usuario.correo = correo;
      if (contrasena) {
        payload.usuario.contrasena = await bcrypt.hash(contrasena, 10);
      }
    }

    const estudiante = await this.estudianteRepository.preload({
      id,
      ...payload,
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID #${id} no encontrado`);
    }
    return this.estudianteRepository.save(estudiante);
  }

  async remove(id: number) {
    const estudiante = await this.findOne(id);
    // `cascade: true` también se encargará de eliminar el usuario asociado.
    return this.estudianteRepository.remove(estudiante);
  }
}
