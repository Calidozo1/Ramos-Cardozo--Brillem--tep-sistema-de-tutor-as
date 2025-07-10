import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinadorService } from './coordinador.service';
import { CoordinadorController } from './coordinador.controller';
import { Coordinador } from './coordinador.entity';
import { UsuarioModule } from '../UsuarioModule/usuario.module';
import { Usuario } from '../UsuarioModule/usuario.entity';
import { TutorModule } from '../TutorModule/tutor.module';
import { CoordinadorPanelController } from './coordinador-panel.controller';
import { SesionModule } from '../SesionModule/sesion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coordinador, Usuario]),
    forwardRef(() => UsuarioModule),
    forwardRef(() => TutorModule),
    SesionModule,
  ],
  controllers: [CoordinadorController, CoordinadorPanelController],
  providers: [CoordinadorService],
  exports: [CoordinadorService],
})
export class CoordinadorModule {}
