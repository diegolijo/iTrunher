import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'new-vater',
    loadChildren: () => import('./pages/new-vater/new-vater.module').then( m => m.NewVaterPageModule)
  },
  {
    path: 'valoraciones',
    loadChildren: () => import('./pages/valoraciones/valoraciones.module').then( m => m.ValoracionesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
