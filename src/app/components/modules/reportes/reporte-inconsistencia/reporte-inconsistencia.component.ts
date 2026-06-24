import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

import { ReportesService } from '../../../../services/reportes.service';
import { ExcelExportService } from '../../../../services/excel-export.service';
import { FormUtils } from '../../../../utils/form-utils';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ReporteInconsistenciaGeneral } from '../../../../models/reporteInconsistenciaGeneral';

export enum TipoReporte {
  GENERAL = 'GENERAL',
  POR_NNA = 'POR_NNA'
}

@Component({
  selector: 'app-reporte-inconsistencia',
  standalone: true,
  imports: [CalendarModule, InputGroupAddonModule, InputGroupModule, DropdownModule, CommonModule, ButtonModule, InputTextModule, SelectButtonModule, ReactiveFormsModule, TableModule],
  templateUrl: './reporte-inconsistencia.component.html',
  styleUrl: './reporte-inconsistencia.component.css'
})
export class ReporteInconsistenciaComponent implements OnInit {
  public reportesInconsistenciaNNA: any[] = [];
  public reportesInconsistenciaGeneral: ReporteInconsistenciaGeneral | null = null;
  public NNA: any[] = [];

  public camposForm!: FormGroup;

  public tipoReporte: TipoReporte = TipoReporte.GENERAL;
  public TipoReporte = TipoReporte;
  public periodoLabel: string = '';
  public cargando: boolean = false;

  public camposLabel: { [k: string]: string } = {
    TipoIdentificacion: 'Tipo de Identificación',
    NumeroIdentificacion: 'Número de Identificación',
    PrimerNombre: 'Primer Nombre',
    SegundoNombre: 'Segundo Nombre',
    PrimerApellido: 'Primer Apellido',
    SegundoApellido: 'Segundo Apellido',
    FechaNacimiento: 'Fecha de Nacimiento',
    Sexo: 'Sexo',
    FechaDefuncion: 'Fecha de Defunción',
    Diagnostico: 'Diagnóstico',
    Estado: 'Estado',
    FechaNotificacion: 'Fecha de Notificación',
    PaisNacimiento: 'País de Nacimiento',
    RegimenAfiliacion: 'Régimen de afiliación',
    Asegurador: 'Asegurador',
    IPS: 'IPS',
    Contacto1Nombre: 'Contacto 1 — Nombre',
    Contacto1Parentesco: 'Contacto 1 — Parentesco',
    Contacto1Telefono: 'Contacto 1 — Teléfono',
  };

  constructor(
    private fb: FormBuilder,
    private reportesService: ReportesService,
    private excelExportService: ExcelExportService
  ) { }

  ngOnInit(): void {
    this.camposForm = this.fb.group(
      {
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
      },
      {
        validators: [FormUtils.validarFechas('fechaInicio', 'fechaFin')],
      } as AbstractControlOptions
    );

    this.getNNA();
  }

  onSubmit() {
    if (this.camposForm.invalid) return this.camposForm.markAllAsTouched();

    const { fechaInicio, fechaFin } = this.camposForm.value;
    this.periodoLabel = `${this.fmt(fechaInicio)} - ${this.fmt(fechaFin)}`;

    if (this.tipoReporte != TipoReporte.GENERAL) return;
    this.cargando = true;
    this.reportesService.getReporteInconsistenciasGeneral(fechaInicio, fechaFin)
      .subscribe({
        next: (reportes: any) => {
          this.reportesInconsistenciaGeneral = reportes;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error fetching general report:', err);
          this.cargando = false;
        }
      });
  }

