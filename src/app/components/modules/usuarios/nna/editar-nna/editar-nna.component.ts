import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { NNAInfoDiagnostico } from '../../../../../models/nnaInfoDiagnostico.model';
import { NNA } from '../../../../../models/nna.model';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { GenericService } from '../../../../../services/generic.services';
import { Parametricas } from '../../../../../models/parametricas.model';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { NnaContactoListaComponent } from '../../nna-contacto/nna-contacto-lista/nna-contacto-lista.component';
import { ContactoNNA } from '../../../../../models/contactoNNA.model';
import { AlertasTratamiento } from '../../../../../models/alertasTratamiento.model';
import { PermisoDirective } from '../../../../../directives/permiso.directive';

@Component({
  selector: 'app-editar-nna',
  templateUrl: './editar-nna.component.html',
  styleUrls: ['./editar-nna.component.css'],
  standalone: true,
  imports: [CommonModule, BadgeModule, CardModule, TableModule, RouterModule, ButtonModule, DividerModule, DialogModule, AccordionModule, SelectButtonModule, DropdownModule, CalendarModule, FormsModule, ToastModule, ButtonModule, RippleModule, NnaContactoListaComponent, PermisoDirective],
  providers: [MessageService]
})
export class EditarNnaComponent implements OnInit {

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

  fechaConsultaDiagnosticoInput: string = '';
  fechaDiagnosticoInput: string = '';
  fechaInicioTratamientoInput: string = '';
  fechaRecaidaInput: string = '';

  optionsIps: any[] = [];

  listadoPais: Parametricas[] = [];
  listaDepartamentos: Parametricas[] = [];
  listaMunicipios: Parametricas[] = [];
  etnias: Parametricas[] = [];
  gruposponlacional: Parametricas[] = [];
  regimenesAfiliacion: Parametricas[] = [];
  eapbs: Parametricas[] = [];
  parentescos: Parametricas[] = [];
  razonesSinDiagnostico: any[] = [];
  placeholderidsindiagnostico: any;
  diagnosticos: any[] = [];
  estadosNNA: any[] = [];
  tiposOrigenReporte: any[] = [];
  entidadesRecibirTratamiento: any[] = [];
  departamentos: any[] = [];
  municipios: any[] = [];

  listaContactos: ContactoNNA[] = [];

  tiposMalaAtencionIps: any[] = [];
  categoriasAlerta: any[] = [];
  subcategoriasAlerta: any[] = [];
  ipss: any[] = [];
  tiposRecursoLegal: any[] = [];
  unidadesMedida: any[] = [];
  cuasasInasistencia: any[] = [];
  sexoAnn: any[] = [
    {"id" : "H", "nombre" : "Masculino"},
    {"id" : "M", "nombre" : "Femenino"}
  ];
  estadosIngresoEstrategia: any[] = [];
  departamentosOrigen: any[] = [];
  municipiosOrigen: any[] = [];
  departamentosResidenciaActual: any[] = [];
  municipiosResidenciaActual: any[] = [];
  areas: any[] = [];
  estratos: any[] = [];
  tiposVivienda: any[] = [];

  observacion: any = '';
  departamentoOrigen: any ='';
  municipioOrigen: any ='';
  departamentoRecidenciaActual: any ='';
  municipioRecidenciaActual: any ='';

  alertas: AlertasTratamiento[] = [];
  idContacto: string | undefined;
  saving: boolean = false;
  // BUG-LZ-083: flag que indica que las parametricas (areas, IPS, diagnosticos, etc) ya cargaron;
  // se setea tras Promise.all en ngOnInit para evitar pintar selects sin opciones.
  listasCargadas: boolean = false;

  // BUG-LZ-083: el select "¿La IPS le informo de manera clara...?" usa [ngValue]="true|false".
  // Si la propiedad del NNA llega como string "True"/"False" (por algun serializer o reporte),
  // el boolean no matchea y se ve "False" crudo. Accessor normaliza string<->boolean.
  get tratamientoHaSidoInformadoBool(): boolean | null {
    const v: any = this.datosNNA?.tratamientoHaSidoInformadoClaramente;
    if (v === true || v === 'True' || v === 'true' || v === 1 || v === '1') return true;
    if (v === false || v === 'False' || v === 'false' || v === 0 || v === '0') return false;
    return null;
  }
  set tratamientoHaSidoInformadoBool(val: boolean | null) {
    if (this.datosNNA) {
      (this.datosNNA as any).tratamientoHaSidoInformadoClaramente = val;
    }
  }

