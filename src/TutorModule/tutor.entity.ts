import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Usuario } from '../UsuarioModule/usuario.entity';
import { Materia } from '../MateriaModule/materia.entity';
import { Solicitud } from '../SolicitudModule/solicitud.entity';
import { Calificacion } from '../CalificacionModule/calificacion.entity';
import { Sesion } from '../SesionModule/sesion.entity';

@Entity('tutor')
export class Tutor {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Usuario, { cascade: true, eager: true })
  @JoinColumn({ name: 'id' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  cedula: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  profesion: string;

  @Column({ type: 'text', nullable: true })
  experiencia: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @ManyToOne(() => Materia)
  @JoinColumn({ name: 'materia_id' })
  materia: Materia;


  @OneToMany(() => Solicitud, (solicitud) => solicitud.tutor)
  solicitudesAsignadas: Solicitud[];

  @OneToMany(() => Sesion, (sesion) => sesion.tutor)
  sesionesDictadas: Sesion[];

  @OneToMany(() => Calificacion, (calificacion) => calificacion.tutor)
  calificacionesRecibidas: Calificacion[];

}