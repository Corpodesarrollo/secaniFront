import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { apis } from '../../../../../models/apis.model';
import { Notificacion } from '../../../../../models/notificacion.model';
import { Parametricas } from '../../../../../models/parametricas.model';
import { Plantilla } from '../../../../../models/plantilla.model';
import { GenericService } from '../../../../../services/generic.services';
import { ContactoEAPB } from '../../../../../models/contactoEapb.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContactoEAPBService } from '../../../../../core/services/contactoEAPBService';
import { MultiSelectModule } from 'primeng/multiselect';
import { environment } from '../../../../../../environments/environment';
import { EntidadServices } from '../../../../../core/services/entidadServices';

@Component({
  selector: 'app-notificacion-oficio',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, ReactiveFormsModule, DropdownModule, DialogModule, FormsModule, NgSelectModule,MultiSelectModule,
              InputTextModule, ChipsModule, ToastModule, CheckboxModule, EditorModule, ButtonModule],
  templateUrl: './notificacion-oficio.component.html',
  styleUrl: './notificacion-oficio.component.css'
})
export class NotificacionOficioComponent {

    @Input() showDialog: boolean = false;
    @Input() idNotificacion!: number;
    @Input() idAlerta: number = 10;
    @Input() idNNA: number = 10;
    @Output() closeModal = new EventEmitter<void>();
    @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  
    isLoading: boolean = false;
    submitted: boolean = false;
    isLoadingEntidades: boolean = true;
    isLoadingPLantillas: boolean = true;
  
    selectedFile: File | null = null;
    fileError: string | null = null;
    fileName: string | null = null;
  
    mensajeCarga: string = 'Cargando datos...';
    colorMensaje: string = 'text-primary';
  
    entidades: Parametricas[] = [];
    selectedEntidad: Parametricas | undefined;

    contactos: ContactoEAPB[] = [];
    selectedPara: ContactoEAPB[] = [];
    selectedConCopia: ContactoEAPB[] = [];
    isLoadingContactos: boolean = true;
  
    plantillas: Plantilla[] = [];
    selectedPlantilla: Plantilla | undefined;
  
    notificacion: Notificacion = {
      id: 0,
      idNotificacion: 0,
      idEntidad: '',
      para: [],
      conCopia: [],
      plantillaId: 0,
      asunto: "",
      mensaje: "",
      agregarEnlace: false,
      enlace: "",
      agregarComentario: false,
      comentario: "",
      adjunto: null,
      firma: "",
    };

     mostrarDialogo: boolean = false;
  
    constructor(private messageService: MessageService, private tp: EntidadServices, private tpp: TpParametros, private repos: GenericService, private contactoEAPBService: ContactoEAPBService) {}
  
