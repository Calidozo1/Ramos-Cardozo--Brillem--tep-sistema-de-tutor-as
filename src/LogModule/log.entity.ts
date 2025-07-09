import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('log')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  usuario_id: number;

  //Para la descripcion
  @Column({ type: 'varchar', length: 100, nullable: false })
  accion: string;

  //Para la ruta del endpoint
  @Column({ type: 'varchar', length: 100, nullable: true })
  ruta: string;

  //Para los métodos
  @Column({ type: 'varchar', length: 10, nullable: true })
  metodo: string;

  //Pa la fecha y hora de la acción
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
