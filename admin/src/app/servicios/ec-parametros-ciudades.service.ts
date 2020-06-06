import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class EcParametrosCiudadesService extends BaseService {

  recurso = 'ecParamCiudad';

}
