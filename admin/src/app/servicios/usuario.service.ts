import { Injectable, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Usuario } from '../modelos/usuario';
import { Router } from '@angular/router';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ServicioUsuario {

  @Output() loginEmitter = new EventEmitter();
  @Output() logoutEmitter = new EventEmitter();

  token: string = null;
  private usuario: Usuario = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  iniciarSession(usuario: any) {
    return new Promise(resolve => {
      this.http.post(`${API}/user/signIn`, usuario)
        .subscribe(
          async (response: any) => {
            if (response.success) {
              // se guarda el token en el Storage
              await this.guardarToken(response.data);
              // se manda el usuario mediante el emmiter
              this.loginEmitter.emit(this.usuario);
              // se retorna true
              resolve({ success: true });
            }
          },
          (error) => {
            this.token = null;
            localStorage.removeItem('user-admin-token');
            resolve({ success: false, error: error.error });
          }
        );
    });
  }

  async registrar(user) {
    return new Promise(resolve => {
      this.http.post(`${API}/user`, user).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  async obtenerUsuarios(id?, parametros?) {
    const url = (id) ? `${API}/user/${id}` : `${API}/user`;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const params = new HttpParams({ fromObject: parametros });

    return new Promise(resolve => {
      this.http.get(url, { headers, params }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  async actualizar(user, id) {
    return new Promise(resolve => {
      this.http.put(`${API}/user/${id}`, user).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  activarDesactivarUsuario(id, accion) {
    return new Promise(resolve => {
      this.http.delete(`${API}/user/${id}`).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  async obtenerUsuario() {
    if (!this.usuario) { this.validarToken(); }
    return await (this.usuario) ? { ...this.usuario } : null;
  }

  async cargarToken() {
    this.token = await localStorage.getItem('user-admin-token') || null;
  }

  async obtenerToken() {
    this.token = localStorage.getItem('user-admin-token') || null;

    return new Promise<string>(resolve => {
      resolve(this.token);
    });
  }

  async guardarToken(token: string) {
    this.token = token;
    await localStorage.setItem('user-admin-token', token);
    await this.validarToken();
  }

  async validarToken(): Promise<boolean> {
    await this.cargarToken();
    if (this.token == null) {
      this.router.navigate(['/login']);
      return Promise.resolve(false);
    }

    return new Promise<boolean>(resolve => {
      this.http.post(`${API}/user/checkToken`, {})
        .subscribe(
          async (response: any) => {
            if (response.success) {
              this.usuario = response.data.usuario;

              // guardar permisos
              await this.guardarPermisos(this.usuario.rol.permisos);

              resolve(true);

            } else {
              resolve(false);
            }
          }
        );
    });
  }

  validarEmail(id, email) {
    return new Promise<boolean>(resolve => {
      this.http.post(`${API}/user/validarEmail`, { id, email })
        .subscribe(
          (response: any) => {
            resolve(true);
          },
          (error) => {
            resolve(false);
          }
        );
    });
  }

  cerrarSession() {
    this.token = null;
    this.usuario = null;
    localStorage.removeItem('user-admin-token');
    localStorage.removeItem('user-admin-permisos');
    this.logoutEmitter.emit(true);
    this.router.navigate(['/login']);
  }


  async cambiarPassword(usuario: any) {
    return new Promise(resolve => {
      this.http.post(`${API}/user/cambiarPassword`, usuario)
        .subscribe(
          (response: any) => {
            resolve(response);
          },
          error => {
            resolve(error.error);
          }
        );
    });
  }

  async obtenerPermisos(rol) {
    return new Promise(resolve => {
      this.http.post(`${API}/user/permisos`, { rol })
        .subscribe(
          (response: any) => {
            resolve(response.data);
          },
          error => {
            resolve(error.error);
          }
        );
    });
  }

  async guardarPermisos(permisos: any) {
    await localStorage.setItem('user-admin-permisos', permisos);
  }

  async validarPermiso(permiso) {
    return new Promise(async resolve => {
      let permisos: any = {};
      permisos = await localStorage.getItem('user-admin-permisos') || null;
      const existe = permisos.indexOf(permiso);

      resolve(existe !== -1);
    });
  }
}
