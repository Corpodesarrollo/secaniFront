import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ReportesService } from '../../../../services/reportes.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reporte-detalle-nuevo-depurados',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CommonModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-detalle-nuevo-depurados.component.html',
  styleUrl: './reporte-detalle-nuevo-depurados.component.css'
})
export class ReporteDetalleNuevoDepuradosComponent {
  private id: string | null = null;
  public reportes: any[] = [];

  constructor(private reportesService: ReportesService, private activatedRoute: ActivatedRoute) {}

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async params => {
      this.id = params.get('id');
      if(this.id) this.reportes = await this.reportesService.getReporteDetalleRegDepurados(this.id);
      console.log(this.reportes);
    });
  }
}
