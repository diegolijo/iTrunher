/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { latLng, Map, marker, popup } from 'leaflet';
import { Api, IApiLatLangs } from '../../services/api';
import { Helper } from '../../services/helper';
import { LeafletUtil } from '../../services/leaflet-util';
import { LocationManager } from '../../services/location-manager';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NewVaterPage } from '../new-vater/new-vater.page';
import { ValoracionesPage } from '../valoraciones/valoraciones.page';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  static NAVIGATION_PACKAGE = 'google.navigation:q=';
  static WALK_MODE = '&mode=w';
  static MAPS_PACKAGE = 'com.google.android.apps.maps';

  // MAP
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
  @ViewChild('info', { read: ElementRef, static: false }) infoRef: ElementRef;
  public map: Map;
  public markers: marker[] = [];
  public popup: popup;
  public mapLayer = this.leafletUtil.terrenoLayer;
  public iconName = 'globe-sharp';
  public items: any;
  public selectedLoc: IApiLatLangs;
  public selectedMarker: marker;
  private isNavigator = false;



  constructor(
    private api: Api,
    private leafletUtil: LeafletUtil,
    private locationManager: LocationManager,
    private helper: Helper,
    private appLauncher: AppLauncher,
    private platform: Platform,
    private googlePlus: GooglePlus,
    private modalController: ModalController
  ) { }

  async ngOnInit() {

    this.selectedLoc = this.api.emptyApiLatLangs();
    this.items = await this.getLatLangs();
    await this.loadMap();
    await this.createMarkers();
    this.leafletUtil.addMarkersToMap(this.map, this.markers)
  }



  //********************************** MAPA ***********************************/
  private async loadMap() {
    try {
      await this.helper.delay(100);
      const location: any = await this.locationManager.getCurrentPosition();
      this.map = await this.leafletUtil.loadMap(
        this.map,
        this.mapRef.nativeElement,
        this.mapLayer,
        10,
        2,
        18,
        { lat: location.coords.latitude, lng: location.coords.longitude },
        (e) => { this.onClickMap(e); });

    } catch (err) {
      this.helper.showException(err);
    }
  }

  private async createMarkers() {
    for (const item of this.items) {
      const mark = await this.leafletUtil.crateLocationMarker(
        { lat: item.lat, lng: item.lng },
        this.leafletUtil.vaterIcon,
        (ev) => { this.onClickMarker(ev); },
        item,
        { iconSize: [30, 30], iconAnchor: [15, 15] });
      this.markers.push(mark);
    }
  }


  // TODO observable que lance valoracion cuando vuelava del navigator
  private async launchNavigator(latLang: latLng) {
    const options: AppLauncherOptions = {};
    if (this.platform.is('ios')) {
      options.uri = ''; // TODO uri de la version ios
    } else {
      options.uri = HomePage.NAVIGATION_PACKAGE + latLang.lat + ',' + latLang.lng + HomePage.WALK_MODE;
      options.packageName = HomePage.MAPS_PACKAGE;
    }
    const res = await this.appLauncher.canLaunch(options);
    if (res) {
      await this.appLauncher.launch(options);
      this.isNavigator = true;
    } else {
      this.helper.showException('No se puede lanzar el navegador');
    }
  }


  public async onClickMap(e: any) {
    try {
      this.leafletUtil.clearSelectedMarker(this.selectedMarker);
      this.selectedLoc = this.api.emptyApiLatLangs();

      const revGeo = await this.locationManager.reverseGeocoder(e.latlng.lat, e.latlng.lng);
      const item: IApiLatLangs = {
        id: 0,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        descripcion: `${revGeo.countryName} - ${revGeo.locality} - ${revGeo.thoroughfare}`,
        locality: revGeo.locality,
        name: 'truñaco en el campo',
        puntuacion: 4,
        foto: ''
      }
      this.insertLatLang([item]);

    } catch (err) {
      this.helper.showException(err);
    }
  }

  public onClickMarker(event: any): any {
    this.leafletUtil.clearSelectedMarker(this.selectedMarker);
    this.selectedMarker = event.sourceTarget;
    this.leafletUtil.setSelectedMarker(this.selectedMarker);
    this.selectedLoc = this.selectedMarker.embebedObject;
  }

  public onClickNav(latLang) {
    this.launchNavigator(latLang);
  }

  public onClickValoraciones() {

  }


  /*************************** operaciones DB API ************************/

  public async getLatLangs() {
    const latLangs = await this.api.getLatLangs();
    for (const iterator of latLangs) {
      console.log(iterator)
    }
    return latLangs;
  }

  private async insertLatLang(items: IApiLatLangs[]) {
    await this.api.insertLatLangs(items);
  }

  public async deleteLatLangs() {
    await this.api.deleteLatLangs();
  }

  /*************************** google login ************************/

  // TODO
  onClickLogin() {
    this.googlePlus.login({
      webClientId: '807138262633-pn5fbtt6hf6880nls6b74js16eo643me.apps.googleusercontent.com',
      offline: true
    }).then(res =>
      console.log(res))
      .catch(err =>
        console.log(err)
      );
  }
  /************************** ROUTER ************************/


  public async launckModalNewVater() {
    const modal = await this.modalController.create(
      {
        component: NewVaterPage
      }
    );
    await modal.present();
    await modal.onDidDismiss();
  }


  public async launckModalValoracion() {
    const modal = await this.modalController.create(
      {
        component: ValoracionesPage,
        cssClass: 'contenedor-valoracion'
      }
    );
    await modal.present();
    await modal.onDidDismiss();
  }


}




