import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FotosModalPageRoutingModule } from './fotos-modal-routing.module';

import { FotosModalPage } from './fotos-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FotosModalPageRoutingModule
  ],
  declarations: [FotosModalPage]
})
export class FotosModalPageModule {}
