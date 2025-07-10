import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../UsuarioModule/usuario.entity';

@Entity('coordinador') // Nombre de la tabla
export class Coordinador {
  @PrimaryColumn()
  id: number;

  // --- Relación Uno a Uno con Usuario ---
  @OneToOne(() => Usuario, { cascade: true, eager: true })
  @JoinColumn({ name: 'id' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  cedula: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  departamento: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  extension_interna: string;
}