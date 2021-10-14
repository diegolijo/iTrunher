/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { latLng, Map, marker, popup } from 'leaflet';
import { Api, IApiLatLangs } from '../../services/api';
import { Helper } from '../../services/helper';
import { LeafletUtil } from '../../services/leaflet-util';
import { IReversedGeocoded, LocationManager } from '../../services/location-manager';
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
  public newVaterMarker: marker;
  public popup: popup;
  public mapLayer = this.leafletUtil.terrenoLayer;
  public iconName = 'globe-sharp';
  public items: any;
  public selectedVater: IApiLatLangs;
  public selectedVaterMarker: marker;
  public search = '';
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

    this.selectedVater = this.api.emptyApiLatLangs();
    this.items = await this.getLatLangs();
    await this.loadMap();
    await this.createMarkers();
    this.leafletUtil.addMarkersToMap(this.map, this.markers);
  }

  /****************************** EVENTOS  *****************************/
  //  google login
  // TODO
  public onClickLogin() {
    this.googlePlus.login({
      webClientId: '807138262633-pn5fbtt6hf6880nls6b74js16eo643me.apps.googleusercontent.com',
      offline: true
    }).then(res =>
      console.log(res))
      .catch(err =>
        console.log(err)
      );
  }

  // ROUTER
  public async onClickNewVater() {

    //  this.newVaterMarker.remove();
    this.launckModalNewVater();
  }

  public async onClickValoracion() {
    this.launckModalValoracion();
  }

  //  MAPA

  // TODO click en el mapa, debe deseleccionar el vater actual y pintar newVaterMarker
  public async onClickMap(e: any) {
    try {
      this.leafletUtil.clearSelectedVaterMarker(this.selectedVaterMarker);
      this.selectedVater = this.api.emptyApiLatLangs();

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
      };
      this.insertLatLang([item]);

    } catch (err) {
      this.helper.showException(err);
    }
  }

  public onClickMarker(event: any): any {
    this.leafletUtil.clearSelectedVaterMarker(this.selectedVaterMarker);
    this.selectedVaterMarker = event.sourceTarget;
    this.leafletUtil.setSelectedVaterMarker(this.selectedVaterMarker);
    this.selectedVater = this.selectedVaterMarker.embebedObject;
  }



  // pintamos un marker con la ubicacion actual del dispositivo
  // TODO borrar seleccion
  public async onClickNewVaterMarcker() {
    this.leafletUtil.clearSelectedVaterMarker(this.selectedVaterMarker);
    this.selectedVater = this.api.emptyApiLatLangs();

    if (this.newVaterMarker) {
      this.newVaterMarker.remove();
    }

    let data: IReversedGeocoded;
    if (this.search) {
      data = await this.locationManager.forwardGeocode(this.search);
    } else {
      data = await this.getLastReveseData();
    }

    this.newVaterMarker = this.leafletUtil.crateLocationMarker(
      { lat: data.latitude, lng: data.longitude },
      this.leafletUtil.dangerIcon,
      {},
      () => { this.setNewVaterReveseData(); },
      data,
      {
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        draggable: true
      });

    this.map.flyTo({ lat: data.latitude, lng: data.longitude }, 14);
    this.leafletUtil.addMarkerToMap(this.map, this.newVaterMarker);
  }






  //ROUTER
  public onClickNav(latLang) {
    this.launchNavigator(latLang);
  }

  public onClickValoraciones() {
    this.launckModalValoracion();
  }

  //*************************  FUNCIONES **************************/


  // Location
  public getLastReveseData() {
    if (this.platform.is('cordova')) {
      return this.locationManager.reverseGeocoder(
        this.locationManager.getLastLocation().lat,
        this.locationManager.getLastLocation().lng);
    } else {
      return {
        latadministrativeArea: 'Galicia',
        areasOfInterest: ['19'],
        countryCode: 'ES',
        countryName: 'Spain',
        latitude: 42.867909999999995,
        locality: 'Santiago de Compostela',
        longitude: -8.53823,
        postalCode: '15702',
        subAdministrativeArea: 'A Coruña',
        subLocality: '',
        subThoroughfare: '19',
        thoroughfare: 'Rúa das Santas Mariñas',
      };
    }
  }

  public async setNewVaterReveseData() {

    this.leafletUtil.clearSelectedVaterMarker(this.selectedVaterMarker);
    this.selectedVater = this.api.emptyApiLatLangs();

    if (this.platform.is('cordova')) {
      this.newVaterMarker.embebedObject = await this.locationManager.reverseGeocoder(
        this.newVaterMarker.getLatLng().lat,
        this.newVaterMarker.getLatLng().lng);
    } else {
      this.newVaterMarker.embebedObject = {
        latadministrativeArea: 'Galicia',
        areasOfInterest: ['19'],
        countryCode: 'ES',
        countryName: 'Spain',
        latitude: 42.867909999999995,
        locality: 'Santiago de Compostela',
        longitude: -8.53823,
        postalCode: '15702',
        subAdministrativeArea: 'A Coruña',
        subLocality: '',
        subThoroughfare: '19',
        thoroughfare: 'Santiago de chile',
      };
    }
  }



  // MAPA
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
        {},
        item,
        { iconSize: [30, 30], iconAnchor: [15, 15] });
      this.markers.push(mark);
    }
  }



  //ROUTER
  private async launckModalNewVater() {
    const modal = await this.modalController.create(
      {
        component: NewVaterPage,
        componentProps: {
          newMarker: this.newVaterMarker
        }
      }
    );
    await modal.present();
    await modal.onDidDismiss();
  }

  private async launckModalValoracion() {
    const modal = await this.modalController.create(
      {
        component: ValoracionesPage,
        cssClass: 'contenedor-valoracion'
      }
    );
    await modal.present();
    await modal.onDidDismiss();
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
      this.isNavigator = true; // TODO lanzar valoracion al volver del navigator
    } else {
      this.helper.showException('No se puede lanzar el navegador');
    }
  }


  // operaciones DB API

  private async getLatLangs() {
    const latLangs = await this.api.getLatLangs();
    for (const iterator of latLangs) {
      console.log(iterator);
    }
    return latLangs;
  }

  private async insertLatLang(items: IApiLatLangs[]) {
    await this.api.insertLatLangs(items);
  }

  private async deleteLatLangs() {
    await this.api.deleteLatLangs();
  }



}




