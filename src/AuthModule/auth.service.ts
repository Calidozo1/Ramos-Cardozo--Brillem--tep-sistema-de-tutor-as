import { Injectable } from '@nestjs/common';
import { UsuarioService } from '../UsuarioModule/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Rol } from './roles/rol.enum';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUser(correo: string, pass: string): Promise<any> {
    const user = await this.usuarioService.findByEmail(correo);
    if (user && (await bcrypt.compare(pass, user.contrasena))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { contrasena, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // Determinamos el rol usando el enum para mayor seguridad
    let rol: Rol = Rol.Estudiante;
    if (user.estudiante) {
      rol = Rol.Estudiante;
    } else if (user.tutor) {
      rol = Rol.Tutor;
    } else if (user.coordinador) {
      rol = Rol.Coordinador;
    }

    const payload = { email: user.correo, sub: user.id, rol: rol };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
