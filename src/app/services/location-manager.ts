import { Injectable } from '@angular/core';
 import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Subject, Subscription } from 'rxjs';

@Injectable()
export class LocationManager {

    public lastLocation;
    public locationObservable = new Subject<any>();
    private locationSubscription: Subscription;
    private watchId: number;


    constructor(
        private geolocation: Geolocation
    ) { }


    public initWatchPosition() {
        if (!this.locationSubscription || this.locationSubscription.closed) {
            const HighAccOpt = {
                enableHighAccuracy: false,
                timeout: 1000 * 10,
                //   maximunAge: 10 * 1000
            };
            this.watchId = navigator.geolocation.watchPosition(
                (resp: any) => {
                    this.locationObservable.next(resp);
                    this.lastLocation = resp;
                }, (error: any) => {
                    throw error;
                },
                HighAccOpt);
        }
    }

    public stopGeolocating() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
        }
    }


    public async getCurrentPosition() {
        return new Promise(async (resolve, reject) => {
            try {
                const HighAccOpt = {
                    enableHighAccuracy: true,
                    timeout: 1000 * 10,
                    //   maximunAge: 10 * 1000
                };
                this.lastLocation = await this.geolocation.getCurrentPosition(HighAccOpt);
                resolve(this.lastLocation);
            } catch (err) {
                reject(err);
            }
        });
    }




}
