import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { TpParametros } from '../../../core/services/tpParametros';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estado-nna',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estado-nna.component.html',
  styleUrl: './estado-nna.component.css'
})
export class EstadoNnaComponent {
  @Input() nnaEstadoId: number = 0;
  estado:string = 'Registrado';
  colorTxt:string = 'white';
  colorBg:string = '#73b7ad';

  constructor(private tpp: TpParametros) {
  }

  async ngOnChanges(changes: SimpleChanges) {
    let estadosNNA = await this.tpp.getTpEstadosNNA();
    let estado: { id: number; nombre: string; colorText: string; colorBG: string } | undefined;
    if (estadosNNA) {
      estado = estadosNNA.find((x: { id: number }) => x.id === this.nnaEstadoId);
      console.log(estado);
    }
    this.estado = estado?.nombre ?? '';
    this.colorTxt = estado?.colorText ?? 'white';
    this.colorBg = estado?.colorBG ?? '#73b7ad';
  }
}
