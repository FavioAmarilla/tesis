import { Component, OnInit } from '@angular/core';
import { SlidesService } from '../../services/slides.service';
import { Slides } from '../../models/slides';
import { environment } from 'environments/environment';
import swal from'sweetalert2';

const API = environment.api;

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss']
})
export class SlidesComponent implements OnInit {

  public url: string;
  public form = false;
  public action: string = '';
  public slide: Slides;
  public listaSlide: Slides;
  public cargando: boolean = false;
  public errors = [];

  public fileUploaderConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.jpeg,.gif",
    maxSize: "50",
    uploadAPI:  {
      url: `${API}/slide/upload`
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: "Seleccionar imagen"
  };
  public slides: Slides;

  constructor(
    private slidesService: SlidesService
  ) {
    this.url = environment.api; 
  }

  ngOnInit() {
    this.getSlides();
  }

  viewForm(flag, action, limpiarError?) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.slide = new Slides(null, null, null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async getSlides() {
    this.listaSlide = null;
    this.action = "LST";
    this.cargando = true;
    this.errors = [];

    var response = <any>await this.slidesService.getSlide();
    
    if (response.status) {
      this.listaSlide = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async getSlide(id) {
    this.action = "LST";
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.slidesService.getSlide(id);
    
    if (response.status) {
      this.slide = response.data;
      this.viewForm(true, 'UPD');
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
    this.cargando = false;
  }

  async register() {
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.slidesService.register(this.slide);
    
    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getSlides();
          this.viewForm(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
      this.viewForm(true, 'INS');
    }
  }

  async update() {
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.slidesService.update(this.slide, this.slide.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getSlides();
          this.viewForm(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
      this.viewForm(true, 'UPD');
    }
  }

  async delete(id) {
    this.action = "LST";
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.slidesService.delete(id);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getSlides();
          this.viewForm(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }
  }

  // delete(id) {
  //   this.slidesService.delete(id).subscribe(
  //     (response: any) => {
  //       if (response.status) {
  //         this.getSlides();
  //       } else {

  //       }
  //     },
  //     error => {
  //       console.log('Error: ', error);
  //     }
  //   );
  // }

  uploadImage(event){
    let data = JSON.parse(event.response);
    this.slide.archivo_img = data.data;
  }

}
