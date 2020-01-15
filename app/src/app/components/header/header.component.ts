import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public usuario: any = null;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private cartService: CartService
  ) { 
  }

  async ngOnInit() {
    this.usuarioService.emitter
    .subscribe(
      response => {
        this.usuario = response;
      }
    );
  }
  
  redirectTo(url) {
    this.router.navigate([url]);
  }

  logout() {
    this.usuarioService.logout();
    this.usuario = null;
  }


}
