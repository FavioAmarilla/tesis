import { Component, OnInit } from '@angular/core';
import { ServicioCarrusel } from '../../servicios/carrusel.service';
import { Carrusel } from '../../modelos/carrusel';
import { environment } from 'environments/environment';
import swal from'sweetalert2';

const API = environment.api;

@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.scss']
})
export class CarruselComponent implements OnInit {

  public url: string;
  public form = false;
  public accion: string = '';
  public slide: Carrusel;
  public listaSlide: Carrusel;
  public cargando: boolean = false;
  public errores = [];

  public fileUploaderConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png,.jpeg,.gif',
    maxSize: '50',
    uploadAPI:  {
      url: `${API}/slide/upload`
    },
    theme: 'attachPin',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Seleccionar imagen'
  };
  public carrusel: Carrusel;

  constructor(
    private servicioCarrusel: ServicioCarrusel
  ) {
    this.url = environment.api;
  }

  ngOnInit() {
    this.obtenerCarruseles();
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.slide = new Carrusel(null, null, null, null);
    }
    if (limpiarError) {
      this.errores = [];
    }
  }

  async obtenerCarruseles() {
    this.listaSlide = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errores = [];

    const response = <any> await this.servicioCarrusel.obtenerCarrusel();

    if (response.status) {
      this.listaSlide = response.data;
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async obtenerCarrusel(id) {
    this.accion = 'LST';
    this.cargando = true;

    this.errores = [];
    const response = <any> await this.servicioCarrusel.obtenerCarrusel(id);

    if (response.status) {
      this.slide = response.data;
      this.mostrarFormulario(true, 'UPD');
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;

    this.errores = [];
    const response = <any> await this.servicioCarrusel.registrar(this.slide);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.obtenerCarruseles();
          this.mostrarFormulario(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
      this.mostrarFormulario(true, 'INS');
    }
  }

  async actualizar() {
    this.cargando = true;

    this.errores = [];
    const response = <any> await this.servicioCarrusel.actualizar(this.slide, this.slide.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.obtenerCarruseles();
          this.mostrarFormulario(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
      this.mostrarFormulario(true, 'UPD');
    }
  }

  async eliminar(id) {
    this.accion = 'LST';
    this.cargando = true;

    this.errores = [];
    const response = <any> await this.servicioCarrusel.eliminar(id);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.obtenerCarruseles();
          this.mostrarFormulario(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
    }
  }

  // delete(id) {
  //   this.servicioCarrusel.delete(id).subscribe(
  //     (response: any) => {
  //       if (response.status) {
  //         this.obtenerCarruseles();
  //       } else {

  //       }
  //     },
  //     error => {
  //       console.log('Error: ', error);
  //     }
  //   );
  // }

  subirImagen(event) {
    const data = JSON.parse(event.response);
    this.slide.archivo_img = data.data;
  }

}
