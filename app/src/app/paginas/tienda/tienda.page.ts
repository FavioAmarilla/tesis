import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.page.html',
  styleUrls: ['./tienda.page.scss'],
})
export class PaginaTienda implements OnInit {

  public cargando = true;

  constructor() { }

  ngOnInit() {
    const tsthis = this;
    setTimeout(() => {
      tsthis.cargando = false;
    }, 2000);
  }

}
