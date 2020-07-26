import { Injectable, RendererFactory2, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    private http: HttpClient,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: any
  ) { }

  public obtenerMenuItems() {
    return this.http.get<any>('/assets/menu.json');
  }

  public unidadMedida(medida, tipo = 'medida') {
    let valor = 1;
    let minimo = 1;

    switch (medida) {
      case 'UN':
      case 'LI':
        break;
      case 'KG':
        valor = 0.25;
        minimo = 0.25;
        break;
      case 'ME':
        valor = 0.5;
        minimo = 0.5;
        break;
    }

    return (tipo === 'ambos') ? {minimo, valor} : (tipo === 'medida') ? valor : minimo;
  }

  public agregarScriptBancard() {
    return new Promise(resolve => {
      const bancard = environment.bancard;
      const prodMode = bancard.prodMode;
      const api = (prodMode) ? bancard.production : bancard.staging;

      const scriptElm = document.querySelector('#bancard-checkout-js');
      if (scriptElm) { return resolve(); }

      const renderer = this.rendererFactory.createRenderer(null, null);
      const script = renderer.createElement('script');
      renderer.setAttribute(script, 'id', 'bancard-checkout-js');
      renderer.setAttribute(script, 'src', `${api}/checkout/javascript/dist/bancard-checkout-2.0.0.js`);

      renderer.appendChild(this.document.body, script);

      return resolve();
    });
  }

  public promiseTimeout(time) {
    return new Promise(resolve => {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        return resolve();
      }, time);
    });
  }
}
