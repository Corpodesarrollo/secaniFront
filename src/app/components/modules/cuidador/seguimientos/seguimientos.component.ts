import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { ReportesSIVIGILAService } from '../../../../services/reportes-sivigila.service';

@Component({
  selector: 'app-seguimientos',
  standalone: true,
  imports: [ ButtonModule, DialogModule, DropdownModule, InputTextModule, ReactiveFormsModule, RouterModule, TableModule, ToastModule],
  templateUrl: './seguimientos.component.html',
  styleUrl: './seguimientos.component.css',
  providers: [MessageService]
})
export class SeguimientosComponent implements OnInit {

  public seguimientoForm: FormGroup;
  public recaidaForm: FormGroup;

  public seguimientos: any[] = [];

  public parentescos: any[] = [];
  public tipoIdentificacion: any[] = [];
  public recaidadOpciones: any[] = [];

  public visible: boolean = false;
  public estaFallecido: boolean = false; // Controla el diálogo de mensaje de fallecimiento
  public hayRecaida: boolean = false;
  public esMenorEdad: boolean = false;
  public estaRegistrado: boolean = true;

  public nnaInfo: { nombre: string, identificacion: string } = { nombre: '', identificacion: '' };

  constructor( private formBuilder: FormBuilder, private messageService: MessageService, private reportesSIVIGILAService: ReportesSIVIGILAService) {
    this.seguimientoForm = this.formBuilder.group({
      parentesco: [null, Validators.required],
      tipoIdentificacion: [null, Validators.required],
      numeroIdentificacion: ['', Validators.required]
    });

    this.recaidaForm = this.formBuilder.group({
      recaida: [null, Validators.required]
    });
  }

  async ngOnInit() {
    await this.getSeguimientos();
  }

  async getSeguimientos() {
    const reportes = await this.reportesSIVIGILAService.getReportes();
    console.log(reportes);
  }

  showDialog(): void {
    this.visible = true;
  }

  hiddenDialog(): void {
    this.visible = false;
    this.estaFallecido = false;
    this.esMenorEdad = false;
    this.hayRecaida = false;
    this.estaRegistrado = true;
  }

  closeInformacionDialog() {
    this.estaFallecido = false;
    this.esMenorEdad = false;
    this.hayRecaida = false;
    this.estaRegistrado = true;
  }

  onSubmitSeguimiento(): void {
    // if( this.seguimientoForm.invalid ) return;
    // this.estaFallecido = true;
    // this.esMenorEdad = true;
    // this.hayRecaida = true;

    this.estaRegistrado = false;
    this.nnaInfo = {
      nombre: 'Ana Maria Luiz Bolaños',
      identificacion: 'R.C. 1.035.201.226'
    }
  }

  onSubmitRecaida(): void {
    // if ( this.recaidaForm.invalid ) return;

    this.messageService.add({
      severity: 'success',
      summary: 'Seguimiento solicitado con éxito',
    });

    this.hiddenDialog();
  }
}
