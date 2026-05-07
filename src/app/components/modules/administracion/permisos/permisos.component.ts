import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { GenericService } from '../../../../services/generic.services';
import { CardModule } from 'primeng/card';
import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";
import { Entidad } from '../../../../models/entidad.model';
import { Rol } from '../../../../models/rol.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [RouterModule, CheckboxModule, FormsModule, CommonModule, TableModule, CardModule, BotonNotificacionComponent, TabViewModule],
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.css'
})

export class PermisosComponent implements OnInit {
  selectRoles: Rol[] = [];
  selectModulos: any[] = [];
  currentView: string = 'permisos';

  selectedRol: string | null = null;
  selectedModulo: number | null = null;

  tableData: any[] = [];
  listaEntidades: Entidad[] = [];
  dataUsers: any[] = [];

  first = 0;
  rows = 10;

  constructor(private dataService: GenericService) { }

  ngOnInit(): void {
    this.dataService.get_withoutParameters('Role/GetAll', 'Authentication').subscribe({
      next: (data: any) => {
        this.selectRoles = data
        console.log(data)
        this.selectedRol = data[0].id
      },
      error: (e) => console.error('Se presento un error al llenar la lista de roles', e),
      complete: () => console.info('Se lleno la lista de roles')
    });

    this.dataService.get_withoutParameters('Modulos', 'Permisos').subscribe({
      next: (data: any) => {
        this.selectModulos = data
        console.log(data)
        this.selectedModulo = data[0].id
      },
      error: (e) => console.error('Se presento un error al llenar la lista de modulos', e),
      complete: () => console.info('Se lleno la lista de modulos')
    });

    this.dataService.get_withoutParameters('EAPB', 'TablaParametrica').subscribe({
      next: (data: any) => {
        this.listaEntidades = data
        this.listaEntidades.sort((a, b) => a.nombre.localeCompare(b.nombre));
      },
      error: (e) => console.error('Se presento un error al llenar la lista de Entidades', e),
      complete: () => console.info('Se lleno la lista de Entidades')
    });

    // BUG-003: usuarios vienen de SISPRO API, no de BD local
    this.dataService.get_withoutParameters('User/GetAllFromSispro', 'Authentication').subscribe({
      next: (data: any) => {
        this.dataUsers = Array.isArray(data) ? data : (data?.data ?? []);
        console.log('SISPRO users:', this.dataUsers);
      },
      error: (e) => {
        console.error('Error consultando usuarios SISPRO', e);
        this.dataUsers = [];
      }
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
    if (!this.tableData?.length) return;
    // BUG-LZ-008: backend retorna 204 NoContent. HttpClient con responseType:json puede fallar
    // al parsear cuerpo vacio (SyntaxError). Status 2xx en HttpErrorResponse = success real.
    const requests = this.tableData.map(permiso =>
      this.dataService.put(`Permisos/${permiso.moduloComponenteObjetoId}`, permiso, 'Permisos').pipe(
        catchError((err: any) => {
          const status = err?.status ?? 0;
          if (status >= 200 && status < 300) {
            return of(null);
          }
          return of({ __error: err, permiso });
        })
      )
    );
    forkJoin(requests).subscribe((results: any[]) => {
      const errores = results.filter(r => r && r.__error);
      if (errores.length === 0) {
        alert('¡Permisos guardados exitosamente! Se recargará la página para aplicar cambios.');
      } else {
        console.error('Permisos con error:', errores);
        alert(`Guardado parcial: ${results.length - errores.length} OK, ${errores.length} con error. Se recargará la página.`);
      }
      window.location.reload();
    });
  }

  buscarNombreEntidadPorId(id: number): string {
    const item = this.listaEntidades.find(eapb => eapb.codigo === id);
    return item ? item.nombre : 'No encontrado';
  }

  showUsuarios() {
    this.currentView = 'usuarios';
  }

  showRoles() {
    this.currentView = 'roles';
  }

  showPermisos() {
    this.currentView = 'permisos';
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
