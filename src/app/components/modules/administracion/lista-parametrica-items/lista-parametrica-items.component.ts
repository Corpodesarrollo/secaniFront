import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ListasParametricasService } from '../../../../services/listas-parametricas.service';
import { ActivatedRoute } from '@angular/router';
import { ListaParametrica } from '../../../../models/listaParametrica.model';

@Component({
  selector: 'app-lista-parametrica-items',
  standalone: true,
  imports: [ButtonModule, DropdownModule, InputTextModule, ReactiveFormsModule, TableModule],
  templateUrl: './lista-parametrica-items.component.html',
  styleUrl: './lista-parametrica-items.component.css'
})
export class ListaParametricaItemsComponent implements OnInit {

  public id: string | null = null;
  public listaParametricaPadre: ListaParametrica | null = null;

  public items: any[] = [];
  public itemsListasPadre: any[] = [];
  public itemsListaParametricaForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private listasParametricasService: ListasParametricasService
  ) {
    this.itemsListaParametricaForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      nombre: ['', Validators.required],
      codigo: [{ value: null, disabled: true }],
      descripcion: [{ value: null, disabled: true }],
      identificador: ['', Validators.required],
      ordenLista: [{ value: null, disabled: true }],
      itemListaPadre: [{ value: null, disabled: true }]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.obtenerListaParametricaPorId(this.id);
      }
    });
  }

  async obtenerListaParametricaPorId(id: string) {
    this.listaParametricaPadre = await this.listasParametricasService.getListaParametrica(id);
    await this.obtenerItems();
  }

  async obtenerItems() {
    if (!this.listaParametricaPadre?.nombre) return;

    const rawItems = await this.listasParametricasService.getItemListaParametricas(this.listaParametricaPadre?.nombre);

    // Normalizar los datos para garantizar que todos tengan el campo `nombre`
    this.items = rawItems.map((item: any) => ({
      ...item,
      nombre: item.nombre || item.festivo || item.subCategoriaAlerta || 'Sin nombre',
    }));
  }

  openItemForEdit(itemListaParematrica: any): void {
    this.itemsListaParametricaForm.reset(itemListaParematrica);
  }

  async onSubmit() {
    if(this.itemsListaParametricaForm.invalid || !this.listaParametricaPadre) return;

    const { identificador, ordenLista, itemListaPadre, id, ...datos } = this.itemsListaParametricaForm.getRawValue();
    const { nombre } = this.listaParametricaPadre;

    try {
      if (id) {
        await this.listasParametricasService.putItemListaParametrica(nombre, id, { id, ...datos });
      } else {
        await this.listasParametricasService.postItemListaParametrica(nombre, datos);
      }
      await this.obtenerItems();
      this.clearForm();
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }
  }

  clearForm(): void {
    this.itemsListaParametricaForm.reset();
  }
}
