import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ServicioEmpresa {

  constructor(
    private http: HttpClient
  ) { }

  async obtenerEmpresa(id?, pagina?, filtros?) {
    let url = (id) ? `${API}/empresa/${id}` : `${API}/empresa`;
    url = (pagina) ? `${url}?page=${pagina}` : url;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let params = new HttpParams();
    for (let key in filtros) {
      params.append(key, filtros[key]);
    }

    let options = {
      params
    }

    return new Promise(resolve => {
      this.http.get(url, options).subscribe(
        (response: any) => {
          console.log('empresa:', response);
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }

  async registrar(empresa) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(`${API}/empresa`, empresa, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }

  async actualizar(empresa, id) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.put(`${API}/empresa/${id}`, empresa, { headers: headers }).subscribe(
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
