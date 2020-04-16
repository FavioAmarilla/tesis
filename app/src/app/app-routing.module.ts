import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', loadChildren: () => import('./paginas/inicio/inicio.module').then(m => m.ModuloPaginaInicio) },
  { path: 'tienda', loadChildren: () => import('./paginas/tienda/tienda.module').then(m => m.ModuloPaginaTienda) },
  { path: 'favoritos', loadChildren: () => import('./paginas/favoritos/favoritos.module').then(m => m.FavoritosPageModule) },
  { path: 'carrito', loadChildren: () => import('./paginas/carrito/carrito.module').then(m => m.ModuloPaginaCarrito) },
  { path: 'acerca-de', loadChildren: () => import('./paginas/acerca-de/acerca-de.module').then(m => m.ModuloPaginaAcercaDe) },
  { path: 'contacto', loadChildren: () => import('./paginas/contacto/contacto.module').then(m => m.ModuloPaginaContacto) },
  { path: 'login', loadChildren: () => import('./paginas/login/login.module').then(m => m.LoginPageModule) },
  { path: 'signup', loadChildren: () => import('./paginas/signup/signup.module').then(m => m.SignupPageModule) },
  { path: 'producto/:slug', loadChildren: () => import('./paginas/producto/producto.module').then(m => m.ModuloPaginaProducto) },
  { path: 'pedido', loadChildren: () => import('./paginas/pedido/pedido.module').then(m => m.PedidoPageModule) },
  { path: 'pedido-lista', loadChildren: () => import('./paginas/pedido-listado/pedido-listado.module').then(m => m.PedidoListadoPageModule) },
  { path: 'mi-cuenta', loadChildren: () => import('./paginas/mi-cuenta/mi-cuenta.module').then(m => m.MiCuentaPageModule) }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
