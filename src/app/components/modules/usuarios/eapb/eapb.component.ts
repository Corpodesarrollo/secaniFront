import { Component, OnInit, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalCrearComponent } from './modal-crear/modal-crear.component';
import { TableModule } from 'primeng/table';
import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";
import { CardModule } from 'primeng/card';

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
  
  data: any[] = [
    { eapb: 'EPS Sanitas', nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987514', correo: 'luz1@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Sanitas', nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987515', correo: 'luz2@sanitas.com', estado: 'Inactivo' },
    { eapb: 'EPS Sanitas', nombreApe: 'Felipe Arias', cargo: 'Jefe de Doctores', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Sanitas', nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Compensar', nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Compensar', nombreApe: 'Felipe Arias', cargo: 'Jefe de Doctores', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Compensar', nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Cafam', nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Cafam', nombreApe: 'Felipe Arias', cargo: 'Jefe de Doctores', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
  ];

  originalData: any[] = [...this.data];

  selectedItem: any = null;
  isEditing: boolean = false;

  filtroBuscar: string = '';
  filtroEAPB: string = '';

  first = 0;
  rows = 10;

  constructor() { }

  ngOnInit(): void {  }

  /**Modal Crear y Editar**/

  onEdit(item: any) {
    this.selectedItem = item;
    this.isEditing = true; // Modo edición
    this.openModal();
  }

  onCreate() {
    this.selectedItem = null; // Asegúrate de que no hay datos seleccionados
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
      this.data = this.data.filter(item => item.eapb === filtroEAPB);
    }
  }

  onFiltroBuscarChange(): void {
    //console.log('Buscar cambiado:', event);
    this.buscar(this.filtroBuscar,this.filtroEAPB); // Llama a la función de búsqueda
  }

  onFiltroEAPBChange(): void {
    //console.log('Orden cambiado:', event);
    this.buscar(this.filtroBuscar,this.filtroEAPB); // Llama a la función de búsqueda
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
