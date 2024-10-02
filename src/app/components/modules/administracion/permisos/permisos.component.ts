import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { GenericService } from '../../../../services/generic.services';
import { CardModule } from 'primeng/card';
import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [RouterModule, CheckboxModule, FormsModule, CommonModule, TableModule, CardModule, BotonNotificacionComponent],
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.css'
})

export class PermisosComponent implements OnInit{
  selectRoles: any[] = [];
  selectModulos: any[] = [];

  selectedRol: string | null = null;
  selectedModulo: number | null = null;

  tableData: any[] = [];

  first = 0;
  rows = 10;

  constructor(private dataService: GenericService) { }

  ngOnInit(): void {
    this.dataService.get_withoutParameters('Role/GetAll','Authentication').subscribe({
      next: (data: any) => {
        this.selectRoles = data
        console.log(data)
        this.selectedRol = data[0].id
      },
      error: (e) => console.error('Se presento un error al llenar la lista de roles', e),
      complete: () => console.info('Se lleno la lista de roles')
    });

    this.dataService.get_withoutParameters('Modulos','Permisos').subscribe({
      next: (data: any) => {
        this.selectModulos = data
        console.log(data)
        this.selectedModulo = data[0].id
      },
      error: (e) => console.error('Se presento un error al llenar la lista de modulos', e),
      complete: () => console.info('Se lleno la lista de modulos')
    });
  }

  onSelectChangeRol(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedRol = String(selectElement.value);
  }

  onSelectChangeModulo(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedModulo = Number(selectElement.value);
  }

  onCheckboxChange(event: any, item: any, field: string) {
    const newValue = event.checked;
    item[field] = newValue;
  }

  onConsultarClick(): void {
    // Limpiar la tabla antes de llenarla con nuevos datos
    this.tableData = [];

    var parametros = this.selectedRol + '/' + this.selectedModulo

    console.log(parametros)

    this.dataService.get('Permisos/GetByRoleandModuloId/', parametros, 'Permisos').subscribe({
      next: (data: any) => {
        this.tableData = data
        console.log(data)
      },
      error: (e) => console.error('Se presento un error al llenar la tabla de permisos', e),
      complete: () => console.info('Se lleno la tabla de permisos')
    });
  }

  onLimpiarClick(): void {
    this.tableData = [];
  }

  onGuardarClick(): void {
    this.tableData.forEach(permiso => {
      console.log(permiso);
      this.dataService.put(`Permisos/${permiso.id}`, permiso, 'Permisos').subscribe({
        next: (data: any) => {
          console.log(data)
          alert('¡Se guardo de forma exitosa!')
        },
        error: (e) => console.error('Se presento un error al actualizar los permisos', e),
        complete: () => console.info('Se actualizaron los permisos')
      });
    });
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
