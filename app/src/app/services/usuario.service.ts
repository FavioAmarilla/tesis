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

  registro(usuario: Usuario) {
    const json = JSON.stringify(usuario);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(`${API}user`, params, {headers});
  }

  login(usuario: any) {
    const json = JSON.stringify(usuario);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.post(`${API}user/signIn`, params, {headers})
      .subscribe(
        async (response: any) => {
          if (response.status) {
            // se guarda el token en el Storage
            await this.saveToken(response.data);
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

  getUsuario() {
    if (!this.user) { this.validateToken(); }
    return { ...this.user };
  }

  async loadToken() {
    this.token = await this.storage.get('token') || null;
  }

  async saveToken(token: string) {
    this.token = token;
    await this.storage.set('token', token);
    await this.validateToken();
  }

  async validateToken(): Promise<boolean> {
    await this.loadToken();
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

  logout() {
    this.token = null;
    this.storage.remove('token');
    this.router.navigate(['/home']);
  }
}
