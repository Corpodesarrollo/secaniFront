import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta-caso-critico',
  templateUrl: './tarjeta-caso-critico.component.html',
  styleUrls: ['./tarjeta-caso-critico.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TarjetaCasoCriticoComponent implements OnInit {

  @Input() caso: any;

  color : any;
  badge: any;

  hoy = new Date();

  constructor() { }

  ngOnInit() {


    if ( this.caso.alertaId == 2){
      this.color = '#FF9801';
      this.badge = 'warning';
    }
    if ( this.caso.alertaId == 3){
      this.color = '#EC2121';
      this.badge = 'danger';
    }

  }


  calcularTiempoTranscurrido(fech1: any, fech2: any) {


    const fechaInicio = new Date(fech1);
    const fechaFin = new Date(fech2);

    let anos = fechaFin.getFullYear() - fechaInicio.getFullYear();
    let meses = fechaFin.getMonth() - fechaInicio.getMonth();
    let dias = fechaFin.getDate() - fechaInicio.getDate();

    if (dias < 0) {
      meses--;
      const diasEnMes = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 0).getDate();
      dias += diasEnMes;
    }

    if (meses < 0) {
      anos--;
      meses += 12;
    }

    return  `${anos} años, ${meses} meses, ${dias} días`;
  }

}
