import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { EditorModule } from 'primeng/editor';
import { TableModule } from 'primeng/table';
import { GenericService } from '../../../../../services/generic.services';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { Parametricas } from '../../../../../models/parametricas.model';
import { DropdownModule } from 'primeng/dropdown';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { InputTextModule } from 'primeng/inputtext';
import { NotificacionService } from '../../../../../core/services/notificacionService';
import { Oficio } from '../../../../../models/oficio.model';
import { NotificacionOficioComponent } from "../notificacion-oficio/notificacion-oficio.component";
import { ContactoEAPBService } from '../../../../../core/services/contactoEAPBService';
import { EntidadServices } from '../../../../../core/services/entidadServices';
import { User } from '../../../../../core/services/user';

@Component({
  selector: 'app-crear-oficio',
  templateUrl: './crear-oficio.component.html',
  standalone: true,
  imports: [
    CommonModule, BadgeModule, CardModule, TableModule, RouterModule, ButtonModule, DividerModule, ReactiveFormsModule, DropdownModule,
    FormsModule, EditorModule, ToastModule, DialogModule, InputTextModule,
    NotificacionOficioComponent
],
  styleUrls: ['./crear-oficio.component.css'],
  providers: [MessageService]
})
export class CrearOficioComponent implements OnInit {

  today: Date;
  formattedDate: string;
  idAlerta: any;

  @Input() alerta: any;
  @Input() NNAdatos: any;
  @Input() nombreNNA: any;
  @Input() edadNNA: any;
  @Input() diagnosticoNNA: any;
  @Input() show: boolean = false;
  @Input() plantillaPrefill: any = null;
  @Output() closeModal = new EventEmitter<void>();

  idNotificacion: number = 0;
  membrete: string = '';
  entidades: Parametricas[] = [];
  selectedEntidad: Parametricas | undefined;
  isLoadingEntidades: boolean = true;
  showDialog: boolean = false;
  user = new User(); 

  oficio: Oficio = {
    id: 0,
    ciudadEnvio: '',
    fechaEnvio: new Date(),
    membrete: this.membrete,
    idEntidad: 0,
    ciudad: '',
    asunto: '',
    mensaje: '',
    idAlertaSeguimiento: 0,
    comentario: '',
    idNNA: 0,
    cierre: '',
    firma: '',
    firmaJpg: '',
    userName: ''
  };
  

  submitted: boolean = false;
  saving: boolean = false;
  
  constructor(
    private tp: TablasParametricas,
    private notificacionService: NotificacionService,
    private entidadesService: EntidadServices, 
  ) {
    this.today = new Date();
    this.formattedDate = this.formatDate(this.today);
    
    this.oficio.fechaEnvio = this.today;
    this.oficio.ciudad = 'Bogota';
    this.oficio.ciudadEnvio = 'Bogota';
    
   }

  ngOnInit() {
    this.loadAlertaData();
  }

  ver(){
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  }

  async loadAlertaData(){
    console.log(this.alerta);
    if (this.alerta.idAlertaSeguimiento) {
      let result = await this.notificacionService.getOficio(this.alerta.idAlertaSeguimiento);
      if (result.estado){
        this.oficio = result.datos;
      } else {
        this.oficio.idAlertaSeguimiento = this.alerta.idAlertaSeguimiento;
        this.oficio.idNNA = this.NNAdatos.id;
      }
    }

    // BUG-LZ-052: antes solo cargaba ET. Cargar tambien EAPB y combinarlas para que el oficio
    // de notificacion permita seleccionar cualquiera de los dos tipos de entidad.
    const [ets, eapbs] = await Promise.all([
      this.entidadesService.getET(),
      this.entidadesService.getEAPB()
    ]);
    this.entidades = [...(ets || []), ...(eapbs || [])].sort((a, b) =>
      (a.nombre ?? '').localeCompare(b.nombre ?? '')
    );
    this.isLoadingEntidades = false;
    this.selectedEntidad = this.entidades.find(e => e.id === this.oficio.idEntidad);

    // BUG-024: prefilling desde plantilla seleccionada
    if (this.plantillaPrefill) {
      if (!this.oficio.asunto && this.plantillaPrefill.asunto) this.oficio.asunto = this.plantillaPrefill.asunto;
      if (!this.oficio.mensaje && this.plantillaPrefill.mensaje) this.oficio.mensaje = this.plantillaPrefill.mensaje;
      if (!this.oficio.cierre && this.plantillaPrefill.cierre) this.oficio.cierre = this.plantillaPrefill.cierre;
      if (!this.oficio.firma && this.plantillaPrefill.firmante) this.oficio.firma = this.plantillaPrefill.firmante;
    }
  }

  async enviar(){
    if(this.saving){
      return;
    }
    this.submitted = true;
    this.saving = true;

    if (this.validarCamposRequeridos()){
      await this.guardar();
    }
    this.saving = false;
  }

  validarCamposRequeridos(): boolean {
    this.oficio.idEntidad = this.selectedEntidad?.id ?? 0;
    this.oficio.userName = this.user.email ?? "";

    const camposAValidar = [
      this.oficio.membrete,
      this.oficio.idEntidad,
      this.oficio.ciudad,
      this.oficio.asunto,
      this.oficio.mensaje,
      this.oficio.cierre,
      this.oficio.firmaJpg
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

  async guardar() {
    console.log('Guardando oficio:', this.oficio);
    var result = await this.notificacionService.postOficio(this.oficio);
    if (result.estado) {
      this.idNotificacion = Number(result.datos);
      this.showDialog = true; // Muestra el modal de notificación.
    } else {
      console.error('Error al guardar el oficio:');
    }
  }

  close() {
    this.submitted = false; // Reinicia el estado de envío del formulario
    this.saving = false; // Reinicia el estado de guardado
    this.show = false; // Oculta el modal
    this.selectedEntidad = undefined; // Reinicia la selección de entidad
    this.oficio = {
      id: 0,
      ciudadEnvio: '',
      fechaEnvio: new Date(),
      membrete: this.membrete,
      idEntidad: 0,
      ciudad: '',
      asunto: '',
      mensaje: '',
      idAlertaSeguimiento: 0,
      comentario: '',
      idNNA: 0,
      cierre: '',
      firma: '',
      firmaJpg: '',
      userName: ''
    }; // Reinicia el objeto oficio

    this.closeModal.emit(); // Emite evento para cerrar el modal
  }

  closeNotificacion(resultado: boolean): void {
    this.showDialog = false; 
    if (resultado) {
      this.showDialog = false; 
      this.show = false; 
    }
  }

}
