import { Component, OnInit, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalCrearComponent } from './modal-crear/modal-crear.component';

declare var bootstrap: any;

@Component({
  selector: 'app-eapb',
  standalone: true,
  imports: [ModalCrearComponent, CommonModule, FormsModule],
  templateUrl: './eapb.component.html',
  styleUrl: './eapb.component.css'
})

export class EAPBComponent implements OnInit {

  @ViewChild(ModalCrearComponent) modalCrearComponent!: ModalCrearComponent;
  
  data: any[] = [
    { eapb: 'EPS Sanitas', nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987514', correo: 'luz1@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Sanitas', nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987515', correo: 'luz2@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Sanitas', nombreApe: 'Felipe Arias', cargo: 'Jefe de Doctores', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Sanitas', nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Compensar', nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Compensar', nombreApe: 'Felipe Arias', cargo: 'Jefe de Doctores', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Compensar', nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Cafam', nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
    { eapb: 'EPS Cafam', nombreApe: 'Felipe Arias', cargo: 'Jefe de Doctores', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
  ];

  selectedItem: any = null;
  isEditing: boolean = false;

  pageSize: number = 5;
  currentPage: number = 1;
  paginatedData: any[] = [];
  searchTerm: string = '';
  selectedArea: string = '';

  constructor() { }

  ngOnInit(): void {
    this.updatePaginatedData();
  }

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

  updatePaginatedData(): void {
    const filteredData = this.filterData(this.searchTerm, this.selectedArea);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = filteredData.slice(startIndex, endIndex);
  }

  filterData(searchTerm: string, selectedArea: string): any[] {
    let filteredData = this.data;

    if (searchTerm) {
      searchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item =>
        Object.values(item).some(value => {
          if (typeof value === 'string') {
            return value.toString().toLowerCase().includes(searchTerm);
          }
          return false;
        })
      );
    }

    if (selectedArea) {
      filteredData = filteredData.filter(item => item.eapb === selectedArea);
    }

    return filteredData;
  }

  nextPage(): void {
    const filteredData = this.filterData(this.searchTerm, this.selectedArea);
    if ((this.currentPage * this.pageSize) < filteredData.length) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  onSearchTermChange(): void {
    this.currentPage = 1; // Reset to first page on search
    this.updatePaginatedData();
  }

  onAreaChange(): void {
    this.currentPage = 1; // Reset to first page on area change
    this.updatePaginatedData();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedArea = '';
    this.currentPage = 1;
    this.updatePaginatedData();
  }
}
