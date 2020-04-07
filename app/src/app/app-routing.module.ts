import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', loadChildren: () => import('./paginas/inicio/inicio.module').then(m => m.ModuloPaginaInicio) },
  { path: 'tienda', loadChildren: () => import('./paginas/tienda/tienda.module').then(m => m.ModuloPaginaTienda) },
  { path: 'favoritos', loadChildren: () => import('./paginas/favoritos/favoritos.module').then(m => m.FavoritosPageModule) },
  { path: 'carrito', loadChildren: () => import('./paginas/carrito/carrito.module').then(m => m.ModuloPaginaCarrito) },
  { path: 'pedido', loadChildren: () => import('./paginas/pedido/pedido.module').then(m => m.PedidoPageModule) },
  { path: 'acerca-de', loadChildren: () => import('./paginas/acerca-de/acerca-de.module').then(m => m.ModuloPaginaAcercaDe) },
  { path: 'contacto', loadChildren: () => import('./paginas/contacto/contacto.module').then(m => m.ModuloPaginaContacto) },
  { path: 'login', loadChildren: () => import('./paginas/login/login.module').then(m => m.LoginPageModule) },
  { path: 'signup', loadChildren: () => import('./paginas/signup/signup.module').then(m => m.SignupPageModule) },
  { path: 'producto/:id', loadChildren: () => import('./paginas/producto/producto.module').then(m => m.ModuloPaginaProducto) },
  { path: 'pedidos', loadChildren: './paginas/pedidos/pedidos.module#PedidosPageModule' }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
