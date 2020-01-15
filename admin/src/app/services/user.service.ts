import { Injectable, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'app/models/user';
import { Router } from '@angular/router';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  @Output() loginEmitter = new EventEmitter();
  @Output() logoutEmitter = new EventEmitter();

  token: string = null;
  private user: User = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(usuario: any) {
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
            await this.saveToken(response.data);
            // se manda el usuario mediate el emmiter
            this.loginEmitter.emit(this.user);
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

  signIn(user: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(`${API}/user`, {headers});
  }

  register(user: any) {
    const json = JSON.stringify(user);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(`${API}/user`, params, { headers });
  }

  update(user: any, id) {
    const json = JSON.stringify(user);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.put(`${API}/user/update/${id}`, params, { headers });
  }

  getUser() {
    if (!this.user) { this.validateToken(); }
    return (this.user) ? { ...this.user } : null;
  }

  getUsers(id?) {
    const url = (id) ? `${API}/user/show/${id}` : `${API}/user`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(url, { headers });
  }

  async loadToken() {
    this.token = await localStorage.getItem('user-admin-token') || null;
  }

  async saveToken(token: string) {
    this.token = token;
    await localStorage.setItem('user-admin-token', token);
    await this.validateToken();
  }

  async validateToken(): Promise<boolean> {
    await this.loadToken();
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
    this.user = null;
    localStorage.removeItem('user-admin-token');
    this.logoutEmitter.emit(true);
    this.router.navigate(['/login']);
  }


}
