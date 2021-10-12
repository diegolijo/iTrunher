import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FotosModalPage } from './fotos-modal.page';

const routes: Routes = [
  {
    path: '',
    component: FotosModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FotosModalPageRoutingModule {}
