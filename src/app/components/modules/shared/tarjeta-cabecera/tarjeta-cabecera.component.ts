import { Component, Input, OnInit } from '@angular/core';
import { BotonNotificacionComponent } from '../../boton-notificacion/boton-notificacion.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarjeta-cabecera',
  templateUrl: './tarjeta-cabecera.component.html',
  styleUrls: ['./tarjeta-cabecera.component.css'],


  standalone: true,
  imports: [BotonNotificacionComponent, CommonModule],
})
export class TarjetaCabeceraComponent implements OnInit {
  @Input() usuario: any;
  @Input() visible: any = 'true';

  constructor() { }

  ngOnInit() {
  }

}
