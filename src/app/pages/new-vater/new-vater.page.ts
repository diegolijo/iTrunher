import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Api, IApiLatLangs } from 'src/app/services/api';
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
    private api: Api
  ) { }

  ngOnInit() {
    this.vater = this.api.emptyApiLatLangs();
    this.newMarker;

  }



  public async launchTakeFoto() {
    const res = await this.proPhoto.takePhotoB64();
    this.foto = res;
  }


  public async insertDB() {

    const latLng: IApiLatLangs = this.api.emptyApiLatLangs();
    latLng.foto = this.foto;
    latLng.descripcion = '';
    latLng.lat = '';
    latLng.lng = '';
    latLng.locality = '';
    latLng.name = 'PRUEBA';
    latLng.puntuacion = 5;

    await this.api.insertLatLangs([latLng]);
  }


  async close() {
    try {
      this.modalController.dismiss({});
    } catch (err) {
      throw err;
    }
  }

}
