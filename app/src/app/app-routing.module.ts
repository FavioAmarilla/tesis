import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', loadChildren: './paginas/mobile-menu/mobile-menu.module#MobileMenuPageModule' },
  { path: '**', redirectTo: ''},  { path: 'condicion-uso', loadChildren: './paginas/condicion-uso/condicion-uso.module#CondicionUsoPageModule' },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
