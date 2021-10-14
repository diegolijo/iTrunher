
import { Injectable } from '@angular/core';
import { ProHttp } from './http-provider';
@Injectable()
export class Api {

  // 'http://localhost/ApiTrunher.php'
  // 'https://vayapedal.com/API/datos.php'
  private static url = 'https://vayapedal.com/API/datos.php' ;



  constructor(
    private proHtml: ProHttp
  ) {
  }



  public getLatLangs(): Promise<IApiLatLangs[]> {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const headers = {
          responseType: 'json'
        };
        const body: any = {
          action: 'get_latlangs',
          table: 'LATLANGS',
          id: 1
        };
        const res = await this.proHtml.post(Api.url, body, headers);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  }

  public insertLatLangs(items: IApiLatLangs[]) {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const headers = {
          responseType: 'text'
        };
        const body: any = {
          action: 'insert_latlangs',
          data: items
        };
        const res = await this.proHtml.post(Api.url, body, headers);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  }

  public deleteLatLangs() {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const headers = {
          responseType: 'text'
        };
        const body: any = {
          action: 'delete_latlangs',
          id: 12
        };
        const res = await this.proHtml.post(Api.url, body, headers);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  }


  emptyApiLatLangs(): IApiLatLangs {
    return {
      id: 0,
      lat: '',
      lng: '',
      descripcion: '',
      name: '',
      locality: '',
      puntuacion: 0,
      foto: ''
    };
  }



}

export interface IApiLatLangs {
  id: number;
  lat: string;
  lng: string;
  descripcion: string;
  name: string;
  locality: string;
  puntuacion: number;
  foto: string;
}
