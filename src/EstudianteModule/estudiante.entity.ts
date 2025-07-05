import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../UsuarioModule/usuario.entity';

@Entity('estudiante') // El nombre de la tabla en la base de datos [cite: 5]
export class Estudiante {
  @PrimaryColumn() // No es @PrimaryGeneratedColumn porque el ID viene de la tabla usuario
  id: number;

  @OneToOne(() => Usuario, { cascade: true, eager: true }) // Define la relación
  @JoinColumn({ name: 'id' }) // Especifica que la columna 'id' es la clave foránea
  usuario: Usuario;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  cedula: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  carrera: string;

  @Column({ type: 'integer', nullable: true })
  semestre: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string; 
}