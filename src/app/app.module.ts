import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AppLauncher } from '@ionic-native/app-launcher/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Api } from './services/api';
import { Helper } from './services/helper';
import { ProHttp } from './services/http-provider';
import { LeafletUtil } from './services/leaflet-util';
import { LocationManager } from './services/location-manager';
import { GooglePlus } from '@ionic-native/google-plus/ngx';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Api,
    ProHttp,
    LocationManager,
    LeafletUtil,
    Geolocation,
    Helper,
    NativeGeocoder,
    AppLauncher,
    GooglePlus
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
