import { Controller, Get, Query, UseGuards, UsePipes, ValidationPipe, NotFoundException, } from '@nestjs/common';
import { SesionService } from '../SesionModule/sesion.service';
import { JwtAuthGuard } from '../AuthModule/guards/jwt-auth.guard';
import { RolesGuard } from '../AuthModule/guards/roles.guard';
import { Roles } from '../AuthModule/roles/roles.decorator';
import { Rol } from '../AuthModule/roles/rol.enum';
import { FiltroSesionesDto } from './dto/filtro-sesiones.dto';

// disponible para usuarios con el rol coordinador
@Controller('panel-coordinador')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Rol.Coordinador)
export class CoordinadorPanelController {
  constructor(private readonly sesionService: SesionService) {}

  //endpoints para consultar filtros
  //se utiliza validationPipe para validar los parámetros de consulta
  @Get('sesiones')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async getSesiones(@Query() filtros: FiltroSesionesDto) {
    const sesiones = await this.sesionService.obtenerSesionesFiltradas(filtros);

    if (!sesiones.length) {
      throw new NotFoundException(
        'No se encontraron las sesiones con los filtros proporcionados.',
      );
    }
    return sesiones;
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
