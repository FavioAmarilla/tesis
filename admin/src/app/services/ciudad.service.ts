import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  constructor(
    private http: HttpClient
  ) { }

  getCiudad(id?) {
    const url = (id) ? `${API}/ciudad/show/${id}` : `${API}/ciudad`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(url, { headers });
  }

  register(ciudad) {
    const json = JSON.stringify(ciudad);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(`${API}/ciudad`, params, { headers: headers });
  }

  update(ciudad, id) {
    const json = JSON.stringify(ciudad);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.put(`${API}/ciudad/update/${id}`, params, { headers: headers });
  }
}
