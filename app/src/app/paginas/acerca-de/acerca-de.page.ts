import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.page.html',
  styleUrls: ['./acerca-de.page.scss'],
})
export class PaginaAcercaDe implements OnInit {

  public cargando = true;

  constructor() { 
    this.cargando = false;
  }

  ngOnInit() {
    const tsthis = this;
    setTimeout(() => {
      tsthis.cargando = false;
    }, 2000);
  }

}
