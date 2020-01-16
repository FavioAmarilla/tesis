import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ServicioLineasProducto {

  constructor(
    private http: HttpClient
  ) { }

  obtenerLineas() {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(`${API}lineaProducto`, {headers});
  }
}
