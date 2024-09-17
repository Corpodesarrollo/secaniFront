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

  constructor() { }

  ngOnInit() {

    if ( this.caso.estado == 'EN TRÁMITE'){
      this.color = '#FF9801';
      this.badge = 'warning';
    }
    else {
      this.color = '#EC2121';
      this.badge = 'danger';
    }

  }

}
