import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ServicioProducto {

  constructor(
    private http: HttpClient
  ) { }

  obtenerProductos() {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(`${API}producto`, {headers});
  }

  obtenerProducto(id) {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(`${API}producto/${id}`, {headers});
  }

}
