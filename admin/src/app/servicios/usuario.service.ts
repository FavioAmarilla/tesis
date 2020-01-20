import { Injectable, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const json = JSON.stringify(usuario);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.post(`${API}/user/signIn`, params, {headers})
      .subscribe(
        async (response: any) => {
          console.log('response: ', response);
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
    const json = JSON.stringify(user);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.post(`${API}/user`, params, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }

  async obtenerUsuarios(id?) {
    const url = (id) ? `${API}/user/show/${id}` : `${API}/user`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.get(url, { headers }).subscribe(
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
    const json = JSON.stringify(user);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.put(`${API}/user/update/${id}`, params, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }

  obtenerUsuario() {
    if (!this.usuario) { this.validarToken(); }
    return (this.usuario) ? { ...this.usuario } : null;
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
    if (!this.token) {
      this.router.navigate(['/login']);
      return Promise.resolve(false);
    }

    return new Promise<boolean>(resolve => {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').append('Authorization', this.token);
      this.http.post(`${API}/user/checkToken`, {}, {headers})
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