    async ngOnInit(): Promise<void> {      
      this.contactos = await this.contactoEAPBService.getAll();
      this.isLoadingContactos = false;

      this.entidades =  await this.tp.getET();
      this.isLoadingEntidades = false;
  
      this.plantillas = await this.tpp.getPlantillas();
      this.isLoadingPLantillas = false;
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['idNotificacion']) {
        this.idNotificacion = changes['idNotificacion'].currentValue; // Actualiza el ID si cambia
        this.notificacion.idNotificacion = this.idNotificacion ?? 0;
        console.log("ngOnChanges:", this.idNotificacion);
      }
    }
  
    async enviar(){
      this.notificacion.para = this.selectedPara.map((contacto) => contacto.email);
      this.notificacion.conCopia = this.selectedConCopia.map((contacto) => contacto.email);
      this.notificacion.idEntidad = this.selectedEntidad?.codigo ?? '';
      this.notificacion.plantillaId = this.selectedPlantilla?.id ?? 0;
      this.notificacion.idNotificacion = this.idNotificacion ?? 0;
  
      this.submitted = true;
      if (this.selectedPara.length === 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe ingresar al menos un correo.' });
        return;
      }
  
      if (this.notificacion.idEntidad === '') {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar una entidad.' });
        return;
      }
  
      if (this.notificacion.asunto === '') {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe ingresar un asunto.' });
        return;
      }
  
      if (this.notificacion.mensaje === '') {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe ingresar un mensaje.' });
        return;
      }
  
      if (this.notificacion.agregarComentario && this.notificacion.comentario === '') {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe ingresar un comentario.' });
        return;
      }
  
      // Enviar notificación
  
      if (this.selectedFile) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const fileContent = fileReader.result as ArrayBuffer;
  
          this.notificacion.adjunto = {
            fileName: this.selectedFile?.name ?? null,
            fileExtension: this.selectedFile?.name.split('.').pop() ?? null,
            file: Array.from(new Uint8Array(fileContent))
          };
  
          console.log(this.notificacion);
  
          this.guardar();
        };
  
        fileReader.readAsArrayBuffer(this.selectedFile);
      } else {
        this.guardar();
      }
    }
  
    guardar(){
      this.repos.post("Notificacion/EnviarOficioNotificacion", this.notificacion, apis.seguimiento).subscribe({
        next: (response) => {
          this.mostrarDialogo = true;
        },
        error: (error) => {
          console.error('Error al consumir el API:', error);
        }
      });
    }
  
    limpiar(){
      this.notificacion = {
            id: 0,
            idNotificacion: 0,
            idEntidad: '',
            para: [],
            conCopia: [],
            plantillaId: 0,
            asunto: "",
            mensaje: "",
            agregarEnlace: false,
            enlace: "",
            agregarComentario: false,
            comentario: "",
            adjunto: null,
            firma: "",
          };

      this.showDialog = false;
      this.selectedPlantilla = undefined;
      this.selectedEntidad = undefined;
    }
  
    openModal() {
      this.showDialog = true;
    }
  
    validarEmail(event: any): void {
      const email = event.value;
      if (!this.isValidEmail(email)) {
        // Si no es válido, elimina el correo de la lista
        this.notificacion.para = this.notificacion.para.filter(e => e !== email);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `${email} no es un correo valido.` });
      }
    }
  
    isValidEmail(email: string): boolean {
      const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      return emailPattern.test(email);
    }
  
    cargarPlantilla(event: any) {
      this.notificacion.mensaje = this.selectedPlantilla?.mensaje ?? '';
      this.notificacion.asunto = this.selectedPlantilla?.asunto ?? '';
      this.notificacion.firma = this.selectedPlantilla?.firmante ?? '';
    }
  
    onFileChange(event: any) {
      const file = event.target.files[0];
      this.fileError = null;
      this.fileName = null;
  
      if (file) {
        const fileType = file.type;
        const fileSize = file.size;
  
        // Validar tipos permitidos
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg'];
  
        if (!allowedTypes.includes(fileType)) {
          this.fileError = 'Tipo de archivo no permitido. Solo PDF, Word, Excel y JPG están permitidos.';
          return;
        }
  
        // Validar tamaño máximo de archivo (5MB)
        const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
        if (fileSize > maxSizeInBytes) {
          this.fileError = 'El archivo excede el tamaño máximo permitido de 5MB.';
          return;
        }
  
        // Si todo es válido, guardar el archivo seleccionado
        this.selectedFile = file;
        this.fileName = file.name;
        // this.contactForm.patchValue({
        //   archivo: file
        // });
      }
    }
  
    openFileDialog(event: Event) {
      this.fileInput.nativeElement.click();
      event.stopPropagation();  // Evita que el evento se propague dos veces
    }

    close() {
      this.submitted = false; // Reinicia el estado de envío del formulario
      this.showDialog = false; // Oculta el modal
      this.selectedEntidad = undefined; // Reinicia la selección de entidad
      this.notificacion = {
        id: 0,
        idNotificacion: 0,
        idEntidad: '',
        para: [],
        conCopia: [],
        plantillaId: 0,
        asunto: "",
        mensaje: "",
        agregarEnlace: false,
        enlace: "",
        agregarComentario: false,
        comentario: "",
        adjunto: null,
        firma: "",
      }; // Reinicia el objeto oficio
  
      this.closeModal.emit(); // Emite evento para cerrar el modal
    }

    cambiarEstadoEnlace() {
      if (this.notificacion.agregarEnlace) {
        this.notificacion.enlace = `${environment.url}respuesta-notificacion/${this.stringTobase64(this.idNotificacion?.toString() ?? "")}`;
      } else {
        this.notificacion.enlace = '';
      }
    }

    stringTobase64(str: string): string {
      const buffer = new TextEncoder().encode(str);
      const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      return base64String;
    }
}
