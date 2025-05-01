import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { ReportesService } from '../../../../services/reportes.service';
import { ExcelExportService } from '../../../../services/excel-export.service';
import { FormUtils } from '../../../../utils/form-utils';

@Component({
  selector: 'app-reporte-detalle-nuevo-depurados',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CommonModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule, ReactiveFormsModule],
  templateUrl: './reporte-detalle-nuevo-depurados.component.html',
  styleUrl: './reporte-detalle-nuevo-depurados.component.css'
})
export class ReporteDetalleNuevoDepuradosComponent {
  private id: string | null = null;

  public reportes: any[] = [];
  public filteredReportes: any[] = [];
  public camposForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private reportesService: ReportesService,
    private activatedRoute: ActivatedRoute,
    private excelExportService: ExcelExportService
  ) {
    this.camposForm = this.formBuilder.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    }, { 
      validators: [FormUtils.validarFechas('fechaInicio', 'fechaFin')],
    });
  }

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async params => {
      this.id = params.get('id');
      if (this.id) {
        this.reportes = await this.reportesService.getReporteDetalleRegDepurados(this.id);

        if (!this.reportes || (this.reportes && this.reportes.length == 0)) {
          this.reportes = [
            {
              "id": 1,
              "idReporteDepuracion": 0,
              "fechaNotificacion": "2022-07-12T02:41:36.4767203",
              "origenReporteId": 3,
              "origenReporte": "Secretaría de salud",
              "primerNombre": "Greg",
              "segundoNombre": "Ricky",
              "primerApellido": "Christy",
              "segundoApellido": "Brad",
              "diagnosticoId": 10,
              "diagnostico": "Tumores óseos malignos",
              "fechaNacimiento": "2007-11-11T03:14:52.8061867",
              "edad": 17,
              "sexoId": "H",
              "sexo": null,
              "tipoIdentificacionId": "CC",
              "tipoIdentificacion": "Cédula Ciudadanía",
              "numeroIdentificacion": "1050069231",
              "paisId": "0",
              "pais": null,
              "etniaId": "1",
              "etnia": "Indígena",
              "municipioNacimientoId": "504",
              "departamentoNacimiento": "META",
              "municipioNacimiento": null,
              "grupoPoblacionId": "3",
              "grupoPoblacion": null,
              "residenciaOrigenMunicipioId": "05001",
              "residenciaOrigenDepartamento": null,
              "residenciaOrigenMunicipio": null,
              "residenciaOrigenBarrio": "79627",
              "residenciaOrigenAreaId": "1",
              "areaProcedencia": "Urbano",
              "residenciaOrigenDireccion": "830 West Fabien Drive",
              "residenciaOrigenEstratoId": "3",
              "residenciaActualTelefono": "606-989-5657",
              "departamentoTratamientoId": "23",
              "departamentoTratamiento": "CÓRDOBA",
              "estadoIngresoEstrategiaId": 13,
              "estadoIngresoEstrategia": "13",
              "fechaIngresoEstrategia": "2023-06-07T02:02:33.8183336",
              "tipoRegimenSSId": "2",
              "tipoRegimenSS": "Contributivo",
              "epsId": 7,
              "eps": null,
              "ipsId": 2,
              "ips": null,
              "cuidadorNombres": "Bridgette May",
              "cuidadorParentescoId": "1",
              "cuidadorParentesco": "Padre o Madre",
              "cuidadorEmail": "uvlxsrgs.qzhvizagf@yqwnwd.vkcafx.org",
              "cuidadorTelefono": "005-7444214",
              "agente": "48e6efab-2c8a-4d37-bc6c-d62ec8fdd0c5"
            }
          ];
        }

        this.filteredReportes = this.reportes;
      }
    });
  }

  onSubmit() {
    if (this.camposForm.invalid) return;
    const { fechaInicio, fechaFin } = this.camposForm.value;

    this.filteredReportes = this.reportes.filter(reporte => {
      const fechaNotificacion = new Date(reporte.fechaNotificacion);

      const fechaInicioValida = fechaInicio ? fechaNotificacion >= new Date(fechaInicio) : true;
      const fechaFinValida = fechaFin ? fechaNotificacion <= new Date(fechaFin) : true;

      return fechaInicioValida && fechaFinValida;
    });
  }

  exportExcel() {
    this.excelExportService.exportReporteToExcel(
      this.reportes, [], 'Reporte detalle nuevo depuración'
    );
  }
}
