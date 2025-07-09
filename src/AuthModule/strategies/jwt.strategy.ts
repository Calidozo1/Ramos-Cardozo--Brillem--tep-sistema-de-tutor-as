import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsuarioService } from '../../UsuarioModule/usuario.service';
import { Usuario } from '../../UsuarioModule/usuario.entity';

// Definimos el tipo de usuario autenticado, sin su contraseña
export type AuthenticatedUser = Omit<Usuario, 'contrasena'> & { rol: string };

interface JwtPayload {
  email: string;
  sub: number;
  rol: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usuarioService: UsuarioService, // Inyectamos el servicio de usuario
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.usuarioService.findOne(payload.sub);

    if (!user || !user.activo) {
      throw new UnauthorizedException('Token inválido o usuario inactivo.');
    }
    // Adjuntamos el usuario y su rol al objeto request
    return { ...user, rol: payload.rol } as AuthenticatedUser;
  }
}
