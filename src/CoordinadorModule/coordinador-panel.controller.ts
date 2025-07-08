import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SesionService } from '../SesionModule/sesion.service';
import { JwtAuthGuard } from '../AuthModule/guards/jwt-auth.guard';
import { RolesGuard } from '../AuthModule/guards/roles.guard';
import { Roles } from '../AuthModule/roles/roles.decorator';
import { Rol } from '../AuthModule/roles/rol.enum';

// disponible para usuarios con el rol coordinador
@Controller('panel-coordinador')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Rol.Coordinador)
export class CoordinadorPanelController {
  constructor(private readonly sesionService: SesionService) {}
//endpoints para consultar
  @Get('sesiones')
  getSesiones(
    @Query('tutor_id') tutorId?: number,
    @Query('materia_id') materiaId?: number,
    @Query('fecha') fecha?: string,
    @Query('completada') completada?: boolean,
  ) {
    return this.sesionService.filtrarSesiones({
      tutorId,
      materiaId,
      fecha,
      completada,
    });
  }

//cuantas sesiones hay por tutor
  @Get('estadisticas/tutores')
  getEstadisticasPorTutor() {
    return this.sesionService.estadisticasPorTutor();
  }

  // cuantaas sesiones hay por materia
  @Get('estadisticas/materias')
  getEstadisticasPorMateria() {
    return this.sesionService.estadisticasPorMateria();
  }
}