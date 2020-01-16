import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from 'app/models/empresa';
import { environment } from 'environments/environment';

const API = environment.api;

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {

  public url: string;
  public form = false;
  public action: string = '';
  public empresa: Empresa;
  public listaEmpresas: Empresa;

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
    private empresaService: EmpresaService
  ) { 
    this.url = environment.api; 
  }

  ngOnInit() {
    this.getEmpresas();
  }

  mostrarFormulario(flag, action) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.empresa = new Empresa(null, null, null, null, null);
    }
  }

  getEmpresas() {
    this.empresaService.getEmpresa().subscribe(
      (response: any) => {
        if (response.status) {
          this.listaEmpresas = response.data;
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  getEmpresa(id) {
    this.empresaService.getEmpresa(id).subscribe(
      (response: any) => {
        if (response.status) {
          this.empresa = response.data;
          this.mostrarFormulario(true, 'UPD');
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  register() {
    this.empresaService.register(this.empresa).subscribe(
      (response: any) => {
        if (response.status) {
          this.getEmpresas();
        } else {

        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

  update() {
    this.empresaService.update(this.empresa, this.empresa.identificador).subscribe(
      (response: any) => {
        if (response.status) {
          this.getEmpresas();
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
    this.empresa.imagen = data.data;
  }

}
