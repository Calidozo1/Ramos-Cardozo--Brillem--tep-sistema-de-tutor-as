import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calificacion } from './calificacion.entity';
import { CalificacionController } from './calificacion.controller';
import { CalificacionService } from './calificacion.service';
import { Sesion } from '../SesionModule/sesion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calificacion, Sesion])],
  controllers: [CalificacionController],
  providers: [CalificacionService],
})
export class CalificacionModule {}