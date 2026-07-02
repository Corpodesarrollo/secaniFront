import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { FormUtils } from '../../../../utils/form-utils';
import { Columna } from '../../../../models/columna';
import { ReportesService } from '../../../../services/reportes.service';
import { ExcelExportService } from '../../../../services/excel-export.service';
import { ReporteDinamicoEAPB } from '../../../../models/reporteDinamicoEAPB';
import { EAPB } from '../../../../models/eapb.model';
import { GenericService } from '../../../../services/generic.services';

@Component({
  selector: 'app-reporte-dinamico-eapb',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CheckboxModule, CommonModule, DropdownModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-dinamico-eapb.component.html',
  styleUrl: './reporte-dinamico-eapb.component.css'
})
export class ReporteDinamicoEapbComponent implements OnInit {
  public reportes: ReporteDinamicoEAPB[] = [];
  public camposForm!: FormGroup;
  public cargando: boolean = false;

  public columnasObligatorias: Columna<ReporteDinamicoEAPB>[] = [
    { header: 'EAPB', field: 'eapb' },
    { header: 'Casos asociados', field: 'casosAsociados' },
    { header: 'Casos con alertas sin resolver', field: 'casosConAlertasSinResolver' },
    { header: 'Total de alertas sin resolver', field: 'totalDeAlertasSinResolver' }
  ];

  public columnasOpcionales: Columna<ReporteDinamicoEAPB>[] = [
    { header: 'Promedio de tiempo de respuesta a alertas (días)', field: 'promedioTiempoRespuestaAlertas' },
    { header: 'Casos Régimen Contributivo', field: 'casosRegimenContributivo' },
    { header: 'Casos Régimen Subsidiado', field: 'casosRegimenSubsidiado' },
    { header: 'Casos Régimen Especial', field: 'casosRegimenEspecial' },
    { header: 'Casos Régimen Excepción', field: 'casosRegimenExcepcion' },
    { header: 'Casos Régimen No Afiliado', field: 'casosRegimenNoAfiliado' },
    { header: 'Total alertas resueltas', field: 'totalAlertasResueltas' },
    { header: 'Casos con seguimiento por iniciar', field: 'casosSeguimientoPorIniciar' },
    { header: 'Casos con seguimiento en proceso', field: 'casosSeguimientoEnProceso' },
    { header: 'Casos con seguimiento culminado', field: 'casosSeguimientoCulminado' }
  ];

  public listaEAPB: EAPB[] = [];
  public departamentos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private reportesService: ReportesService,
    private dataService: GenericService,
    private excelExportService: ExcelExportService
  ) {}
  
  ngOnInit(): void {
    this.camposForm = this.fb.group(
      {
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
        eapb: [''],
        departamento: [''],
        camposSeleccionados: this.fb.array([]),
      }, 
      {
        validators: [FormUtils.validarFechas('fechaInicio', 'fechaFin')],
      } as AbstractControlOptions
    );

    this.dataService.get_withoutParameters('EAPB', 'TablaParametrica').subscribe({
      next: (data: any) => { this.listaEAPB = data; }
    });
    
    this.dataService.get_withoutParameters('TablaParametrica/Departamento', 'TablaParametrica').subscribe({
      next: (data: any) => { this.departamentos = data; }
    });
  }

  get camposSeleccionados(): FormArray {
    return this.camposForm.get('camposSeleccionados') as FormArray;
  }

  onCheckboxChange(event: any, columna: Columna<ReporteDinamicoEAPB>): void {
    const selected = this.camposSeleccionados;
    const index = selected.controls.findIndex(ctrl => ctrl.value.field === columna.field);
    if (index === -1) {
      selected.push(new FormControl(columna));
    } else {
      selected.removeAt(index);
    }
  }

  get columnasParaMostrar(): Columna<ReporteDinamicoEAPB>[] {
    return [...this.columnasObligatorias, ...this.camposSeleccionados.value];
  }

  get columnasFiltroGlobal(): string[] {
    return this.columnasParaMostrar.map(col => col.field);
  }

  onSubmit(): void {
    if (this.camposForm.invalid) return this.camposForm.markAllAsTouched();
    const formValue = this.camposForm.value;
    this.cargando = true;

    const payload = {
      ...formValue,
      camposSeleccionados: formValue.camposSeleccionados.map((campo: Columna<ReporteDinamicoEAPB>) => campo.field),
    };

    this.reportesService.getReporteDinamicoEAPB(payload)
      .subscribe({
        next: (response: any) => {
          this.reportes = response;
          this.cargando = false;
        },
        error: (err) => {
          this.cargando = false;
        }
      });
  }

  exportExcel() {
    this.excelExportService.exportToExcel<ReporteDinamicoEAPB>(
      { rows: this.reportes, columns: this.columnasParaMostrar, sheetName: `Reporte Dinamico EAPB` }, 
      'Reporte Dinamico EAPB',
    );
  }
}
