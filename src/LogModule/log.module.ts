import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './log.entity';
import { LogService } from './log.service';
import { LoggingInterceptor } from './log.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}