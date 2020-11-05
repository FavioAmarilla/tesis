import { Component, OnInit } from '@angular/core';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { PreguntasFrecuentesService } from 'src/app/servicios/preguntas-frecuentes.service';
import { PreguntaFrecuente } from '../../interfaces/interfaces';

@Component({
  selector: 'app-preguntas-frecuentes',
  templateUrl: './preguntas-frecuentes.page.html',
  styleUrls: ['./preguntas-frecuentes.page.scss'],
})
export class PreguntasFrecuentesPage implements OnInit {

  public cargando: boolean = false;
  public preguntas: PreguntaFrecuente;

  constructor(
    private preguntaService: PreguntasFrecuentesService,
    private servicioAlerta: AlertaService
  ) { }

  async ngOnInit() {
    await this.obtenerPreguntas();
  }

  async obtenerPreguntas() {
    const response: any = await this.preguntaService.obtenerPreguntas(null, null);
    if (response.success) {
      this.preguntas = response.data;
    } else {
      this.servicioAlerta.dialogoError(response.message);
    }

    this.cargando = false;
  }
}
