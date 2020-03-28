import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'environments/environment';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { ServicioAlertas } from 'app/servicios/alertas.service';

let mapa,
  opciones: any,
  coordenadas: any = [],
  seleccionFinalizada,
  servicioAlerta: ServicioAlertas;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {

  @Input() coordenadas;
  @Output() seleccionFinalizada = new EventEmitter<any>();

  constructor(
    private servicioAlertas: ServicioAlertas
  ) {
    servicioAlerta = this.servicioAlertas;
  }

  ngOnInit() {
    seleccionFinalizada = this.seleccionFinalizada;
    coordenadas = (this.coordenadas) ? this.coordenadas.poligono.coordinates : [];
    // mapboxgl.accessToken = environment.mapbox.apiKey;
    Object.assign(mapboxgl, {
      accessToken: environment.mapbox.apiKey
    });
    mapa = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [Number(environment.mapbox.defaultCoords.lng), Number(environment.mapbox.defaultCoords.lat)],
      zoom: 15
    });

    this.opcionesEventos();
  }

  opcionesEventos() {
    opciones = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });

    mapa.addControl(opciones);

    mapa.on('load', this.dibujarPoligono);

    mapa.on('draw.create', this.actualizarArea);
    mapa.on('draw.delete', this.actualizarArea);
    mapa.on('draw.update', this.actualizarArea);
  }

  dibujarPoligono() {
    console.log('coordenadas: ', coordenadas);
    if (coordenadas.length) {
      opciones.set({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: coordenadas
          }
        }]
      });

      // mapa.addSource('maine', {
      //   'type': 'geojson',
      //   'data': {
      //     'type': 'Feature',
      //     'geometry': {
      //       'type': 'Polygon',
      //       'coordinates': coordenadas
      //     }
      //   }
      // });

      // mapa.addLayer({
      //   'id': 'maine',
      //   'type': 'fill',
      //   'source': 'maine',
      //   'layout': {},
      //   'paint': {
      //     'fill-color': '#079A4A',
      //     'fill-opacity': 0.2
      //   }
      // });
    }
  }

  actualizarArea(e) {
    if (e.type === 'draw.create') {
      const data = opciones.getAll();
      if (coordenadas.length == 0) {
        coordenadas = data.features[0].geometry.coordinates[0];
      } else {
        const index = data.features.length - 1;
        opciones.delete(data.features[index].id);
        servicioAlerta.dialogoError('Acción no permitida', 'Ya tienes una selección en curso');
      }
    } else if (e.type === 'draw.delete') {
      coordenadas = [];
    }
    seleccionFinalizada.emit(coordenadas);
  }

}
