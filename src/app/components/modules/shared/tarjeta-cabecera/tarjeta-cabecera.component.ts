import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta-cabecera',
  templateUrl: './tarjeta-cabecera.component.html',
  styleUrls: ['./tarjeta-cabecera.component.css'],
  standalone: true,
})
export class TarjetaCabeceraComponent implements OnInit {
  @Input() usuario: any;
  constructor() { }

  ngOnInit() {
  }

}
