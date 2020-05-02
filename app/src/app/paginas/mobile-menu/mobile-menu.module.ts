import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MobileMenuPage } from './mobile-menu.page';

const routes: Routes = [
  {
    path: '',
    component: MobileMenuPage,
    children: [
      { path: '', loadChildren: () => import('../inicio/inicio.module').then(m => m.ModuloPaginaInicio) },
      { path: 'tienda', loadChildren: () => import('../tienda/tienda.module').then(m => m.ModuloPaginaTienda) },
      { path: 'favoritos', loadChildren: () => import('../favoritos/favoritos.module').then(m => m.FavoritosPageModule) },
      { path: 'carrito', loadChildren: () => import('../carrito/carrito.module').then(m => m.ModuloPaginaCarrito) },
      { path: 'acerca-de', loadChildren: () => import('../acerca-de/acerca-de.module').then(m => m.ModuloPaginaAcercaDe) },
      { path: 'contacto', loadChildren: () => import('../contacto/contacto.module').then(m => m.ModuloPaginaContacto) },
      { path: 'login', loadChildren: () => import('../login/login.module').then(m => m.LoginPageModule) },
      { path: 'signup', loadChildren: () => import('../signup/signup.module').then(m => m.SignupPageModule) },
      { path: 'producto/:slug', loadChildren: () => import('../producto/producto.module').then(m => m.ModuloPaginaProducto) },
      { path: 'pedido', loadChildren: () => import('../pedido/pedido.module').then(m => m.PedidoPageModule) },
      { path: 'pedido-lista', loadChildren: () => import('../pedido-listado/pedido-listado.module').then(m => m.PedidoListadoPageModule) },
      { path: 'mi-cuenta', loadChildren: () => import('../mi-cuenta/mi-cuenta.module').then(m => m.MiCuentaPageModule) },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MobileMenuPage]
})
export class MobileMenuPageModule {}
