import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('materia')
export class Materia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string; 

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  codigo: string; 
}