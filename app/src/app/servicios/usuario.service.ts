import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { environment } from '../../environments/environment';
import { Usuario } from '../interfaces/interfaces';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private token: string = null;
  private usuario: Usuario = null;

  @Output() loginEmitter = new EventEmitter();
  @Output() logoutEmitter = new EventEmitter();

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router
  ) { }

  async registro(usuario: Usuario) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(`${API}user`, usuario, { headers })
      .subscribe(
        (response: any) => resolve(response),
        (error: any) => resolve(error.error)
      );
    });
  }

  async actualizar(usuario: Usuario, id: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.put(`${API}user/${id}`, usuario, { headers })
      .subscribe(
        (response: any) => resolve(response),
        (error: any) => resolve(error.error)
      );
    });
  }

  iniciarSession(usuario: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(`${API}user/signIn`, usuario, { headers })
      .subscribe(
        async (response: any) => {
          if (response.success) {
            // se guarda el token en el Storage
            await this.guardarToken(response.data);
            this.loginEmitter.emit(this.usuario);
            resolve({ success: true });
          }
        },
        (error) => {
          this.token = null;
          this.storage.remove('token');
          resolve({ success: false, error });
        }
      );
    });
  }

  async obtenerUsuario() {
    if (!this.usuario) { await this.validarToken(); }
    return await (this.usuario) ? { ...this.usuario } : null;
  }

  async cargarToken() {
    this.token = await this.storage.get('token') || null;
  }

  async guardarToken(token: string) {
    this.token = token;
    await this.storage.set('token', token);
    await this.validarToken();
  }

  async validarToken(): Promise<boolean> {
    await this.cargarToken();
    if (!this.token) {
      return Promise.resolve(false);
    }

    const data = {
      Authorization: this.token
    };

    return new Promise<boolean>(resolve => {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post(`${API}user/checkToken`, data, { headers })
      .subscribe(
        (response: any) => {
          if (response.success) {
            this.usuario = response.data;
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (error) => resolve(false)
      );
    });
  }

  async cerrarSession() {
    this.token = null;
    this.usuario = null;
    this.storage.remove('token');
    this.logoutEmitter.emit(true);
    this.router.navigate(['/']);
  }

  async cambiarPassword(usuario: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(`${API}user/cambiarPassword`, usuario, { headers })
      .subscribe(
        (response: any) => resolve(response),
        (error: any) => resolve(error.error)
      );
    });
  }
}
