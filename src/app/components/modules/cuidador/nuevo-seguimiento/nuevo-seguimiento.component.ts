import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { timeout, TimeoutError } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Parametricas } from '../../../../models/parametricas.model';
import { TpParametros } from '../../../../core/services/tpParametros';
import { TablasParametricas } from '../../../../core/services/tablasParametricas';
import { ReportesSIVIGILA } from '../../../../models/reporteSIVIGILA.model';
import { GenericService } from '../../../../services/generic.services'

@Component({
  selector: 'app-nuevo-seguimiento',
  standalone: true,
  imports: [DialogModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, CalendarModule, DropdownModule, FileUploadModule, InputTextModule, ToastModule],
  templateUrl: './nuevo-seguimiento.component.html',
  styleUrl: './nuevo-seguimiento.component.css',
  providers: [MessageService]
})
export class NuevoSeguimientoComponent {

  sexoOptions = [{ label: 'Masculino', value: 'H' }, { label: 'Femenino', value: 'M' }];
  diagnosticoOptions = [{ label: 'Sí', value: true }, { label: 'No', value: false }];
  readonly: boolean = false;
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
    // BUG-LZ-035: antes el default era 'H' (Masculino), lo que hacía que el dropdown "Sexo asignado al
    // nacer" siempre tuviera un valor aunque el usuario no lo seleccionara. Init vacío para forzar la
    // selección explícita.
    sexoId: '',
    tieneDiagnostico: false,
    aseguradora: 0,
    departamentoProcedenciaId: undefined,
    municipioProcedenciaId: undefined,
    evidenciaDiagnostico: undefined,
    evidenciaParentesco: undefined
    };

  // BUG-LZ-033: tamaño máximo permitido para evidencias (5MB) y extensiones aceptadas
  private readonly maxFileSize = 5 * 1024 * 1024;
  private readonly extensionesPermitidas = ['pdf', 'jpg', 'jpeg', 'png'];

  constructor(
    private router: Router,
    private repos: GenericService,
    private tp: TablasParametricas,
    private tpp: TpParametros,
    private formbuilder: FormBuilder,
    private routeAct: ActivatedRoute,
    private messageService: MessageService
  ) {
  }

  // BUG-LZ-034: filtrar caracteres numericos (y otros simbolos) en nombres/apellidos del NNA.
  // Handler en (keyup) limpia el value del input directamente para que el usuario vea el
  // resultado mientras escribe (el binding (ngModelChange) anterior dejaba el digito visible
  // por un frame hasta que Angular reaplicaba el modelo).
  onNombreChange(campo: 'primerNombre' | 'segundoNombre' | 'primerApellido' | 'segundoApellido', event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const limpio = (input.value || '').replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü ]/g, '');
    if (input.value !== limpio) {
      input.value = limpio;
    }
    (this.reporte as any)[campo] = limpio;
  }

  async ngOnInit(): Promise<void> {
    let tipoId: string | undefined;
    let numero: string | undefined;

    this.routeAct.paramMap.subscribe(() => {
      tipoId = history.state.tipoId;
      numero = history.state.numero;
    });

    this.isLoadingTipoID = true;
    this.tipoID = await this.tp.getTP('APSTipoIdentificacion');
    this.isLoadingTipoID = false;

    this.isLoadingDepartamento = true;
    this.departamentos = await this.tp.getTP('Departamento');
    this.isLoadingDepartamento = false;

    this.isLoadingIPS = true;
    this.IPS = await this.tpp.getTPEAPB();
    this.isLoadingIPS = false;

    // BUG-LZ-028: si NNA no tiene reporte previo SIVIGILA → formulario editable (nuevo reporte).
    // Si ya existe reporte → mostrar readonly.
    const data = await this.tpp.getByTipoIdNumeroId(tipoId ?? '', numero ?? '');
    if (data) {
      this.reporte = data;
      if (this.reporte?.fechaNacimiento) {
        this.reporte.fechaNacimiento = new Date(this.reporte.fechaNacimiento);
      }
      this.readonly = true;
    } else {
      this.reporte = new ReportesSIVIGILA();
      this.readonly = false;
    }

    this.selectedTipoID = this.tipoID.find(item => item.codigo === tipoId);
    this.reporte.tipoIdentificacionId = this.selectedTipoID?.codigo ?? '';
    this.reporte.numeroIdentificacion = numero ?? '';
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
    try {
      if (this.validarCamposRequeridos()){
        await this.Actualizar();
      } else {
        // BUG-LZ-032: avisar al usuario por que no se envia el formulario; antes el boton no daba feedback
        this.messageService.add({
          severity: 'warn',
          summary: 'Campos obligatorios',
          detail: 'Complete todos los campos requeridos antes de enviar.',
          life: 5000
        });
      }
    } finally {
      this.saving = false;
    }
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
      this.reporte.sexoId, // BUG-LZ-035: validar obligatoriedad
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
      if (campo == null || campo.toString().trim() === '' || campo === '0' || campo === 0) {
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
          // BUG-LZ-spinner-sivigila: timeout defensivo 30s. Si backend cuelga (ej. tabla faltante,
          // SMTP/SISPRO bloqueado), el HttpClient default no tiene timeout y deja saving=true
          // indefinido. timeout() emite TimeoutError → cae al error handler → resetea spinner.
          this.repos.post('ReportesSIVIGILA', Reporte, 'NNA').pipe(timeout(30000)).subscribe({
              next: (data: any) => {
              console.log('Respuesta del servidor:', data);
              this.mostrarMensaje = true;
              resolve(data);
              },
              error: (err) => {
              // BUG-LZ-032: mostrar feedback al usuario cuando el POST falla
              console.error(err);
              const detalle = err instanceof TimeoutError
                ? 'El servidor no respondio en 30s. Intente nuevamente.'
                : (err?.error?.message || err?.message || 'No fue posible enviar el reporte. Intente nuevamente.');
              this.messageService.add({
                severity: 'error',
                summary: 'Error al enviar reporte',
                detail: detalle,
                life: 6000
              });
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

  // BUG-LZ-033: validar tipo y tamaño del archivo antes de subir. p-fileUpload ya muestra
  // los invalidFileTypeMessageDetail/invalidFileSizeMessageDetail, este metodo es defensivo
  // (clean uploader si por algo pasa, descartar files invalidos, evitar guardarlos en el modelo).
  onFileSelect(uploader: FileUpload, tipo: string, event: any) {
    const file = event?.files?.[0];
    if (!file) {
      return;
    }
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!this.extensionesPermitidas.includes(extension)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Archivo no permitido',
        detail: 'Solo se permiten archivos PDF, JPG o PNG.',
        life: 5000
      });
      uploader.clear();
      return;
    }
    if (file.size > this.maxFileSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'Archivo demasiado grande',
        detail: 'El archivo supera el límite de 5MB.',
        life: 5000
      });
      uploader.clear();
      return;
    }
    uploader.upload();
  }

  terminar(){
    this.router.navigate([`/mis-seguimientos`]).then(() => {
      window.scrollTo(0, 0);
    });
  }
}
