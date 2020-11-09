import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', loadChildren: './paginas/mobile-menu/mobile-menu.module#MobileMenuPageModule' },
  { path: '**', redirectTo: ''},  { path: 'condicion-uso', loadChildren: './paginas/condicion-uso/condicion-uso.module#CondicionUsoPageModule' },
  { path: 'medio-pago', loadChildren: './paginas/medio-pago/medio-pago.module#MedioPagoPageModule' },
  { path: 'area-cobertura', loadChildren: './paginas/area-cobertura/area-cobertura.module#AreaCoberturaPageModule' },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