  // BUG-LZ-078: `datosNNA.trasladosIPSId` es int[] en el backend (NNADto.TrasladosIPSId).
  // El p-dropdown de IPS de traslado es single-select y emite un escalar. Si se enlaza
  // directo, manda un string/numero suelto -> ASP.NET no puede bindear a int[] -> 400
  // silencioso (Guardar "no hace nada"). Este accessor mapea escalar <-> int[].
  get trasladoIpsSeleccionado(): number | null {
    const arr = this.datosNNA?.trasladosIPSId;
    return Array.isArray(arr) && arr.length ? Number(arr[0]) : null;
  }
  set trasladoIpsSeleccionado(val: number | null) {
    if (!this.datosNNA) { return; }
    this.datosNNA.trasladosIPSId = (val !== null && val !== undefined) ? [Number(val)] : [];
  }

  constructor(
    private routerUrl: Router, 
    private route: ActivatedRoute,
    private repos: GenericService,
    private tpp: TpParametros,
    private tp: TablasParametricas,
    private messageService: MessageService,
    private cd: ChangeDetectorRef
  ) { }

  async ngOnInit() {

    this.panelSeleccionado = 1;

    // BUG-LZ-083: cargar todas las parametricas ANTES de pedir el JSON del NNA, para evitar la
    // condicion de carrera intermitente que dejaba selects sin valor o mostrando codigo en
    // lugar de nombre cuando datosNNA llegaba primero (areas, IPS, diagnosticos, etc).
    await new Promise<void>(resolve => {
      this.route.paramMap.subscribe(params => {
        this.idNna = params.get('idNna') || '';
        this.alertas = history.state.alertas;
        this.idContacto = history.state.idContacto;
        resolve();
      });
    });

    try {
      const [
        paises, deptos, munis, etniasD, gruposD, regimenesD, eapbsD, parentescosD,
        razonesD, diagnosticosD, ipsD, malaAtenD, catAlertaD, subCatAlertaD,
        causasInasistD, estadosD, tiposOrigenD, estadosIngresoD,
        areasD, estratosD, tiposViviendaD, unidadesMedidaD, tiposRecursoD
      ] = await Promise.all([
        this.fetchListSafe(`TablaParametrica/Pais`, 'TablaParametrica'),
        this.fetchListSafe(`TablaParametrica/Departamento`, 'TablaParametrica'),
        this.fetchListSafe(`TablaParametrica/Municipio`, 'TablaParametrica'),
        this.fetchListSafe(`TablaParametrica/GrupoEtnico`, 'TablaParametrica'),
        this.fetchListSafe(`TablaParametrica/LCETipoPoblacionEspecial`, 'TablaParametrica'),
        this.fetchListSafe(`TablaParametrica/APSRegimenAfiliacion`, 'TablaParametrica'),
        this.fetchListSafe(`EAPB/Entidades`, 'TablaParametrica'),
        this.fetchListSafe(`TablaParametrica/RLCPDParentesco`, 'TablaParametrica'),
        this.fetchListSafe(`RazonesSinDiagnostico`, 'TablaParametrica'),
        this.fetchListSafe(`CIE10`, 'TablaParametrica'),
        this.fetchListSafe(`IPS`, 'TablaParametrica'),
        this.fetchListSafe(`MalaAtencionIPS`, 'TablaParametrica'),
        this.fetchListSafe(`CategoriaAlerta`, 'TablaParametrica'),
        this.fetchListSafe(`SubCategoriaAlerta`, 'TablaParametrica'),
        this.fetchListSafe(`CausaInasistencia`, 'TablaParametrica'),
        this.fetchListSafe(`EstadoNNA`, 'TablaParametrica'),
        this.fetchListSafe(`OrigenReporte`, 'TablaParametrica'),
        this.fetchListSafe(`EstadoIngresoEstrategia`, 'TablaParametrica'),
        this.fetchListSafe(`TablaParametrica/ZonaTerritorial`, 'TablaParametrica'),
        this.fetchListSafe(`TablaParametrica/EstratoSocioeconomico`, 'TablaParametrica'),
        this.fetchListSafe(`TablaParametrica/RIBATipoVivienda`, 'TablaParametrica'),
        this.fetchListSafe(`TablaParametrica/UnidadMedida`, 'TablaParametrica'),
        this.fetchListSafe(`TipoRecurso`, 'TablaParametrica'),
      ]);

      this.listadoPais = paises ?? [];
      this.listaDepartamentos = deptos ?? [];
      this.departamentosOrigen = deptos ?? [];
      this.departamentosResidenciaActual = deptos ?? [];
      this.listaMunicipios = munis ?? [];
      this.etnias = etniasD ?? [];
      this.gruposponlacional = gruposD ?? [];
      this.regimenesAfiliacion = regimenesD ?? [];
      this.eapbs = eapbsD ?? [];
      this.parentescos = parentescosD ?? [];
      this.razonesSinDiagnostico = razonesD ?? [];
      this.diagnosticos = diagnosticosD ?? [];
      this.entidadesRecibirTratamiento = ipsD ?? [];
      this.ipss = ipsD ?? [];
      this.tiposMalaAtencionIps = malaAtenD ?? [];
      this.categoriasAlerta = catAlertaD ?? [];
      this.subcategoriasAlerta = subCatAlertaD ?? [];
      this.cuasasInasistencia = causasInasistD ?? [];
      this.estadosNNA = estadosD ?? [];
      this.tiposOrigenReporte = tiposOrigenD ?? [];
      this.estadosIngresoEstrategia = estadosIngresoD ?? [];
      this.areas = areasD ?? [];
      this.estratos = estratosD ?? [];
      this.tiposVivienda = tiposViviendaD ?? [];
      this.tiposRecursoLegal = (tiposRecursoD ?? []).map((x: any) => ({ codigo: x.id, nombre: x.nombre }));

      const fallbackUnidades = [
        { codigo: 'D', nombre: 'Días' },
        { codigo: 'S', nombre: 'Semanas' },
        { codigo: 'M', nombre: 'Meses' },
        { codigo: 'A', nombre: 'Años' }
      ];
      this.unidadesMedida = (Array.isArray(unidadesMedidaD) && unidadesMedidaD.length > 0)
        ? unidadesMedidaD : fallbackUnidades;
    } catch (err) {
      console.error('BUG-LZ-083: error cargando parametricas, alguna fallo', err);
    }

    this.listasCargadas = true;

    // Recien ahora cargar el NNA: las listas ya estan en memoria y los selects podran resolver
    // sus valores (nombre en lugar de codigo crudo).
    this.loadDatosBasicosNNA();
    this.loadNNAData();
    this.loadContactosNna();
  }

