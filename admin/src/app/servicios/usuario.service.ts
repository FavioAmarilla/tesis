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
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(`${API}/user/signIn`, usuario, { headers })
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
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(`${API}/user`, user, { headers: headers }).subscribe(
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
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.put(`${API}/user/${id}`, user, { headers: headers }).subscribe(
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
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.delete(`${API}/user/${id}`, { headers: headers }).subscribe(
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
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .append('Authorization', this.token);

      this.http.post(`${API}/user/checkToken`, {}, { headers })
        .subscribe(
          (response: any) => {
            if (response.success) {
              this.usuario = response.data;

              //obtener permisos
              this.http.post(`${API}/user/permisos`, { rol: response.data.rol }, { headers })
                .subscribe(
                  (responseP: any) => {
                    if (responseP.success) {
                      this.guardarPermisos(responseP.data);
                      resolve(true);
                    } else {
                      resolve(false);
                    }
                  }
                );

            } else {
              resolve(false);
            }
          }
        );
    });
  }

  validarEmail(id, email) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise<boolean>(resolve => {
      this.http.post(`${API}/user/validarEmail`, { id, email }, { headers })
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
    this.logoutEmitter.emit(true);
    this.router.navigate(['/login']);
  }


  async cambiarPassword(usuario: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(`${API}/user/cambiarPassword`, usuario, { headers })
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

  async guardarPermisos(permisos: string) {
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
