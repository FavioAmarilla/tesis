import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var mapboxgl: any;

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.page.html',
  styleUrls: ['./ubicacion.page.scss'],
})
export class UbicacionPage implements OnInit {

  public longitud = 0;
  public latitud = 0;
  public marker: any;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  async cerrarModal() {
    await this.modalCtrl.dismiss({
      latitud: this.latitud,
      longitud: this.longitud
    });
  }

  async obtenerMarker(position: any) {
    const lat = position.coords.lat;
    const lng = position.coords.lng;

    this.marker = [{ latitude: lat, longitude: lng }];
    this.latitud = lat;
    this.longitud = lng;
  }



}
