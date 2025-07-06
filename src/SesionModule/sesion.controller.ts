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
}