import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MateriasModule } from './MateriaModule/materias.module';
import { UsuarioModule } from './UsuarioModule/usuario.module';
import { EstudianteModule } from './EstudianteModule/estudiante.module';
import { TutorModule } from './TutorModule/tutor.module';
import { CoordinadorModule } from './CoordinadorModule/coordinador.module';
import { AuthModule } from './AuthModule/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MateriasModule,
    UsuarioModule,
    EstudianteModule,
    TutorModule,
    CoordinadorModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
