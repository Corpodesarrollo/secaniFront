import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TarjetaCasoCriticoComponent } from '../tarjeta-caso-critico/tarjeta-caso-critico.component';
@Component({
  selector: 'app-tarjetaKPI',
  templateUrl: './tarjetaKPI.component.html',
  styleUrls: ['./tarjetaKPI.component.css'],
  standalone: true,
  imports: [ChartModule, TarjetaKPIComponent, TarjetaCasoCriticoComponent, CommonModule,],
})
export class TarjetaKPIComponent implements OnInit {

  estilo: any;

  @Input() data: any;



  constructor() {


  }

  ngOnInit() {
    if(this.data.porcentaje.startsWith("-")){
      this.estilo = false;
    }
    else
      this.estilo = true;
  }

}
