import { CallHandler, ExecutionContext, Injectable, NestInterceptor, } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Ejecuta sin alterar
import { LogService } from './log.service';
import { Request } from 'express'; // para tipar la peticion HTTP

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user as { id: number } | undefined;
    const metodo: string = request.method;
    const ruta: string = request.originalUrl;

    if (!user || !user.id) {  // si no hay usuario autenticado, no se registra
      return next.handle();
    }

    const usuarioId = user.id;
    const accion = `${metodo} ${ruta}`;

    return next.handle().pipe( //el tap pa ejecutar el registro, sin modificar la respuesta
      tap(() => {
        void this.logService.registrar(usuarioId, accion, ruta, metodo); //el void pa indicar que el resultado se ignora
      }),
    );
  }
}
