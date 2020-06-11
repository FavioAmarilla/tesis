import { Component, OnInit } from '@angular/core';
import { ServicioAlertas } from 'app/servicios/alertas.service';
import { Rol } from 'app/modelos/rol';
import { Permiso } from 'app/modelos/permiso';
import { RolesService } from 'app/servicios/roles.service';
import { PermisosService } from 'app/servicios/permisos.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  public cargando: boolean = false;
  public cargandoPermisos: boolean = false;
  public form = false;
  public accion: string = '';
  public rol: Rol;
  public listaRoles: Rol;
  public listaPermisos: Permiso;
  public listaPermisosTmp = [];

  public parametros: any = {};
  public filtrosTabla: any = {};
  public parametrosTabla: any = []

  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private servicioRol: RolesService,
    private servicioPermiso: PermisosService,
    private servicioAlerta: ServicioAlertas
  ) {
    this.cargando = false;
    this.inicializarFiltros();
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      nombre: ''
    }
  }

  async mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion === 'INS') {
      this.rol = new Rol(null, null, null, null, null);
      await this.obtenerPermisos();
    }
  }

  async obtenerPermisos(pagina?, parametrosFiltro?, cargando?) {
    if (cargando) {
      this.cargandoPermisos = cargando;
    }
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaPermisos = null;

    this.parametros = null;
    this.parametros = {
      paginar: true,
      page: this.paginaActual
    };

    if (parametrosFiltro) {
      this.parametrosTabla.forEach(element => {
        this.parametros[element.key] = element.value;
      });
    }


    const response: any = await this.servicioPermiso.obtener(null, this.parametros);

    if (response.success) {
      this.listaPermisos = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
      this.seleccionarPermisos();
    } else {
      this.cargandoPermisos = false;
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargandoPermisos = false;
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaRoles = null;
    this.accion = "LST";
    this.cargando = true;

    this.parametros = null;
    this.parametros = {
      paginar: true,
      page: this.paginaActual
    };

    if (parametrosFiltro) {
      this.parametrosTabla.forEach(element => {
        this.parametros[element.key] = element.value;
      });
      this.parametros.push(parametrosFiltro);
    }

    const response: any = await this.servicioRol.obtener(null, this.parametros);

    if (response.success) {
      this.listaRoles = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }

    this.cargando = false;
  }

  async obtenerRol(id) {
    this.accion = 'LST';
    this.cargando = true;
    const response: any = await this.servicioRol.obtener(id);

    if (response.success) {
      this.rol = response.data;
      await this.obtenerPermisos();
      this.mostrarFormulario(true, 'UPD');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
      this.mostrarFormulario(false, 'LST');
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;
    this.rol.permisos = this.listaPermisosTmp;
    const response: any = await this.servicioRol.registrar(this.rol);

    this.cargando = false;
    if (response.success) {
      this.listaPermisosTmp = [];
      this.servicioAlerta.dialogoExito(response.message, '');
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async actualizar() {
    this.cargando = true;
    this.rol.permisos = this.listaPermisosTmp;
    const response: any = await this.servicioRol.actualizar(this.rol, this.rol.identificador);

    this.cargando = false;
    if (response.success) {
      this.listaPermisosTmp = [];
      this.servicioAlerta.dialogoExito(response.message, '');
      this.paginacion();
      this.mostrarFormulario(false, 'LST');
    } else {
      this.servicioAlerta.dialogoError(response.message, '');
    }
  }

  async filtrarTabla(metodo?, event?) {
    if (event) {
      let key = event.target.name;
      let value = event.target.value;
      let parametros = { key, value };
      this.parametrosTabla.push(parametros);

      if (metodo == 'paginacion') {
        await this.paginacion(null, parametros);
      }

      if (metodo == 'obtenerPermisos') {
        await this.obtenerPermisos(null, parametros, true);
      }
    } else {
      await this.inicializarFiltros();
      if (metodo == 'paginacion') {
        await this.paginacion(null, null);
      }

      if (metodo == 'obtenerPermisos') {
        await this.obtenerPermisos(null, null, true);
      }
    }
  }

  seleccionarPermisos() {
    if (this.accion != 'INS') {
      for (let i = 0; i < this.listaPermisos.length; i++) {
        const permisoId = this.listaPermisos[i].identificador;
        const index = this.rol.rol_permisos.findIndex(permiso => permiso.id_permiso == permisoId);

        if (index != -1) this.listaPermisosTmp.push(permisoId);
      }
    }
  }

  permisosSeleccionados(permisoId, event) {
    const add = event.target.checked;

    if (add) {
      this.listaPermisosTmp.push(permisoId);
    } else {
      var index = this.listaPermisosTmp.indexOf(permisoId);
      if (index >= 0) {
        this.listaPermisosTmp.splice(index, 1);
      }
    }
  }

  verificarCheck(permisoId): boolean {
    const permisos: any = this.rol.rol_permisos || [];
    const index = permisos.findIndex(permiso => permiso.id_permiso == permisoId);

    const check = (index != -1) ? true : false;

    return check;
  }

}
