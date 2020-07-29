import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisosGuard implements CanActivateChild {

  constructor(private router: Router) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.comprobarPermisos(state.url);
  }

  comprobarPermisos(route) {
    let autorizado = false;
    const storage = localStorage.getItem('user-admin-permisos');
    const permisos =  JSON.parse(storage) || [];
    const array = route.split('/');
    const last = array[array.length - 1];
    const normalizado = last.toUpperCase().replace(' ', '-').replace('.', '');

    permisos.map(permiso => {
      if (`${normalizado}.LISTAR` == permiso.nombre) { autorizado = true; }
    });

    if (!autorizado) {
      this.router.navigate(['/dashboard']);
    }

    return autorizado
  }

}
