import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BaseService } from './base.service';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ServicioCarrusel extends BaseService {

  recurso = 'slide';

}
