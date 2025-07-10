import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Estudiante } from '../EstudianteModule/estudiante.entity';
import { Materia } from '../MateriaModule/materia.entity';
import { Tutor } from '../TutorModule/tutor.entity';
import { Sesion } from '../SesionModule/sesion.entity';
import { EstadoSolicitud } from './estado-solicitud.enum';

@Entity('solicitud')
export class Solicitud {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  estudiante_id: number;

  @Column()
  materia_id: number;

  @Column()
  fecha_solicitada: Date;

  @Column()
  hora_solicitada: string;

  @Column({
    type: 'enum',
    enum: EstadoSolicitud,
    default: EstadoSolicitud.Pendiente,
  })
  estado: EstadoSolicitud;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  // Relaciones
  @ManyToOne(() => Estudiante, (estudiante) => estudiante.solicitudes)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Materia, (materia) => materia.solicitudes)
  @JoinColumn({ name: 'materia_id' })
  materia: Materia;

  @ManyToOne(() => Tutor, (tutor: Tutor) => tutor.solicitudesAsignadas, { nullable: true })
  tutor: Tutor;


  @OneToOne(() => Sesion, (sesion) => sesion.solicitud)
  sesion: Sesion;

}