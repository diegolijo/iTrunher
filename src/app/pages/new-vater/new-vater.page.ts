import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProPhoto } from '../../services/photo-provider';

@Component({
  selector: 'app-new-vater',
  templateUrl: './new-vater.page.html',
  styleUrls: ['./new-vater.page.scss'],
})
export class NewVaterPage implements OnInit {


  public cab64 = 'data:image/png;base64,'
  public fotos: string[] = [];

  constructor(
    private proPhoto: ProPhoto,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }



  public async launchTaekFoto() {
    const res = await this.proPhoto.takePhotoB64();
    this.fotos.push(res);
  }



  async close() {
    try {
      await this.modalController.dismiss({
        result: this.fotos[0]
      });
    } catch (err) {
      throw err;
    }
  }

}
