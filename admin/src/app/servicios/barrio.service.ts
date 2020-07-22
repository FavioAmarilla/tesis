import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BaseService } from './base.service';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ServicioBarrio extends BaseService {

  recurso = 'barrio';

  public async registrar(data) {
    this.token = await this.servicioUsuario.obtenerToken();
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(`${API}/${this.recurso}`, data, { headers: headers }).subscribe(
        (response: any) => {
          resolve(response);
        },
        error => {
          resolve(error.error);
        }
      );
    });
  }
}
