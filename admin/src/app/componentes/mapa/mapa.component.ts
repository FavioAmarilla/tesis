import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';

let opciones: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // mapboxgl.accessToken = environment.mapbox.apiKey;
    Object.assign(mapboxgl, {
      accessToken: environment.mapbox.apiKey
    });
    const mapa = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [Number(environment.mapbox.defaultCoords.lng), Number(environment.mapbox.defaultCoords.lat)],
      zoom: 15
    });

    // this.dibujarPoligono(mapa);
  }

  // dibujarPoligono(mapa) {
  //   opciones = new MapboxDraw({
  //     displayControlsDefault: false,
  //     controls: {
  //       polygon: true,
  //       trash: true
  //     }
  //   });
  //   mapa.addControl(opciones);

  //   mapa.on('draw.create', this.actualizarArea);
  //   mapa.on('draw.delete', this.actualizarArea);
  //   mapa.on('draw.update', this.actualizarArea);
  // }

  // actualizarArea(e) {
  //   const data = opciones.getAll();
  //   if (data.features.length > 0) {
  //     const area = turf.area(data);
  //     // restrict to area to 2 decimal points
  //     const rounded_area = Math.round(area * 100) / 100;
  //     console.log('rounded_area: ', rounded_area);
  //   } else {
  //     answer.innerHTML = '';
  //     if (e.type !== 'draw.delete') alert('Use the draw tools to draw a polygon!');
  //   }
  // }

}
