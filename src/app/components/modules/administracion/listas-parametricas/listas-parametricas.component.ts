import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { ListasParametricasService } from '../../../../services/listas-parametricas.service';

@Component({
  selector: 'app-listas-parametricas',
  standalone: true,
  imports: [ButtonModule, DialogModule, DropdownModule, InputTextModule, InputTextareaModule, ReactiveFormsModule, RouterModule, TableModule],
  templateUrl: './listas-parametricas.component.html',
  styleUrl: './listas-parametricas.component.css'
})
export class ListasParametricasComponent implements OnInit {
  public listasParametricas: any[] = [];

  public listaParametricaForm: FormGroup;
  public mostrarModalEditar: boolean = false;

  constructor(private formBuilder: FormBuilder, private listasParametricasService: ListasParametricasService) {
    this.listaParametricaForm = this.formBuilder.group({
      id: [{ value: '', disable: true }, Validators.required],
      nombre: [{ value: '', disabled: true }, Validators.required],
      descripcion: ['', Validators.required],
      tablaPadre: [{ value: '', disabled: true }, Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    this.listasParametricas = await this.listasParametricasService.getListasParametricas();

    this.listasParametricas = [
      {
        id: 'asdasdqe',
        nombre: '33rer',
        descripcion: 'asd2e',
        tablaPadre: 'asdasñl añsdlmas añsdmasd',
      },
    ];
  }

  openEditModal(listaParametrica: any): void {
    this.listaParametricaForm.reset(listaParametrica);
    this.mostrarModalEditar = true;
  }

  closeEditModal(): void {
    this.mostrarModalEditar = false;
  }

  async onSubmit() {
    if(this.listaParametricaForm.invalid) return;

    const { id, datos } = this.listaParametricaForm.value;
    const response = await this.listasParametricasService.putListaParametrica(id, datos);
    console.log(response);
    this.listaParametricaForm.reset();
  }
}
