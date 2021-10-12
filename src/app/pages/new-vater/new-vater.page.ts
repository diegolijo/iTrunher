import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Api, IApiLatLangs } from 'src/app/services/api';
import { ProPhoto } from '../../services/photo-provider';

@Component({
  selector: 'app-new-vater',
  templateUrl: './new-vater.page.html',
  styleUrls: ['./new-vater.page.scss'],
})
export class NewVaterPage implements OnInit {


  public cab64 = 'data:image/jpg;base64,'
  public fotos: string[] = [];

  constructor(
    private proPhoto: ProPhoto,
    private modalController: ModalController,
    private api: Api
  ) { }

  ngOnInit() {
  }



  public async launchTaekFoto() {
    const res = await this.proPhoto.takePhotoB64();
    this.fotos.push(res);
  }


  public async insertDB() {
    const latLng: IApiLatLangs = this.api.emptyApiLatLangs();
    latLng.foto = this.fotos[0];
    latLng.descripcion = '',
      latLng.lat = '',
      latLng.lng = '',
      latLng.locality = '',
      latLng.name = 'PRUEBA',
      latLng.puntuacion = 5

    await this.api.insertLatLangs([latLng]);
  }


  async close() {
    try {
      this.insertDB();

      await this.modalController.dismiss({
        result: this.fotos[0]
      });
    } catch (err) {
      throw err;
    }
  }

}
