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
import { User } from '../../../../../core/services/userService';
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

@Component({
  selector: 'app-pendiente-reportar',
  templateUrl: './pendiente-reportar.component.html',
  styleUrls: ['./pendiente-reportar.component.css'],
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, CommonModule, BotonNotificacionComponent, RouterModule, DialogModule, CalendarModule, DropdownModule, InputTextModule, SplitterModule, FormsModule],
  providers: [MessageService]
})
export class PendienteReportarComponent implements OnInit {



  casos: any[] = [
    {"noCaso": 1,"nombreNnaCompleto": "Persona Perez Roa", "diagnosticoSiNo": "Si", "nombreReportanteCompleto": "Reportante Ramirez Gutierrez", "idContacto": 1, "aseguradora": "Aseguradora EPS", "municipio": "05001"},
    {"noCaso": 2,"nombreNnaCompleto": "Persona Perez Roa", "diagnosticoSiNo": "Si", "nombreReportanteCompleto": "Reportante Ramirez Gutierrez", "idContacto": 2, "aseguradora": "Aseguradora EPS", "municipio": "05001"},
    {"noCaso": 3,"nombreNnaCompleto": "Persona Perez Roa", "diagnosticoSiNo": "Si", "nombreReportanteCompleto": "Reportante Ramirez Gutierrez", "idContacto": 3, "aseguradora": "Aseguradora EPS", "municipio": "05001"},
    {"noCaso": 4,"nombreNnaCompleto": "Persona Perez Roa", "diagnosticoSiNo": "Si", "nombreReportanteCompleto": "Reportante Ramirez Gutierrez", "idContacto": 4, "aseguradora": "Aseguradora EPS", "municipio": "05001"},
    {"noCaso": 5,"nombreNnaCompleto": "Persona Perez Roa", "diagnosticoSiNo": "Si", "nombreReportanteCompleto": "Reportante Ramirez Gutierrez", "idContacto": 5, "aseguradora": "Aseguradora EPS", "municipio": "05001"}
  ];

  datosNNA: any = {
    "noCaso": 1,
    "nombreCompletoNNA" : "Persona Perez Roa",
    "sexoAlNacer" : "Masculino",
    "fechaNacimiento" : "10/01/2016",
    "tipoIdentificacion" : "TI",
    "identificacion" : "1.234.567.890"
  };

  datosReportante: any = {
    "noCaso": 1,
    "nombreCompleto" : "Reportante Ramirez Gutierrez",
    "tipoIdentificacion" : "CC",
    "identificacion" : "1.234.567.890",
    "numeroCelular" : "3201564789",
    "correo" : "pendiente@gmail.com",


  };

  departamentos: any[] = [];
  municipios: any[] = [];


  archivoDiagnosticoSeleccionado: string | null = null;
  archivoParentescoSeleccionado: string | null = null;

  verNNA: boolean = false;
  verReportante: boolean = false;
  verValidacion: boolean = false;
  validar: boolean = false;


  constructor(
    private router: Router,
    private genericService: GenericService,
    private tp: TablasParametricas,
    private tpParametro: TpParametros,
    private user: User,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    this.loadDepartamentos();
    this.loadMunicipios();
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

  descargarDiagnostico(casoId: any): void{
    console.log('Descargar diagnostico para caso '+casoId);
  }

  descargarParentesco(casoId: any): void{
    console.log('Descargar diagnostico para caso '+casoId);
  }

  mostrarNNA(casoId: any){
    this.verNNA = true;

  }

  closeNNA(){
    this.verNNA = false;
  }

  mostrarReportante(casoId: any){
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
