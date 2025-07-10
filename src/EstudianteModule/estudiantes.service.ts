import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { Usuario } from '../UsuarioModule/usuario.entity';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioConRolDto } from '../UsuarioModule/dto/create-usuario-con-rol.dto';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioConRolDto): Promise<Estudiante> {
    const { nombre, correo, contrasena, rol, ...estudianteData } = dto;

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = this.usuarioRepository.create({
      nombre,
      correo,
      contrasena: hashedPassword,
    });
    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    const nuevoEstudiante = this.estudianteRepository.create({
      ...estudianteData,
      id: usuarioGuardado.id, // Asignamos explícitamente el ID
      usuario: usuarioGuardado,
    });

    const estudianteGuardado = await this.estudianteRepository.save(nuevoEstudiante);

    return estudianteGuardado;
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
    return this.estudianteRepository.remove(estudiante);
  }
}
