import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { environment } from 'src/environments/environment';

import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { AlertaService } from 'src/app/servicios/alerta.service';

var mapa: any, marker, coordenadas;

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.page.html',
  styleUrls: ['./ubicacion.page.scss'],
})
export class UbicacionPage implements OnInit {

  public longitud = 0;
  public latitud = 0;
  public marker: any;
  @ViewChild('map', {static: true}) map;
  @Input() coordenadas;

  constructor(
    private modalCtrl: ModalController,
    private servicioAlerta: AlertaService
  ) { }

  ngOnInit() {
    if (this.coordenadas) {
      const { marcador, poligono } = this.coordenadas;
      coordenadas = { marcador: marcador.coordinates, poligono: poligono.coordinates };
    }

    const defaultCoords = [Number(environment.mapbox.defaultCoords.lng), Number(environment.mapbox.defaultCoords.lat)];
    const center = (coordenadas && coordenadas.marcador) ? coordenadas.marcador : defaultCoords;

    Object.assign(mapboxgl, {
      accessToken: environment.mapbox.apiKey
    });

    mapa = new mapboxgl.Map({
      container: this.map.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom: 13
    });

    mapa.on('click', this.agregarMarcador);
    mapa.on('load', this.dibujarAreaCobertura);
  }

  // mapbox - agrega el marcador
  agregarMarcador(e) {
    if (marker) { marker.remove(); }

    if (coordenadas && coordenadas.poligono.length) {
      const punto = turf.point([e.lngLat.lng, e.lngLat.lat]);
      const poligono = turf.polygon(coordenadas.poligono);
      const permitido = turf.booleanPointInPolygon(punto, poligono);

      if (permitido) {
        marker = new mapboxgl.Marker()
          .setLngLat(e.lngLat)
          .addTo(mapa);

        coordenadas.marcador = marker.getLngLat();
      } else { 
        this.servicioAlerta.dialogoError('La ubicacion no se encuentra dentro del area de cobertura','')
        coordenadas.marcador = null; 
      }

    } else { coordenadas.marcador = null; }
  }

  dibujarAreaCobertura(e) {
    if (coordenadas && coordenadas.poligono.length) {
      mapa.addSource('maine', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: coordenadas.poligono
          }
        }
      });

      mapa.addLayer({
        id: 'maine',
        type: 'fill',
        source: 'maine',
        layout: {},
        paint: {
          'fill-color': '#079A4A',
          'fill-opacity': 0.2
        }
      });
    }
  }

  cerrarModal() {
    this.modalCtrl.dismiss({
      coordenadas
    });
  }

  asignarCoordenadas() {
    this.cerrarModal();
  }

}
