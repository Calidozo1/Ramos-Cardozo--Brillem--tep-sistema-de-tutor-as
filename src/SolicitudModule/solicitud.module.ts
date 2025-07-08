import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './solicitud.entity';
// @ts-ignore
import { SolicitudController } from './solicitud.controller';
// @ts-ignore
import { SolicitudService } from './solicitud.service';
import { TutorModule } from '../TutorModule/tutor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Solicitud]),
    forwardRef(() => TutorModule),
  ],
  controllers: [SolicitudController],
  providers: [SolicitudService],
})
export class SolicitudModule {}