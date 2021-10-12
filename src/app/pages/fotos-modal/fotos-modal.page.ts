import { Component, Input, NgZone, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { ProFile } from 'src/app/services/file-provider';
import { Helper } from 'src/app/services/helper';
import { ProPhoto } from 'src/app/services/photo-provider';










@Component({
  selector: 'fotos-modal',
  templateUrl: './fotos-modal.page.html',
  styleUrls: ['./fotos-modal.page.scss'],
})
export class FotosModalPage implements OnInit {
  @Input() idej: string;
  @Input() parteCodex: string;
  @Input() actionCodex: string;
  @Input() inputDocumentType: string; // tipo de elemento al que pertenecen las fotos : partes:'P' acciones: 'A'



  // Fotos
  public pagePhotos: IFileFotos[] = [];
  public FotoSize = 1;
  public countPhotoSelected = 0;
  public ghostClick = false;
  public editingFoto = false;
  public fotoSelected: IFileFotos;

  private subscribeBackButton: any;
  // public confirmAlert: HTMLIonAlertElement;


  constructor(
    private platform: Platform,
    private proFile: ProFile,
    private file: File,
    private photoViewer: PhotoViewer,
    private modalCtrl: ModalController,
    private ngZone: NgZone,
    public proPhoto: ProPhoto,
    public helper: Helper,


  ) { }

  ngOnInit() {
    try {
   /*    switch (this.inputDocumentType) {
        case this.PARTES:
          this.folderCodex = this.parteCodex;
          break;
        case this.ACCIONES:
          this.folderCodex = this.actionCodex;
          break;
        default:
          break;
      }
      this.getPagePhotos(); */
      this.subscribeToBackButton();
    } catch (err) {
      this.helper.showException(err);
    }
  }

  // ********************************** datos *************************************/

  public async getPagePhotos() {
    try {
      if (this.platform.is('cordova')) {
/*         this.pagePhotos = await this.proFile.getFolderFotos(this.folderCodex, this.inputDocumentType);
        this.fotoSelected = this.emptyIFileFotos(); */

      } else {

        this.pagePhotos.push({
          name: '', url: 'assets/img/FotosPrueba/1612190981070.jpg',
          path: '', isSelected: false, descripcion: 'descripcion zsdfasdf ddfssdf sdefsdfs sdfsdfsdfsdfs '
        });
        this.pagePhotos.push({
          name: '', url: 'assets/img/FotosPrueba/1612193685316.jpg',
          path: '', isSelected: false, descripcion: 'descripcion'
        });
        this.pagePhotos.push({
          name: '', url: 'assets/img/FotosPrueba/1612253445952.jpg',
          path: '', isSelected: false, descripcion: 'descripcion'
        });
        this.pagePhotos.push({
          name: '', url: 'assets/img/FotosPrueba/1612253455739.jpg',
          path: '', isSelected: false, descripcion: 'descripcion'
        });
        this.pagePhotos.push({
          name: '', url: 'assets/img/FotosPrueba/1612253463828.jpg',
          path: '', isSelected: false, descripcion: 'descripcion'
        });
        this.pagePhotos.push({
          name: '', url: 'assets/img/FotosPrueba/1612253474847.jpg',
          path: '', isSelected: false, descripcion: 'descripcion'
        });
        this.pagePhotos.push({
          name: '', url: 'assets/img/FotosPrueba/1612253483362.jpg',
          path: '', isSelected: false, descripcion: 'descripcion'
        });
      }
    } catch (err) {
      await this.helper.showException(err);
    }
  }

  // ********************************* events *************************************


  public async onClickPhoto(index: number) {
    try {

    } catch (err) {
      this.helper.showException(err);
    }
  }







  public async onClicTakePhoto() {
    try {
      this.unSubscribeBackButton();
      await this.takeFoto();
    } catch (err) {
      this.helper.showMessage(err);
    } finally {
      this.subscribeToBackButton();
    }
  }



  // ************************************** fuctions ********************************************

  public showPhoto(index) {
    try {
      const options = {
        share: true
      };
      this.photoViewer.show(this.pagePhotos[index].path + this.pagePhotos[index].name, this.pagePhotos[index].descripcion, options);
    } catch (err) {
      this.helper.showException(err);
    }
  }




  private async takeFoto() {
    try {
      let b64Image;
      try {
        b64Image = await this.proPhoto.takePhotoB64();
        this.pagePhotos.push(b64Image);
      } catch (err) {
        return;
      }
      const blobImage = await this.proFile.b64toBlob(b64Image);

    } catch (err) {
      this.helper.showException(err);
    }
  }







  async close() {
    try {
      this.unSubscribeBackButton();
      await this.modalCtrl.dismiss({
        result: 'cancelled'
      });
    } catch (err) {
      this.helper.showException(err);
    }
  }

  // ******************************************** subscribes  ***************************************
  // Back butom
  public async subscribeToBackButton() {
    try {
      if (!this.subscribeBackButton || this.subscribeBackButton.closed) {
        this.subscribeBackButton = await this.platform.backButton.subscribeWithPriority(10000, () => {
          this.subscribeEvent();
        });
      }
    } catch (err) {
      this.helper.showException(err);
    }
  }


  private async unSubscribeBackButton() {
    try {
      if (this.subscribeBackButton && !this.subscribeBackButton.closed) {
        await this.subscribeBackButton.unsubscribe();
      }

    } catch (err) {
      this.helper.showException(err);
    }
  }

  /**
   * manejador del evento del boton analogico atras
   * ejecutamos las ordenes por prioridad
   */
  public async subscribeEvent() {
    try {
      if (this.subscribeBackButton && !this.subscribeBackButton.closed) {
       this.close();
      }

    } catch (err) {
      this.helper.showException(err);
    }
  }


  public emptyIFileFotos(): IFileFotos {
    return {
      name: '',
      url: '',
      path: '',
      isSelected: false,
      descripcion: ''
    };
  }
}


export interface IFileFotos {
  name: string;
  url: string;
  path: string;
  isSelected: boolean;
  descripcion: string;
}
