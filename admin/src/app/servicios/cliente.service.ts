import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService  extends BaseService {

  recurso = 'cliente';

}