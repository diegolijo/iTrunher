/* eslint-disable @typescript-eslint/dot-notation */
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Api, IApiLatLangs } from 'src/app/services/api';
import { Helper } from '../../services/helper';
import { ProPhoto } from '../../services/photo-provider';

@Component({
  selector: 'app-new-vater',
  templateUrl: './new-vater.page.html',
  styleUrls: ['./new-vater.page.scss'],
})
export class NewVaterPage implements OnInit {

  @Input() newMarker: any;

  public cab64 = 'data:image/jpg;base64,';
  public foto = '';

  public vater: IApiLatLangs;

  constructor(
    private proPhoto: ProPhoto,
    private modalController: ModalController,
    private api: Api,
    private helper: Helper
  ) { }

  ngOnInit() {
    this.vater = this.api.emptyApiLatLangs();
    // this.newMarker;

  }



  public async launchTakeFoto() {
    const res = await this.proPhoto.takePhotoB64();
    this.foto = res;
  }


  public async insertDB() {
    await this.helper.showLoader('Guardando...');
    const latLng: IApiLatLangs = this.api.emptyApiLatLangs();
    latLng.foto = this.foto;
    latLng.descripcion = this.newMarker.embebedObject['descripcion'];
    latLng.lat = this.newMarker.embebedObject.latitude.toString();
    latLng.lng = this.newMarker.embebedObject.longitude.toString();
    latLng.locality = this.newMarker.embebedObject.administrativeArea +
      ' ' + this.newMarker.embebedObject.subAdministrativeArea +
      ' ' + this.newMarker.embebedObject.locality +
      ' ' + this.newMarker.embebedObject.thoroughfare +
      ' ' + this.newMarker.embebedObject.subThoroughfare;
    latLng.name = this.newMarker.embebedObject['name'];
    latLng.puntuacion = 0;
    const res = await this.api.insertLatLangs([latLng]);
    await this.helper.closeLoader();
    this.close();
  }


  async close() {
    try {
      this.modalController.dismiss({});
    } catch (err) {
      throw err;
    }
  }

}
