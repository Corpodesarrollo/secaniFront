import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { GenericService } from '../../../../services/generic.services';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [RouterModule, CheckboxModule, FormsModule, CommonModule, TableModule, CardModule],
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.css'
})

export class PermisosComponent {
  selectRoles: any[] = [];
  selectModulos: any[] = [];

  selectedRol: number | null = null;
  selectedModulo: number | null = null;

  tableData: any[] = [];

  first = 0;
  rows = 10;

  constructor(private dataService: GenericService) { }

  ngOnInit(): void {
    this.dataService.get_withoutParameters('Role/GetAll','UsuariosRoles').subscribe({
      next: (data: any) => {
        this.selectRoles = data
        console.log(data)
      },
      error: (e) => console.error('Se presento un error al llenar la lista de roles', e),
      complete: () => console.info('Se lleno la lista de roles')
    });

    this.dataService.get_withoutParameters('Modulos','Permisos').subscribe({
      next: (data: any) => this.selectModulos = data,
      error: (e) => console.error('Se presento un error al llenar la lista de modulos', e),
      complete: () => console.info('Se lleno la lista de modulos')
    });
  }

  onSelectChangeRol(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedRol = Number(selectElement.value);
  }

  onSelectChangeModulo(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedModulo = Number(selectElement.value);
  }

  onConsultarClick(): void {
    const params: { [key: string]: any } = {};

    if (this.selectedRol !== null) {
      params['param1'] = this.selectedRol;
    }

    if (this.selectedModulo !== null) {
      params['param2'] = this.selectedModulo;
    }

    // Limpiar la tabla antes de llenarla con nuevos datos
    this.tableData = [];

    this.dataService.getAxios('permisos', params).subscribe({
      next: (data) => this.tableData = data,
      error: (e) => console.error('Se presento un error al llenar la tabla de permisos', e),
      complete: () => console.info('Se lleno la tabla de permisos')
    });

    /*this.dataService.get('TablaParametrica/', 'CodigoEAPByNit', 'Permisos').subscribe({
      next: (data: any) => {
        this.listaEAPB = data
        this.listaEAPB.sort((a, b) => a.nombre.localeCompare(b.nombre));
      },
      error: (e) => console.error('Se presento un error al llenar la lista de EAPB', e),
      complete: () => console.info('Se lleno la lista de EAPB')
    });*/
  }

  onSaveClick(): void {
    // Enviar los datos modificados al servidor para actualizar la información
    this.dataService.putAxios('permisos', this.tableData).subscribe({
      next: (response) => console.info('Se actualizaron los permisos' , response),
      error: (e) => console.error('Se presento un error al actualizar los permisos', e),
      complete: () => console.info('Se actualizaron los permisos correctamente')
    });
  }

  onLimpiarClick(): void {
    this.tableData = [];
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
    return this.tableData ? this.first === this.tableData.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.tableData ? this.first === 0 : true;
  }
}
