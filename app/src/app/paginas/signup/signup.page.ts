import { Component, OnInit } from '@angular/core';
import { Usuario, Cliente } from '../../interfaces/interfaces';
import { UsuarioService } from '../../servicios/usuario.service';
import { AlertaService } from 'src/app/servicios/alerta.service';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/servicios/cliente.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public cargando = false;
  public cargandoBoton = false;

  public usuario: Usuario = {
    sub: null,
    identificador: null,
    nombre_completo: null,
    email: null,
    clave_acceso: null,
    telefono: null,
    celular: null,
    fecha_nacimiento: null,
    ruc: null
  };
  public repita_clave = '';

  public cliente: Cliente = {
    identificador: null,
    id_usuario: null,
    razon_social: null,
    numero_documento: null,
    celular: null,
    telefono: null
  };

  constructor(
    private UsuarioService: UsuarioService,
    private clienteService: ClienteService,
    private servicioAlerta: AlertaService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async registro() {
    this.cargandoBoton = true;

    //se guarda el usuario
    const response: any = await this.UsuarioService.registro(this.usuario);
    
    this.cargandoBoton = false;
    if (response.success) {

      //se guarda el cliente
      this.cliente.id_usuario = response.data.identificador;
      this.cliente.razon_social = this.usuario.nombre_completo;
      this.cliente.numero_documento = this.usuario.ruc;
      this.cliente.celular = this.usuario.celular;
      this.cliente.telefono = this.usuario.telefono;

      const responseCliente: any = await this.clienteService.registro(this.cliente);
      
      if (responseCliente.success) {
        this.servicioAlerta.dialogoExito(responseCliente.message);
        this.router.navigate(['/']);
      } else {
        this.servicioAlerta.dialogoError(responseCliente.message);
      }

    } else {
      this.servicioAlerta.dialogoError(response.message);
    }
  }


}
