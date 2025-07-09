import { CallHandler, ExecutionContext, Injectable, NestInterceptor, } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogService } from './log.service';
import { Request } from 'express';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface AuthenticatedUser {
  id: number;
  rol: string;
}

@Injectable()
//lo que registrará automáticamente
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}
  //intercepta cada petición
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const rawUser = request.user;

    if (!rawUser || typeof rawUser !== 'object') {
      return next.handle();
    }
    const user = rawUser as Partial<AuthenticatedUser>;

    if (!user.id || !user.rol) { // si no hay usuario autenticado, no se registra
      return next.handle();
    }
    //se obtiene metodo y ruta  de la petición
    const metodo = request.method;
    const ruta = request.originalUrl;

    //la descripcion de la accion que hace el user
    const accion = this.getDescripcionAccion(metodo, ruta, user.rol);

    return next.handle().pipe(//el tap pa ejecutar el registro, sin modificar la respuesta
      tap(() => {
        void this.logService.registrar(user.id!, accion, ruta, metodo);
      }),
      //si ocurre un error tambien deberia registrar
      catchError((err) => {
        void this.logService.registrar(
          user.id!,
          `Error al intentar: ${accion}`,
          ruta,
          metodo,
        );
        return throwError(() => err);
      }),
    );
  }
//convierte ruta+metodo en un descripcion
  private getDescripcionAccion(metodo: string, ruta: string, rol?: string): string {
    const rolStr = rol ? rol.charAt(0).toUpperCase() + rol.slice(1) : 'Usuario';

    const descriptions: Record<string, string> = {
      // Panel del coordinador
      'GET-/panel-coordinador/sesiones': `${rolStr} listó todas las sesiones`,
      'GET-/panel-coordinador/estadisticas/tutores': `${rolStr} consultó estadísticas por tutor`,
      'GET-/panel-coordinador/estadisticas/materias': `${rolStr} consultó estadísticas por materia`,

      // Sesiones
      'GET-/sesiones': `${rolStr} listó todas las sesiones del sistema`,
      'POST-/sesiones': `${rolStr} creó una nueva sesión`,
      'GET-/sesiones/:id': `${rolStr} consultó detalles de una sesión`,
      'PATCH-/sesiones/:id/completar': `${rolStr} marcó una sesión como completada`,
      'GET-/sesiones/estudiante/:id': `${rolStr} consultó las sesiones de un estudiante`,
      'GET-/sesiones/tutor/:id': `${rolStr} consultó las sesiones dictadas por un tutor`,

      // Usuarios
      'GET-/usuarios': `${rolStr} listó todos los usuarios`,
      'GET-/usuarios/:id': `${rolStr} consultó detalles de un usuario`,
      'PATCH-/usuarios/:id': `${rolStr} actualizó información de un usuario`,
      'DELETE-/usuarios/:id': `${rolStr} eliminó un usuario`,

      // Materias
      'GET-/materias': `${rolStr} listó todas las materias`,
      'POST-/materias': `${rolStr} creó una nueva materia`,
      'GET-/materias/:id': `${rolStr} consultó detalles de una materia`,
      'PATCH-/materias/:id': `${rolStr} actualizó una materia`,
      'DELETE-/materias/:id': `${rolStr} eliminó una materia`,

      // Tutores
      'GET-/tutores': `${rolStr} listó todos los tutores`,
      'POST-/tutores': `${rolStr} registró un nuevo tutor`,
      'GET-/tutores/:id': `${rolStr} consultó detalles de un tutor`,
      'PATCH-/tutores/:id': `${rolStr} actualizó información de un tutor`,
      'DELETE-/tutores/:id': `${rolStr} eliminó un tutor`,
      'POST-/tutores/asignar-materia': `${rolStr} asignó una materia a un tutor`,

      // Estudiantes
      'GET-/estudiantes': `${rolStr} listó todos los estudiantes`,
      'POST-/estudiantes': `${rolStr} registró un nuevo estudiante`,
      'GET-/estudiantes/:id': `${rolStr} consultó detalles de un estudiante`,
      'PATCH-/estudiantes/:id': `${rolStr} actualizó información de un estudiante`,
      'DELETE-/estudiantes/:id': `${rolStr} eliminó un estudiante`,

      // Solicitudes
      'GET-/solicitudes': `${rolStr} listó todas las solicitudes`,
      'POST-/solicitudes': `${rolStr} creó una nueva solicitud`,
      'GET-/solicitudes/:id': `${rolStr} consultó detalles de una solicitud`,
      'PATCH-/solicitudes/:id': `${rolStr} actualizó una solicitud`,
      'DELETE-/solicitudes/:id': `${rolStr} eliminó una solicitud`,
      'GET-/solicitudes/tutor/:id': `${rolStr} consultó solicitudes asignadas a un tutor`,

      // Calificaciones
      'GET-/calificaciones': `${rolStr} listó todas las calificaciones`,
      'POST-/calificaciones': `${rolStr} registró una calificación`,
      'GET-/calificaciones/:id': `${rolStr} consultó detalles de una calificación`,
      'PATCH-/calificaciones/:id': `${rolStr} actualizó una calificación`,
      'DELETE-/calificaciones/:id': `${rolStr} eliminó una calificación`,

      // Coordinadores
      'GET-/coordinadores': `${rolStr} listó todos los coordinadores`,
      'POST-/coordinadores': `${rolStr} registró un nuevo coordinador`,
      'GET-/coordinadores/:id': `${rolStr} consultó detalles de un coordinador`,
      'PATCH-/coordinadores/:id': `${rolStr} actualizó información de un coordinador`,
      'DELETE-/coordinadores/:id': `${rolStr} eliminó un coordinador`,

      // Autenticación
      'POST-/auth/login': `${rolStr} inició sesión en el sistema`,
    };
    // sino encuentrar la ruta, se devuelve
    return (
      descriptions[`${metodo}-${ruta}`] ||
      `${rolStr} realizó "${metodo} ${ruta}"`
    );
  }
}