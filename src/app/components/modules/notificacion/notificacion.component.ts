import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Parametricas } from '../../../models/parametricas.model';
import { Notificacion } from '../../../models/notificacion.model';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ChipsModule } from 'primeng/chips';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { TablasParametricas } from '../../../core/services/tablasParametricas';

@Component({
  selector: 'app-notificacion',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, ReactiveFormsModule, DropdownModule, DialogModule, FormsModule, 
            InputTextModule, ChipsModule, ToastModule, NotificacionComponent, CheckboxModule, EditorModule, ButtonModule],
  templateUrl: './notificacion.component.html',
  styleUrl: './notificacion.component.css',
  providers: [MessageService]
})
export class NotificacionComponent {
  @Input() id!: number;

  isLoading: boolean = false;
  submitted: boolean = false;
  isLoadingEntidades: boolean = true;
  showDialog: boolean = false;

  mensajeCarga: string = 'Cargando datos...';
  colorMensaje: string = 'text-primary';

  entidades: Parametricas[] = [];
  selectedEntidad: Parametricas | undefined;

  notificacion: Notificacion = {
    id: 0,
    idEntidad: 0,
    para: [],
    conCopia: [],
    plantillaId: 0,
    asunto: "",
    mensaje: "",
    agregarComentario: false,
    comentario: "",
    adjunto: "",
    firma: "",
  };

  constructor(private messageService: MessageService, private tp: TablasParametricas) {}

  async ngOnInit(): Promise<void> {
    this.entidades =  await this.tp.getTP('EntidadTerritorial');
    this.isLoadingEntidades = false;
  }

  openModal() {
    this.showDialog = true;
  }

  closeModal() {
    this.showDialog = false;
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
}
