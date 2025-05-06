import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { Parametricas } from '../../../../models/parametricas.model';
import { CommonModule } from '@angular/common';
import { TpParametros } from '../../../../core/services/tpParametros';
import { TablasParametricas } from '../../../../core/services/tablasParametricas';
import { ReportesService } from '../../../../services/reportes.service';
import { ReportesSIVIGILA } from '../../../../models/reporteSIVIGILA.model';
import { GenericService } from '../../../../services/generic.services';
import { Reporte } from '../../../../models/reporte.model';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-seguimiento',
  standalone: true,
  imports: [DialogModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, CalendarModule, DropdownModule, FileUploadModule, InputTextModule, ],
  templateUrl: './nuevo-seguimiento.component.html',
  styleUrl: './nuevo-seguimiento.component.css'
})
export class NuevoSeguimientoComponent {

  sexoOptions = [{ label: 'Masculino', value: 'H' }, { label: 'Femenino', value: 'M' }];
  diagnosticoOptions = [{ label: 'Sí', value: true }, { label: 'No', value: false }];

  departamentos: Parametricas[] = [];
  municipios: Parametricas[] = [];
  IPS: Parametricas[] = [];
  tipoID: Parametricas[] = [];
  
  aseguradoraOptions = [{ label: 'EPS1', value: 'EPS1' }, { label: 'EPS2', value: 'EPS2' }];
  departamentoOptions = [{ label: 'Departamento1', value: 'Dep1' }, { label: 'Departamento2', value: 'Dep2' }];
  municipioOptions = [{ label: 'Municipio1', value: 'Mun1' }, { label: 'Municipio2', value: 'Mun2' }];

  selectedDepartamento: Parametricas | undefined;
  selectedMunicipio: Parametricas | undefined;
  selectedIPS: Parametricas | undefined;
  selectedTipoID: Parametricas | undefined;

  isLoadingDepartamento: boolean = true;
  isLoadingMunicipio: boolean = false;
  isLoadingIPS: boolean = false;
  isLoadingTipoID: boolean = false;

  submitted: boolean = false;
  saving: boolean | undefined;
  mostrarMensaje: boolean = false;

  reporte: ReportesSIVIGILA = {
    id: 0,
    tipoIdentificacionId: '',
    numeroIdentificacion: '',
    primerNombre: '',
    segundoNombre: undefined,
    primerApellido: '',
    segundoApellido: undefined,
    fechaNacimiento: null,
    sexoId: 'H',
    tieneDiagnostico: false,
    aseguradora: 0,
    departamentoProcedenciaId: undefined,
    municipioProcedenciaId: undefined,
    evidenciaDiagnostico: undefined,
    evidenciaParentesco: undefined
    };

  constructor(private router: Router, private repos: GenericService, private tp: TablasParametricas, private tpp: TpParametros, private formbuilder: FormBuilder) {
  }

  async ngOnInit(): Promise<void> {
    this.isLoadingTipoID = true;
    this.tipoID = await this.tp.getTP('APSTipoIdentificacion');
    this.isLoadingTipoID = false;

    this.isLoadingDepartamento = true;
    this.departamentos = await this.tp.getTP('Departamento');
    this.isLoadingDepartamento = false;

    this.isLoadingIPS = true;
    this.IPS = await this.tpp.getTPEAPB();
    this.isLoadingIPS = false;
  }

  async CargarMunicipios() {
    this.isLoadingMunicipio = true;
    this.municipios = [];
    if (this.selectedDepartamento) {
      this.municipios = await this.tpp.getTPCiudad(this.selectedDepartamento.codigo);
    }
    this.isLoadingMunicipio = false;
  }

  async guardar() {
    if(this.saving){
      return;
    }
    
    this.submitted = true;
    this.saving = true;
    if (this.validarCamposRequeridos()){

      await this.Actualizar();
    }
    this.saving = false;
  }

  validarCamposRequeridos(): boolean {
    this.reporte.tipoIdentificacionId = this.selectedTipoID?.codigo ?? '';
    this.reporte.aseguradora = this.selectedIPS?.id ?? 0;
    this.reporte.departamentoProcedenciaId = this.selectedDepartamento?.codigo ?? '';
    this.reporte.municipioProcedenciaId = this.selectedMunicipio?.codigo ?? '';
    this.reporte.evidenciaDiagnostico = this.reporte.evidenciaDiagnostico ?? undefined;
    this.reporte.evidenciaParentesco = this.reporte.evidenciaParentesco ?? undefined;

    const camposAValidar = [
      this.reporte.tipoIdentificacionId,
      this.reporte.numeroIdentificacion,
      this.reporte.primerNombre,
      this.reporte.primerApellido,
      this.reporte.fechaNacimiento,
      this.reporte.aseguradora,
      this.reporte.departamentoProcedenciaId,
      this.reporte.municipioProcedenciaId,
      this.reporte.evidenciaDiagnostico,
      this.reporte.evidenciaParentesco
    ];

    // Valida que cada campo no sea nulo, vacío o solo espacios en blanco
    let pos = 0;
    for (const campo of camposAValidar) {
      pos++;
      if (!campo || campo.toString().trim() === '' || campo === '0') {
        console.log('Campo requerido vacío', pos);
        return false;
      }
    }

    return true;
  }

  async Actualizar() {
    await this.post(this.reporte);
  }

  public async post(Reporte: ReportesSIVIGILA): Promise<any> {
      return new Promise((resolve, reject) => {
          this.repos.post('ReportesSIVIGILA', Reporte, 'NNA').subscribe({
              next: (data: any) => {
              console.log('Respuesta del servidor:', data);
              this.mostrarMensaje = true;
              resolve(data);
              },
              error: (err) => {
              console.error(err);
              reject(err);
              }
          });
      });
  }

  onUpload(event: any, tipo: string) {
    const file = event.files[0]; // Obtener el primer archivo subido
    const reader = new FileReader();
    reader.readAsDataURL(file); // Leer el archivo como URL de datos (base64)
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1]; // Obtener solo la parte base64
      if (tipo === 'parentesco') {
        this.reporte.evidenciaParentesco = {
          fileName: file.name,
          fileBytes: base64String
        };
      } else if (tipo === 'diagnostico') {
        this.reporte.evidenciaDiagnostico = {
          fileName: file.name,
          fileBytes: base64String
        };
      }
    };
  }
  
  onFileSelect(uploader: FileUpload) {
    uploader.upload();
  }

  terminar(){
    this.router.navigate([`/mis-seguimientos`]).then(() => {
      window.scrollTo(0, 0);
    });
  }
}
