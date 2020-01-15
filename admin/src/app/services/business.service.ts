import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(
    private http: HttpClient
  ) {}

  getBusiness(id?) {
    const url = (id) ? `${API}/empresa/show/${id}` : `${API}/empresa`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(url, { headers });
  }

  register(empresa) {
    const json = JSON.stringify(empresa);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(`${API}/empresa`, params, { headers: headers });
  }

  update(empresa, id) {
    const json = JSON.stringify(empresa);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.put(`${API}/empresa/update/${id}`, params, { headers: headers });
  }
}
