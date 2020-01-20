import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { environment } from 'environments/environment';
import swal from'sweetalert2';

const API = environment.api;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public url: string;
  public form = false;
  public action: string = '';
  public usuario: User;
  public listaUsuario: User;
  public cargando: boolean = false;
  public errors = [];

  public fileUploaderConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.jpeg,.gif",
    maxSize: "50",
    uploadAPI:  {
      url: `${API}/user/upload`
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: "Seleccionar imagen"
  };

  constructor(
    private usuarioService: UserService
  ) {
    this.url = environment.api; 
  }

  ngOnInit() {
    this.getUsuarios();
  }

  viewForm(flag, action, limpiarError?) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.usuario = new User(null, null, null, null, null);
    }
    if (limpiarError) {
      this.errors = [];
    }
  }

  async getUsuarios() {
    this.listaUsuario = null;
    this.action = "LST";
    this.cargando = true;
    this.errors = [];

    var response = <any>await this.usuarioService.getUsuario();
    
    if (response.status) {
      this.listaUsuario = response.data;
    } else {
      for (const i in response.data) {
        this.errors.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async getUsuario(id) {
    this.action = "LST";
    this.cargando = true;

    this.errors = [];
    var response = <any>await this.usuarioService.getUsuario(id);
    
    if (response.status) {
      this.usuario = response.data;
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
    var response = <any>await this.usuarioService.register(this.usuario);
    
    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getUsuarios();
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
    var response = <any>await this.usuarioService.update(this.usuario, this.usuario.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.getUsuarios();
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
    console.log(event.response);
    let data = JSON.parse(event.response);
    this.usuario.imagen = data.data;
  }

}
