import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SeguimientoStepsComponent } from '../seguimiento-steps/seguimiento-steps.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { Parametricas } from '../../../../../models/parametricas.model';
import { Router } from '@angular/router';
import { NNA } from '../../../../../models/nna.model';

@Component({
  selector: 'app-seguimiento-datos',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule, DropdownModule, CalendarModule, FormsModule, InputTextModule],
  templateUrl: './seguimiento-datos.component.html',
  styleUrl: './seguimiento-datos.component.css'
})

export class SeguimientoDatosComponent implements OnInit {
  nna: NNA = {
    id: '',
    primerNombre: 'Ana',
    segundoNombre: 'Patricia',
    primerApellido: 'Ruiz',
    segundoApellido: 'Bustamante',
    edad: '',
    sexo: '1',
    tipoID: 3,
    numeroID: '1028504301',
    fechaNacimiento: new Date(2020,1,5),
    paisNacimiento: 1,
    etnia: 1,
    grupoPoblacional: 1,
    regimenAfiliacion: 1,
    EAPB: 1,
    nombreContacto: 'Maria Bustamante',
    telefono1: '3112504599',
    telefono2: '5201364',
    parentesco: 2,
    origenReporte: 0,
    otro: '',
    fechaIngresoEstrategia: new Date(),
    estadoIngresoEstrategia: 'Vivo',
    fechaNotificacionSIVIGILA: new Date(),
  };

  selectedTipoID: Parametricas | undefined;
  selectedPaisNacimiento: Parametricas | undefined;
  selectedEtnia: Parametricas | undefined;
  selectedGrupoPoblacional: Parametricas | undefined;
  selectedRegimenAfiliacion: Parametricas | undefined;
  selectedEAPB: Parametricas | undefined;
  selectedParentesco: Parametricas | undefined;
  selectedOrigenReporte: Parametricas | undefined;
  
  items: MenuItem[] = [];
  contactForm: FormGroup;
  submitted: boolean = false;

  parentescos: Parametricas[] = [];
  tipoID: Parametricas[] = [];
  origenReporte: Parametricas[] = [];
  paisNacimiento: Parametricas[] = [];
  etnias: Parametricas[] = [];
  gruposPoblacionales: Parametricas[] = [];
  regimenAfiliacion: Parametricas[] = [];
  EAPB: Parametricas[] = [];

  constructor(private fb: FormBuilder, private tp: TablasParametricas, private router: Router) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required]],
      parentesco: ['', [Validators.required]],
      telefono1: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      telefono2: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.contactForm.valid) {
      console.log('Formulario enviado', this.contactForm.value);
      this.contactForm.reset();
    } else {
      console.log('Formulario no válido');
    }
  }

  ngOnInit(): void {
    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimiento' },
      { label: 'Ana Ruiz', routerLink: '/gestion/seguimiento' },
    ];

    this.parentescos = this.tp.getTP('Parentescos');
    this.tipoID = this.tp.getTP('TipoID');
    this.origenReporte = this.tp.getTP('OrigenReporte');
    this.paisNacimiento = this.tp.getTP('PaisNacimiento');
    this.etnias = this.tp.getTP('Etnia');
    this.gruposPoblacionales = this.tp.getTP('GrupoPoblacional');
    this.regimenAfiliacion = this.tp.getTP('RegimenAfiliacion');
    this.EAPB = this.tp.getTP('EAPB');

    this.selectedTipoID = this.tipoID[2];
    this.selectedPaisNacimiento = this.paisNacimiento[0];
    this.selectedEtnia = this.etnias[0];
    this.selectedGrupoPoblacional = this.gruposPoblacionales[0];
    this.selectedRegimenAfiliacion = this.regimenAfiliacion[0];
    this.selectedEAPB = this.EAPB[0];
    this.selectedParentesco = this.parentescos[1];

    this.CalcularEdad();
  }

  applySexo(sexo: string) {
    this.nna.sexo = sexo;
  }

  CalcularEdad() {
    if (this.nna.fechaNacimiento) {
      const nacimiento = new Date(this.nna.fechaNacimiento);
      const hoy = new Date();

      let años = hoy.getFullYear() - nacimiento.getFullYear();
      let meses = hoy.getMonth() - nacimiento.getMonth();
      let días = hoy.getDate() - nacimiento.getDate();

      if (días < 0) {
        meses--;
        días += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
      }

      if (meses < 0) {
        años--;
        meses += 12;
      }

      this.nna.edad = `${años} años, ${meses} meses, ${días} días`;
    }
  }

  Siguiente() {
    this.router.navigate(['/gestion/seguimiento/estado-seguimiento']).then(() => {
      window.scrollTo(0, 0);
    });
  }
}
