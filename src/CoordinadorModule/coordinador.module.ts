import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinadorService } from './coordinador.service';
import { CoordinadorController } from './coordinador.controller';
import { Coordinador } from './coordinador.entity';
import { UsuarioModule } from '../UsuarioModule/usuario.module';
import { Usuario } from '../UsuarioModule/usuario.entity';
import { CoordinadorPanelController } from './coordinador-panel.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coordinador, Usuario]),
    forwardRef(() => UsuarioModule),
  ],
  controllers: [CoordinadorController, CoordinadorPanelController],
  providers: [CoordinadorService],
  exports: [CoordinadorService],
})
export class CoordinadorModule {}
