import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { FormsModule } from '@angular/forms';
import { NNAInfoDiagnostico } from '../../../../../models/nnaInfoDiagnostico.model';
import { NNA } from '../../../../../models/nna.model';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { GenericService } from '../../../../../services/generic.services';
import { Parametricas } from '../../../../../models/parametricas.model';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';

@Component({
  selector: 'app-editar-nna',
  templateUrl: './editar-nna.component.html',
  styleUrls: ['./editar-nna.component.css'],
  standalone: true,
  imports: [CommonModule, BadgeModule, CardModule, TableModule, RouterModule, ButtonModule, DividerModule, DialogModule, AccordionModule, SelectButtonModule, DropdownModule, CalendarModule, FormsModule],
})
export class EditarNnaComponent implements OnInit {

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

  listadoPais: any;
  etnias: any;
  razonesSinDiagnostico: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private repos: GenericService,
    private tpp: TpParametros,
    private tp: TablasParametricas
  ) { }

  ngOnInit() {

    this.panelSeleccionado = 2;

    this.loadRazonesSinDiagnostico();

    this.route.paramMap.subscribe(params => {
      this.idNna = params.get('idNna') || '';
      this.loadDatosBasicosNNA();
      this.loadNNAData();
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

  loadContactosNna(){
    this.repos.get_withoutParameters(`/ContactoNNAs/ObtenerByNNAId/${this.idNna}`, 'NNA').subscribe({
      next: async (data: any) => {
        this.contactosNna = data.datos;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombrePaisNacimiento(){
    return "nombre"
  }

  /*async getNombreDepto(codigo: string): Promise<string> {

    if (!codigo) {
      return 'No encontrado';
    }

    let cod = codigo.substring(0, 2);
    let deptos: any[] = await this.tpp.getTPDepartamento(cod);

    let filtrado = deptos.filter(objeto => objeto.codigo === cod);

    return filtrado.length > 0 ? filtrado[0].nombre : 'No encontrado';
  }*/

  /*async getNombreMuni(codigo: string): Promise<string> {

    if (!codigo) {
      return 'No encontrado';
    }

    let deptos: any[] = await this.tpp.getTPCiudad(codigo);

    let filtrado = deptos.filter(objeto => objeto.codigo === codigo);

    return filtrado.length > 0 ? filtrado[0].nombre : 'No encontrado';
  }*/

  loadRazonesSinDiagnostico(){
    this.repos.get_withoutParameters(`/RazonesSinDiagnostico`, 'TablaParametrica').subscribe({
      next: (data: any) => {
        this.razonesSinDiagnostico = data.datos;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

}
