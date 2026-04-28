import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, Renderer2 } from '@angular/core';
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
import { Parametricas } from '../../../../../models/parametricas.model';

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
    fechaNacimiento: '',
    idEstado: 0,
  };
  fechaInicio!: Date; // Fecha de nacimiento
  fechaFin: Date = new Date(); // Fecha actual
  tiempoTranscurrido: string = '';
  panelSeleccionado: any = 1;
  datosNNA: NNA = new NNA();
  contactosNna: any[] = [];

  seguimientos: { fechaSeguimiento?: Date, categoriaAlerta: string, subcategoriaAlerta: string, descripcion: string, entidad: string, fechaNotifi?: Date, fechaRespuesta?: Date, idSeguimiento: number }[] = [];

  estadoSeguimientoNombre: string = '';

  optionsDiagnostico: any[] = [];
  optionsIps: any[] = [];


  stateOptions: any[] = [
    { label: 'SI', value: true },
    { label: 'NO', value: false }
  ];

  sexoAnn: any[] = [
    {"id" : "H", "nombre" : "Masculino"},
    {"id" : "M", "nombre" : "Femenino"}
  ];
  listadoPais: Parametricas[] = [];
  etnias: Parametricas[] = [];
  listaDepartamentos: Parametricas[] = [];
  listaMunicipios: Parametricas[] = [];
  gruposponlacional: Parametricas[] = [];
  areas: Parametricas[] = [];
  estratos: Parametricas[] = [];
  tiposOrigenReporte: Parametricas[] = [];
  estadosNNA: any[] = [];
  estadosIngresoEstrategia: any[] = [];
  regimenesAfiliacion: Parametricas[] = [];

  constructor(
    private route: ActivatedRoute,
    private repos: GenericService,
    private tpp: TpParametros,
    private renderer: Renderer2, private el: ElementRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {

    this.panelSeleccionado = 1;

    this.route.paramMap.subscribe(params => {
      this.idNna = params.get('idNna') || '';
      this.loadDatosBasicosNNA();
      this.loadNNAData();
      this.loadSeguimientoAlertas();
      this.loadEstadoSeguimiento();
      this.loadContactosNna();
    });

    this.loadPaisesNacimiento();
    this.loadEtnias();
    this.loadDepartamentos();
    this.loadMunicipios();
    this.loadGruposPobla();
    this.loadAreas();
    this.loadEstratos();
    this.loadTiposOrigen();
    this.loadEstadosNNA();
    this.loadEstadosIngresoEstrategia();
    this.loadRegimenes();
    this.loadCIE10();

  }

  seleccionarPanel(numPanel:any){
    this.panelSeleccionado = numPanel;
  }

  loadDatosBasicosNNA() {
    this.repos.get_withoutParameters(`NNA/DatosBasicosNNAById/${this.idNna}`, 'NNA').subscribe({
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
    this.repos.get_withoutParameters(`NNA/${this.idNna}`, 'NNA').subscribe({
      next: async (nnaData: any) => {
        this.datosNNA = nnaData;
        this.datosNNA.fechaDiagnostico = this.datosNNA?.fechaDiagnostico ? new Date(this.datosNNA.fechaDiagnostico) : null;
        this.datosNNA.fechaUltimaRecaida = this.datosNNA?.fechaUltimaRecaida ? new Date(this.datosNNA.fechaUltimaRecaida) : null;
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

  loadEstadoSeguimiento() {
    this.repos.get_withoutParameters(`Seguimiento/GetSeguimientosByNNA/${this.idNna}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : [];
        if (list.length === 0) { this.estadoSeguimientoNombre = ''; return; }
        const ordered = [...list].sort((a, b) => {
          const da = new Date(a?.fechaUltimaActuacion || a?.fechaSeguimiento || 0).getTime();
          const db = new Date(b?.fechaUltimaActuacion || b?.fechaSeguimiento || 0).getTime();
          return db - da;
        });
        this.estadoSeguimientoNombre = ordered[0]?.estado?.nombre || '';
      },
      error: (err: any) => console.error('Error al cargar estado de seguimiento', err)
    });
  }

  getNombreDeptoNacimiento(): string {
    if (this.datosNNA?.departamentoNacimientoId) {
      return this.getNombreDeptoPorId(this.datosNNA.departamentoNacimientoId) || 'Dato no encontrado';
    }
    if (this.datosNNA?.municipioNacimientoId) {
      return this.getNombreDeptoPorId(this.datosNNA.municipioNacimientoId) || 'Dato no encontrado';
    }
    return 'Dato no encontrado';
  }

  private getActualOrOrigenMunicipioId(): any {
    const actual = this.datosNNA?.residenciaActualMunicipioId;
    if (actual !== null && actual !== undefined && actual !== '') return actual;
    return this.datosNNA?.residenciaOrigenMunicipioId;
  }

  getNombreDeptoResidenciaActual(): string {
    const codigo = this.getActualOrOrigenMunicipioId();
    return this.getNombreDeptoPorId(codigo) || 'Dato no encontrado';
  }

  getNombreMuniResidenciaActual(): string {
    const codigo = this.getActualOrOrigenMunicipioId();
    return this.getNombreMuniPorId(codigo) || 'Dato no encontrado';
  }

  loadContactosNna(){
    this.repos.get_withoutParameters(`ContactoNNAs/ObtenerByNNAId/${this.idNna}`, 'NNA').subscribe({
      next: async (data: any) => {
        this.contactosNna = data.datos;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombreSexoPorId(id: any): string | undefined {
    const resultado = this.sexoAnn.find(item => item.id === id);
    console.log('No se encuentra el ID: ' + id);
    return resultado ? resultado.nombre : 'Dato no encontrado';
  }

  loadPaisesNacimiento(){
    this.repos.get_withoutParameters(`TablaParametrica/Pais`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.listadoPais = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombrePaisPorId(id: any): string | undefined {
    const resultado = this.listadoPais.find(item => item.codigo === id);
    console.log('No se encuentra el ID: ' + id);
    return resultado ? resultado.nombre : 'Dato no encontrado';
  }

  loadEtnias(){
    this.repos.get_withoutParameters(`TablaParametrica/GrupoEtnico`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.etnias = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombreEtniaPorId(id: any): string | undefined {
    const resultado = this.etnias.find(item => item.codigo === id);
    console.log('No se encuentra el ID: ' + id);
    return resultado ? resultado.nombre : 'Dato no encontrado';
  }

  loadDepartamentos(){
    this.repos.get_withoutParameters(`TablaParametrica/Departamento`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.listaDepartamentos = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombreDeptoPorId(codigo: any): string | undefined {
    if (codigo === null || codigo === undefined || codigo === '') return 'Dato no encontrado';
    const raw = String(codigo).trim();
    const codDepto = raw.length >= 2 ? raw.substring(0, 2) : raw.padStart(2, '0');
    const resultado = this.listaDepartamentos.find(item => String(item.codigo) === codDepto);
    return resultado ? resultado.nombre : 'Dato no encontrado';
  }

  loadMunicipios(){
    this.repos.get_withoutParameters(`TablaParametrica/Municipio`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.listaMunicipios = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombreMuniPorId(codigo: any): string | undefined {
    if (codigo === null || codigo === undefined || codigo === '') return 'Dato no encontrado';
    const raw = String(codigo).trim();
    const codigoCompleto = raw.length >= 5 ? raw.substring(0, 5) : raw.padStart(5, '0');
    const resultado = this.listaMunicipios.find(item => String(item.codigo) === codigoCompleto);
    return resultado ? resultado.nombre : 'Dato no encontrado';
  }

  loadGruposPobla(){
    this.repos.get_withoutParameters(`TablaParametrica/LCETipoPoblacionEspecial`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.gruposponlacional = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombreGrupoPoblaPorId(id: any): string | undefined {
    if (id === null || id === undefined || id === '') return 'Dato no encontrado';
    const resultado = this.gruposponlacional.find(item => String(item.codigo) === String(id));
    return resultado ? resultado.nombre : 'Dato no encontrado';
  }

  loadAreas(){
    this.repos.get_withoutParameters(`TablaParametrica/ZonaTerritorial`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.areas = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombreAreaPorId(id: any): string | undefined {
    const resultado = this.areas.find(item => item.codigo === id);
    console.log('No se encuentra el ID: ' + id);
    return resultado ? resultado.nombre : 'Dato no encontrado';
  }

  loadEstratos(){
    this.repos.get_withoutParameters(`TablaParametrica/EstratoSocioeconomico`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.estratos = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombreEstratoPorId(id: any): string | undefined {
    const resultado = this.estratos.find(item => item.codigo === id);
    console.log('No se encuentra el ID: ' + id);
    return resultado ? resultado.nombre : 'Dato no encontrado';
  }

  loadTiposOrigen(){
    this.repos.get_withoutParameters(`OrigenReporte`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.tiposOrigenReporte = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombreOrigenReportePorId(id: any): string | undefined {
    const resultado = this.tiposOrigenReporte.find(item => item.id === id);
    console.log('No se encuentra el ID: ' + id);
    return resultado ? resultado.nombre : 'Dato no encontrado';
  }

  loadEstadosNNA(){
    this.repos.get_withoutParameters(`EstadoNNA`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.estadosNNA = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombreEstadoNNAPorId(id: any): string | undefined {
    const resultado = this.estadosNNA.find(item => item.id === id);
    console.log('No se encuentra el ID: ' + id);
    return resultado ? resultado.nombre : 'Dato no encontrado';
  }

  loadEstadosIngresoEstrategia(){
    this.repos.get_withoutParameters(`EstadoIngresoEstrategia`, 'TablaParametrica').subscribe({
      next: (data: any) => {
        this.estadosIngresoEstrategia = data;
      },
      error: (err: any) => console.error('Error al cargar Estado Ingreso Estrategia', err)
    });
  }

  getNombreEstadoIngresoEstrategiaPorId(id: any): string {
    const resultado = this.estadosIngresoEstrategia.find(item => String(item.id) === String(id) || String(item.codigo) === String(id));
    return resultado ? resultado.nombre : 'Dato no encontrado';
  }

  // INC-04: cargar CIE10 desde MSTablasParametricas para dropdown diagnostico en acordeon Tratamiento
  loadCIE10() {
    this.repos.get_withoutParameters(`CIE10`, 'TablaParametrica').subscribe({
      next: (data: any) => {
        const items = Array.isArray(data) ? data : [];
        this.optionsDiagnostico = items.map((d: any) => ({ label: d.nombre, value: d.id, ...d }));
      },
      error: (err: any) => console.error('Error al cargar CIE10', err)
    });
  }

  loadRegimenes(){
    this.repos.get_withoutParameters(`TablaParametrica/APSRegimenAfiliacion`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.regimenesAfiliacion = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombreTipoAfiliacionPorId(id: any): string | undefined {
    const resultado = this.regimenesAfiliacion.find(item => item.codigo === id);
    console.log('No se encuentra el ID: ' + id);
    return resultado ? resultado.nombre : 'Dato no encontrado';
  }

  ngAfterViewInit(): void {
    setInterval(() => {
      this.aplicarEstilos();
    }, 5000);
  }

  aplicarEstilos(): void {
    document.querySelectorAll('div.col span').forEach((span) => {
      if (span.textContent?.trim() === 'Dato no encontrado') {
        span.classList.add('highlight');
      }
    });
  }
}
