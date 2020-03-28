import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit, Output, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';

import { environment } from '../../environments/environment';
import { Usuario } from '../interfaces/interfaces';
import { Router } from '@angular/router';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = null;
  private user: Usuario = null;

  @Output() emitter = new EventEmitter();

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router
  ) { }

  async registro(usuario: Usuario) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(`${API}user`, usuario, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  async iniciarSession(usuario: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(`${API}user/signIn`, usuario, { headers })
        .subscribe(
          async (response: any) => {
            if (response.success) {
              // se guarda el token en el Storage
              await this.guardarToken(response.data);
              this.emitter.emit(this.user);
              resolve({ success: true });
            } else {
              this.token = null;
              this.storage.remove('token');
              resolve({ success: false, error: response });
            }
          }
        );
    });
  }

  async obtenerUsuario() {
    if (!this.user) { this.validarToken(); }
    return { ...this.user };
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

    let data = {
      'Authorization': this.token
    };

    return new Promise<boolean>(resolve => {
      const headers = new HttpHeaders().set('Content-Type', 'application/json')
      this.http.post(`${API}user/checkToken`, data, { headers })
        .subscribe(
          (response: any) => {
            if (response.success) {
              this.user = response.data;
              resolve(true);
            } else {
              resolve(false);
            }
          }
        );
    });
  }

  async cerrarSession() {
    this.token = null;
    this.storage.remove('token');
    this.router.navigate(['/inicio']);
  }
}
