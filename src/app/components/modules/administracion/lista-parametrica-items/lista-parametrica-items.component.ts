import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { ListasParametricasService } from '../../../../services/listas-parametricas.service';
import { ListaParametrica } from '../../../../models/listaParametrica.model';

@Component({
  selector: 'app-lista-parametrica-items',
  standalone: true,
  imports: [ButtonModule, DropdownModule, InputTextModule, ReactiveFormsModule, TableModule],
  templateUrl: './lista-parametrica-items.component.html',
  styleUrl: './lista-parametrica-items.component.css'
})
export class ListaParametricaItemsComponent implements OnInit {

  public listaParametricaPadre: ListaParametrica | null = null;
  public items: any[] = [];

  public itemsListaParametricaForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private listasParametricasService: ListasParametricasService
  ) {
    this.itemsListaParametricaForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      nombre: ['', Validators.required],
      codigo: [{ value: null, disabled: true }],
      descripcion: [{ value: null, disabled: true }],
      indicador: ['', Validators.required],
      orden: [{ value: null, disabled: true }],
      itemListaPadre: [{ value: null, disabled: true }]
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        map(params => params.get('id')),
        filter((id): id is string => !!id),
        switchMap(id => this.listasParametricasService.getListaParametrica(id)),
        tap((lista: any) => this.listaParametricaPadre = lista),
        switchMap((lista: any) => this.listasParametricasService.getItemListaParametricas(lista.nombre))
      )
      .subscribe({
        next: (rawItems: any) => this.items = this.mapItems(rawItems),
        error: () => this.router.navigate(['/administracion/lista_parametricas'])
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
      switchMap(() => this.listasParametricasService.getItemListaParametricas(nombreLista)),
      tap(() => this.itemsListaParametricaForm.reset())
    ).subscribe({
      next: (items: any) => this.items = this.mapItems(items),
      error: () => console.error('Error al guardar el item de la lista paramétrica')
    });
  }

  private mapItems(rawItems: any[]): any[] {
    return rawItems.map(item => ({
      ...item,
      fechaCreacion: new Date(item.fechaCreacion),
      nombre: item.nombre || item.festivo || item.subCategoriaAlerta || 'Sin nombre',
    }));
  }

  clearForm(): void {
    this.itemsListaParametricaForm.reset();
  }
}
