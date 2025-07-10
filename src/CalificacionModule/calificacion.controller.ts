import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { CalificacionService } from './calificacion.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { JwtAuthGuard } from '../AuthModule/guards/jwt-auth.guard';
import { RolesGuard } from '../AuthModule/guards/roles.guard';
import { Roles } from '../AuthModule/roles/roles.decorator';
import { Rol } from '../AuthModule/roles/rol.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('calificaciones')
export class CalificacionController {
  constructor(private readonly service: CalificacionService) {}

  @Roles(Rol.Estudiante)
  @Post()
  async create(@Body() dto: CreateCalificacionDto, @Req() req: Request) {
    const userId = (req.user as any).sub;

    // Asegurarse de que el estudiante solo pueda calificar como él mismo
    if (dto.estudiante_id !== userId) {
      throw new ForbiddenException('Solo puedes calificar como tu usuario.');
    }

    return this.service.create(dto);
  }

  @Get('sesion/:id')
  async getBySesion(@Param('id') id: number) {
    return this.service.findBySesion(id);
  }
}
