import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewVaterPage } from './new-vater.page';

const routes: Routes = [
  {
    path: '',
    component: NewVaterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewVaterPageRoutingModule {}
