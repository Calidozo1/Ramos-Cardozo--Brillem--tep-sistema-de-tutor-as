import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteService } from './estudiantes.service';
import { EstudianteController } from './estudiantes.controller';
import { Estudiante } from './estudiante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante])], // Solo necesitamos registrar Estudiante aquí
  controllers: [EstudianteController],
  providers: [EstudianteService],
})
export class EstudianteModule {}
