import { Component, OnInit } from '@angular/core';
import { BusinessService } from '../../services/business.service';
import { Business } from 'app/models/business';
import { environment } from 'environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';

const API = environment.api;

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {

  public url: string;
  public form = false;
  public action: string = '';
  public business: Business;
  public businesses: Business;

  public fileUploaderConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.jpeg,.gif",
    maxSize: "50",
    uploadAPI:  {
      url: `${API}/empresa/upload`
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: "Seleccionar imagen"
  };

  constructor(
    private businessService: BusinessService,
    private formBuilder: FormBuilder
  ) { 
    this.url = environment.api; 
  }

  ngOnInit() {
    this.getBusinesses();
  }

  viewForm(flag, action) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.business = new Business(null, null, null, null, null);
    }
  }

  getBusinesses() {
    this.businessService.getBusiness().subscribe(
      (response: any) => {
        if (response.status) {
          this.businesses = response.data;
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  getBusiness(id) {
    this.businessService.getBusiness(id).subscribe(
      (response: any) => {
        if (response.status) {
          this.business = response.data;
          this.viewForm(true, 'UPD');
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  register() {
    this.businessService.register(this.business).subscribe(
      (response: any) => {
        console.log('register: ', response);
        if (response.status) {
          this.getBusinesses();
        } else {

        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

  update() {
    console.log(this.business);

    this.businessService.update(this.business, this.business.identificador).subscribe(
      (response: any) => {
        console.log('update: ', response);
        if (response.status) {
          this.getBusinesses();
        } else {

        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

  uploadImage(event){
    console.log(event.response);
    let data = JSON.parse(event.response);
    this.business.imagen = data.data;
  }

}
