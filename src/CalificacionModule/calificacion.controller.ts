import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';

@Controller('calificaciones')
export class CalificacionController {
  constructor(private readonly service: CalificacionService) {}

  @Post()
  async create(@Body() dto: CreateCalificacionDto) {
    return this.service.create(dto);
  }

  @Get('sesion/:id')
  async getBySesion(@Param('id') id: number) {
    return this.service.findBySesion(id);
  }
}