import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coordinador } from './coordinador.entity';
import { UpdateCoordinadorDto } from './dto/update-coordinador.dto';
import { Usuario } from '../UsuarioModule/usuario.entity';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioConRolDto } from '../UsuarioModule/dto/create-usuario-con-rol.dto';

@Injectable()
export class CoordinadorService {
  constructor(
    @InjectRepository(Coordinador)
    private readonly coordinadorRepository: Repository<Coordinador>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioConRolDto) {
    const { nombre, correo, contrasena, rol, ...coordinadorData } = dto;

    // 1. Crear y guardar el Usuario primero
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = this.usuarioRepository.create({
      nombre,
      correo,
      contrasena: hashedPassword,
    });
    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    const nuevoCoordinador = this.coordinadorRepository.create({
      ...coordinadorData,
      id: usuarioGuardado.id, 
      usuario: usuarioGuardado,
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
    const coordinadorGuardado = await this.coordinadorRepository.save(coordinador);

    // Si el usuario fue actualizado, también se devuelve sin la contraseña
    if (coordinadorGuardado.usuario) {
    }
    return coordinadorGuardado;
  }

  async remove(id: number) {
    const coordinador = await this.findOne(id);
    return this.coordinadorRepository.remove(coordinador);
  }
}
