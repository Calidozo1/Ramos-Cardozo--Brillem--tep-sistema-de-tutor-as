import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './log.entity';
import { LogService } from './log.service';
import { LoggingInterceptor } from './log.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [
    LogService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor, // Se registra pa la parte global
    },
  ],
  exports: [LogService],
})
export class LogModule {}
