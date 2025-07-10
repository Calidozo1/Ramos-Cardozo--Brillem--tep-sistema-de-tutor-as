import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';

@Injectable()
export class LogService{
  constructor(
    //inyectamos el repo en entidad log
    @InjectRepository(Log)
    private readonly logRepo: Repository<Log>
  ) {}

  async registrar (usuario_id: number,accion: string,ruta?: string, metodo?: string){
    const nuevoLog= this.logRepo.create({
      usuario_id,
      accion,
      ruta,
      metodo
    });
    await this.logRepo.save(nuevoLog);
  }
}