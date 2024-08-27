import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalCrearComponent } from './modal-crear/modal-crear.component';
import { TableModule } from 'primeng/table';
import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";
import { CardModule } from 'primeng/card';
import { EAPB } from '../../../../models/eapb.model';
import { GenericService } from '../../../../services/generic.services';
import { CompartirDatosService } from '../../../../services/compartir-datos.service';
import { ContactoEAPB } from '../../../../models/contactoEapb.model';

declare var bootstrap: any;

@Component({
  selector: 'app-eapb',
  standalone: true,
  imports: [ModalCrearComponent, CommonModule, FormsModule, TableModule, BotonNotificacionComponent, CardModule],
  templateUrl: './eapb.component.html',
  styleUrl: './eapb.component.css'
})

export class EAPBComponent implements OnInit {

  @ViewChild(ModalCrearComponent) modalCrearComponent!: ModalCrearComponent;

  data2: ContactoEAPB[] = [
    { id: '1', entidadId: 'EPS Sanitas', nombres: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefonos: '3208987514', email: 'luz1@sanitas.com', estado: 'Activo' },
    { id: '2', entidadId: 'EPS Sanitas', nombres: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefonos: '3208987515', email: 'luz2@sanitas.com', estado: 'Inactivo' },
    { id: '3', entidadId: 'EPS Sanitas', nombres: 'Felipe Arias', cargo: 'Jefe de Doctores', telefonos: '3208987516', email: 'luz3@sanitas.com', estado: 'Activo' },
    { id: '4', entidadId: 'EPS Sanitas', nombres: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefonos: '3208987516', email: 'luz3@sanitas.com', estado: 'Activo' },
    { id: '5', entidadId: 'EPS Compensar', nombres: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefonos: '3208987516', email: 'luz3@sanitas.com', estado: 'Activo' },
    { id: '6', entidadId: 'EPS Compensar', nombres: 'Felipe Arias', cargo: 'Jefe de Doctores', telefonos: '3208987516', email: 'luz3@sanitas.com', estado: 'Activo' },
    { id: '7', entidadId: 'EPS Compensar', nombres: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefonos: '3208987516', email: 'luz3@sanitas.com', estado: 'Activo' },
    { id: '8', entidadId: 'EPS Cafam', nombres: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefonos: '3208987516', email: 'luz3@sanitas.com', estado: 'Activo' },
    { id: '9', entidadId: 'EPS Cafam', nombres: 'Felipe Arias', cargo: 'Jefe de Doctores', telefonos: '3208987516', email: 'luz3@sanitas.com', estado: 'Activo' },
  ];

  data: ContactoEAPB[] = [];

  originalData: any[] = [];

  listaEAPB: EAPB[] = [];

  selectedItem: any = null;
  isEditing: boolean = false;

  filtroBuscar: string = '';
  filtroEAPB: string = '';

  first = 0;
  rows = 10;

  constructor(private dataService: GenericService, private compartirDatosService: CompartirDatosService) { }

  ngOnInit(): void {
    this.dataService.get('TablaParametrica/', 'CodigoEAPByNit', 'TablaParametrica').subscribe({
      next: (data: any) => {
        this.listaEAPB = data
        this.listaEAPB.sort((a, b) => a.nombre.localeCompare(b.nombre));
      },
      error: (e) => console.error('Se presento un error al llenar la lista de EAPB', e),
      complete: () => console.info('Se lleno la lista de EAPB')
    });

    this.dataService.get_withoutParameters('api/ContactoEntidad', 'Entidad').subscribe({
      next: (data: any) => {
        this.data = data;
        this.originalData = data;
      },
      error: (e) => console.error('Se presento un error al llenar la lista de Contactos por EAPB', e),
      complete: () => console.info('Se lleno la lista de Contactos EAPB')
    });

    this.compartirDatosService.nuevoContactoEAPB$.subscribe({
      next: (data: any) => {
        if (this.isEditing) {
          const index = this.data.findIndex(datanueva => datanueva.id === data.id);
          if (index !== -1) {
            this.data[index] = { ...this.data[index], ...data };
          }
        } else {
          this.data.push(data);
        }
        this.originalData = this.data;
        console.log('Array actualizado:', this.data);
      },
      error: (e) => console.error('Error al recibir el nuevo dato', e),
      complete: () => console.info('Actualización del array completada')
    });
  }

  /**Modal Crear y Editar**/

  onEdit(item: any) {
    this.selectedItem = item;
    this.isEditing = true; // Modo edición
    this.openModal();
  }

  onCreate() {
    this.selectedItem = null;
    this.isEditing = false; // Modo creación
    this.openModal();
  }

  openModal() {
    if (this.modalCrearComponent) {
      this.modalCrearComponent.open(); // Abre el modal
    }
  }

  /**Filtros**/

  limpiar() {
    this.filtroEAPB = "";
    this.filtroBuscar = "";
    this.data = [...this.originalData];
  }

  buscar(filtroBuscar: string, filtroEAPB: string) {
    this.data = [...this.originalData];

    if (filtroBuscar) {
      filtroBuscar = filtroBuscar.toLowerCase();
      this.data = this.data.filter(item =>
        Object.values(item).some(value => {
          if (typeof value === 'string') {
            return value.toString().toLowerCase().includes(filtroBuscar);
          }
          return false;
        })
      );
    }

    if (filtroEAPB) {
      this.data = this.data.filter(item => item.entidadId === filtroEAPB);
    }
  }

  buscarNombreEntidadPorId(id: number): string {
    const item = this.listaEAPB.find(eapb => eapb.codigo === id);
    return item ? item.nombre : 'No encontrado';
  }

  onFiltroBuscarChange(): void {
    //console.log('Buscar cambiado:', event);
    this.buscar(this.filtroBuscar, this.filtroEAPB); // Llama a la función de búsqueda
  }

  onFiltroEAPBChange(): void {
    //console.log('Orden cambiado:', event);
    this.buscar(this.filtroBuscar, this.filtroEAPB); // Llama a la función de búsqueda
  }

  agregarNuevaEAPB(nuevaEAPB: any) {
    this.listaEAPB.push(nuevaEAPB);
  }

  /**Paginador**/
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.data ? this.first === this.data.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.data ? this.first === 0 : true;
  }

}
