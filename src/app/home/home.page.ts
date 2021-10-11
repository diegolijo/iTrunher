/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Map, marker, popup } from 'leaflet';
import { Api, ApiLatLangs } from '../services/api';
import { Helper } from '../services/helper';
import { LeafletUtil } from '../services/leaflet-util';
import { LocationManager } from '../services/location-manager';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  // MAP
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
  public map: Map;
  public markers: marker[];
  public popup: popup;
  public mapLayer = this.leafletUtil.terrenoLayer;
  public iconName = 'globe-sharp';
  public items: any;



  constructor(
    private api: Api,
    private leafletUtil: LeafletUtil,
    private locationManager: LocationManager,
    private helper: Helper
  ) { }

  async ngOnInit() {
    this.items = await this.getLatLangs();
    await this.loadMap();
    await this.helper.delay(1000);
    const markers = [];
    for (const item of this.items) {
      const mark = await this.leafletUtil.crateLocationMarker({ lat: item.lat, lng: item.lng }, this.leafletUtil.sucessIcon, null);
      markers.push(mark);

    }
    this.leafletUtil.addMarkersToMap(this.map, markers);
  }


  public async getLatLangs() {
    const latLangs = await this.api.getLatLangs();
    for (const iterator of latLangs) {
      console.log(iterator)
    }
    return latLangs;
  }

  private async insertLatLang(items: ApiLatLangs[]) {
    await this.api.insertLatLangs(items);
  }

  public async deleteLatLangs() {
    await this.api.deleteLatLangs();
  }



  private async loadMap() {
    await this.helper.delay(100);
    const location: any = await this.locationManager.getCurrentPosition();
    this.map = await this.leafletUtil.loadMap(
      this.map,
      this.mapRef.nativeElement,
      this.mapLayer,
      8,
      2,
      18,
      { lat: location.coords.latitude, lng: location.coords.longitude },
      (e) => { this.onClickMap(e); });
  }




  onClickMap(e: any) {
    const item: ApiLatLangs = {
      id: 0,
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      descripcion: 'pruebassssss',
      name: 'truñaco en el campo'
    }
    this.insertLatLang([item]);
  }





}


