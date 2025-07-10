import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './usuario.entity';
import { EstudianteModule } from '../EstudianteModule/estudiante.module';
import { TutorModule } from '../TutorModule/tutor.module';
import { CoordinadorModule } from '../CoordinadorModule/coordinador.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    // Usamos forwardRef para romper dependencias circulares
    forwardRef(() => EstudianteModule),
    forwardRef(() => TutorModule),
    forwardRef(() => CoordinadorModule),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
