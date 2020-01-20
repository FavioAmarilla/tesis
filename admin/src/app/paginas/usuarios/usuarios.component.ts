import { Component, OnInit } from '@angular/core';
import { ServicioUsuario } from '../../servicios/usuario.service';
import { Usuario } from '../../modelos/usuario';
import { environment } from 'environments/environment';
import swal from'sweetalert2';

const API = environment.api;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  public url: string;
  public form = false;
  public accion: string = '';
  public usuario: Usuario;
  public listaUsuario: Usuario;
  public cargando: boolean = false;
  public errores = [];

  public fileUploaderConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png,.jpeg,.gif',
    maxSize: '50',
    uploadAPI:  {
      url: `${API}/user/upload`
    },
    theme: 'attachPin',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Seleccionar imagen'
  };

  constructor(
    private servicioUsuario: ServicioUsuario
  ) {
    this.url = environment.api;
  }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  viewForm(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'INS') {
      this.usuario = new Usuario(null, null, null, null, null);
    }
    if (limpiarError) {
      this.errores = [];
    }
  }

  async obtenerUsuarios() {
    this.listaUsuario = null;
    this.accion = 'LST';
    this.cargando = true;
    this.errores = [];

    const response = <any> await this.servicioUsuario.obtenerUsuarios();

    if (response.status) {
      this.listaUsuario = response.data;
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
    }

    this.cargando = false;
  }

  async obtenerUsuario(id) {
    this.accion = 'LST';
    this.cargando = true;

    this.errores = [];
    const response = <any> await this.servicioUsuario.obtenerUsuarios(id);

    if (response.status) {
      this.usuario = response.data;
      this.viewForm(true, 'UPD');
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
    const response = <any> await this.servicioUsuario.registrar(this.usuario);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.obtenerUsuarios();
          this.viewForm(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
      this.viewForm(true, 'INS');
    }
  }

  async actualizar() {
    this.cargando = true;

    this.errores = [];
    const response = <any> await this.servicioUsuario.actualizar(this.usuario, this.usuario.identificador);

    this.cargando = false;
    if (response.status) {
      swal.fire({
        text: response.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.obtenerUsuarios();
          this.viewForm(false, 'LST');
        }
      });
    } else {
      for (const i in response.data) {
        this.errores.push(response.data[i]);
      }
      this.viewForm(true, 'UPD');
    }
  }

  subirImagen(event) {
    console.log(event.response);
    const data = JSON.parse(event.response);
    this.usuario.imagen = data.data;
  }

}
