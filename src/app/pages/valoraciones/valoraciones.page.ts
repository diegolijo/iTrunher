import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-valoraciones',
  templateUrl: './valoraciones.page.html',
  styleUrls: ['./valoraciones.page.scss'],
})
export class ValoracionesPage implements OnInit {

  public puntuacion = 3;

  constructor() { }

  ngOnInit() {
  }

}
