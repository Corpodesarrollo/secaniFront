import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { BotonNotificacionComponent } from '../../../boton-notificacion/boton-notificacion.component';
import { Router, RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { GenericService } from '../../../../../services/generic.services';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { apis } from '../../../../../models/apis.model';
import { environment } from '../../../../../../environments/environment';
import { NNA } from '../../../../../models/nna.model';
import { forkJoin } from 'rxjs';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Parametricas } from '../../../../../models/parametricas.model';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SplitterModule } from 'primeng/splitter';
import { MessageService } from 'primeng/api';
import { User } from '../../../../../core/services/user';

@Component({
  selector: 'app-pendiente-reportar',
  templateUrl: './pendiente-reportar.component.html',
  styleUrls: ['./pendiente-reportar.component.css'],
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, CommonModule, BotonNotificacionComponent, RouterModule, DialogModule, CalendarModule, DropdownModule, InputTextModule, SplitterModule, FormsModule],
  providers: [MessageService]
})
export class PendienteReportarComponent implements OnInit {



  casos: any[] = [];
  cargandoCasos = false;

  datosNNA: any = {};
  datosReportante: any = {};

  departamentos: any[] = [];
  municipios: any[] = [];


  archivoDiagnosticoSeleccionado: string | null = null;
  archivoParentescoSeleccionado: string | null = null;

  verNNA: boolean = false;
  verReportante: boolean = false;
  verValidacion: boolean = false;
  validar: boolean = false;


  xUser = new User();

  constructor(
    private router: Router,
    private genericService: GenericService,
    private tp: TablasParametricas,
    private tpParametro: TpParametros,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    this.loadDepartamentos();
    this.loadMunicipios();
    await this.loadCasosPendientes();
  }

  async loadCasosPendientes() {
    this.cargandoCasos = true;
    const params: string[] = [];

    // EAPB: resolver TPEAPB.Id desde NIT (mismo patron casos-entidad / dashboard-eapb)
    if (this.xUser.isEAPB && this.xUser.enterpriseIdentification) {
      try {
        const id: any = await this.genericService
          .get_withoutParameters('Dashboard/GetEAPBIdByNit?nit=' + this.xUser.enterpriseIdentification, 'Seguimiento')
          .toPromise();
        const eapbId = Number(id);
        if (eapbId) params.push('eapbId=' + eapbId);
      } catch (err) {
        console.warn('No se pudo resolver TPEAPB.Id por NIT', err);
      }
    }

    // ET: usar enterpriseDeptoCode (codigo DANE 2 digitos) para ver toda jurisdiccion departamento
    if (this.xUser.isET && this.xUser.enterpriseDeptoCode) {
      params.push('departamentoId=' + this.xUser.enterpriseDeptoCode);
    }

    const qs = params.length ? '?' + params.join('&') : '';
    this.genericService.get_withoutParameters('NNA/PendientesSivigila' + qs, 'NNA').subscribe({
      next: (data: any) => {
        this.casos = data || [];
        this.cargandoCasos = false;
      },
      error: (err: any) => {
        console.error('Error cargando NNA pendientes SIVIGILA', err);
        this.casos = [];
        this.cargandoCasos = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los casos pendientes' });
      }
    });
  }

  loadDepartamentos(){
    this.genericService.get_withoutParameters(`TablaParametrica/Departamento`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.departamentos = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadMunicipios(){
    this.genericService.get_withoutParameters(`TablaParametrica/Municipio`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.municipios = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombreDeptoPorId(codigo: any): string | undefined {
    const extraerDosPrimeros = (codigo: string | undefined | null): string => {
      if (!codigo) {
        return '';
      }
      return codigo.substring(0, 2);
    };
    let codDepto: string = extraerDosPrimeros(codigo);
    const resultado = this.departamentos.find(item => item.codigo === codDepto);
    return resultado ? resultado.nombre : 'No se encuentra el código: ' + codigo;
  }

  getNombreMuniPorId(codigo: any): string | undefined {
    const completarCodigo = (codigo: string | undefined | null): string => {
      if (!codigo) {
        return '';
      }
      return codigo.padEnd(5, '0');
    };
    let codigoCompleto: string = completarCodigo(codigo);
    const resultado = this.municipios.find(item => item.codigo === codigoCompleto);
    return resultado ? resultado.nombre : 'No se encuentra el código: ' + codigo;
  }

  async descargarDiagnostico(caso: any): Promise<void> {
    await this.descargarArchivo(caso?.archivoDiagnostico, 'No hay diagnóstico adjunto para este caso');
  }

  async descargarParentesco(caso: any): Promise<void> {
    await this.descargarArchivo(caso?.archivoParentesco, 'No hay parentesco adjunto para este caso');
  }

  private async descargarArchivo(fileName: string | null | undefined, mensajeFaltante: string): Promise<void> {
    if (!fileName) {
      this.messageService.add({ severity: 'warn', summary: 'Sin archivo', detail: mensajeFaltante });
      return;
    }
    try {
      const blob: Blob = await this.genericService.getFile('Storage', fileName, apis.authentication);
      if (!blob || blob.size === 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Archivo vacío del servidor' });
        return;
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error('Error descargando archivo', fileName, err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo descargar el archivo' });
    }
  }

  mostrarNNA(caso: any){
    this.datosNNA = {
      nombreCompletoNNA: caso?.nombreNnaCompleto,
      sexoAlNacer: caso?.sexoNNA,
      fechaNacimiento: caso?.fechaNacimientoNNA,
      tipoIdentificacion: caso?.tipoIdentificacionId,
      identificacion: caso?.numeroIdentificacion
    };
    this.verNNA = true;
  }

  closeNNA(){
    this.verNNA = false;
  }

  mostrarReportante(caso: any){
    this.datosReportante = {
      nombreCompleto: caso?.nombreReportante || caso?.nombreReportanteCompleto,
      tipoIdentificacion: caso?.tipoIdReportante,
      identificacion: caso?.numeroIdReportante || caso?.aliasReportante,
      numeroCelular: caso?.celularReportante,
      correo: caso?.emailReportante
    };
    this.verReportante = true;
  }

  closeReportante(){
    this.verReportante = false;
  }

  validarCaso(casoId: any): void{
    console.log('validar caso en sivigila ' + casoId);

    this.verValidacion = true;

    //VALIDAR CASO

    if(casoId<=3){
      this.validar = true;
    }else{
      this.validar = false;
    }

  }

  closeValidacion(){
    this.verValidacion = false;
  }




}
