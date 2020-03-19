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
  ) {}

  iniciarSession(usuario: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(`${API}/user/signIn`, usuario, {headers})
      .subscribe(
        async (response: any) => {
          if (response.status) {
            // se guarda el token en el Storage
            await this.guardarToken(response.data);
            // se manda el usuario mediante el emmiter
            this.loginEmitter.emit(this.usuario);
            // se retorna true
            resolve({success: true});
          } else {
            this.token = null;
            localStorage.removeItem('user-admin-token');
            resolve({success: false, error: response});
          }
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
          resolve(error);
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
          resolve(error);
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
          resolve(error);
        }
      );
    });
  }

  activarDesactivarUsuario(id, accion) {
    const estado = (accion === 'activar') ? 1 : 0;
    const json = JSON.stringify({estado});

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().append('json', json);

    return new Promise(resolve => {
      this.http.delete(`${API}/user/${id}`, { headers: headers, params: params }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
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

    let data = {
        'Authorization': this.token
    };

    return new Promise<boolean>(resolve => {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post(`${API}/user/checkToken`, data, {headers})
      .subscribe(
        (response: any) => {
          if (response.status) {
            this.usuario = response.data;
            resolve(true);
          } else {
            resolve(false);
          }
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


}
