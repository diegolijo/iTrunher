import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { NewVaterPageRoutingModule } from '../new-vater/new-vater-routing.module';
import { ValoracionesPageRoutingModule } from '../valoraciones/valoraciones-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NewVaterPageRoutingModule,
    ValoracionesPageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
