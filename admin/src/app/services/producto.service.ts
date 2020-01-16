import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    private http: HttpClient
  ) { }

  getProducto(id?) {
    const url = (id) ? `${API}/producto/getProducto/${id}` : `${API}/producto`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(url, { headers });
  }

  register(producto) {
    const json = JSON.stringify(producto);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(`${API}/producto`, params, { headers: headers });
  }

  update(producto, id) {
    const json = JSON.stringify(producto);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.put(`${API}/producto/update/${id}`, params, { headers: headers });
  }
}
