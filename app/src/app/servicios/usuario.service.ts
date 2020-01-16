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
export class ServicioUsuario {

  token: string = null;
  private user: Usuario = null;

  @Output() emitter = new EventEmitter();

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router
  ) { }

  registro(usuario: Usuario) {
    const json = JSON.stringify(usuario);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(`${API}user`, params, {headers});
  }

  iniciarSession(usuario: any) {
    const json = JSON.stringify(usuario);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.post(`${API}user/signIn`, params, {headers})
      .subscribe(
        async (response: any) => {
          if (response.status) {
            // se guarda el token en el Storage
            await this.guardarToken(response.data);
            this.emitter.emit(this.user);
            resolve({success: true});
          } else {
            this.token = null;
            this.storage.remove('token');
            resolve({success: false, error: response});
          }
        }
      );
    });
  }

  obtenerUsuario() {
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
      // this.router.navigate(['/login']);
      return Promise.resolve(false);
    }

    return new Promise<boolean>(resolve => {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').append('Authorization', this.token);
      this.http.post(`${API}user/checkToken`, {}, {headers})
      .subscribe(
        (response: any) => {
          if (response.status) {
            this.user = response.data;
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
    this.storage.remove('token');
    this.router.navigate(['/inicio']);
  }
}
