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

  async getUsuario(id?, parametros?) {
    const url = (id) ? `user/${id}` : `user`;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const params = new HttpParams({ fromObject: parametros });

    return new Promise(resolve => {
      this.http.get(`${API}${url}`, { headers, params }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }

  async registro(usuario: Usuario) {
    return new Promise(resolve => {
      this.http.post(`${API}user`, usuario)
      .subscribe(
        (response: any) => resolve(response),
        (error: any) => resolve(error.error)
      );
    });
  }

  async actualizar(usuario: Usuario, id: any) {
    return new Promise(resolve => {
      this.http.put(`${API}user/${id}`, usuario)
      .subscribe(
        (response: any) => resolve(response),
        (error: any) => resolve(error.error)
      );
    });
  }

  iniciarSession(usuario: any) {
    return new Promise(resolve => {
      this.http.post(`${API}user/signIn`, usuario)
      .subscribe(
        async (response: any) => {
          if (response.success) {

            // se guarda el token en el Storage
            await this.guardarToken(response.data);

            // se valida el token y que tenga el rol nulo
            // rol nulo = usuario cliente
            const valido = await this.validarToken();
            if (!valido) {
              this.token = null;
              this.usuario = null;
              this.storage.remove('token');
            }

            this.loginEmitter.emit(this.usuario);
            resolve({ success: valido });
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
    return (this.usuario) ? { ...this.usuario } : null;
  }

  async cargarToken() {
    this.token = await this.storage.get('token') || null;
  }

  async guardarToken(token: string) {
    this.token = token;
    await this.storage.set('token', token);
  }

  async validarToken(): Promise<boolean> {
    await this.cargarToken();
    if (!this.token) {
      return Promise.resolve(false);
    }

    return new Promise<boolean>(resolve => {
      this.http.post(`${API}user/checkToken`, {})
      .subscribe(
        (response: any) => {
          if (response.success) {
            this.usuario = response.data.usuario;
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (error) => resolve(false)
      );
    });
  }

  async obtenerTarjetas() {
    return new Promise<boolean>(resolve => {
      this.http.post(`${API}user/${this.usuario.identificador}/tarjetas`, {})
      .subscribe(
        (response: any) => {
          resolve(response);
        },
        (error) => resolve(error)
      );
    });
  }

  async eliminarTarjeta(cardId) {
    return new Promise<boolean>(resolve => {
      this.http.delete(`${API}user/${this.usuario.identificador}/tarjeta/${cardId}`)
      .subscribe(
        (response: any) => {
          resolve(response);
        },
        (error) => resolve(error)
      );
    });
  }

  recuperarContrasenha(form) {
    return new Promise(resolve => {
      this.http.post(`${API}contrasenha/crear-token`, form)
      .subscribe(
        (response: any) => resolve(response),
        (error: any) => resolve(error.error)
      );
    });
  }

  buscarTokenContrasenha(token) {
    return new Promise(resolve => {
      this.http.get(`${API}contrasenha/buscar-token/${token}`)
      .subscribe(
        (response: any) => resolve(response),
        (error: any) => resolve(error.error)
      );
    });
  }

  reestablecerContrasenha(form) {
    return new Promise(resolve => {
      this.http.post(`${API}contrasenha/reestablecer`, form)
      .subscribe(
        (response: any) => resolve(response),
        (error: any) => resolve(error.error)
      );
    });
  }

  cerrarSession() {
    this.token = null;
    this.usuario = null;
    this.storage.remove('token');
    this.logoutEmitter.emit(true);
    this.router.navigate(['/']);
  }

  cambiarPassword(usuario: any) {
    return new Promise(resolve => {
      this.http.post(`${API}user/cambiarPassword`, usuario)
      .subscribe(
        (response: any) => resolve(response),
        (error: any) => resolve(error.error)
      );
    });
  }
}
