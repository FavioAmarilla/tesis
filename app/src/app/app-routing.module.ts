import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)},
  { path: 'shop', loadChildren: () => import('./pages/shop/shop.module').then( m => m.ShopPageModule)},
  { path: 'wish-list', loadChildren: () => import('./pages/wish-list/wish-list.module').then(m => m.WishListPageModule)},
  { path: 'cart', loadChildren: () => import('./pages/cart/cart.module').then( m => m.CartPageModule)},
  { path: 'checkout', loadChildren: () => import('./pages/checkout/checkout.module').then( m => m.CheckoutPageModule)},
  { path: 'about', loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)},
  { path: 'contact', loadChildren: () => import('./pages/contact/contact.module').then( m => m.ContactPageModule)},
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)},
  { path: 'signup', loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)},
  { path: 'single-product/:id', loadChildren: () => import('./pages/single-product/single-product.module').then( m => m.SingleProductPageModule)},
  // { path: 'single-product/:id', loadChildren: './pages/single-product/single-product.module#SingleProductPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
