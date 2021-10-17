/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { IFileFotos } from '../pages/fotos-modal/fotos-modal.page';




@Injectable()
export class ProPhoto {

  public cab64 = 'data:image/jpg;base64,';

  public static CAM_QUALITY = 50;

  public photos: IFileFotos[] = [];
  public base64Image: string;
  public imageData: any;

  constructor(
    private camera: Camera
  ) { }



  /**
   * llama a la aplicacion nativa de la camara
   * devuelve una foto en base64
   */
  public async takePhotoB64() {
    const options: CameraOptions = {
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
      quality: ProPhoto.CAM_QUALITY,
      destinationType: this.camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: false
    };
    return await this.camera.getPicture(options);
  }

  /**
   * llama a la aplicacion nativa de la camara
   * devuelve la ubicacion de la foto (cache)        this.fileUtil.copyTempImageToPartesFolder(tempImage, codex);
   */
  public async takePhoto() {
    const options: CameraOptions = {
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
      quality: ProPhoto.CAM_QUALITY,
      destinationType: this.camera.DestinationType.FILE_URI,
      saveToPhotoAlbum: false
    };
    return await this.camera.getPicture(options);
  }




}
