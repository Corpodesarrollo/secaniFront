import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ChipsModule } from 'primeng/chips';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ContactoEAPBService } from '../../../../core/services/contactoEAPBService';
import { apis } from '../../../../models/apis.model';
import { Attachment } from '../../../../models/attachmentFile.model';
import { ContactoEAPB } from '../../../../models/contactoEapb.model';
import { GenericService } from '../../../../services/generic.services';
import { NgSelectModule } from '@ng-select/ng-select';
import { MultiSelectModule } from 'primeng/multiselect';
import { Config } from '../../../../models/config.model';
import { ConfigService } from '../../../../core/services/configService';

@Component({
  selector: 'app-alertas-enviar-respuesta',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    DropdownModule,
    DialogModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    MultiSelectModule,
    InputTextModule,
    ChipsModule,
    ToastModule,
    CheckboxModule,
    EditorModule,
    ButtonModule,
  ],
  templateUrl: './alertas-enviar-respuesta.component.html',
  styleUrl: './alertas-enviar-respuesta.component.css',
  providers: [MessageService],
})
export class AlertasEnviarRespuestaComponent {
  @Input() alertaId!: number;
  @Input() nombreNNA!: string;
  @Input() documentoNNA!: string;
  @Input() alerta!: string;
  @Input() show: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  isLoading: boolean = false;
  submitted: boolean = false;
  mostrarDialogo: boolean = false;

  selectedFile: File | null = null;
  fileError: string | null = null;
  fileName: string | null = null;

  mensajeCarga: string = 'Cargando datos...';
  colorMensaje: string = 'text-primary';

  contactos: ContactoEAPB[] = [];
  selectedContactos: ContactoEAPB[] = [];

  config: Config = {
    smtpServer: '',
    port: 0,
    enableSsl: false,
    userName: '',
  };

  respuesta: any = {
    idAlerta: 0,
    idNNA: 0,
    para: '',
    cc: [] as string[],
    asunto: '',
    mensaje: '',
    archivo: null as Attachment | null,
    firma: '',
  };

  constructor(
    private messageService: MessageService,
    private repos: GenericService,
    private contactoEAPBService: ContactoEAPBService,
    private configService: ConfigService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['alertaId']) {
      this.alertaId = changes['alertaId'].currentValue; // Actualiza el ID si cambia
    }
  }

  async ngOnInit(): Promise<void> {
    this.contactos = await this.contactoEAPBService.getAll();
    this.config = await this.configService.get();
    this.respuesta.para = this.config.userName; 
  }

  enviar() {
    this.submitted = true;

    if (!this.respuesta.asunto) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe ingresar un asunto.',
      });
      return;
    }

    if (!this.respuesta.mensaje) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe ingresar un mensaje.',
      });
      return;
    }

    if (this.selectedContactos.length > 0) {
      this.respuesta.cc = this.selectedContactos.map(
        (contacto: ContactoEAPB) => contacto.email,
      );
    }

    if (this.selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const fileContent = fileReader.result as ArrayBuffer;

        this.respuesta.archivo = {
          fileName: this.selectedFile?.name ?? null,
          fileExtension: this.selectedFile?.name.split('.').pop() ?? null,
          file: Array.from(new Uint8Array(fileContent)),
        };

        this.guardar();
      };

      fileReader.readAsArrayBuffer(this.selectedFile);
    } else {
      this.guardar();
    }
  }

  guardar() {
    this.repos
      .post(
        'GestionarAlertas/EnviarRespuesta',
        this.respuesta,
        apis.seguimiento,
      )
      .subscribe({
        next: (response: any) => {
          if (response.estado == false) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.descripcion,
            });
          } else {
            this.mostrarDialogo = true;
          }
        },
        error: (error) => {
          console.error('Error al consumir el API:', error);
        },
      });
  }

  limpiar() {
    this.submitted = false;
    this.mostrarDialogo = false;
    this.respuesta = {
      idAlerta: 0,
      idNNA: 0,
      para: [] as string[],
      cc: [] as string[],
      asunto: '',
      mensaje: '',
      archivo: null as Attachment | null,
      firma: '',
    };
    this.selectedFile = null;
  }

  close() {
    this.show = false;
    this.limpiar();
    this.closeModal.emit(); // Emite evento para cerrar el modal
  }

  validarEmail(event: any): void {
    const email = event.value;
    if (!this.isValidEmail(email)) {
      // Si no es válido, elimina el correo de la lista
      this.respuesta.para = this.respuesta.para.filter((e: any) => e !== email);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `${email} no es un correo valido.`,
      });
    }
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailPattern.test(email);
  }

  openFileDialog(event: Event) {
    this.fileInput.nativeElement.click();
    event.stopPropagation(); // Evita que el evento se propague dos veces
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.fileError = null;
    this.fileName = null;

    if (file) {
      const fileType = file.type;
      const fileSize = file.size;

      // Validar tipos permitidos
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
      ];

      if (!allowedTypes.includes(fileType)) {
        this.fileError =
          'Tipo de archivo no permitido. Solo PDF, Word, Excel y JPG están permitidos.';
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
}
