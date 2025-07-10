import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { Estudiante } from '../EstudianteModule/estudiante.entity';
import { Tutor } from '../TutorModule/tutor.entity';
import { Coordinador } from '../CoordinadorModule/coordinador.entity';

@Entity('usuarios') 
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  correo: string;

  @Column({ select: false }) 
  contrasena: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @OneToOne(() => Estudiante, (estudiante) => estudiante.usuario, { nullable: true })
  estudiante: Estudiante;

  @OneToOne(() => Tutor, (tutor) => tutor.usuario, { nullable: true })
  tutor: Tutor;

  @OneToOne(() => Coordinador, (coordinador) => coordinador.usuario, { nullable: true })
  coordinador: Coordinador;
}