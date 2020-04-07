import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from 'environments/environment';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { ServicioAlertas } from 'app/servicios/alertas.service';

let mapa,
  opciones: any,
  marcador: any,
  coordenadas: any = {
    marcador: {},
    poligono: []
  },
  agregarMarcador: any,
  seleccionFinalizada,
  servicioAlerta: ServicioAlertas;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {

  @Input() poligono;
  @Input() coordenadas;
  @Output() seleccionFinalizada = new EventEmitter<any>();

  constructor(
    private servicioAlertas: ServicioAlertas
  ) {
    servicioAlerta = this.servicioAlertas;
  }

  ngOnInit() {
    const defaultCoords = [Number(environment.mapbox.defaultCoords.lng), Number(environment.mapbox.defaultCoords.lat)];

    agregarMarcador = this.agregarMarcador;
    seleccionFinalizada = this.seleccionFinalizada;

    const aux = this.coordenadas;
    coordenadas.marcador = (aux && aux.marcador) ? aux.marcador.coordinates : defaultCoords;
    coordenadas.poligono = (aux && aux.poligono) ? aux.poligono.coordinates[0] : [];

    // mapboxgl.accessToken = environment.mapbox.apiKey;
    Object.assign(mapboxgl, {
      accessToken: environment.mapbox.apiKey
    });

    mapa = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordenadas.marcador,
      zoom: 13
    });

    this.opcionesEventos();

    if (coordenadas.marcador) {
      this.agregarMarcador(coordenadas.marcador);
    }
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

    mapa.on('click', this.obtenerCoodenadas);

    mapa.on('draw.create', this.actualizarArea);
    mapa.on('draw.delete', this.actualizarArea);
    mapa.on('draw.update', this.actualizarArea);
  }

  dibujarPoligono() {
    if (coordenadas.poligono.length) {
      opciones.set({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [coordenadas.poligono]
          }
        }]
      });
    }
  }

  obtenerCoodenadas(e) {
    agregarMarcador(e.lngLat);
  }

  agregarMarcador(lngLat) {
    if (marcador) { marcador.remove(); }

    marcador = new mapboxgl.Marker()
      .setLngLat(lngLat)
      .addTo(mapa);

    coordenadas.marcador = marcador.getLngLat();
    seleccionFinalizada.emit(coordenadas);
  }

  actualizarArea(e) {
    const data = opciones.getAll();
    switch (e.type) {
      case 'draw.create':
        if (coordenadas.poligono.length === 0) {
          coordenadas.poligono = data.features[0].geometry.coordinates[0];
        } else {
          const index = data.features.length - 1;
          opciones.delete(data.features[index].id);
          servicioAlerta.dialogoError('Acción no permitida', 'Ya tienes una selección en curso');
        }
        break;
      case 'draw.update':
        coordenadas.poligono = data.features[0].geometry.coordinates[0];
        break;
      default:
        coordenadas.poligono = [];
        break;
    }

    seleccionFinalizada.emit(coordenadas);
  }

}
