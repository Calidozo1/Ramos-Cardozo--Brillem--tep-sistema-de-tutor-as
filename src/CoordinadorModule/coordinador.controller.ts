import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CoordinadorService } from './coordinador.service';
import { UpdateCoordinadorDto } from './dto/update-coordinador.dto';

@Controller('coordinadores')
export class CoordinadorController {
  constructor(private readonly coordinadorService: CoordinadorService) {}

  @Get()
  findAll() {
    return this.coordinadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coordinadorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCoordinadorDto: UpdateCoordinadorDto) {
    return this.coordinadorService.update(id, updateCoordinadorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coordinadorService.remove(id);
  }
}
