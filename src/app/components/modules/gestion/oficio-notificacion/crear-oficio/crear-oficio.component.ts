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

@Component({
  selector: 'app-crear-oficio',
  templateUrl: './crear-oficio.component.html',
  standalone: true,
  imports: [
    CommonModule, BadgeModule, CardModule, TableModule, RouterModule, ButtonModule, DividerModule, ReactiveFormsModule,
    FormsModule, EditorModule, ToastModule, DialogModule
  ],
  styleUrls: ['./crear-oficio.component.css'],
  providers: [MessageService]
})
export class CrearOficioComponent implements OnInit {

  today: Date;
  formattedDate: string;
  city: string;
  idAlerta: any;

  @Input() alerta: any;
  @Input() NNAdatos: any;
  @Input() nombreNNA: any;
  @Input() edadNNA: any;
  @Input() diagnosticoNNA: any;
  @Input() show: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  membrete: string ='';
  listaEndidades: any[] = [];
  nombreEntidad: any ='';
  ciudad: string ='';
  asunto: string ='';
  mensaje: string ='';
  comentario1: string ='';
  cierre: string ='';
  firma: string ="";

  constructor(
    private route: ActivatedRoute,
    private repos: GenericService
  ) {
    this.today = new Date();
    this.formattedDate = this.formatDate(this.today);
    this.city = 'Bogota';
   }

  ngOnInit() {
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  }

  loadAlertaData(){


    this.repos.get_withoutParameters(`Entidades/Entidades`, 'TablaParametrica').subscribe({
      next: (data: any) => {
        this.listaEndidades = data;
      },
      error: (err: any) => console.error('Error al cargar seguimiento', err)
    });
  }

  verificarCampos(){
    if(this.membrete.length > 100){
      console.log("Membrete muy extenso");
    }else if(this.nombreEntidad.length == 0){
      console.log("Seleccionar entidad");
    }else if(this.ciudad.length > 100){
      console.log("Ciudad muy extensa");
    }else if(this.asunto.length > 500){
      console.log("Asunto muy extenso");
    }else if(this.cierre.length > 200){
      console.log("Cierre muy extenso");
    }else{
      this.crearOficio();
    }
  }

  crearOficio(){

  }

  close() {
    /*this.contacto = {
      id: 0,
      nnaId: this.nnaId,
      nombres: '',
      parentescoId: 0,
      cuidador: false,
      telefonos: '',
      email: '',
      estado: true
    };
    this.telefonos = [];
    this.selectedParentesco = undefined;*/

    this.closeModal.emit(); // Emite evento para cerrar el modal
  }

}
