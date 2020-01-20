import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  constructor(
    private http: HttpClient
  ) { }

  async getSucursal(id?) {
    const url = (id) ? `${API}/sucursal/show/${id}` : `${API}/sucursal`;
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

  async register(sucursal) {
    const json = JSON.stringify(sucursal);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.post(`${API}/sucursal`, params, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error);
        }
      );
    });
  }

  async update(sucursal, id) {
    const json = JSON.stringify(sucursal);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.put(`${API}/sucursal/update/${id}`, params, { headers: headers }).subscribe(
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
