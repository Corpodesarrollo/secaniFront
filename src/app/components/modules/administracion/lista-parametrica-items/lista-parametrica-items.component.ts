import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';

import { ListasParametricasService } from '../../../../services/listas-parametricas.service';
import { ListaParametrica } from '../../../../models/listaParametrica.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-parametrica-items',
  standalone: true,
  imports: [CommonModule, ButtonModule, DropdownModule, InputTextModule, ReactiveFormsModule, TableModule, ConfirmDialogModule, ToastModule, CalendarModule],
  templateUrl: './lista-parametrica-items.component.html',
  styleUrl: './lista-parametrica-items.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ListaParametricaItemsComponent implements OnInit {

  public listaParametricaPadre: ListaParametrica | null = null;
  public items: any[] = [];

  public itemsListaParametricaForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private listasParametricasService: ListasParametricasService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.itemsListaParametricaForm = this.formBuilder.group({
      id: [{ value: 0, disabled: true }, Validators.required],
      festivo: [''],
      horaInicio: ['00:00:00'],
      horaFin: ['23:59:59'],
      nombre: [''],
      descripcion: [{ value: '', disabled: true }],
      orden: [{ value: 0, disabled: true }],
      fechaCreacion: [{ value: new Date().toISOString(), disabled: true }],
      activo: [{ value: true, disabled: true }],
      isDeleted: [{ value: false, disabled: true }],

      itemListaPadre: [{ value: 'N/A', disabled: true }],
      codigo: [{ value: '', disabled: true }],
      indicador: [''],
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        map(params => params.get('id')),
        filter((id): id is string => !!id),
        switchMap(id => this.listasParametricasService.getListaParametrica(id)),
        tap((lista: any) => {
          this.listaParametricaPadre = lista;
          this.updateFormValidators();
        }),
        tap(() => this.loadItems())
      )
      .subscribe({
        error: () => this.router.navigate(['/administracion/lista_parametricas'])
      });
  }

  private loadItems(): void {
    if (!this.listaParametricaPadre) return;
    this.listasParametricasService.getItemListaParametricas(this.listaParametricaPadre.nombre)
      .pipe(map((items: any) => this.mapItems(items)))
      .subscribe({
        next: (items) => this.items = items,
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los ítems de la lista paramétrica.',
            life: 3000
          });
        }
      });
  }

  openItemForEdit(itemListaParematrica: any): void {
    this.itemsListaParametricaForm.reset(itemListaParematrica);
  }

  onSubmit() {
    if(this.itemsListaParametricaForm.invalid || !this.listaParametricaPadre) 
      return this.itemsListaParametricaForm.markAllAsTouched();

    const formData = this.itemsListaParametricaForm.getRawValue();
    const nombreLista = this.listaParametricaPadre.nombre;

    const save$ = formData.id
      ? this.listasParametricasService.putItemListaParametrica(nombreLista, formData.id, formData)
      : this.listasParametricasService.postItemListaParametrica(nombreLista, formData);

    save$.pipe(
        tap(() => {
          this.resetFormToDefaults();
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'El ítem fue guardado correctamente.',
            life: 3000
          });
        }),
        tap(() => this.loadItems())
      ).subscribe({
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo guardar el ítem.',
            life: 3000
          });
        }
      });
  }

  private mapItems(rawItems: any[]): any[] {
    return rawItems.map(item => ({
      ...item,
      fechaCreacion: new Date(item.fechaCreacion),
      nombre: item.nombre || item.festivo || item.subCategoriaAlerta || 'Sin nombre',
    }));
  }

  confirmDelete(event: Event, itemListaParametrica: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de que quieres eliminar el item de lista parametrica?',
      header: 'Confirmar eliminación',
      icon: 'none',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-secondary p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        if (itemListaParametrica) {
          this.itemsListaParametricaForm.reset({...itemListaParametrica, isDeleted: true, activo: false });
          const formData = this.itemsListaParametricaForm.getRawValue();
          this.listasParametricasService.deleteItemListaParametrica(this.listaParametricaPadre!.nombre, itemListaParametrica.id, formData)
            .pipe(tap(() => this.loadItems()))
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Eliminado',
                  detail: 'El ítem fue eliminado con éxito.',
                  life: 3000
                });
              },
              error: () => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'No se pudo eliminar el ítem.',
                  life: 3000
                });
              }
            });
        }
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'No se pudo eliminar el item de lista parametrica fue cancelada.',
          life: 3000
        });
      }
    });
  }

  private updateFormValidators(): void {
    const festivoControl = this.itemsListaParametricaForm.get('festivo');
    const nombreControl = this.itemsListaParametricaForm.get('nombre');

    // Limpiamos validadores previos
    festivoControl?.clearValidators();
    nombreControl?.clearValidators();

    if (this.listaParametricaPadre?.nombre === 'festivos') {
      festivoControl?.setValidators([Validators.required]);
    } else {
      nombreControl?.setValidators([Validators.required]);
    }

    festivoControl?.updateValueAndValidity();
    nombreControl?.updateValueAndValidity();
  }

  resetFormToDefaults(): void {
    this.itemsListaParametricaForm.reset({
      id: 0,
      festivo: '',
      horaInicio: '00:00:00',
      horaFin: '23:59:59',
      nombre: '',
      descripcion: '',
      orden: 0,
      fechaCreacion: new Date().toISOString(),
      activo: true,
      isDeleted: false,
      itemListaPadre: 'N/A',
      codigo: '',
      indicador: '',
    });

    // Restaurar los campos deshabilitados
    this.itemsListaParametricaForm.get('id')?.disable();
    this.itemsListaParametricaForm.get('descripcion')?.disable();
    this.itemsListaParametricaForm.get('orden')?.disable();
    this.itemsListaParametricaForm.get('fechaCreacion')?.disable();
    this.itemsListaParametricaForm.get('activo')?.disable();
    this.itemsListaParametricaForm.get('isDeleted')?.disable();
    this.itemsListaParametricaForm.get('itemListaPadre')?.disable();
    this.itemsListaParametricaForm.get('codigo')?.disable();
  }
}
