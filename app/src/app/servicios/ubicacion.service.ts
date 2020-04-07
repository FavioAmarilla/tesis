import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ServicioUbicacion {

  constructor(
    private http: HttpClient
  ) { }

  validarUbicacion(ciudad, coordenadas) {
    const url = `${API}ciudad/${ciudad}/verificarZona`;
    return new Promise(resolve => {
      this.http.post(url, {coordenadas}, {})
      .subscribe(
        (response: any) => {
          return resolve(response.success);
        },
        (error: any) => {
          console.log('Error: ', error);
          return resolve(false);
        }
      )
    });
  }
}
