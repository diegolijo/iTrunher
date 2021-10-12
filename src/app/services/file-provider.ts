import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';


@Injectable()
export class ProFile {



  public dataPath: string;
  public appPath: string;
  public idejPath: string;
  public backUpPath: string;
  public partesPath: string;
  public actionsPath: string;
  public idej: any;
  public backUpDirectoryEntry: any;
  public idejDirectoryEntry: any;
  public partesDirectoryEntry: any;
  public extDirectoryEntry: any;
  public actionsDirectoryEntry: any;
  private APP_DIRECTORY = 'iTruñer'


  constructor(
    private file: File,
    private webview: WebView
  ) {

  }

  // recuperamos los directorios de la app si no existen se contruyen
  public async getDirectories() {
    return new Promise(async (resolve, reject) => {
      try {

        this.dataPath = this.file.externalRootDirectory; // o .dataDirectory
        this.appPath = this.dataPath + this.APP_DIRECTORY + '/';
        try {
          this.extDirectoryEntry = await this.file.createDir(this.dataPath, this.APP_DIRECTORY, false);
        } catch (err) {
          this.extDirectoryEntry = await this.file.resolveDirectoryUrl(this.appPath);
        }

        resolve(true);
      } catch (err) {
        reject(err);
      }
    });

  }



  /**
   * busca el directorio  proporcionado, si no existe lo crea
   */
  public async findDirectory(codex: string, documentPath: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let result;
        try {
          result = await this.file.createDir(documentPath, codex, false);
        } catch (err) {
          const codexDir = documentPath + codex;
          result = await this.file.resolveDirectoryUrl(codexDir);
        }
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });

  }

/*
   * lee la carpeta de fotos del parte o accion seleccionados, devuelve un arr con todas las fotos
   * @param codex  id de la carpeta
   * @param type  el tipo de documento ('P':partes / 'A':acciones)
   * @return IFileFotos[]

  public async getFolderFotos(codex: string, type: string): Promise<IFileFotos[]> {

    return new Promise(async (resolve, reject) => {
      try {
        const arrFotos: IFileFotos[] = [];
        let documentPath;
        switch (type) {
          case 'P':
            documentPath = this.partesPath;
            break;
          case 'A':
            documentPath = this.actionsPath;
            break;
          default:
            break;
        }
        const codexDirectory = await this.findDirectory(codex, documentPath);
        const res = await codexDirectory.createReader();
        res.readEntries(async (entries) => {
          if (entries.length > 0) {
            for (const entry of entries) {
              const description = await this.fotos.getDescription(this.idej, entry.nativeURL);
              const nombre = entry.name;
              const ruta = entry.nativeURL.substr(0, entry.nativeURL.lastIndexOf('/') + 1);
              const converted = await this.webview.convertFileSrc(entry.nativeURL);
              arrFotos.push({ name: nombre, url: converted, path: ruta, isSelected: false, descripcion: description });
            }
          }
          resolve(arrFotos);
        },
          (error) => {
            reject(error);
          });
      } catch (error) {
        throw (error);
      }
    });
  } */



  // copia una foto del directorio cache a findPartCodexDirectory(), devuelve la ruta
  public async copyTempImageToFolder(tempImage: string, codex: string, type: string) {

    const tempFilename = tempImage.substr(tempImage.lastIndexOf('/') + 1);
    const tempBaseFilesystemPath = tempImage.substr(0, tempImage.lastIndexOf('/') + 1);

    let documentPath;
    switch (type) {
      case 'P':
        documentPath = this.partesPath;
        break;
      case 'A':
        documentPath = this.actionsPath;
        break;
      default:
        break;
    }
    const codexDirectory = await this.findDirectory(codex, documentPath);
    if (codexDirectory) {
      return await this.file.copyFile(tempBaseFilesystemPath, tempFilename, codexDirectory.nativeURL, tempFilename);
    }
  }

  // guarda una foto en el directorios de acciones o partes  a partir de un Blob, devuelve la ruta
/*   public async saveBlobImageToFolder(tempImage: Blob, codex: string, type: string) {

    const Filename = new Date().getTime().toString() + JPG_EXTENSION;
    let documentPath;
    switch (type) {
      case 'P':
        documentPath = this.partesPath;
        break;
      case 'A':
        documentPath = this.actionsPath;
        break;
      default:
        break;
    }
    const codexDirectory = await this.findDirectory(codex, documentPath);
    if (codexDirectory) {
      return await this.file.writeFile(codexDirectory.nativeURL, Filename, tempImage, { replace: true });
    }
  } */

  /** convierte Base64 a Blob.jpg
   * @param b64Data  Cadena base64 pura sin contentType
   * @param contentType  el tipo de contenido del archivo, es decir (imagen /jpeg -imagen /png -texto /plano)
   * @param sliceSize   SliceSize para procesar los bytes de caracteres
   * @return Blob
   */
  public async b64toBlob(b64Data, contentType?, sliceSize?) {

    contentType = contentType || 'data:image/jpeg;base64,';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }


  public async toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


  public async moveToBackUpFotos() {
    let result;
    try {
      const backUpPath = this.idej + '_' + new Date().getTime().toString();
      result = await this.file.moveDir(this.appPath, this.idej, this.backUpPath, backUpPath);
    } catch (err) {
      throw (result + ' ' + err);
    }
    return result;
  }







}

