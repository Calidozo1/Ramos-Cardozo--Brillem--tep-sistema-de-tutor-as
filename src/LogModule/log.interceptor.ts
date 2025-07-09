import { CallHandler, ExecutionContext, Injectable, NestInterceptor, } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogService } from './log.service';
import { Request } from 'express';

interface AuthenticatedUser {
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

    // Validar que el usuario esté autenticado y tenga id y rol
    if (!rawUser || typeof rawUser !== 'object') {
      return next.handle();
    }

    const user = rawUser as AuthenticatedUser;

    if (!user.id || !user.rol) { // si no hay usuario autenticado, no se registra
      return next.handle();
    }
    //se obtiene metodo y ruta  de la petición
    const metodo = request.method;
    const ruta = request.originalUrl;
    const usuarioId = user.id;
    const rolStr = user.rol.charAt(0).toUpperCase() + user.rol.slice(1);
    // Coordinador / Tutor / Estudiante

    //la descripcion de la accion que hace el user
    const descripcionAccion = this.getDescripcionAccion(metodo, ruta, rolStr);

    // Registrar antes de finalizar la petición
    return next.handle().pipe(
      tap({
        next: () => {
          this.logService.registrar(usuarioId, descripcionAccion, ruta, metodo);
        },
      }),
    );
  }

  private getDescripcionAccion(metodo: string, ruta: string, rol: string): string {
    const descriptions: Record<string, string> = {
      // Panel del coordinador
      'GET-/panel-coordinador/sesiones': `${rol} listó todas las sesiones`,
      'GET-/panel-coordinador/estadisticas/tutores': `${rol} consultó estadísticas por tutor`,
      'GET-/panel-coordinador/estadisticas/materias': `${rol} consultó estadísticas por materia`,

      // Sesiones
      'GET-/sesiones': `${rol} listó todas las sesiones`,
      'POST-/sesiones': `${rol} creó una nueva sesión`,
      'GET-/sesiones/:id': `${rol} consultó detalles de una sesión`,
      'PATCH-/sesiones/:id/completar': `${rol} marcó una sesión como completada`,
      'GET-/sesiones/estudiante/:id': `${rol} consultó las sesiones de un estudiante`,
      'GET-/sesiones/tutor/:id': `${rol} consultó las sesiones dictadas por un tutor`,

      // Usuarios
      'GET-/usuarios': `${rol} listó todos los usuarios`,
      'GET-/usuarios/:id': `${rol} consultó detalles de un usuario`,
      'PATCH-/usuarios/:id': `${rol} actualizó información de un usuario`,
      'DELETE-/usuarios/:id': `${rol} eliminó un usuario`,

      //Materias
      'GET-/materias': `${rol} listó todas las materias`,
      'POST-/materias': `${rol} creó una nueva materia`,
      'POST-/usuarios': `${rol} registró un nuevo usuario`,

      // Tutores
      'GET-/tutores': `${rol} listó todos los tutores`,
      'POST-/tutores': `${rol} registró un nuevo tutor`,
      'GET-/tutores/:id': `${rol} consultó detalles de un tutor`,
      'PATCH-/tutores/:id': `${rol} actualizó información de un tutor`,
      'DELETE-/tutores/:id': `${rol} eliminó un tutor`,
      'POST-/tutores/asignar-materia': `${rol} asignó una materia a un tutor`,

      // Estudiantes
      'GET-/estudiantes': `${rol} listó todos los estudiantes`,
      'POST-/estudiantes': `${rol} registró un nuevo estudiante`,
      'GET-/estudiantes/:id': `${rol} consultó detalles de un estudiante`,
      'PATCH-/estudiantes/:id': `${rol} actualizó información de un estudiante`,
      'DELETE-/estudiantes/:id': `${rol} eliminó un estudiante`,

      // Solicitudes
      'GET-/solicitudes': `${rol} listó todas las solicitudes`,
      'POST-/solicitudes': `${rol} creó una nueva solicitud`,
      'GET-/solicitudes/:id': `${rol} consultó detalles de una solicitud`,
      'PATCH-/solicitudes/:id': `${rol} actualizó una solicitud`,
      'DELETE-/solicitudes/:id': `${rol} eliminó una solicitud`,
      'GET-/solicitudes/tutor/:id': `${rol} consultó solicitudes asignadas a un tutor`,
      // Calificaciones
      'GET-/calificaciones': `${rol} listó todas las calificaciones`,
      'POST-/calificaciones': `${rol} registró una calificación`,
      'GET-/calificaciones/:id': `${rol} consultó detalles de una calificación`,
      'PATCH-/calificaciones/:id': `${rol} actualizó una calificación`,
      'DELETE-/calificaciones/:id': `${rol} eliminó una calificación`,
      // Coordinadores
      'GET-/coordinadores': `${rol} listó todos los coordinadores`,
      'POST-/coordinadores': `${rol} registró un nuevo coordinador`,
      'GET-/coordinadores/:id': `${rol} consultó detalles de un coordinador`,
      'PATCH-/coordinadores/:id': `${rol} actualizó información de un coordinador`,
      'DELETE-/coordinadores/:id': `${rol} eliminó un coordinador`,

      // Autenticación
      'POST-/auth/login': `${rol} inició sesión en el sistema`,
    };
    // sino encuentrar la ruta, se devuelve
    return descriptions[`${metodo}-${ruta}`] ||
      `${rol} realizó "${metodo} ${ruta}"`;
  }
}