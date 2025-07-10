import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteService } from './estudiantes.service';
import { EstudianteController } from './estudiantes.controller';
import { Estudiante } from './estudiante.entity';
import { UsuarioModule } from '../UsuarioModule/usuario.module';
import { Usuario } from '../UsuarioModule/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estudiante, Usuario]), // Registramos ambos repositorios
    forwardRef(() => UsuarioModule), // Mantenemos esto para los servicios
  ],
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [EstudianteService],
})
export class EstudianteModule {}
