import { Controller, Get, Post, Body, Param, Patch, Req } from '@nestjs/common';
import { SesionService } from './sesion.service';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../AuthModule/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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
  @Get('tutor')
  async getByTutor(@Req() req: any) {
    const tutorId = (req.user as any).sub;
    return this.service.findByTutor(tutorId);
  }

  // Listar sesiones por estudiante
  @Get('estudiante/:id')
  async getByEstudiante(@Param('id') estudianteId: number) {
    return this.service.findByEstudiante(estudianteId);
  }

}