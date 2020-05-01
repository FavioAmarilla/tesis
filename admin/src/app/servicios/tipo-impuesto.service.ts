import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BaseService } from './base.service';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class ServicioTipoImpuesto extends BaseService {

  recurso = 'tipoImpuesto';

}