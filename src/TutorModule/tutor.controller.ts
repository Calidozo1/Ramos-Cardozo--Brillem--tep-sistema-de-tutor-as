import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { TutorService } from './tutor.service';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { JwtAuthGuard } from '../AuthModule/guards/jwt-auth.guard';
import { RolesGuard } from '../AuthModule/guards/roles.guard';
import { Roles } from '../AuthModule/roles/roles.decorator';
import { Rol } from '../AuthModule/roles/rol.enum';
import { SolicitudService } from '../SolicitudModule/solicitud.service';
import { UpdateSolicitudDto } from '../SolicitudModule/dto/update-solicitud.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Rol.Tutor)
@Controller('tutores')
export class TutorController {
  constructor(
    private readonly tutorService: TutorService,
    private readonly SolicitudService: SolicitudService,
  ) {}

  @Roles(Rol.Coordinador)
  @Get()
  findAll() {
    return this.tutorService.findAll();
  }

  @Roles(Rol.Coordinador)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tutorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTutorDto: UpdateTutorDto,
  ) {
    return this.tutorService.update(id, updateTutorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tutorService.remove(id);
  }

  @Get(':id/solicitudes')
  getSolicitudes(@Param('id') id: number) {
    return this.SolicitudService.getSolicitudesByTutor(id);
  }

  @Put(':tutorId/solicitudes/:solicitudId')
  actualizarSolicitud(
    @Param('tutorId') tutorId: number,
    @Param('solicitudId') solicitudId: number,
    @Body() updateDto: UpdateSolicitudDto
  ) {
    return this.SolicitudService.actualizarEstadoSolicitud(
      solicitudId,
      tutorId,
      updateDto
    );
  }
}
