import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe, Post,
} from '@nestjs/common';
import { CoordinadorService } from './coordinador.service';
import { UpdateCoordinadorDto } from './dto/update-coordinador.dto';
import { AsignarMateriaDto } from '../TutorModule/dto/asignar-materia.dto';
import { TutorService } from '../TutorModule/tutor.service'

@Controller('coordinadores')
export class CoordinadorController {
  constructor(
    private readonly coordinadorService: CoordinadorService,
    private readonly tutorService: TutorService,
  ) {}

  @Get()
  findAll() {
    return this.coordinadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coordinadorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCoordinadorDto: UpdateCoordinadorDto,
  ) {
    return this.coordinadorService.update(id, updateCoordinadorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coordinadorService.remove(id);
  }
  
@Post('asignar-materia')  // Este es el nuevo endpoint
asignarMateriaTutor(@Body() asignarMateriaDto: AsignarMateriaDto) {
    return this.tutorService.asignarMateria(asignarMateriaDto);
}
}


