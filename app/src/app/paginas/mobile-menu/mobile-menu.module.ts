import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MobileMenuPage } from './mobile-menu.page';
import { AuthGuard } from 'src/app/guards/auth.guard';

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
      { path: 'productos', loadChildren: () => import('../productos/productos.module').then(m => m.ProductosPageModule) },
      {
        path: 'producto/:slug',
        loadChildren: () => import('../detalle-producto/detalle-producto.module').then(m => m.ModuloPaginaDetalleProducto)
      },
      { path: 'pedido', loadChildren: () => import('../pedido/pedido.module').then(m => m.PedidoPageModule), canActivate: [AuthGuard] },
      {
        path: 'pedido/finalizado',
        loadChildren: () => import('../pedido-finalizado/pedido-finalizado.module').then(m => m.PedidoFinalizadoPageModule)
      },
      {
        path: 'pedido-lista',
        loadChildren: () => import('../pedido-listado/pedido-listado.module').then(m => m.PedidoListadoPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'mi-cuenta',
        loadChildren: () => import('../mi-cuenta/mi-cuenta.module').then(m => m.MiCuentaPageModule), canActivate: [AuthGuard]
      },
      {
        path: 'recuperar-contrasenha',
        loadChildren: () => import('../recuperar-contrasenha/recuperar-contrasenha.module').then(m => m.RecuperarContrasenhaPageModule)
      },
      {
        path: 'recuperar-contrasenha/:token',
        loadChildren: () => import('../recuperar-contrasenha/recuperar-contrasenha.module').then(m => m.RecuperarContrasenhaPageModule)
      },
      {
        path: 'preguntas-frecuentes',
        loadChildren: () => import('../preguntas-frecuentes/preguntas-frecuentes.module').then(m => m.PreguntasFrecuentesPageModule)
      },
      { path: 'condicion-uso', loadChildren: () => import('../condicion-uso/condicion-uso.module').then(m => m.CondicionUsoPageModule) },
      { path: 'medio-pago', loadChildren: () => import('../medio-pago/medio-pago.module').then(m => m.MedioPagoPageModule) },
      { path: 'area-cobertura', loadChildren: () => import('../area-cobertura/area-cobertura.module').then(m => m.AreaCoberturaPageModule) }
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
export class MobileMenuPageModule { }
