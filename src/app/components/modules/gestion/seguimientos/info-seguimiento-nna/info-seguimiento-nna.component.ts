import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { GenericService } from '../../../../../services/generic.services';
import { DatosBasicosNNA } from '../../../../../models/datosBasicosNNA.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-seguimiento-nna',
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule],
  templateUrl: './info-seguimiento-nna.component.html',
  styleUrl: './info-seguimiento-nna.component.css',
})
export class InfoSeguimientoNnaComponent implements OnChanges {
  @Input() idNNA?: number = 0;

  isLoading: boolean = false;
  error: boolean = false;
  mensajeCarga: string = 'Cargando datos...';
  colorMensaje: string = 'text-primary';

  NNA: DatosBasicosNNA = {
    idNNA: 0,
    nombreCompleto: '',
    fechaNacimiento: new Date(),
    edad: '',
    diagnostico: '',
    fechaIngresoEstrategia: new Date(),
    fechaInicioSeguimiento: new Date(),
    tiempoTranscurrido: '',
    seguimientosRealizados: 0,
    estado: ''
  };

  constructor(
    private repos: GenericService, private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.idNNA && this.idNNA > 0) this.CargarDatos();
  }

  // Bug 2026-06-17: el padre (detalle-seguimientos) resuelve idNNA de forma asincrona;
  // ngOnInit corria con idNNA=0 -> API devolvia null -> tarjeta quedaba con defaults.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idNNA'] && this.idNNA && this.idNNA > 0) {
      this.CargarDatos();
    }
  }

  async CargarDatos() {
    this.isLoading = true;
    this.repos.get('Seguimiento/SeguimientoNNA/', `${this.idNNA}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        if (data != null) {
          this.NNA = data;
          // Bug 2026-06-17: backend devuelve tiempoTranscurrido="" -> calculamos en front.
          // Se mide desde ultimaActuacionFecha (lo que la grilla muestra como "Fecha Seguimiento").
          // Si backend no la trae, fallback a fechaInicioSeguimiento.
          const ref = this.NNA.ultimaActuacionFecha || this.NNA.fechaInicioSeguimiento;
          this.NNA.tiempoTranscurrido = this.calcularTiempoTranscurrido(ref);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = true;
        this.colorMensaje = 'text-danger';
        this.mensajeCarga = 'Error al cargar los datos del NNA';
      },
    });
  }

  // Bug 2026-06-17: la tarjeta restaba -1 a seguimientosRealizados (mostraba 5 vs paginador 6).
  // Removido. Ahora computa tiempo (anios/meses/dias) desde fechaInicioSeguimiento hasta hoy.
  private calcularTiempoTranscurrido(desde: any): string {
    if (!desde) return '';
    const inicio = new Date(desde);
    if (isNaN(inicio.getTime())) return '';
    const fin = new Date();
    // Bug 2026-06-17: si el ultimo seguimiento queda en el futuro (dato semilla / seguimiento
    // futuro) la resta daba negativos que el algoritmo cascadeaba a "11 meses, 23 dias" en
    // lugar de 0. Clamp a 0 dias.
    if (inicio.getTime() >= fin.getTime()) return '0 días';
    let anios = fin.getFullYear() - inicio.getFullYear();
    let meses = fin.getMonth() - inicio.getMonth();
    let dias = fin.getDate() - inicio.getDate();
    if (dias < 0) {
      meses--;
      dias += new Date(fin.getFullYear(), fin.getMonth(), 0).getDate();
    }
    if (meses < 0) {
      anios--;
      meses += 12;
    }
    const parts: string[] = [];
    if (anios > 0) parts.push(`${anios} año${anios === 1 ? '' : 's'}`);
    if (meses > 0) parts.push(`${meses} mes${meses === 1 ? '' : 'es'}`);
    parts.push(`${dias} día${dias === 1 ? '' : 's'}`);
    return parts.join(', ');
  }

  verDetalle() {
    this.router.navigate(["/usuarios/detalle_nna/", this.idNNA]);
  }
}
