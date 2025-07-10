import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sesion } from './sesion.entity';
import { SesionController } from './sesion.controller';
import { SesionService } from './sesion.service';
import { Calificacion } from '../CalificacionModule/calificacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sesion, Calificacion])],
  controllers: [SesionController],
  providers: [SesionService],
})
export class SesionModule {}