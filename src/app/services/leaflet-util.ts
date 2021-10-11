/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
import { Injectable } from '@angular/core';
import { icon, latLng, latLngBounds, Map, marker, tileLayer, popup, point, DomEvent, DomUtil, featureGroup } from 'leaflet';
import { Subject } from 'rxjs';
import { Helper } from './helper';
import { LocationManager } from './location-manager';



@Injectable()
export class LeafletUtil {

  public readonly vaterIcon = '/assets/img/vaterIcon.png';
  public readonly sucessIcon = '/assets/img/markerIconSuccess.png';
  public readonly warningIcon = '/assets/img/markerIconWarning.png';
  public readonly dangerIcon = '/assets/img/markerIconDanger.png';
  public readonly deviceIcon = '/assets/img/positionIcon.png';


  /* terreno */
  public readonly terrenoLayer = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  /* topo */
  public readonly topoLayer = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';


  //  subscribe
  public mapObservable = new Subject<boolean>();
  public devicePosition: marker;


  constructor(
    private locationManager: LocationManager,
    private helper: Helper
  ) { }



  /******************************* MAPA ********************************
   * @param map leaflet Map
   * @param elMap HTMLElement <div id="map" #map class="mapa"></div>
   * @param layer capa del terreno
   * @param zoom nivel de zoom de inicio
   * @param minZ zoom minimo
   * @param maxZ  zoom maximo
   * @param centerPoint punto central de inicio
   * @param funcion funcion onClick en el mapa
   */
  public loadMap(
    map: Map, elMap: HTMLElement, layer: string, zoom: number, minZ: number, maxZ: number, centerPoint: any, funcion: any): Map {
    return new Promise(async (resolve, reject) => {
      try {
        await this.clearMap(map);
        const mapOptions = {
          maxBounds: latLngBounds(latLng(90, 2000), latLng(-90, -2000)),
          attributionControl: false,
          zoomControl: false,
          zoomSnap: 0.1,
          bounceAtZoomLimits: false,
          doubleClickZoom: false,
          closePopupOnClick: false,
          maxBoundsViscosity: 1.0
        };
        const layerOptions = {
          minZoom: minZ,
          maxZoom: maxZ
        };
        map = new Map(elMap, mapOptions).setView(centerPoint, zoom);
        tileLayer(layer, layerOptions).addTo(map);

        map.on('click', (e) => {
          funcion(e);
        });
        this.initWatchPosition(map);
        resolve(map);
      } catch (err) {
        reject(err);
      }
    });
  }




  public clearMap(map: Map): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        if (map) {
          await map.off('dblclick');
          await map.off('click');
          await map.remove();
          map = null;
        }
        this.locationManager.stopGeolocating();
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });

  }

  /****************************** POPUPS ******************************/

  public async createPopup(mapParte: any, map: Map, popUp: popup, onClickNavBtn: any, onClickListBtn: any) {
    await map.closePopup();
    await this.helper.delay(200); // para que el clicklistener funcione si cambiamos de popoup sin cerrar el anterior
    popUp = popup(
      {
        minWidth: 200,
        autoPanPaddingTopLeft: point(0, 20)
      });
    popUp.setLatLng(mapParte.latlng);
    const html = this.generatePopupHTML(mapParte);
    popUp.setContent(html);
    popUp.openOn(map);

    const btnNav = DomUtil.get('btnNav');
    DomEvent.addListener(btnNav, 'click', () => {
      onClickNavBtn(mapParte.latlng);
    });

    const btnList = DomUtil.get('btnList');
    DomEvent.addListener(btnList, 'click', () => {
      onClickListBtn(mapParte.partes[0].pt_ccl);
    });

    return popUp;
  }

  private generatePopupHTML(mapParte: any) {
    let html2 = `<div  style="text-align:center">
               <p style="margin-top: 1em; margin-bottom: 0em; font-weight: bolder; width:100%;">${mapParte.dlName}<br>partes:</p>`;
    for (const parte of mapParte.partes) {
      const color = parte.pt_prio === '02' ? 'var(--ion-color-sucess)' :
        parte.pt_prio === '03' ? 'var(--ion-color-warning)' :
          parte.pt_prio === '04' ? 'var(--ion-color-danger)' : 'var(--ion-color-dark)';
      html2 += `<li style="color:${color};  margin: 0 0 0 -1.5em">
              ${parte.codex} ${parte.pt_tipo} ${parte.pt_fecp}</li>`;
    }
    html2 += `<div style = "display:flex;flex-direction: row;justify-content: space-evenly; margin-top: 1em" >
                          <ion-button color="secondary" fill="outline"  id="btnNav" style="width: 2.5em; height: 2.5em;" >
                              <ion-icon name="navigate-circle-outline"  size="large" style ="position:absolute"></ion-icon>
                          </ion-button>
                          <ion-button color="secondary" fill="outline" id="btnList" style ="width: 2.5em; height: 2.5em;" >
                              <ion-icon name="list-outline" size="large" style ="position:absolute" ></ion-icon>
                          </ion-button>
                        </div>
                      </div>`;
    return html2;
  }

  /****************************** MARKERS ******************************/

  public crateLocationMarker(latlng: any, sIcon: string, onClickFuncion: any, options?: any): marker {
    const opt = {
      icon: icon({
        iconUrl: sIcon,
        shadowUrl: options ? options.shadowUrl : [30, 30],
        iconSize: options ? options.iconSize : [30, 30], // size of the icon
        iconAnchor: options ? options.iconAnchor : [16, 30], // point of the icon which will correspond to marker's loc
        shadowAnchor: options ? options.shadowAnchor : [0, 0],  // the same for the shadow
        shadowSize: options ? options.shadowSize : [0, 0], // size of the shadow
        popupAnchor: options ? options.popupAnchor : [0, 0] // point from which  popup should open relat to the iconAnch
      })
    };
    const markr: marker = marker(latLng(latlng.lat, latlng.lng), opt);
    markr.on('click', (e) => {
      onClickFuncion(e);
    });
    return markr;
  }


  public addMarkersToMap(map: Map, markers: marker[]) {
    const group = new featureGroup(markers);
    group.addTo(map);
    return group;
  }

  public addMarkerToMap(map: Map, marker: marker) {
    marker.addTo(map);
  }



  // **************************************** DEVICE POSITION ***********************************

  public async initWatchPosition(map: Map) {
    this.devicePosition = this.crateLocationMarker(
      map.getCenter(),
      this.deviceIcon,
      () => { this.flyToDevicePosition(map); },
      { iconSize: [16, 16], iconAnchor: [8, 8] });
    this.devicePosition.addTo(map);

    this.locationManager.initWatchPosition();
    this.locationManager.locationObservable.subscribe((location) => {
      this.updateDeviceLocation(location);
    });
  }


  private flyToDevicePosition(map: any): any {
    return map.flyTo(this.devicePosition._latlng, map.getZoom());
  }



  private updateDeviceLocation(location) {
    this.devicePosition.setLatLng({ lat: location.coords.latitude, lng: location.coords.longitude });
  }



  /*  public emptyIMapPartes(): IMapPartes {
      return {
        dlCodex: '',
        dlName: '',
        partes: [],
        latlng: {},
        marker: {},
        icon: {},
      };
    }

  }




  *
   * objeto para posicionar partes en el mapa

  export interface IMapPartes {
    dlCodex: string;
    dlName: string;
    partes: IParte[];
    latlng: latLng;
    marker: marker;
    icon: icon;
  } */

}
