import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Solicitud } from '../SolicitudModule/solicitud.entity';
import { Sesion } from '../SesionModule/sesion.entity';
@Entity('materia')
export class Materia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string; 

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  codigo: string; 


@OneToMany(() => Solicitud, (solicitud) => solicitud.materia)
  solicitudes: Solicitud[];

@OneToMany(() => Sesion, (sesion) => sesion.materia)
sesiones: Sesion[];
}