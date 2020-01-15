import { Component, OnInit } from '@angular/core';
import { LineaProductoService } from '../../services/linea-producto.service';
import { LineaProducto } from 'app/models/linea-producto';
import { environment } from 'environments/environment';

const API = environment.api;

@Component({
  selector: 'app-linea-producto',
  templateUrl: './linea-producto.component.html',
  styleUrls: ['./linea-producto.component.scss']
})
export class LineaProductoComponent implements OnInit {

  public url: string;
  public form = false;
  public action: string = '';
  public lineaProducto: LineaProducto;
  public lineasProducto: LineaProducto;

  constructor(
    private lineaProductoService: LineaProductoService
  ) { 
    this.url = environment.api; 
  }

  ngOnInit() {
    this.getLineas();
  }

  viewForm(flag, action) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.lineaProducto = new LineaProducto(null, null);
    }
  }

  getLineas() {
    this.lineaProductoService.getLineas().subscribe(
      (response: any) => {
        console.log(response);
        if (response.status) {
          this.lineasProducto = response.data;
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  getBusiness(id) {
    this.lineaProductoService.getLineas(id).subscribe(
      (response: any) => {
        if (response.status) {
          this.lineaProducto = response.data;
          this.viewForm(true, 'UPD');
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  register() {
    this.lineaProductoService.register(this.lineaProducto).subscribe(
      (response: any) => {
        console.log('register: ', response);
        if (response.status) {
          this.getLineas();
        } else {

        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

  update() {
    this.lineaProductoService.update(this.lineaProducto, this.lineaProducto.identificador).subscribe(
      (response: any) => {
        console.log('update: ', response);
        if (response.status) {
          this.getLineas();
        } else {

        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

}
