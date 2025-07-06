import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<Omit<Usuario, 'contrasena'>> {
    const { contrasena, ...userData } = createUsuarioDto;
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = this.usuarioRepository.create({
      ...userData,
      contrasena: hashedPassword,
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contrasena: _, ...resultado } = usuarioGuardado;
    return resultado;
  }

  findAll(): Promise<Usuario[]> {
    // Excluimos la contraseña de la respuesta por seguridad.
    return this.usuarioRepository.find({
      select: ['id', 'nombre', 'correo', 'activo', 'fechaCreacion'],
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      select: ['id', 'nombre', 'correo', 'activo', 'fechaCreacion'],
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID #${id} no encontrado`);
    }
    return usuario;
  }

  async findByEmail(correo: string): Promise<Usuario> {
    // Usamos el QueryBuilder para poder seleccionar explícitamente la contraseña,
    // que podría estar oculta por defecto en la entidad con `select: false`.
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .where('usuario.correo = :correo', { correo })
      .addSelect('usuario.contrasena') // Asegura que la contraseña sea seleccionada
      .getOne();

    if (!usuario) {
      throw new NotFoundException(`Usuario con correo ${correo} no encontrado`);
    }
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const dataToUpdate: Partial<Usuario> = { ...updateUsuarioDto };

    if (updateUsuarioDto.contrasena) {
      dataToUpdate.contrasena = await bcrypt.hash(
        updateUsuarioDto.contrasena,
        10,
      );
    }

    const usuario = await this.usuarioRepository.preload({
      id,
      ...dataToUpdate,
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID #${id} no encontrado`);
    }
    const usuarioGuardado = await this.usuarioRepository.save(usuario);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contrasena: _, ...resultado } = usuarioGuardado;
    return resultado;
  }

  async remove(id: number) {
    const usuario = await this.findOne(id); // Reutilizamos findOne para verificar que existe.
    return this.usuarioRepository.remove(usuario);
  }
}