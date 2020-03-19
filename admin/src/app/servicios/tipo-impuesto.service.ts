import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ServicioTipoImpuesto {

  constructor(
    private http: HttpClient
  ) { }

  async obtenerImpuesto(id?, parametros?) {
    const url = (id) ? `${API}/tipoImpuesto/${id}` : `${API}/tipoImpuesto`;

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

  async registrar(tipoImpuesto) {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.post(`${API}/tipoImpuesto`, tipoImpuesto, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }

  async actualizar(tipoImpuesto, id) {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.put(`${API}/tipoImpuesto/${id}`, tipoImpuesto, { headers: headers }).subscribe(
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
