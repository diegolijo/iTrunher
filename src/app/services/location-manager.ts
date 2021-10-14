import { Injectable } from '@angular/core';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { latLng } from 'leaflet';
import { Subject, Subscription } from 'rxjs';
import { Helper } from './helper';

@Injectable()
export class LocationManager {

  public locationObservable = new Subject<any>();

  private lastLocation;
  private locationSubscription: Subscription;
  private watchId: number;


  constructor(
    private nativeGeocoder: NativeGeocoder,
    private helper: Helper
  ) { }


  public initWatchPosition() {
    if (!this.locationSubscription || this.locationSubscription.closed) {
      const highAccOpt = {
        enableHighAccuracy: true,
        timeout: 1000 * 10,
        maximunAge: 60 * 1000
      };
      this.watchId = navigator.geolocation.watchPosition(
        (resp: any) => {
          this.locationObservable.next(resp);
          this.lastLocation = resp;
        }, (error: any) => {
          throw error;
        },
        highAccOpt);
    }
  }

  public stopGeolocating() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }


  public async getCurrentPosition() {
    return new Promise(async (resolve, reject) => {
      await this.helper.showLoader('buscando posición...');
      try {
        const highAccOpt = {
          enableHighAccuracy: true,
          // timeout: 1000 * 60,
          // maximunAge: 10 * 1000
        };
        navigator.geolocation.getCurrentPosition(
          async (resp: any) => {
            this.locationObservable.next(resp);
            this.lastLocation = resp;
            await this.helper.closeLoader();
            resolve(this.lastLocation);
          }, (error: any) => {
            throw error;
          },
          highAccOpt);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async reverseGeocoder(lat, lng) {
    const reversedGeocoded: any = await this.nativeGeocoder.reverseGeocode(lat, lng, {
      useLocale: true,
      maxResults: 5,
      defaultLocale: 'gl_ES'
    });
    console.log(reversedGeocoded);
    return this.filterReversedGeocoded(reversedGeocoded);
  }



  public async forwardGeocode(text: string) {
    const forwardGeocode: any = await this.nativeGeocoder.forwardGeocode(text, {
      useLocale: true,
      maxResults: 5,
      defaultLocale: 'gl_ES'
    });
    console.log(forwardGeocode);
    return this.filterForwardGeocode(forwardGeocode);
  }

  public getLastLocation(): latLng {
    return { lat: this.lastLocation.coords.latitude, lng: this.lastLocation.coords.longitude };
  }


  // TODO
  private filterReversedGeocoded(reversedGeocoded: any[]) {
    let locality = reversedGeocoded[0];
    const filtered = reversedGeocoded.filter(loc => loc.locality && loc.subAdministrativeArea && loc.thoroughfare);
    locality = filtered.length ? filtered[0] : locality;
    // TODO filtrar el resultaDO MAS FRECUENTE
    /*     for (const rvGeo of filtered) {
          locality = rvGeo.locality === locality ? locality : rvGeo.locality;
        } */
    return locality;
    /*  administrativeArea: "Galicia"
        areasOfInterest: ['22']
        countryCode: "ES"
        countryName: "Spain"
        latitude: 42.60845
        locality: "A Pobra do Caramiñal"
        longitude: -8.94333
        postalCode: "15948"
        subAdministrativeArea: "A Coruña"
        subLocality: ""
        subThoroughfare: "22"
        thoroughfare: "Lugar Agros" */
  }

  // TODO
  private filterForwardGeocode(forwardGeocode: any[]) {
    let locality = forwardGeocode[0];
    const filtered = forwardGeocode.filter(loc => loc.locality && loc.subAdministrativeArea && loc.thoroughfare);
    locality = filtered.length ? filtered[0] : locality;
    // TODO filtrar el resultaDO MAS FRECUENTE
    /*     for (const rvGeo of filtered) {
          locality = rvGeo.locality === locality ? locality : rvGeo.locality;
        } */
    return locality;
    /*  administrativeArea: "Galicia"
        areasOfInterest: ['22']
        countryCode: "ES"
        countryName: "Spain"
        latitude: 42.60845
        locality: "A Pobra do Caramiñal"
        longitude: -8.94333
        postalCode: "15948"
        subAdministrativeArea: "A Coruña"
        subLocality: ""
        subThoroughfare: "22"
        thoroughfare: "Lugar Agros" */
  }

}


export interface IReversedGeocoded {
  latadministrativeArea: string;
  areasOfInterest: string[];
  countryCode: string;
  countryName: string;
  latitude: number;
  locality: string;
  longitude: number;
  postalCode: string;
  subAdministrativeArea: string;
  subLocality: string;
  subThoroughfare: string;
  thoroughfare: string;
}
