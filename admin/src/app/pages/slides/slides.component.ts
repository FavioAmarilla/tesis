import { Component, OnInit } from '@angular/core';
import { SlidesService } from '../../services/slides.service';
import { Slides } from '../../models/slides';
import { environment } from 'environments/environment';

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

  viewForm(flag, action) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.slide = new Slides(null, null, null, null);
    }
  }

  getSlides() {
    this.slidesService.getSlides().subscribe(
      (response: any) => {
        if (response.status) {
          this.slides = response.data;
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  getSlide(id) {
    this.slidesService.getSlides(id).subscribe(
      (response: any) => {
        if (response.status) {
          this.slide = response.data;
          this.viewForm(true, 'UPD');
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  register() {
    this.slidesService.register(this.slide).subscribe(
      (response: any) => {
        if (response.status) {
          this.getSlides();
        } else {

        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

  update() {
    this.slidesService.update(this.slide, this.slide.identificador).subscribe(
      (response: any) => {
        if (response.status) {
          this.getSlides();
        } else {

        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

  delete(id) {
    this.slidesService.delete(id).subscribe(
      (response: any) => {
        if (response.status) {
          this.getSlides();
        } else {

        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

  uploadImage(event){
    let data = JSON.parse(event.response);
    this.slide.archivo_img = data.data;
  }

}
