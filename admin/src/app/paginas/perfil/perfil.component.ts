import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServicioUsuario } from 'app/servicios/usuario.service';
import { ServicioAlertas } from 'app/servicios/alertas.service';
import { environment } from 'environments/environment';

const API = environment.api;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  angForm: FormGroup;
  cargando = false;

  public url;
  public resetVar = false;
  public fileUploaderConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png,.jpeg,.gif',
    maxSize: '50',
    uploadAPI: {
      url: `${API}/user/upload`
    },
    theme: 'attachPin',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Seleccionar imagen'
  };

  constructor(
    private formBuilder: FormBuilder,
    private servicioUsuario: ServicioUsuario,
    private servicioAlertas: ServicioAlertas
  ) {
    this.url = environment.api;
    this.createForm();
  }

  ngOnInit() {
    this.completarFormulario();
  }

  createForm() {
    this.angForm = this.formBuilder.group({
      identificador: ['', Validators.required],
      nombre_completo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fecha_nacimiento: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      telefono: [''],
      imagen: ['']
    });
  }

  async completarFormulario() {
    const usuario: any = await this.servicioUsuario.obtenerUsuario();

    if (usuario) {
      this.angForm.controls['identificador'].setValue(usuario.sub);
      this.angForm.controls['nombre_completo'].setValue(usuario.nombre_completo);
      this.angForm.controls['fecha_nacimiento'].setValue(usuario.fecha_nacimiento);
      this.angForm.controls['celular'].setValue(usuario.celular);
      this.angForm.controls['telefono'].setValue(usuario.telefono);
      this.angForm.controls['email'].setValue(usuario.email);
      this.angForm.controls['imagen'].setValue(usuario.imagen);
      this.servicioUsuario.loginEmitter.emit(usuario);
    }
  }

  subirImagen(event) {
    const data = JSON.parse(event.response);
    this.angForm.controls['imagen'].setValue(data.data);
  }

  async actualizarPerfil() {
    const form = this.angForm;
    if (form.invalid) {
      return;
    }

    if (form.value.clave_acceso !== '' && form.value.confirmar_clave_acceso !== '') {
      if (form.value.clave_acceso !== form.value.confirmar_clave_acceso) {
        form.controls['clave_acceso'].setErrors({ invalid: true });
        form.controls['confirmar_clave_acceso'].setErrors({ invalid: true });
        return;
      }
    }

    this.cargando = true;

    const validar = await this.servicioUsuario.validarEmail(form.value.identificador, form.value.email);
    if (!validar) {
      this.cargando = false;
      this.servicioAlertas.dialogoError('', 'Ya existe otro usuario con este email');
      return;
    }

    const actualizar: any = await this.servicioUsuario.actualizar(form.value, form.value.identificador);

    if (actualizar.success) {
      this.servicioAlertas.dialogoExito('', 'Usuario actalizado correctamente');
      await this.servicioUsuario.guardarToken(actualizar.data.token);
      this.createForm();
      this.completarFormulario();
    } else {
      this.servicioAlertas.dialogoError('', 'Ha ocurrido un problema al intentar actualizar');
    }

    this.cargando = false;
  }
}
