import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService extends BaseService {

  recurso = 'comprobante'
}
