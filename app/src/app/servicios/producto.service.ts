import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    private http: HttpClient
  ) { }

  async obtenerProducto(slug?, parametros?) {
    const url = (slug) ? `producto/slug/${slug}` : `producto`;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const params = new HttpParams({ fromObject: parametros });

    return new Promise(resolve => {
      this.http.get(`${API}${url}`, { headers, params }).subscribe(
        response => resolve(response),
        error => resolve(error.error)
      );
    });
  }

  async obtenerProductoRelacionados(id, parametros?) {
    const url = `producto/${id}/relacionados`;
    const params = new HttpParams({ fromObject: parametros });

    return new Promise(resolve => {
      this.http.get(`${API}${url}`, { params }).subscribe(
        response => resolve(response),
        error => resolve(error.error)
      );
    });
  }

  async shop(slug?, parametros?) {
    const url = (slug) ? `producto/slug/${slug}` : `producto`;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const params = new HttpParams({ fromObject: parametros });

    return new Promise(resolve => {
      this.http.get(`${API}${url}`, { headers, params }).subscribe(
        response => resolve(response),
        error => resolve(error.error)
      );
    });
  }

  async shopHome(slug?, parametros?) {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const params = new HttpParams({ fromObject: parametros });

    return new Promise(resolve => {
      this.http.get(`${API}shop/home`, { headers, params }).subscribe(
        response => resolve(response),
        error => resolve(error.error)
      );
    });
  }

}
