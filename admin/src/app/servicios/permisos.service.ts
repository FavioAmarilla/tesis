import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PermisosService extends BaseService {

  recurso = 'permiso'
}
