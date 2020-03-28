import { Component, OnInit } from '@angular/core';

declare var mapboxgl: any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class PaginaContacto implements OnInit {

  public cargando = true;
  public longitud = -25.403561;
  public latitud = -57.284329;

  constructor() { }

  ngOnInit() {
    const tsthis = this;
    setTimeout(() => {
      tsthis.cargando = false;
    }, 2000);

    this.dibujarMapa();
  }

  dibujarMapa() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmF2aW9hbWFyaWxsYSIsImEiOiJjazd1dGJjMXEwM210M2ZwaDN3bzAwc3cxIn0.hFQSvmuxyr_rtRbzPvJdvA';
    const mapa = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.latitud, this.longitud],
      zoom: 14
    });

    const marker = new mapboxgl.Marker().setLngLat([this.latitud, this.longitud]).addTo(mapa);
    this.cargando = false;
  }



}
