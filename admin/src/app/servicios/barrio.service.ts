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
}
