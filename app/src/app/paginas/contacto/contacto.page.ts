import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

declare var mapboxgl: any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class PaginaContacto implements OnInit {

  public cargando = true;
  public longitud = environment.mapbox.defaultCoords.lng;
  public latitud = environment.mapbox.defaultCoords.lat;

  constructor() { }

  ngOnInit() {
    const tsthis = this;
    setTimeout(() => {
      tsthis.cargando = false;
    }, 2000);

    this.dibujarMapa();
  }

  dibujarMapa() {
    mapboxgl.accessToken = environment.mapbox.apiKey;
    const mapa = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.longitud, this.latitud],
      zoom: 14
    });

    const marker = new mapboxgl.Marker().setLngLat([this.longitud, this.latitud]).addTo(mapa);
    this.cargando = false;

    mapa.on('load', () => {
      mapa.resize();
    });
  }



}
