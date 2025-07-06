import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './solicitud.entity';
// @ts-ignore
import { SolicitudController } from './solicitud.controller';
// @ts-ignore
import { SolicitudService } from './solicitud.service';

@Module({
  imports: [TypeOrmModule.forFeature([Solicitud])],
  controllers: [SolicitudController],
  providers: [SolicitudService],
})
export class SolicitudModule {}