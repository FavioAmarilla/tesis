import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../servicios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private servicioUsuario: UsuarioService
  ) {}

  canActivate(): Promise<boolean> | Observable<boolean> | boolean {
    return this.servicioUsuario.validarToken();
  }

}
