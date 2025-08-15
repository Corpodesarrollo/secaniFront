import { Component, Input, SimpleChanges } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { NNA } from '../../../../models/nna.model';
import { MenuItem } from 'primeng/api';
import { TpParametros } from '../../../../core/services/tpParametros';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from "primeng/progressspinner";

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule, CommonModule, ProgressSpinnerModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent {
  @Input() id: number = 0;
  nna: NNA = new NNA();
  items: MenuItem[] = [];
  cargando = true;

  constructor(private tpp: TpParametros) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] && changes['id'].currentValue !== changes['id'].previousValue) {
      this.nna = await this.tpp.getNNA(this.id.toString());
      this.items = [
        { label: 'Seguimientos', routerLink: '/gestion/seguimientos' },
        { label: `${this.nna.primerNombre} ${this.nna.primerApellido}`, routerLink: `/usuarios/detalle_nna/${this.id}` },
      ];
      this.cargando = false;
    }
  }
}
