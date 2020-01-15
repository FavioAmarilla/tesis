import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class TipoImpuestoService {

  constructor(
    private http: HttpClient
  ) { }

  getTipoImpuesto(id?) {
    const url = (id) ? `${API}/tipoImpuesto/show/${id}` : `${API}/tipoImpuesto`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(url, {headers});
  }

  register(impuesto) {
    const json = JSON.stringify(impuesto);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(`${API}/tipoImpuesto`, params, {headers: headers});
  }

  update(impuesto, id) {
    const json = JSON.stringify(impuesto);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.put(`${API}/tipoImpuesto/update/${id}`, params, {headers: headers});
  }

}
