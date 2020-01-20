import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ServicioUsuario } from '../servicios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private servicioUsuario: ServicioUsuario) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.servicioUsuario.validarToken();
  }
}
