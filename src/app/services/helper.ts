import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController, Platform, PopoverController, ToastController } from '@ionic/angular';




// https://gist.github.com/marcelo-ribeiro/abd651b889e4a20e0bab558a05d38d77
const accentsMap = {
  a: 'á|à|ã|â|À|Á|Ã|Â',
  e: 'é|è|ê|É|È|Ê',
  i: 'í|ì|î|Í|Ì|Î',
  o: 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
  u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
  c: 'ç|Ç',
  n: 'ñ|Ñ',
};


export const slugify = text =>
  Object.keys(accentsMap).reduce((acc, cur) =>
    acc && typeof acc === 'string' ? (acc.replace(new RegExp(accentsMap[cur], 'g'), cur), text) : '');


@Injectable()
export class Helper {





  public fabLeftOffset = 0;
  public fabBtn: any;

  private toastMgs: HTMLIonToastElement;

  public confirmationAlert: HTMLIonAlertElement;
  private subscribeAlertBackButton: any;

  private subscribeBarcode: any;
  private timeOutLoader: any;


  constructor(
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private modalController: ModalController

  ) { }


  /**
   * funcion para centrar los fabList buttons
   *
   * uso:
   * <ion-fab #fabButton>
   * <ion-fab-button (click)="helper.centerFabList(fabButton, fabList)">
   * <ion-fab-list #fabList [ngStyle]="{'left.px':helper.fabLeftOffset}">
   *
   * alinear los iconos:
   * <ion-icon  style="position: absolute;left: 0em"> menos en el elemento de mayor ancho
   */
  /*   public centerFabList(fabButton: any, fabList: any) {
      this.fabBtn = fabButton;
      setTimeout(() => {
        const width = (fabList.el.clientWidth - this.fabBtn.el.clientWidth) / 2;
        this.fabLeftOffset = width * -1;
      }, 20);
    }
   */
  // cerramos la lista del fab
  public collapseFab() {
    if (this.fabBtn) {
      this.fabBtn.close();
    }
  }

  public removeItemAll(array, value): any[] {
    let i = 0;
    while (i < array.length) {
      if (array[i] === value) {
        array.splice(i, 1);
      } else {
        ++i;
      }
    }
    return array;
  }

  public getRemoveItemAll(array, value): any[] {
    let i = 0;
    const toret = [...array];
    while (i < toret.length) {
      if (toret[i] === value) {
        toret.splice(i, 1);
      } else {
        ++i;
      }
    }
    return toret;
  }

  public prepareDirection(dom, cp, pob, prov) {
    return [dom, cp + ', ' + pob + ' (' + prov + ')'];
  }

  public roundToFactor(value, factor) {
    const res = (Math.round(value * (10 ** factor)) / (10 ** factor));
    return res;
  }

  // ************************************************ ELEMENTOS UI ********************************************************

