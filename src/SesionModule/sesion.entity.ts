import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Solicitud } from '../SolicitudModule/solicitud.entity';
import { Tutor } from '../TutorModule/tutor.entity';
import { Estudiante } from '../EstudianteModule/estudiante.entity';
import { Materia } from '../MateriaModule/materia.entity';
import { Calificacion } from '../CalificacionModule/calificacion.entity';

@Entity('sesion')
export class Sesion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  solicitud_id: number;

  @Column()
  tutor_id: number;

  @Column()
  estudiante_id: number;

  @Column()
  materia_id: number;

  @Column()
  fecha: Date;

  @Column()
  hora: string;

  @Column({ default: false })
  completada: boolean;

  // Relaciones
  @ManyToOne(() => Solicitud, (solicitud) => solicitud.sesion)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: Solicitud;

  @ManyToOne(() => Tutor, (tutor) => tutor.sesionesDictadas)
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.sesionesAsistidas)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Materia, (materia) => materia.sesiones)
  @JoinColumn({ name: 'materia_id' })
  materia: Materia;

  @OneToOne(() => Calificacion, (calificacion) => calificacion.sesion)
  calificacion: Calificacion;
}