  // BUG-LZ-083: wrapper Observable -> Promise para usar Promise.all. Resuelve null en error
  // para no abortar la carga completa si una parametrica concreta falla.
  private fetchListSafe(endpoint: string, api: string): Promise<any> {
    return new Promise((resolve) => {
      this.repos.get_withoutParameters(endpoint, api).subscribe({
        next: (data: any) => resolve(data),
        error: (err: any) => {
          console.error('BUG-LZ-083: error cargando parametrica', endpoint, err);
          resolve(null);
        }
      });
    });
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
    this.repos.get_withoutParameters(`NNA/${this.idNna}`, 'NNA').subscribe({
      next: async (nnaData: any) => {
        this.datosNNA = nnaData;
        this.fechaConsultaDiagnosticoInput = this.formatDate(this.datosNNA.fechaConsultaDiagnostico);
        this.fechaDiagnosticoInput = this.formatDate(this.datosNNA.fechaDiagnostico);
        this.fechaInicioTratamientoInput = this.formatDate(this.datosNNA.fechaInicioTratamiento);
        this.fechaRecaidaInput = this.formatDate(this.datosNNA.fechaUltimaRecaida);
        this.deptoMuniOrigen(nnaData.residenciaOrigenMunicipioId);
        this.deptoMuniResiActual(nnaData.residenciaActualMunicipioId);
        this.setFechaRecaida();
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadContactosNna(){
    this.repos.get_withoutParameters(`ContactoNNAs/ObtenerByNNAId/${this.idNna}`, 'NNA').subscribe({
      next: async (data: any) => {
        this.contactosNna = data.datos;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombrePaisNacimiento(){
    return "nombre"
  }

  private formatDate(date: any): string {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    // Verifica que ahora sí es una fecha válida
    if (isNaN(date.getTime())) {
        console.error('La fecha proporcionada no es válida.');
        return '';
    }
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const seconds = this.padZero(date.getSeconds());

    return `${year}-${month}-${day}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  onDateChange(event: any): void {
    console.log(event.value);
  }

  loadRazonesSinDiagnostico(){
    this.repos.get_withoutParameters(`RazonesSinDiagnostico`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.razonesSinDiagnostico = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadPaisesNacimiento(){
    this.repos.get_withoutParameters(`TablaParametrica/Pais`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.listadoPais = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadDepartamentos(){
    this.repos.get_withoutParameters(`TablaParametrica/Departamento`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.listaDepartamentos = data;
        this.departamentosOrigen = data;
        this.departamentosResidenciaActual = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadMunicipios(){
    this.repos.get_withoutParameters(`TablaParametrica/Municipio`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.listaMunicipios = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadEtnias(){
    this.repos.get_withoutParameters(`TablaParametrica/GrupoEtnico`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.etnias = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadGruposPobla(){
    this.repos.get_withoutParameters(`TablaParametrica/LCETipoPoblacionEspecial`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.gruposponlacional = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
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

  loadEAPBs(){
    // BUG-LZ-053 (extension): endpoint anterior `TablaParametrica/CodigoEAPByNit` lee el
    // directorio externo SISPRO y retorna `{codigo, nombre}` sin `id`. El dropdown usa
    // optionValue="id" + ngModel datosNNA.eapbId (que es TPEAPB.Id) -> no matcheaba nunca,
    // dropdown quedaba vacio aunque el NNA tuviera EAPB asignada en BD.
    // Fix: usar `EAPB/Entidades` local que devuelve la fila completa (incluye id de TPEAPB).
    this.repos.get_withoutParameters(`EAPB/Entidades`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.eapbs = data;
      },
      error: (err: any) => console.error('Error al cargar EAPBs', err)
    });
  }

  loadParentescos(){
    this.repos.get_withoutParameters(`TablaParametrica/RLCPDParentesco`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.parentescos = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadDiagnosticos(){
    this.repos.get_withoutParameters(`CIE10`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.diagnosticos = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadEntidadesRecibirTratamiento(){
    // BUG-LZ-073: endpoint previo `Entidades/Entidades` retornaba listado de EAPB/EPS (503 + fallback).
    // Campo es "Institución donde recibe tratamiento (IPS)" -> usar endpoint IPS.
    this.repos.get_withoutParameters(`IPS`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.entidadesRecibirTratamiento = data;
        // BUG-LZ-078: el dropdown de IPS de traslado (`ipss`) cargaba por error desde
        // EAPB/Entidades (codigos no numericos). Debe usar el mismo listado IPS.
        this.ipss = data;
      },
      error: (err: any) => console.error('Error al cargar IPS', err)
    });
  }

  loadTiposMalaAtencionIps(){
    this.repos.get_withoutParameters(`MalaAtencionIPS`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.tiposMalaAtencionIps = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadCategoriasAlerta(){
    this.repos.get_withoutParameters(`CategoriaAlerta`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.categoriasAlerta = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadSubCategoriasAlerta(){
    this.repos.get_withoutParameters(`SubCategoriaAlerta`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.subcategoriasAlerta = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadCausasInasistencia(){
    this.repos.get_withoutParameters(`CausaInasistencia`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.cuasasInasistencia = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadEstadosNNA(){
    this.repos.get_withoutParameters(`EstadoNNA`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.estadosNNA = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadTiposOrigen(){
    this.repos.get_withoutParameters(`OrigenReporte`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.tiposOrigenReporte = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadEstadoIngresoEstrategia(){
    this.repos.get_withoutParameters(`EstadoIngresoEstrategia`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.estadosIngresoEstrategia = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadAreas(){
    this.repos.get_withoutParameters(`TablaParametrica/ZonaTerritorial`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.areas = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadEstratos(){
    this.repos.get_withoutParameters(`TablaParametrica/EstratoSocioeconomico`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.estratos = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadTiposVivienda(){
    this.repos.get_withoutParameters(`TablaParametrica/RIBATipoVivienda`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.tiposVivienda = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadUnidadesMedida(){
    // BUG-LZ-065: SISPRO TREF "UnidadMedida" retorna 204 No Content (endpoint sin items en
    // referencia externa). Fallback local hardcoded para que el dropdown muestre opciones.
    const fallback = [
      { codigo: 'D', nombre: 'Días' },
      { codigo: 'S', nombre: 'Semanas' },
      { codigo: 'M', nombre: 'Meses' },
      { codigo: 'A', nombre: 'Años' }
    ];
    this.repos.get_withoutParameters(`TablaParametrica/UnidadMedida`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.unidadesMedida = (Array.isArray(data) && data.length > 0) ? data : fallback;
      },
      error: (err: any) => {
        console.error('Error al cargar UnidadMedida, usando fallback local', err);
        this.unidadesMedida = fallback;
      }
    });
  }

  setFechaConsultaDiagnostico() {
    const fechaDate = new Date(this.fechaConsultaDiagnosticoInput);
    this.datosNNA.fechaConsultaDiagnostico = fechaDate;
  }

  setFechaDiagnostico() {
    const fechaDate = new Date(this.fechaDiagnosticoInput);
    this.datosNNA.fechaDiagnostico = fechaDate;
  }

  setFechaInicioTratamiento() {
    const fechaDate = new Date(this.fechaInicioTratamientoInput);
    this.datosNNA.fechaInicioTratamiento = fechaDate;
  }

  setFechaRecaida() {
    const fechaDate = new Date(this.fechaRecaidaInput);
    this.datosNNA.fechaUltimaRecaida = fechaDate;
  }

  cambiarRecaidaSiNo(value: boolean){
    this.datosNNA.recaida = value;
  }

  cambiarHaSidoTrasladadoSiNo(value: boolean){
    this.datosNNA.trasladosHaSidoTrasladadodeInstitucion = value;
  }

  getNombreSexoPorId(id: any): string | undefined {
    const resultado = this.sexoAnn.find(item => item.id === id);
    return resultado ? resultado.nombre : 'No se encuentra el ID: ' + id;
  }

  getNombrePaisPorId(id: any): string | undefined {
    const limpiarDato = (dato: string | null | undefined): string => {
      if (!dato) return ''; // Si es null o undefined, retorna una cadena vacía
      return dato.replace(/'/g, '');
    };
    let codPais : string = limpiarDato(id);
    const resultado = this.listadoPais.find(item => item.codigo === codPais);
    return resultado ? resultado.nombre : 'No se encuentra el ID: ' + id;
  }

  getNombreDeptoPorId(codigo: any): string | undefined {
    const extraerDosPrimeros = (codigo: string | undefined | null): string => {
      if (!codigo) {
        return '';
      }
      return codigo.substring(0, 2);
    };
    let codDepto: string = extraerDosPrimeros(codigo);
    const resultado = this.listaDepartamentos.find(item => item.codigo === codDepto);
    return resultado ? resultado.nombre : 'No se encuentra el código: ' + codigo;
  }

  getNombreMuniPorId(codigo: any): string | undefined {
    const completarCodigo = (codigo: string | undefined | null): string => {
      if (!codigo) {
        return '';
      }
      return codigo.padEnd(5, '0');
    };
    /*const completarCodigo = (codigo: string): string => {
      return codigo.padEnd(5, '0');
    };*/
    let codigoCompleto: string = completarCodigo(codigo);
    const resultado = this.listaMunicipios.find(item => item.codigo === codigoCompleto);
    return resultado ? resultado.nombre : 'No se encuentra el código: ' + codigo;
  }

  getNombreEtniaPorId(id: any): string | undefined {
    const resultado = this.etnias.find(item => item.codigo === id);
    return resultado ? resultado.nombre : 'No se encuentra el ID: ' + id;
  }

  getNombreGrupoPoblaPorId(id: any): string | undefined {
    const resultado = this.gruposponlacional.find(item => item.codigo === id);
    return resultado ? resultado.nombre : 'No se encuentra el ID: ' + id;
  }

  getNombreTipoAfiliacionPorId(id: any): string | undefined {
    const resultado = this.regimenesAfiliacion.find(item => item.codigo === id);
    return resultado ? resultado.nombre : 'No se encuentra el ID: ' + id;
  }

  getNombreEstadoNNAPorId(id: any): string | undefined {
    const resultado = this.estadosNNA.find(item => item.id === id);
    return resultado ? resultado.nombre : 'No se encuentra el ID: ' + id;
  }

  getNombreOrigenReportePorId(id: any): string | undefined {
    const resultado = this.tiposOrigenReporte.find(item => item.id === id);
    return resultado ? resultado.nombre : 'No se encuentra el ID: ' + id;
  }

  getNombreEstadoIngresoPorId(id: any): string | undefined {
    const resultado = this.estadosIngresoEstrategia.find(item => item.id === id);
    return resultado ? resultado.nombre : 'No se encuentra el ID: ' + id;
  }

  deptoMuniOrigen(codigoMuniOrigenNNa:string){
    const extraerDosPrimeros = (codigoMuniOrigenNNa: string | undefined | null): string => {
      if (!codigoMuniOrigenNNa) {
        return '';
      }
      return codigoMuniOrigenNNa.substring(0, 2);
    };
    this.departamentoOrigen = extraerDosPrimeros(codigoMuniOrigenNNa);
    this.municipioOrigen = codigoMuniOrigenNNa;

    if(this.departamentoOrigen!=''){
      this.loadMunisPorDepto();
    }
  }

  deptoMuniResiActual(codigoMuniResiActualNNa:string){
    const extraerDosPrimeros = (codigoMuniResiActualNNa: string | undefined | null): string => {
      if (!codigoMuniResiActualNNa) {
        return '';
      }
      return codigoMuniResiActualNNa.substring(0, 2);
    };
    this.departamentoRecidenciaActual = extraerDosPrimeros(codigoMuniResiActualNNa);
    this.municipioRecidenciaActual = codigoMuniResiActualNNa;

    // BUG-LZ-072: copy-paste error - chequeaba departamentoOrigen + llamaba loadMunisPorDepto (origen)
    // en vez de chequear departamentoRecidenciaActual + llamar loadMunisResiActualPorDepto. Resultado:
    // la lista de municipios actual nunca se cargaba al abrir el edit (quedaba vacia hasta que user
    // cambia depto). Fix: usar el depto + loader correctos.
    if(this.departamentoRecidenciaActual!=''){
      this.loadMunisResiActualPorDepto();
    }
  }

  loadMunisPorDepto(){
    this.repos.get_withoutParameters(`TablaParametrica/Municipios/`+this.departamentoOrigen, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.municipiosOrigen = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  seleccionMunicipioOrigen(){
    this.datosNNA.residenciaOrigenMunicipioId = this.municipioOrigen;
  }

  loadMunisResiActualPorDepto(){
    this.repos.get_withoutParameters(`TablaParametrica/Municipios/`+this.departamentoRecidenciaActual, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.municipiosResidenciaActual = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  seleccionMunicipioResiActual(){
    this.datosNNA.residenciaActualMunicipioId = this.municipioRecidenciaActual;
  }


  validarDatos(): boolean {
    // Validar régimen de afiliación obligatoria
    if (!this.datosNNA.tipoRegimenSSId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El régimen de afiliación es obligatorio.' });
      return false;
    }

    // Validar EAPB obligatorio
    if (!this.datosNNA.eapbId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo EAPB es obligatorio.' });
      return false;
    }

    if (this.contactosNna.length == 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe ingresar al menos un contacto.' });
      return false;
    }

    // Validar recaídas obligatorio
    if (this.datosNNA.recaida === undefined || this.datosNNA.recaida === null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo recaídas es obligatorio.' });
      return false;
    }

    // Validar fecha última recaída obligatoria
    if (this.datosNNA.recaida && !this.datosNNA.fechaUltimaRecaida) {
      console.log('Fecha última recaída:', this.datosNNA.fechaUltimaRecaida);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fecha de la última recaída es obligatoria.' });
      return false;
    }

    // Validar si requirió traslado de ciudad obligatorio
    if (this.datosNNA.trasladosHaSidoTrasladadodeInstitucion === undefined || this.datosNNA.trasladosHaSidoTrasladadodeInstitucion === null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe indicar si se requirió traslado de ciudad para acceder al tratamiento.' });
      return false;
    }

    // Validar departamento de residencia de procedencia/ocurrencia obligatorio
    if (!this.datosNNA.residenciaOrigenMunicipioId || this.datosNNA.residenciaOrigenMunicipioId.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El departamento de residencia de procedencia/ocurrencia es obligatorio.' });
      return false;
    }

    // Validar municipio de residencia de procedencia/ocurrencia obligatorio
    if (!this.datosNNA.residenciaOrigenMunicipioId || this.datosNNA.residenciaOrigenMunicipioId.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El municipio de residencia de procedencia/ocurrencia es obligatorio.' });
      return false;
    }

    // Validar barrio de residencia de procedencia/ocurrencia obligatorio y con máximo 100 caracteres
    if (!this.datosNNA.residenciaOrigenBarrio || this.datosNNA.residenciaOrigenBarrio.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El barrio de residencia de procedencia/ocurrencia es obligatorio.' });
      return false;
    }

    if (this.datosNNA.residenciaOrigenBarrio.length > 100) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El barrio de residencia de procedencia/ocurrencia no puede exceder los 100 caracteres.' });
      return false;
    }

    // Validar área de residencia de procedencia/ocurrencia obligatorio
    if (!this.datosNNA.residenciaOrigenAreaId || this.datosNNA.residenciaOrigenAreaId.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El área de residencia de procedencia/ocurrencia es obligatoria.' });
      return false;
    }

    // Validar estrato de residencia de procedencia/ocurrencia obligatorio
    if (!this.datosNNA.residenciaOrigenEstratoId || this.datosNNA.residenciaOrigenEstratoId.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El estrato de residencia de procedencia/ocurrencia es obligatorio.' });
      return false;
    }

    // Validar si cuenta con la capacidad económica para asumir el traslado del menor, obligatorio
    if (this.datosNNA.trasladoTieneCapacidadEconomica === undefined || this.datosNNA.trasladoTieneCapacidadEconomica === null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe indicar si cuenta con la capacidad económica para asumir el traslado del menor.' });
      return false;
    }

    // Validar si la EAPB ha suministrado servicios sociales de apoyo para el traslado, obligatorio
    if (this.datosNNA.trasladoEAPBSuministroApoyo === undefined || this.datosNNA.trasladoEAPBSuministroApoyo === null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe indicar si la EAPB le ha suministrado servicios sociales de apoyo para el traslado.' });
      return false;
    }

    // Validar si los servicios sociales de apoyo fueron entregados con oportunidad, obligatorio
    if (this.datosNNA.trasladosServiciosdeApoyoOportunos === undefined || this.datosNNA.trasladosServiciosdeApoyoOportunos === null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe indicar si los servicios sociales de apoyo fueron entregados con oportunidad.' });
      return false;
    }

    // Validar si los servicios sociales de apoyo logran dar cobertura al traslado del menor, obligatorio
    if (this.datosNNA.trasladosServiciosdeApoyoCobertura === undefined || this.datosNNA.trasladosServiciosdeApoyoCobertura === null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe indicar si los servicios sociales de apoyo logran dar cobertura al traslado del menor.' });
      return false;
    }

    // Validar si ha solicitado apoyo de alguna fundación, obligatorio
    if (this.datosNNA.trasladosHaSolicitadoApoyoFundacion === undefined || this.datosNNA.trasladosHaSolicitadoApoyoFundacion === null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe indicar si ha solicitado apoyo de alguna fundación.' });
      return false;
    }

    // Validar Nombre de la fundación, máximo 255 caracteres
    if (this.datosNNA.trasladosNombreFundacion && this.datosNNA.trasladosNombreFundacion.length > 255) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre de la fundación no puede exceder los 255 caracteres.' });
      return false;
    }

    // Validar Apoyo recibido por la fundación, máximo 255 caracteres
    if (this.datosNNA.trasladosApoyoRecibidoxFundacion && this.datosNNA.trasladosApoyoRecibidoxFundacion.length > 255) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El apoyo recibido por la fundación no puede exceder los 255 caracteres.' });
      return false;
    }

    // Validar ¿Quién asumió los costos del traslado?, máximo 255 caracteres
    if (this.datosNNA.trasladosQuienAsumioCostosTraslado && this.datosNNA.trasladosQuienAsumioCostosTraslado.length > 255) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo "¿Quién asumió los costos del traslado?" no puede exceder los 255 caracteres.' });
      return false;
    }

    // Validar ¿Quién asumió los costos de la vivienda?, máximo 255 caracteres
    if (this.datosNNA.trasladosQuienAsumioCostosVivienda && this.datosNNA.trasladosQuienAsumioCostosVivienda.length > 255) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo "¿Quién asumió los costos de la vivienda?" no puede exceder los 255 caracteres.' });
      return false;
    }

    // Validar ¿Ha sido trasladado de institución?, obligatorio
    if (this.datosNNA.trasladosHaSidoTrasladadodeInstitucion === null || this.datosNNA.trasladosHaSidoTrasladadodeInstitucion === undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo "¿Ha sido trasladado de institución?" es obligatorio.' });
      return false;
    }

    // Validar ¿Ha tenido que recurrir a algún tipo de acción legal para acceder a la atención?, obligatorio
    if (this.datosNNA.trasladosHaRecurridoAccionLegal === null || this.datosNNA.trasladosHaRecurridoAccionLegal === undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo "¿Ha tenido que recurrir a algún tipo de acción legal para acceder a la atención?" es obligatorio.' });
      return false;
    }

    // Validar ¿Ha dejado de asistir al tratamiento?, obligatorio
    if (this.datosNNA.tratamientoHaDejadodeAsistir === null || this.datosNNA.tratamientoHaDejadodeAsistir === undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo "¿Ha dejado de asistir al tratamiento?" es obligatorio.' });
      return false;
    }

    // Validar ¿Está estudiando actualmente?, obligatorio
    if (this.datosNNA.tratamientoEstudiaActualmente === null || this.datosNNA.tratamientoEstudiaActualmente === undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo "¿Está estudiando actualmente?" es obligatorio.' });
      return false;
    }

    // Validar ¿En algún momento ha dejado de asistir al colegio?, obligatorio
    if (this.datosNNA.tratamientoHaDejadodeAsistirColegio === null || this.datosNNA.tratamientoHaDejadodeAsistirColegio === undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo "¿En algún momento ha dejado de asistir al colegio?" es obligatorio.' });
      return false;
    }

    // Validar ¿Considera que la IPS y/o el médico le han informado de manera clara y completa sobre el diagnóstico y el tratamiento del NNA?, obligatorio
    if (this.datosNNA.tratamientoHaSidoInformadoClaramente === null || this.datosNNA.tratamientoHaSidoInformadoClaramente === undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo "¿Considera que la IPS y/o el médico le han informado de manera clara y completa sobre el diagnóstico y el tratamiento del NNA?" es obligatorio.' });
      return false;
    }

    // Validar Observación ¿Por qué?, máximo 255 caracteres
    if (this.datosNNA.tratamientoObservaciones && this.datosNNA.tratamientoObservaciones.length > 255) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo "Observación ¿Por qué?" no puede exceder los 255 caracteres.' });
      return false;
    }

    return true; // Si pasa todas las validaciones
  }

  obtenerLista(lista: ContactoNNA[]) {
      this.contactosNna = lista; // Guardar la lista emitida por el hijo
      console.log('Lista de alertas recibidas:', this.listaContactos);
    }

  async guardarCambios() {
    console.log('Guardando cambios...');

    if (this.saving) {
      return; // Evita múltiples envíos si ya se está guardando
    }

    this.saving = true;

    if (!this.validarDatos()) {
      this.saving = false;
      return;
    }

    // Permite que el spinner pueda mostrarse
    this.repos.put('NNA/Actualizar', this.datosNNA, 'NNA').subscribe({
        next: (result) => {
          console.log('Resultado de la actualización:', result);
          this.loadNNAData();
          this.fechaConsultaDiagnosticoInput = this.formatDate(this.datosNNA.fechaConsultaDiagnostico);
          this.saving = false;   // ✅ FIN DEL GUARDADO
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Los cambios se han guardado correctamente.' });
        },
        error: (err) => {
          console.error('Error al actualizar NNA:', err);
          this.saving = false;   // ✅ SI HUBO ERROR, TAMBIÉN LIBERA
          // BUG-LZ-078: antes el error era silencioso (solo console) -> el usuario veia
          // que Guardar "no hacia nada". Mostrar el motivo real del backend.
          const detalle = err?.error?.message || err?.error?.title
            || (err?.status ? `Error HTTP ${err.status}` : 'No fue posible guardar los cambios');
          this.messageService.add({ severity: 'error', summary: 'Error al guardar', detail: detalle });
        }
      });
  }


  visibleCrearContacto: boolean = false;
  visibleEditarContacto: boolean = false;
  headerContacto: any = '';
  contactoId: any = '0';

  showDialogCrearContacto() {
    this.headerContacto = "Crear contacto"
    this.visibleCrearContacto = true;
  }

  showDialogEditarContacto(id: any) {
    this.headerContacto = "Editar contacto"
    this.visibleCrearContacto = true;
    this.contactoId = id;
  }

  manejarContactoCreado(contacto: any) {
    console.log('Contacto creado:', contacto);
  }

  manejarCierreModal() {
    console.log('El modal ha sido cerrado');
    this.contactoId = '0';
    this.visibleCrearContacto = false; // Cerrar el modal
  }

  volver(){
    this.routerUrl.navigate([`/gestion/seguimientos/gestionar-seguimiento/${this.idNna}`], {
          state: { alertas: this.alertas, idContacto: this.idContacto, skipGuard: true }
        }).then(() => {
          window.scrollTo(0, 0);
    });
  }
}
