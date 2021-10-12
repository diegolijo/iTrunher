import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewVaterPageRoutingModule } from './new-vater-routing.module';

import { NewVaterPage } from './new-vater.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewVaterPageRoutingModule
  ],
  declarations: [NewVaterPage]
})
export class NewVaterPageModule {}
