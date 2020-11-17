import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { environment } from 'src/environments/environment';

import { AlertaService } from 'src/app/servicios/alerta.service';
import { GeneralService } from 'src/app/servicios/general.service';

declare var mapboxgl: any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class PaginaContacto implements OnInit {

  public angForm: FormGroup;
  public cargando = true;
  public longitud = environment.mapbox.defaultCoords.lng;
  public latitud = environment.mapbox.defaultCoords.lat;

  constructor(
    private formBuilder: FormBuilder,
    private servicioAlerta: AlertaService,
    private generalService: GeneralService,
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    const tsthis = this;
    setTimeout(() => {
      tsthis.cargando = false;
    }, 2000);

    this.dibujarMapa();
  }

  crearFormulario() {
    this.angForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      asunto: ['', Validators.required],
      mensaje: ['', Validators.required]
    });
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

  async contactar() {
    const response: any = this.generalService.contactar(this.angForm.value);

    if (response.success) {
      this.servicioAlerta.dialogoExito('Email enviado correctamente');
    } else {
      this.servicioAlerta.dialogoError('Ha ocurrido un problema por favor intentelo más tarde');
    }

    this.angForm.reset();
  }

}
