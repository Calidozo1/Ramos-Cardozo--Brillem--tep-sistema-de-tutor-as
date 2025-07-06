import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud } from './solicitud.entity';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';

@Injectable()
export class SolicitudService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepo: Repository<Solicitud>,
  ) {
  }

  async findAll(): Promise<Solicitud[]> {
    return this.solicitudRepo.find();
  }

  async create(dto: CreateSolicitudDto): Promise<Solicitud> {
    const solicitud = this.solicitudRepo.create(dto);
    return this.solicitudRepo.save(solicitud);
  }

  async update(id: number, dto: UpdateSolicitudDto): Promise<Solicitud> {
    const result = await this.solicitudRepo.update(id, dto);

    if (result.affected === 0) {
      throw new Error('No se encontró la solicitud para actualizar');
    }

    const updated = await this.solicitudRepo.findOneBy({ id });

    if (!updated) {
      throw new Error('La solicitud actualizada no fue encontrada');
    }

    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.solicitudRepo.delete(id);
  }


  async findOne(id: number): Promise<Solicitud> {
    const solicitud = await this.solicitudRepo.findOneBy({ id });
    if (!solicitud) throw new Error('Solicitud no encontrada');
    return solicitud;
  }
}