  private fmt(d: any): string {
    if (!d) return '';
    const dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt.getTime())) return '';
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${dt.getFullYear()}`;
  }

  onNNAChange(event: any) {
    const selectedValue = event.value;
    this.getReporteNNA(selectedValue);
  }

  getReporteNNA(nnaId: string) {
    if (this.tipoReporte != TipoReporte.POR_NNA) return;
    this.cargando = true;
    this.reportesService.getReporteInconsistenciasPorNNA(nnaId)
      .subscribe({
        next: (reporte: any) => {
          this.reportesInconsistenciaNNA = Array.isArray(reporte) ? reporte : (reporte ? [reporte] : []);
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error fetching report by NNA:', err);
          this.reportesInconsistenciaNNA = [];
          this.cargando = false;
        }
      });
  }

  getNNA() {
    this.reportesService.getNNA()
      .subscribe({
        next: (nna: any) => this.NNA = nna,
        error: (err) => console.error('Error fetching general report:', err)
      });
  }

  get camposArr() {
    const dict = this.reportesInconsistenciaGeneral?.inconsistenciasPorCampo || {};
    return Object.keys(dict).map(k => ({
      campo: this.camposLabel[k] || k,
      total: dict[k] || 0
    }));
  }

  exportExcel() {
    if (this.tipoReporte === TipoReporte.GENERAL) {
      const g = this.reportesInconsistenciaGeneral;
      if (!g) return;
      const rows = [
        { seccion: 'KPI 1: Total inconsistencias', valor: g.totalInconsistencias },
        { seccion: 'KPI 6: Tiempo prom. resolución (días)', valor: g.tiempoPromedioResolucionDias },
        { seccion: 'KPI 6: Resueltos', valor: g.totalResueltos },
        { seccion: 'KPI 6: Pendientes', valor: g.totalPendientes },
        { seccion: 'KPI 7: Validadas automáticamente', valor: g.validadasAutomaticamente },
        { seccion: 'KPI 7: Validadas manualmente', valor: g.validadasManualmente },
        { seccion: 'KPI 8: Tasa reincidencia (%)', valor: g.tasaReincidencia },
        { seccion: 'KPI 8: Reincidentes', valor: g.totalReincidentes },
        { seccion: 'KPI 9: Impacto notif. (días)', valor: g.impactoNotificacionDias },
        { seccion: 'KPI 9: Impacto tratamiento (días)', valor: g.impactoTratamientoDias },
        ...this.camposArr.map(c => ({ seccion: 'KPI 2: Por campo', campo: c.campo, total: c.total })),
        ...(g.inconsistenciasPorFuente || []).map(c => ({ seccion: 'KPI 3: Por fuente', ...c })),
        ...(g.inconsistenciasPorDepartamento || []).map(c => ({ seccion: 'KPI 4: Por departamento', ...c })),
        ...(g.inconsistenciasPorMunicipio || []).map(c => ({ seccion: 'KPI 4: Por municipio', ...c })),
        ...(g.inconsistenciasPorTipoCancer || []).map(c => ({ seccion: 'KPI 5: Por tipo cáncer', ...c })),
        ...(g.inconsistenciasPorDiagnostico || []).map(c => ({ seccion: 'KPI 5: Por diagnóstico (CIE10)', ...c })),
        ...(g.camposCriticosTrazabilidad || []).map(c => ({ seccion: 'KPI 10: Campos críticos', ...c })),
      ];
      this.excelExportService.exportToExcel<any>(
        { rows, sheetName: 'Reporte Inconsistencias' },
        'Reporte Inconsistencias General',
      );
      return;
    }
    this.excelExportService.exportToExcel<any>(
      { rows: this.reportesInconsistenciaNNA, sheetName: 'Reporte Inconsistencias' },
      'Reporte Inconsistencias',
    );
  }

  async exportPDF() {
    const g = this.reportesInconsistenciaGeneral;
    if (!g) return;
    const jsPDFModule = await import('jspdf');
    const autoTableModule = await import('jspdf-autotable');
    const doc = new jsPDFModule.jsPDF('p', 'pt', 'a4');
    const autoTable = (autoTableModule as any).default || (autoTableModule as any);

    doc.setFontSize(16);
    doc.text('Reporte de Inconsistencias', 40, 40);
    doc.setFontSize(10);
    doc.text(`Periodo: ${this.periodoLabel || '—'}`, 40, 60);
    doc.text(`Total inconsistencias: ${g.totalInconsistencias}`, 40, 76);

    let y = 100;
    const addSection = (titulo: string, head: string[], body: any[][]) => {
      doc.setFontSize(12);
      doc.text(titulo, 40, y);
      autoTable(doc, {
        startY: y + 8,
        head: [head],
        body,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [40, 167, 69] },
        margin: { left: 40, right: 40 }
      });
      y = (doc as any).lastAutoTable.finalY + 24;
      if (y > 720) { doc.addPage(); y = 40; }
    };

    addSection('KPI 2 — Inconsistencias por campo',
      ['Campo', 'Total'],
      this.camposArr.map(c => [c.campo, c.total]));

    addSection('KPI 3 — Por fuente de datos',
      ['Fuente', 'Total', '%'],
      (g.inconsistenciasPorFuente || []).map(f => [f.fuente, f.totalInconsistencias, `${f.porcentaje}%`]));

    addSection('KPI 4 — Por departamento',
      ['Departamento', 'Total', '%'],
      (g.inconsistenciasPorDepartamento || []).map(d => [d.departamento || '(Sin)', d.totalInconsistencias, `${d.porcentaje}%`]));

    addSection('KPI 4 — Por municipio',
      ['Municipio', 'Departamento', 'Total', '%'],
      (g.inconsistenciasPorMunicipio || []).map(m => [m.municipio || '(Sin)', m.departamento || '', m.totalInconsistencias, `${m.porcentaje}%`]));

    addSection('KPI 5 — Por tipo de cáncer',
      ['Tipo Cáncer', 'Total', '%'],
      (g.inconsistenciasPorTipoCancer || []).map(t => [t.tipoCancer || '(Sin)', t.totalInconsistencias, `${t.porcentaje}%`]));

    addSection('KPI 6/7/8/9',
      ['Métrica', 'Valor'],
      [
        ['Tiempo promedio resolución (días)', g.tiempoPromedioResolucionDias],
        ['Resueltos / Pendientes', `${g.totalResueltos} / ${g.totalPendientes}`],
        ['Validadas automáticamente', g.validadasAutomaticamente],
        ['Validadas manualmente', g.validadasManualmente],
        ['Tasa reincidencia', `${g.tasaReincidencia}% (${g.totalReincidentes} casos)`],
        ['Impacto notificación (días)', g.impactoNotificacionDias],
        ['Impacto tratamiento (días)', g.impactoTratamientoDias],
      ]);

    addSection('KPI 10 — Campos críticos trazabilidad',
      ['Campo', 'NNAs sin dato', 'Total NNAs', '% Faltante'],
      (g.camposCriticosTrazabilidad || []).map(c => [c.campo, c.nnAsConFalta, c.totalNNAs, `${c.porcentajeInconsistencia}%`]));

    doc.save('Reporte_Inconsistencias.pdf');
  }
}
