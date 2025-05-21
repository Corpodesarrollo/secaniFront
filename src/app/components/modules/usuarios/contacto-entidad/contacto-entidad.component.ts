import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalCrearComponent } from './modal-crear/modal-crear.component';
import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";
import { ContactoEntidad } from '../../../../models/contactoEntidad.mode';
import { GenericService } from '../../../../services/generic.services';
import { CompartirDatosService } from '../../../../services/compartir-datos.service';
import { Entidad } from '../../../../models/entidad.model';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-contacto-entidad',
  standalone: true,
  imports: [ModalCrearComponent, CommonModule, FormsModule, TableModule, BotonNotificacionComponent, CardModule],
  templateUrl: './contacto-entidad.component.html',
  styleUrl: './contacto-entidad.component.css'
})
export class ContactoEntidadComponent implements OnInit{
  @ViewChild(ModalCrearComponent) modalCrearComponent!: ModalCrearComponent;

  data2: ContactoEntidad[] = [
    { id: '1', entidadNombre: 'EPS Sanitas', tipoId: 'Luz Maria Soler', representante: 'Jefe de Enfermeras', telefonos: '3208987514', email: 'luz1@sanitas.com', ubicacion: 'Antioquia, Medellin', estado: 'Activo' },
    { id: '2', entidadNombre: 'EPS Sanitas', tipoId: 'Luz Maria Soler', representante: 'Jefe de Enfermeras', telefonos: '3208987515', email: 'luz2@sanitas.com', ubicacion: 'Antioquia, Medellin', estado: 'Inactivo' },
    { id: '3', entidadNombre: 'EPS Sanitas', tipoId: 'Felipe Arias', representante: 'Jefe de Doctores', telefonos: '3208987516', email: 'luz3@sanitas.com', ubicacion: 'Antioquia, Medellin', estado: 'Activo' },
    { id: '4', entidadNombre: 'EPS Sanitas', tipoId: 'Luz Maria Soler', representante: 'Jefe de Enfermeras', telefonos: '3208987516', email: 'luz3@sanitas.com', ubicacion: 'Antioquia, Medellin', estado: 'Activo' },
    { id: '5', entidadNombre: 'EPS Compensar', tipoId: 'Luz Maria Soler', representante: 'Jefe de Enfermeras', telefonos: '3208987516', email: 'luz3@sanitas.com', ubicacion: 'Antioquia, Medellin', estado: 'Activo' },
    { id: '6', entidadNombre: 'EPS Compensar', tipoId: 'Felipe Arias', representante: 'Jefe de Doctores', telefonos: '3208987516', email: 'luz3@sanitas.com', ubicacion: 'Antioquia, Medellin', estado: 'Activo' },
    { id: '7', entidadNombre: 'EPS Compensar', tipoId: 'Luz Maria Soler', representante: 'Jefe de Enfermeras', telefonos: '3208987516', email: 'luz3@sanitas.com', ubicacion: 'Antioquia, Medellin', estado: 'Activo' },
    { id: '8', entidadNombre: 'EPS Cafam', tipoId: 'Luz Maria Soler', representante: 'Jefe de Enfermeras', telefonos: '3208987516', email: 'luz3@sanitas.com', ubicacion: 'Antioquia, Medellin', estado: 'Activo' },
    { id: '9', entidadNombre: 'EPS Cafam', tipoId: 'Felipe Arias', representante: 'Jefe de Doctores', telefonos: '3208987516', email: 'luz3@sanitas.com', ubicacion: 'Antioquia, Medellin', estado: 'Activo' },
  ];

  data: ContactoEntidad[] = [];

  originalData: any[] = [];

  listaEntidades: Entidad[] = [];

  selectedItem: any = null;
  isEditing: boolean = false;

  filtroBuscar: string = '';
  filtroEntidad: string = '';

  first = 0;
  rows = 10;

  constructor(private dataService: GenericService, private compartirDatosService: CompartirDatosService) { }

  ngOnInit(): void {
    this.dataService.get_withoutParameters('ET', 'TablaParametrica').subscribe({
      next: (data: any) => {
        this.listaEntidades = data
        this.listaEntidades.sort((a, b) => a.nombre.localeCompare(b.nombre));
      },
      error: (e) => console.error('Se presento un error al llenar la lista de EAPB', e),
      complete: () => console.info('Se lleno la lista de EAPB')
    });

    this.dataService.get_withoutParameters('ContactoEntidad', 'Entidad').subscribe({
      next: (data: any) => {
        this.data = data;
        this.originalData = data;
        this.compartirDatosService.actualizarListaContactos(this.originalData);
        console.log(data)
      },
      error: (e) => console.error('Se presento un error al llenar la lista de Contactos por ET', e),
      complete: () => console.info('Se lleno la lista de Contactos ET')
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
        this.compartirDatosService.actualizarListaContactos(this.originalData);
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
    this.filtroEntidad = "";
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
      this.data = this.data.filter(item => item.entidadNombre === filtroEAPB);
    }
  }

  buscarNombreEntidadPorId(id: number): string {
    const item = this.listaEntidades.find(eapb => eapb.codigo === id);
    return item ? item.nombre : 'No encontrado';
  }

  onFiltroBuscarChange(): void {
    //console.log('Buscar cambiado:', event);
    this.buscar(this.filtroBuscar, this.filtroEntidad); // Llama a la función de búsqueda
  }

  onFiltroEntidadChange(): void {
    //console.log('Orden cambiado:', event);
    this.buscar(this.filtroBuscar, this.filtroEntidad); // Llama a la función de búsqueda
  }

  agregarNuevaEntidad(nuevaEAPB: any) {
    this.listaEntidades.push(nuevaEAPB);
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
