import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sesion } from '../SesionModule/sesion.entity';
import { Estudiante } from '../EstudianteModule/estudiante.entity';
import { Tutor } from '../TutorModule/tutor.entity';

@Entity('calificacion')
export class Calificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sesion_id: number;

  @Column()
  estudiante_id: number;

  @Column()
  tutor_id: number;

  @Column('integer')
  calificacion: number;

  @Column({ nullable: true })
  comentario: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  // Relaciones

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.calificaciones)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Tutor, (tutor) => tutor.calificacionesRecibidas)
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;

  @ManyToOne(() => Sesion, (sesion) => sesion.calificacion)
  @JoinColumn({ name: 'sesion_id' })
  sesion: Sesion;
}