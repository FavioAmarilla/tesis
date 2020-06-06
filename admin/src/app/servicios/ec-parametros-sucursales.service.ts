import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class EcParametrosSucursalesService  extends BaseService {

  recurso = 'ecParamSucursal';

}

