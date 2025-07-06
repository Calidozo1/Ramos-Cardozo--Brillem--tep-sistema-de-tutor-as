import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sesion } from './sesion.entity';
import { SesionController } from './sesion.controller';
import { SesionService } from './sesion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sesion])],
  controllers: [SesionController],
  providers: [SesionService],
})
export class SesionModule {}