import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ListasParametricasService } from '../../../../services/listas-parametricas.service';
import { ListaParametrica } from '../../../../models/listaParametrica.model';
import { filter, map, switchMap, tap } from 'rxjs';
import { PermisoDirective } from '../../../../directives/permiso.directive';

@Component({
  selector: 'app-lista-parametrica',
  standalone: true,
  imports: [ButtonModule, CommonModule, RouterModule, TableModule, PermisoDirective, ConfirmDialogModule, ToastModule],
  templateUrl: './lista-parametrica.component.html',
  styleUrl: './lista-parametrica.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ListaParametricaComponent {

  public listaParametrica?: ListaParametrica;
  public itemsListaParametricas: any[] = [];

  public titulos: Record<string, string> = {
    "festivos": 'Festivos',
    "estadoseguimiento": 'Estado seguimientos',
    "subcategoriaalerta": 'Subcategoría alerta',
    "razonessindiagnostico": 'Razones sin diagnósticos',
    "estadonna": 'Estado NNA',
    "malaatencionips": 'Mala atención IPS',
    "motivocierresolicitud": 'Motivo cierre solicitud',
    "origenreporte": 'Origen reporte',
    "tipofallallamada": 'Tipo falla llamada',
    "categoriaalerta": 'Categoría alerta',
    "causainasistencia": 'Causa inasistencia',
    "cie10": 'Diagnóstico',
    "estadoalerta": 'Estado alerta',
    "estadoingresoestrategia": 'Estado ingreso estrategia',
    "tiporecurso": 'Tipo de recurso',
  }

  private listasProtegidas: string[] = ['TPEstadoNNA', 'TPEstadoSeguimiento', 'TPEstadoAlerta'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private listasParametricasService: ListasParametricasService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  isListaProtegida(): boolean {
    return this.listaParametrica ? this.listasProtegidas.includes(this.listaParametrica.nombre) : false;
  }

  private toDateOnly(value: any): string | null {
    if (!value) return null;
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // BUG: la pantalla /lista_parametricas/{id} (vista detalle) no permitia eliminar items;
  // el boton papelera no tenia handler. Reusa el flujo del componente /items.
  confirmDelete(event: Event, item: any): void {
    if (this.isListaProtegida()) {
      this.messageService.add({ severity: 'warn', summary: 'Eliminación no permitida', detail: 'Esta lista paramétrica no se puede eliminar.', life: 3000 });
      return;
    }
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de eliminar este ítem?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      accept: () => {
        if (!this.listaParametrica) return;
        let formData: any = { ...item, isDeleted: true, activo: false };
        if (this.listaParametrica.nombre === 'festivos') {
          formData.festivo = this.toDateOnly(formData.festivo || formData.nombre);
        }
        if (this.listaParametrica.nombre === 'subcategoriaalerta') {
          formData = {
            id: formData.id,
            subCategoriaAlerta: formData.nombre,
            categoriaAlertaId: formData.categoriaAlertaId,
            indicador: formData.indicador,
            isDeleted: formData.isDeleted
          };
        }
        this.listasParametricasService.deleteItemListaParametrica(this.listaParametrica.nombre, item.id, formData)
          .pipe(tap(() => this.recargarItems()))
          .subscribe({
            next: () => this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'El ítem fue eliminado con éxito.', life: 3000 }),
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el ítem.', life: 3000 })
          });
      }
    });
  }

  private recargarItems(): void {
    if (!this.listaParametrica) return;
    this.listasParametricasService.getItemListaParametricas(this.listaParametrica.nombre)
      .subscribe({
        next: (rawItems: any) => {
          this.itemsListaParametricas = rawItems.map((item: any) => ({
            ...item,
            fechaCreacion: new Date(item.fechaCreacion),
            nombre: item.nombre || item.festivo || item.subCategoriaAlerta || 'Sin nombre',
          }));
        }
      });
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        map(params => params.get('id')),
        filter((id): id is string => !!id),
        switchMap(id => this.listasParametricasService.getListaParametrica(id)),
        switchMap((lista: any) => {
          this.listaParametrica = lista;
          return this.listasParametricasService.getItemListaParametricas(lista.nombre);
        })
      )
      .subscribe({
        next: (rawItems: any) => {
          this.itemsListaParametricas = rawItems.map((item: any) => ({
            ...item,
            fechaCreacion: new Date(item.fechaCreacion),
            nombre: item.nombre || item.festivo || item.subCategoriaAlerta || 'Sin nombre',
          }));
        },
        error: (error) => {
          this.router.navigate(['/administracion/lista_parametricas']);
        }
      });
  }
}
