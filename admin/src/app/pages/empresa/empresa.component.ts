import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from 'app/models/empresa';
import { environment } from 'environments/environment';
import swal from'sweetalert2';

const API = environment.api; 

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {

  public cargando: boolean = false;
  public url: string;
  public form = false;
  public action: string = '';
  public empresa: Empresa;
  public listaEmpresas: Empresa;
  public errors = [];

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
    attachPinText: "Seleccionar"
  };

  constructor(
    private empresaService: EmpresaService
  ) { 
    this.url = environment.api; 
  }

  ngOnInit() {
    this.getEmpresas();
  }

  viewForm(flag, action, limpiarError?) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.empresa = new Empresa(null, null, null, null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async getEmpresas() {
    this.listaEmpresas = null;
    this.action = "LST";
    this.cargando = true;
    this.errors = [];

    var response = <any>await this.empresaService.getEmpresa();

    if (response.status) {
      this.listaEmpresas = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async getEmpresa(id) {
    this.action = "LST";
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.empresaService.getEmpresa(id);
    
    if (response.status) {
      this.empresa = response.data;
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
    var response = <any>await this.empresaService.register(this.empresa);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getEmpresas();
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
    var response = <any>await this.empresaService.update(this.empresa, this.empresa.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getEmpresas();
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

  uploadImage(event){
    let data = JSON.parse(event.response);
    this.empresa.imagen = data.data;
  }

}
