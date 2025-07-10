import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MateriasService } from './materias.service';
import { JwtAuthGuard } from '../AuthModule/guards/jwt-auth.guard';
import { RolesGuard } from '../AuthModule/guards/roles.guard';
import { Roles } from '../AuthModule/roles/roles.decorator';
import { Rol } from '../AuthModule/roles/rol.enum';

@Controller('materias')
@UseGuards(JwtAuthGuard, RolesGuard) // Aplicamos los guardianes a todo el controlador
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Roles(Rol.Tutor, Rol.Coordinador) 
  @Get()
  findAll() {
    return this.materiasService.findAll();
  }

  // Para poder probar, añadimos un endpoint para crear materias
  // Solo los coordinadores pueden crear materias
  @Roles(Rol.Coordinador)
  @Post()
  create(@Body() body: { nombre: string; codigo: string }) {
    return this.materiasService.create(body.nombre, body.codigo);
  }
}
