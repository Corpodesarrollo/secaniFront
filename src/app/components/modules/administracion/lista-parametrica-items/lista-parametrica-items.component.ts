import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lista-parametrica-items',
  standalone: true,
  imports: [ButtonModule, DropdownModule, InputTextModule, ReactiveFormsModule, TableModule],
  templateUrl: './lista-parametrica-items.component.html',
  styleUrl: './lista-parametrica-items.component.css'
})
export class ListaParametricaItemsComponent implements OnInit {

  public items: any[] = [];
  public itemsListasPadre: any[] = [];
  public itemsListaParametricaForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.itemsListaParametricaForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      nombre: ['', Validators.required],
      identificador: ['', Validators.required],
      ordenLista: [{ value: '', disabled: true }, Validators.required],
      itemListaPadre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.items = [
      { nombre: 'Leucemia Linfoide Aguda', identificador: 'i.', ordenLista: 'i.', itemListaPadre: 'N/A' }
    ];
  }

  openEditModal(itemListaParematrica: any): void {
    this.itemsListaParametricaForm.reset(itemListaParematrica);
  }

  onSubmit(): void {
    if(this.itemsListaParametricaForm.invalid) return;
    console.log(this.itemsListaParametricaForm.value);
    this.itemsListaParametricaForm.reset();
  }
}
