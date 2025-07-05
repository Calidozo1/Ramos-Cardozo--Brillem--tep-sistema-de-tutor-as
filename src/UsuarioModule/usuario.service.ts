import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // En una aplicación real, aquí deberías hashear la contraseña antes de guardarla.
    // Ejemplo: const hashedPassword = await bcrypt.hash(createUsuarioDto.contraseña, 10);
    const nuevoUsuario = this.usuarioRepository.create(createUsuarioDto);
    return this.usuarioRepository.save(nuevoUsuario);
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

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    // El método `preload` busca el usuario y lo actualiza con los nuevos datos.
    const usuario = await this.usuarioRepository.preload({
      id,
      ...updateUsuarioDto,
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID #${id} no encontrado`);
    }
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.findOne(id); // Reutilizamos findOne para verificar que existe.
    return this.usuarioRepository.remove(usuario);
  }
}