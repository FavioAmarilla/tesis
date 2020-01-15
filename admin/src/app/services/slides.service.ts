import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class SlidesService {

  constructor(
    private http: HttpClient
  ) {}

  getSlides(id?) {
    const url = (id) ? `${API}/slide/show/${id}` : `${API}/slide`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(url, { headers });
  }

  register(impuesto) {
    const json = JSON.stringify(impuesto);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(`${API}/slide`, params, { headers: headers });
  }

  update(impuesto, id) {
    const json = JSON.stringify(impuesto);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.put(`${API}/slide/update/${id}`, params, { headers: headers });
  }

  delete(id) {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.delete(`${API}/slide/delete/${id}`, {headers: headers});
  }
}