  /**
   * @param msg mensaje del loader
   * @param options
   *  spinner?: SpinnerTypes | null;
   *  message?: string;
   *  cssClass?: string | string[];
   *  showBackdrop?: boolean;
   *  duration?: number;
   *  translucent?: boolean;
   *  animated?: boolean;
   *  backdropDismiss?: boolean;
   *  mode?: Mode;
   *  keyboardClose?: boolean;
   *  id?: string;
   * }
   */
  public async showLoader(msg?: string, options?: any): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.closeLoader();
        if (res) {
          if (!this.timeOutLoader) {
            this.timeOutLoader = setTimeout(async () => {
              this.showException(
                'Tiempo excedido');
            }, 60 * 1000);
          }
          const opt = msg ? { message: msg, translucent: true, cssClass: 'loader-class' } : {};
          const appLoader = await this.loadingCtrl.create(options || opt);
          await appLoader.present();
          resolve(true);
          console.log('showLoader');
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * cierra los loader que haya en pantalla.
   * se llama a la recursiva por si hay mas de un loader presente
   */
  public async closeLoader(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let res = false;
        const loader = await this.loadingCtrl.getTop();
        if (loader) {
          clearTimeout(this.timeOutLoader);
          this.timeOutLoader = null;
          res = await loader.dismiss();
          console.log('closeLoader');
        }
        if (res) {
          await this.closeLoader();
        } else {
          resolve(true);
          return;
        }
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }


  public async showMessage(mes: any, toastColor?: string) {
    mes = typeof mes === 'string' ? mes : this.getErrorMsg(mes, '');
    await this.closeLoader();
    if (this.toastMgs && this.toastMgs.isConnected) {
      this.toastMgs.dismiss();
    }
    const options: any = {
      message: mes,
      cssClass: 'toastMarginBottom',
      position: 'bottom',
      duration: 2500,
      color: toastColor
    };
    this.toastMgs = await this.toastController.create(options);
    await this.toastMgs.present();


  }


  public async showClosableMessage(mes: any, funcion?: any) {
    await this.closeLoader();
    const loading = await this.loadingCtrl.create({ message: '' });
    loading.dismiss();
    const toast = await this.toastController.create({
      message: mes,
      cssClass: 'toastMarginBottom',
      position: 'bottom',

      keyboardClose: true,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          side: 'start',
          handler: () => {
            funcion();
          }
        }
      ]
    });
    await toast.present();
  }


  public async showException(error: any) {
    await this.closeLoader();
    let msg = '';
    if (typeof error.message !== 'undefined') {
      msg = error.message;
    } else if (typeof error.msg !== 'undefined') {
      msg = error.msg;
    } else if (typeof error.error !== 'undefined') {
      msg = error.error;
    } else if (typeof error === 'string') {
      msg = error;
    } else if (typeof error === 'object') {
      msg = this.getErrorMsg(error, msg);
    }

    const butons = [];

    if (error.stack) {
      butons.push({
        text: 'detalles',
        handler: async () => {
          this.showException(error.stack);
        }
      });
    }

    butons.push({
      text: 'aceptar',
      handler: async () => {
        this.alertCtrl.dismiss();
      }
    });

    const alert = await this.alertCtrl.create({
      message: msg,
      cssClass: 'msgException',
      keyboardClose: true,
      buttons: butons
    });
    await alert.present();
    await alert.onDidDismiss();
    console.log(msg);
  }


  /**
   * recorre las propiedades de un objeto e imprime su contenido, si ulguna propiedades es un objeto
   * realiza la operacion recursivamente
   */
  private getErrorMsg(error: any, msg: any) {
    for (const key in error) {
      if (Object.prototype.hasOwnProperty.call(error, key)) {
        if (typeof error[key] === 'object') {
          msg += this.getErrorMsg(error[key], msg);
        } else if (typeof error[key] === 'string') {
          msg += error[key] + '\n';
        }
      }
    }
    return msg ? msg : 'error indefinido';
  }


  /**
   * USO:
   *  const result = await this.helper.showConfirmationAlert(
   *    'titulo del mensaje',
   *    'cuerpo del mensaje'
   *    async () => { await this.functionAccept(); },
   *    () => { this.functionCancel(); });
   *
   *    los botones  cancelar y descartar se hacen visibles al pasarle una funcion por parametro.
   *    Si queremos que este visible pero no haga nada (p.ej boton cancelar para  cerrar el alert unicamente)
   *    le pasaremos una funcion vacía:   ()=>{}
   *
   * @returns  Promise<string> = 'accept'/'discard'/'cancel'/'isConnected' si ya hay un alert en pantalla
   */
  public async showConfirmationAlert(
    headerMsg: string,
    msg: string,
    functionAccept: any,
    functionCancel?: any,
    functionDiscard?: any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.closeLoader();
        if (this.confirmationAlert && this.confirmationAlert.isConnected) {
          resolve('isConnected');
          return;
        }
        if (!this.subscribeAlertBackButton || this.subscribeAlertBackButton.closed) {
          this.subscribeAlertBackButton = await this.platform.backButton.subscribeWithPriority(10000000000, async () => {
            const role = functionDiscard ? 'discard' : 'cancel';
            await this.confirmationAlert.dismiss(null, role);
          });
        }
        const options = {
          header: headerMsg,
          message: msg,
          buttons: [{
            text: 'aceptar',
            role: 'accept'
          }]
        };
        if (functionDiscard) {
          options.buttons.unshift({
            text: 'descartar',
            role: 'discard'
          });
        }
        if (functionCancel) {
          options.buttons.unshift({
            text: 'cancelar',
            role: 'cancel'
          });
        }
        this.confirmationAlert = await this.alertCtrl.create(options);
        await this.confirmationAlert.present();
        const res = await this.confirmationAlert.onDidDismiss();
        switch (res.role) {
          case 'accept':
            await functionAccept();
            break;
          case 'discard':
            await functionDiscard();
            break;
          case 'cancel':
            await functionCancel();
            break;
          default:
            break;
        }
        if (this.subscribeAlertBackButton && !this.subscribeAlertBackButton.closed) {
          await this.delay(100);
          this.subscribeAlertBackButton.unsubscribe();
        }
        resolve(res.role);
      } catch (err) {
        reject(err);
      }
    });
  }



  /**
   * cierra la interface  abierta en pantalla
   * utilizado para cerrar los dialogos desplegados de ion-select  cuando navegamos atras
   * devuelve true si cerro algun dialogo
   */
  public async closeSelects() {

    return new Promise(async (resolve, reject) => {
      try {
        let res = false;
        const popRes = await this.popoverCtrl.getTop();
        if (popRes) {
          res = await this.popoverCtrl.dismiss();
        }
        const actionRes = await this.actionSheetCtrl.getTop();
        if (actionRes) {
          res = await this.actionSheetCtrl.dismiss();
        }
        const alertRes = await this.alertCtrl.getTop();
        if (alertRes) {
          res = await this.alertCtrl.dismiss();
        }
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });

  }



  /**
   * comprobamos campos obligatorios (requiredFields) en cada uno de los elementos del array de entrada (data)
   * si falla lanza una excepcion indicando objeto y campo
   */
  public checkRequiredFields(data: any[], requiredFields: string[], object: string) {
    for (const row of data) {
      for (const field of requiredFields) {
        if (!row.hasOwnProperty(field)) {
          throw new Error('El campo ' + field + ' es obligatorio en ' + object + '\n');
        } else {
          for (const key in row) {
            if (Object.prototype.hasOwnProperty.call(object, key) && key === field && row[key] === '') {
              throw new Error('El campo ' + field + ' es obligatorio en ' + object + '\n');
            }
          }
        }
      }
    }
  }



  public generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line: no-bitwise
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


  public isNumber(dato) {
    const valoresAceptados = /^(-)?[0-9]*(\.?)[0-9]+$/;
    if (dato.match(valoresAceptados)) {
      return true;
    } else {
      return false;
    }
  }

  // valida un número aun no terminado, ej: 56.
  public canBeNumber(dato) {
    const valoresAceptados = /^(-)?[0-9]*(\.?)([0-9]?)+$/;
    if (dato.match(valoresAceptados)) {
      return true;
    } else {
      return false;
    }
  }

  public isDefined(dato) {
    let res = false;
    if (dato != null) {
      res = true;
    }
    return res;
  }

  public hasLength(dato) {
    let res = false;
    if (Array.isArray(dato)) {
      res = (dato.length > 0) ? true : false;
    }
    return res;
  }

  /**
   *  comprueba el valor proporcionado (key) está contenido en alguna de las propiedades de los objetos contenidos en el array (arrayIn)
   */
  public async search(arrayIn: any[], key: string, minValues: number) {
    if (key.length >= minValues) {
      key = slugify(key).normalize('NFD').toUpperCase();
      const foundValues: any[] = [];
      const arrayValues: any[] = [];
      for (const value of arrayIn) {
        // hacemnos una copia de los elementos para pasar a mayusculas suprimir acentos..
        const res = Object.assign({}, value);
        arrayValues.push(res);
      }
      // recorremos los elementos del array de entrada
      for (let i = 0; i < arrayValues.length; i++) {
        const element = arrayValues[i];
        // recorremos las propiedades de cada elemento
        for (const prop in element) {
          // propiedades directas no heredadas
          if (element.hasOwnProperty(prop)) {
            if (typeof element[prop] === 'string') {
              // eliminamos acentos y pasamos a mayusculas
              element[prop] = slugify(element[prop]).normalize('NFD').toUpperCase();
              // comprobamos si cointiene el valor a buscar
              if (element[prop].includes(key)) {
                // buscamos el elemento original por el indice
                foundValues.push(arrayIn[i]);
                break;
              }
            } else if (Array.isArray(element[prop])) {
              // buscamos recursivamente con las propiedades que sean un array
              const result = await this.search(element[prop], key, minValues);
              if (result.length > 0) {
                // buscamos el elemento original por el codex
                foundValues.push(arrayIn[i]);
                break;
              }
            }
          }
        }
      }
      return foundValues;
    }
    return arrayIn;
  }





  public delay(ms: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }

  /**
   * imprime en ms el tiempo que tarda en realizarse la funcion que se pasa por parametro
   *
   *       USO:
   *
   *       await this.helper.countMillis(async () => {
   *         await this.updateDB();
   *       });
   */
  public async countMillis(funcion: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const startCount = new Date();
        await funcion();
        const endCount = new Date();
        console.log('Operation took ' + (endCount.getTime() - startCount.getTime()) + ' msec.');
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });

  }


  public abs(n: number) {
    return Math.abs(n);
  }


}

