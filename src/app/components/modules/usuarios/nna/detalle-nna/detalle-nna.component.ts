import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { NNAInfoDiagnostico } from '../../../../../models/nnaInfoDiagnostico.model';
import { GenericService } from '../../../../../services/generic.services';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { NNA } from '../../../../../models/nna.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-nna',
  templateUrl: './detalle-nna.component.html',
  styleUrls: ['./detalle-nna.component.css'],
  standalone: true,
  imports: [CommonModule, BadgeModule, CardModule, TableModule, RouterModule, ButtonModule, DividerModule, DialogModule, AccordionModule, SelectButtonModule, DropdownModule, CalendarModule, FormsModule
  ],
})
export class DetalleNnaComponent implements OnInit {

  idNna: any;
  datosBasicosNNA: NNAInfoDiagnostico = {
    diagnostico: '',
    nombreCompleto: '',
    fechaNacimiento: ''
  };
  fechaInicio!: Date; // Fecha de nacimiento
  fechaFin: Date = new Date(); // Fecha actual
  tiempoTranscurrido: string = '';
  panelSeleccionado: any = 1;
  datosNNA: NNA = new NNA();
  contactosNna: any[] = [];

  seguimientos: { fechaSeguimiento?: Date, categoriaAlerta: string, subcategoriaAlerta: string, descripcion: string, entidad: string, fechaNotifi?: Date, fechaRespuesta?: Date, idSeguimiento: number }[] = [];


  optionsDiagnostico: any[] = [];
  optionsIps: any[] = [];


  stateOptions: any[] = [
    { label: 'SI', value: true },
    { label: 'NO', value: false }
  ];

  constructor(
    private route: ActivatedRoute,
    private repos: GenericService,
    private tpp: TpParametros
  ) { }

  ngOnInit() {

    this.panelSeleccionado = 1;

    this.route.paramMap.subscribe(params => {
      this.idNna = params.get('idNna') || '';
      this.loadDatosBasicosNNA();
      this.loadNNAData();
      this.loadSeguimientoAlertas();
      this.loadContactosNna();
    });

  }

  seleccionarPanel(numPanel:any){
    this.panelSeleccionado = numPanel;
  }

  loadDatosBasicosNNA() {
    this.repos.get_withoutParameters(`/NNA/DatosBasicosNNAById/${this.idNna}`, 'NNA').subscribe({
      next: (datosBasicosData: any) => {
        this.datosBasicosNNA = datosBasicosData;
        this.fechaInicio = new Date(this.datosBasicosNNA.fechaNacimiento);
        this.calcularTiempoTranscurrido();
      },
      error: (err: any) => console.error('Error al cargar datos básicos del NNA', err)
    });
  }

  calcularTiempoTranscurrido() {

    console.log(this.fechaInicio);
    if (!this.fechaInicio) {
      return;
    }

    const fechaInicio = new Date(this.fechaInicio);
    const fechaFin = new Date(this.fechaFin);

    let anos = fechaFin.getFullYear() - fechaInicio.getFullYear();
    let meses = fechaFin.getMonth() - fechaInicio.getMonth();
    let dias = fechaFin.getDate() - fechaInicio.getDate();

    if (dias < 0) {
      meses--;
      const diasEnMes = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 0).getDate();
      dias += diasEnMes;
    }

    if (meses < 0) {
      anos--;
      meses += 12;
    }

    console.log(`${anos} años, ${meses} meses, ${dias} días`);

    this.tiempoTranscurrido = `${anos} años, ${meses} meses, ${dias} días`;
  }

  loadNNAData() {
    this.repos.get_withoutParameters(`/NNA/${this.idNna}`, 'NNA').subscribe({
      next: async (nnaData: any) => {
        this.datosNNA = nnaData;

      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadSeguimientoAlertas() {
    this.repos.get(`Seguimiento/GetSeguimientosNNA/`, this.idNna, 'Seguimiento').subscribe({
      next: async (data: any) => {

        for (let dat of data) {
          const baseSeguimiento = {
            fechaSeguimiento: dat.fechaSeguimiento,
            descripcion: dat.observacion,
            entidad: dat.nombreEntidad,
            fechaNotifi: dat.fechaNotificacion,
            fechaRespuesta: dat.fechaRespuesta,
            idSeguimiento: dat.idSeguimiento
          };

          if (dat.alertasSeguimientos && dat.alertasSeguimientos.length > 0) {
            for (let alerta of dat.alertasSeguimientos) {
              this.seguimientos.push({
                ...baseSeguimiento,
                categoriaAlerta: alerta.categoriaAlerta,
                subcategoriaAlerta: alerta.subcategoriaAlerta
              });
            }
          } else {
            this.seguimientos.push({
              ...baseSeguimiento,
              categoriaAlerta: '',
              subcategoriaAlerta: ''
            });
          }
        }
      },
      error: (err: any) => console.error('Error al cargar datos del Seguimiento', err)
    });
  }

  loadContactosNna(){
    this.repos.get_withoutParameters(`/ContactoNNAs/ObtenerByNNAId/${this.idNna}`, 'NNA').subscribe({
      next: async (data: any) => {
        this.contactosNna = data.datos;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }




}
