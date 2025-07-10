import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { SesionService } from './sesion.service';
import { CreateSesionDto } from './dto/create-sesion.dto';

@Controller('sesiones')
export class SesionController {
  constructor(private readonly service: SesionService) {}

  @Get()
  async getAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() dto: CreateSesionDto) {
    return this.service.create(dto);
  }

  @Patch(':id/completar')
  async marcarCompletada(@Param('id') id: number) {
    return this.service.marcarCompletada(id);
  }

  // Listar sesiones por tutor
  @Get('tutor/:id')
  async getByTutor(@Param('id') tutorId: number) {
    return this.service.findByTutor(tutorId);
  }

  // Listar sesiones por estudiante
  @Get('estudiante/:id')
  async getByEstudiante(@Param('id') estudianteId: number) {
    return this.service.findByEstudiante(estudianteId);
  }

}