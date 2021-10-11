import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ProHttp {

  constructor(
    private httpBrowser: HttpClient
  ) {
  }


  public post(url: string, body: any, headers: any) {
    return new Promise((resolve: any, reject: any) => {
      this.httpBrowser.post(url, body, headers).subscribe((res: any) => {
        try {
          resolve(JSON.parse(res));
        } catch (err) {
          resolve(res);
        }
      }, (err: any) => {
        reject(err);
      });
    });
  }

}
