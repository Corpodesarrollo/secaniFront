import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { GenericService } from '../../../../../services/generic.services';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SeguimientoGestion } from '../../../../../models/seguimientoGestion.model';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Seguimiento } from '../../../../../models/seguimiento.model';
import { apis } from '../../../../../models/apis.model';
import { Router } from '@angular/router';
import { PermisoDirective } from '../../../../../directives/permiso.directive';

@Component({
  selector: 'app-seguimiento-guardar',
  standalone: true,
  imports: [CommonModule, CalendarModule, ReactiveFormsModule, FormsModule, DialogModule, InputTextModule, SelectButtonModule, PermisoDirective ],
  templateUrl: './seguimiento-guardar.component.html',
  styleUrl: './seguimiento-guardar.component.css'
})
export class SeguimientoGuardarComponent {
  @Input() show: boolean = false;
  @Input() seguimiento: SeguimientoGestion | undefined = undefined;
  @ViewChild('inputCampo') inputCampo!: ElementRef;
  @Output() onClose = new EventEmitter<void>(); 

  submitted: boolean = false;
  fechaSugerida: Date = new Date();
  nuevaFecha: Date | undefined;
  nuevaHora: Date | undefined;
  motivo: string = '';
  isLoading: boolean = false;
  
  mensajeCarga: string = 'Cargando datos...';
  colorMensaje: string = 'text-primary';

  mostrarMensaje: boolean = false;

  mostrarDialogo: boolean = false;
  diasDiferencia: number = 0;
  hora: number | null = 8;     // Horas
  minutos: number | null = 0;  // Minutos
  periodo: string = 'AM';         // AM o PM
  idSeguimiento: number = 0;

  constructor(private fb: FormBuilder, private tp: TpParametros, private gs: GenericService, private router: Router) {
    
  }

  async ngOnInit(): Promise<void>{
    setTimeout(() => {
      if (this.inputCampo){
        this.inputCampo.nativeElement.focus();
      }
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['seguimiento'] && changes['seguimiento'].currentValue) {
      this.fechaSugerida = new Date(this.seguimiento?.fechaSeguimiento || '');
    }
    if (changes['show'] && changes['show'].currentValue) {
      console.log('Mostrar modal');
    }
  }

  validarCamposRequeridos(): boolean {
    const camposAValidar = [];
    this.getFechaYHoraCompleta();
    camposAValidar.push(this.nuevaHora);

    if (this.nuevaFecha) {
      camposAValidar.push(this.motivo);
    }

    // Valida que cada campo no sea nulo, vacío o solo espacios en blanco
    for (const campo of camposAValidar) {
      if (!campo || campo.toString().trim() === '') {
        return false;
      }
    }

    return true;
  }

  guardar() {
    this.submitted = true;
    if (this.validarCamposRequeridos()){
      if(this.fechaSugerida && this.nuevaFecha && this.fechaSugerida != this.nuevaFecha){
        this.diasDiferencia = Math.floor((this.nuevaFecha.getTime() - this.fechaSugerida.getTime()) / (1000 * 60 * 60 * 24));
        this.mostrarDialogo = true;
      } else {
        let fechaConHora = new Date(this.seguimiento!.fechaSeguimiento);
        fechaConHora.setHours(this.periodo === 'PM' ? (this.hora ?? 0) + 12 : (this.hora ?? 0));
        fechaConHora.setMinutes(this.minutos ?? 0);
        //this.seguimiento!.fechaSeguimientoStr = fechaConHora.toISOString();
        this.seguimiento!.fechaSeguimiento = fechaConHora;
        this.enviar();
      }
    }
  }

  getFechaYHoraCompleta(): void {
    if (this.hora !== null && this.minutos !== null) {
      let fechaConHora = new Date();
      fechaConHora.setHours(this.periodo === 'PM' ? this.hora + 12 : this.hora);
      fechaConHora.setMinutes(this.minutos);
      this.nuevaHora = fechaConHora;
    } else {
      console.log('Datos incompletos para fecha y hora');
    }
  }

  positivo(value: number):number {
    return Math.abs(value);
  }

  apply(p: string) {
    this.periodo = p;
    this.getFechaYHoraCompleta();
  }

  limpiar(){
    this.mostrarDialogo = false;
  }

  limpiar2(){
    this.show = false;
    this.onClose.emit();
  }

  enviar(){
    this.gs.post('Seguimiento/SetSeguimiento', this.seguimiento, apis.seguimiento).subscribe(
      response => {
        this.idSeguimiento = response as number;
        this.mostrarMensaje = true;
      },
      error => {
        console.error('Error al subir el archivo', error);
      }
    );
  }

  cancelar(){
    this.mostrarDialogo = false;
    this.motivo = '';
    this.nuevaFecha = undefined;
  }

  continuar(){
    this.mostrarDialogo = false;
    if (this.nuevaFecha && this.nuevaHora) {
      this.nuevaFecha.setHours(this.nuevaHora.getHours());
    }
    if (this.seguimiento && this.nuevaFecha) {
      this.seguimiento.fechaSeguimiento = this.nuevaFecha;
    }

    this.enviar();
  }

  terminar(){
    this.onClose.emit();
    if (this.seguimiento && this.seguimiento.nnaId !== undefined && this.seguimiento.nnaId !== null) {
      if (this.seguimiento.alertas && this.seguimiento.alertas.length > 0) {
        this.router.navigate([`/gestion/consultar-alertas/${this.idSeguimiento}`], { state: { skipGuard: true } }).then(() => {
          window.scrollTo(0, 0);
        });
      } else {
        this.router.navigate([`/gestion/seguimientos`]).then(() => {
          window.scrollTo(0, 0);
        });
      }
      
    }
  }
}
