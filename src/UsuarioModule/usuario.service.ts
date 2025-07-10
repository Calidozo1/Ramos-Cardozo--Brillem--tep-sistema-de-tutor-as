import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioConRolDto } from './dto/create-usuario-con-rol.dto';
import { Rol } from '../AuthModule/roles/rol.enum';
import { EstudianteService } from '../EstudianteModule/estudiantes.service';
import { TutorService } from '../TutorModule/tutor.service';
import { CoordinadorService } from '../CoordinadorModule/coordinador.service';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @Inject(forwardRef(() => EstudianteService)) private estudianteService: EstudianteService,
    @Inject(forwardRef(() => TutorService)) private tutorService: TutorService,
    @Inject(forwardRef(() => CoordinadorService)) private coordinadorService: CoordinadorService,
  ) {}

  async createConRol(dto: CreateUsuarioConRolDto) {
    // Verificar si el correo ya existe
    const existeUsuario = await this.usuarioRepository.findOneBy({ correo: dto.correo });
    if (existeUsuario) {
      throw new BadRequestException(`El correo ${dto.correo} ya está en uso.`);
    }

    switch (dto.rol) {
      case Rol.Estudiante:
        return this.estudianteService.create(dto);
      case Rol.Tutor:
        return this.tutorService.create(dto);
      case Rol.Coordinador:
        return this.coordinadorService.create(dto);
      default:
        throw new BadRequestException('Rol no válido proporcionado.');
    }
  }

  findAll(): Promise<Usuario[]> {
    // No mostramos la contraseña del usuario.
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
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.estudiante', 'estudiante')
      .leftJoinAndSelect('usuario.tutor', 'tutor')
      .leftJoinAndSelect('usuario.coordinador', 'coordinador')
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