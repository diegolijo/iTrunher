
import { Injectable } from '@angular/core';
import { ProHttp } from './http-provider';
@Injectable()
export class Api {

  private static localUrl = 'http://localhost/trunerDB.php';
  private static url = 'https://vayapedal.com/API/datos.php';

  constructor(
    private proHtml: ProHttp
  ) {
  }



  public getLatLangs(): Promise<any> {
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

  public insertLatLangs(items: any[]) {
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

}

export interface ApiLatLangs {
  id: number;
  lat: string;
  lng: string;
  descripcion: string;
  name: string;
}
