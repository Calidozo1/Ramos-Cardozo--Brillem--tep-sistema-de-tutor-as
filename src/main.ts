import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './LogModule/log.interceptor';
import {LogService } from './LogModule/log.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  //Activar el interceptor global
  app.useGlobalInterceptors(new LoggingInterceptor(app.get('LogService')));

  const port = process.env.PORT ?? 3000;

  await app.listen(port);
  console.log(`Servidor corriendo en http://localhost:${port}`);
}

bootstrap();
