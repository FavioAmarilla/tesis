import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', loadChildren: () => import('./paginas/inicio/inicio.module').then( m => m.ModuloPaginaInicio)},
  { path: 'tienda', loadChildren: () => import('./paginas/tienda/tienda.module').then( m => m.ModuloPaginaTienda)},
  { path: 'lista-deseos', loadChildren: () => import('./paginas/lista-deseos/lista-deseos.module').then(m => m.ModuloPaginaListaDeseos)},
  { path: 'carrito', loadChildren: () => import('./paginas/carrito/carrito.module').then( m => m.ModuloPaginaCarrito)},
  { path: 'checkout', loadChildren: () => import('./paginas/checkout/checkout.module').then( m => m.CheckoutPageModule)},
  { path: 'acerca-de', loadChildren: () => import('./paginas/acerca-de/acerca-de.module').then( m => m.ModuloPaginaAcercaDe)},
  { path: 'contacto', loadChildren: () => import('./paginas/contacto/contacto.module').then( m => m.ModuloPaginaContacto)},
  { path: 'login', loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule)},
  { path: 'signup', loadChildren: () => import('./paginas/signup/signup.module').then( m => m.SignupPageModule)},
  { path: 'producto-simple/:id', loadChildren: () => import('./paginas/producto-simple/producto-simple.module').then( m => m.ModuloPaginaProductoSimple)}

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
