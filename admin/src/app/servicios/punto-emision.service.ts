import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API = environment.api;
@Injectable({
  providedIn: 'root'
})
export class ServicioPuntoEmision {

  constructor(
    private http: HttpClient
  ) { }

  async obtenerPuntoEmision(id?, pagina?) {
    let url = (id) ? `${API}/puntoEmision/${id}` : `${API}/puntoEmision`;
    url = (pagina) ? `${url}?page=${pagina}` : url;
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

  async registrar(puntoEmision) {
    const json = JSON.stringify(puntoEmision);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.post(`${API}/puntoEmision`, params, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }

  async actualizar(puntoEmision, id) {
    const json = JSON.stringify(puntoEmision);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.put(`${API}/puntoEmision/update/${id}`, params, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }

}
