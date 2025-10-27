import { Component, Input, OnInit } from '@angular/core';
import { BotonNotificacionComponent } from '../../boton-notificacion/boton-notificacion.component';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/services/user';

@Component({
  selector: 'app-tarjeta-cabecera',
  templateUrl: './tarjeta-cabecera.component.html',
  styleUrls: ['./tarjeta-cabecera.component.css'],


  standalone: true,
  imports: [BotonNotificacionComponent, CommonModule],
})
export class TarjetaCabeceraComponent implements OnInit {
  usuario: any;
  @Input() visible: any = 'true';

  user = new User();

  constructor() { }

  ngOnInit() {
    this.usuario = this.user.name;
  }

}
