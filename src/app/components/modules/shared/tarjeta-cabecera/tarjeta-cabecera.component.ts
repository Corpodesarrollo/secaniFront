import { Component, Input, OnInit } from '@angular/core';
import { BotonNotificacionComponent } from '../../boton-notificacion/boton-notificacion.component';

@Component({
  selector: 'app-tarjeta-cabecera',
  templateUrl: './tarjeta-cabecera.component.html',
  styleUrls: ['./tarjeta-cabecera.component.css'],


  standalone: true,
  imports: [BotonNotificacionComponent],
})
export class TarjetaCabeceraComponent implements OnInit {
  @Input() usuario: any;
  constructor() { }

  ngOnInit() {
  }

}
