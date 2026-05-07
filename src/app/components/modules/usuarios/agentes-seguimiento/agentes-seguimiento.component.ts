import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { BotonNotificacionComponent } from '../../boton-notificacion/boton-notificacion.component';
import { GenericService } from '../../../../services/generic.services';

interface AgenteRow {
  id: string;
  fullName: string;
  email: string;
  alias: string;
  telefonos: string;
  entidadId: string;
  cargo: string;
  activo: boolean;
}

@Component({
  selector: 'app-agentes-seguimiento',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    TableModule, CardModule, DialogModule, ButtonModule, InputTextModule, DropdownModule, ToastModule,
    BotonNotificacionComponent
  ],
  templateUrl: './agentes-seguimiento.component.html',
  styleUrl: './agentes-seguimiento.component.css',
  providers: [MessageService]
})
export class AgentesSeguimientoComponent implements OnInit {
  agentes: AgenteRow[] = [];
  agentesFiltrados: AgenteRow[] = [];
  filtroBuscar: string = '';
  filtroEstado: string = '';

  estadoOptions = [
    { label: 'Todos', value: '' },
    { label: 'Activo', value: 'true' },
    { label: 'Inactivo', value: 'false' }
  ];

  rowsPerPageOptions: number[] = [5, 10, 25, 50];

  // Modal edición
  modalVisible: boolean = false;
  editForm!: FormGroup;
  agenteSeleccionado: AgenteRow | null = null;
  guardando: boolean = false;

  constructor(private dataService: GenericService, private fb: FormBuilder, private messageService: MessageService) {
    this.editForm = this.fb.group({
      id: [''],
      fullName: ['', [Validators.required, Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      telefonos: [''],
      entidadId: [''],
      cargo: [''],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.dataService.get_withoutParameters('User/GetAgentesSeguimiento', 'Authentication').subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : [];
        this.agentes = list.map(a => ({
          id: a.id ?? '',
          fullName: a.fullName ?? '',
          email: a.email ?? '',
          alias: a.alias ?? '',
          telefonos: a.telefonos ?? '',
          entidadId: a.entidadId ?? '',
          cargo: a.cargo ?? '',
          activo: a.activo === true
        }));
        this.aplicarFiltros();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible cargar los agentes de seguimiento.' })
    });
  }

  aplicarFiltros(): void {
    let r = [...this.agentes];
    if (this.filtroEstado === 'true') r = r.filter(x => x.activo === true);
    else if (this.filtroEstado === 'false') r = r.filter(x => x.activo === false);
    if (this.filtroBuscar) {
      const t = this.filtroBuscar.toLowerCase();
      r = r.filter(x => Object.values(x).some(v => v != null && String(v).toLowerCase().includes(t)));
    }
    this.agentesFiltrados = r;
  }

  limpiar(): void {
    this.filtroBuscar = '';
    this.filtroEstado = '';
    this.aplicarFiltros();
  }

  get totalActivos(): number { return this.agentes.filter(a => a.activo).length; }
  get totalInactivos(): number { return this.agentes.filter(a => !a.activo).length; }

  abrirEditar(agente: AgenteRow): void {
    this.agenteSeleccionado = agente;
    this.editForm.reset({
      id: agente.id,
      fullName: agente.fullName,
      email: agente.email,
      telefonos: agente.telefonos,
      entidadId: agente.entidadId,
      cargo: agente.cargo,
      activo: agente.activo
    });
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.agenteSeleccionado = null;
    this.editForm.reset();
  }

  guardar(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const v = this.editForm.getRawValue();
    const command = {
      id: v.id,
      fullName: v.fullName,
      email: v.email,
      telefonos: v.telefonos ?? '',
      entidadId: v.entidadId ?? '',
      cargo: v.cargo ?? '',
      estado: !!v.activo
    };
    this.guardando = true;
    this.dataService.put(`User/EditUserProfile/${v.id}`, command, 'Authentication').subscribe({
      next: () => {
        this.guardando = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Agente actualizado.' });
        this.cerrarModal();
        this.cargar();
      },
      error: (err) => {
        this.guardando = false;
        const detail = err?.error?.message || err?.error || 'No se pudo actualizar el agente.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: typeof detail === 'string' ? detail : 'No se pudo actualizar el agente.' });
      }
    });
  }
}
