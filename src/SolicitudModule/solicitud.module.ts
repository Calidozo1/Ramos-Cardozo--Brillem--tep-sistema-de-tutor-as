import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './solicitud.entity';
import { SolicitudController } from './solicitud.controller';
import { SolicitudService } from './solicitud.service';
import { TutorModule } from '../TutorModule/tutor.module';
import { MateriasModule } from '../MateriaModule/materias.module';
import { Sesion } from '../SesionModule/sesion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Solicitud, Sesion]),
    forwardRef(() => TutorModule),
    forwardRef(() => MateriasModule),
  ],
  controllers: [SolicitudController],
  providers: [SolicitudService],
  exports: [SolicitudService],
})
export class SolicitudModule {}