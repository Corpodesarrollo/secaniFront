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
import { ListaParametrica } from '../../../../models/listaParametrica.model';

@Component({
  selector: 'app-listas-parametricas',
  standalone: true,
  imports: [ButtonModule, DialogModule, DropdownModule, InputTextModule, InputTextareaModule, ReactiveFormsModule, RouterModule, TableModule],
  templateUrl: './listas-parametricas.component.html',
  styleUrl: './listas-parametricas.component.css'
})
export class ListasParametricasComponent implements OnInit {
  public listasParametricas: ListaParametrica[] = [];

  public listaParametricaForm: FormGroup;
  public mostrarModalEditar: boolean = false;

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
  }

  constructor(private formBuilder: FormBuilder, private listasParametricasService: ListasParametricasService) {
    this.listaParametricaForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      nombre: [{ value: '', disabled: true }, Validators.required],
      descripcion: ['', Validators.required],
      tablaPadre: [{ value: null, disabled: true }],
      fuenteTabla: [{ value: 0, disabled: true }, Validators.required]
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.listasParametricasService.getListasParametricas().subscribe({
      next: (response: any) => this.listasParametricas = response.filter((lista: any) => lista.fuenteTabla == 1),
      error: (error) => console.error('Error al cargar las listas paramétricas:', error)
    });
  }

  openEditModal(listaParametrica: any): void {
    this.listaParametricaForm.reset(listaParametrica);
    this.mostrarModalEditar = true;
  }

  closeEditModal(): void {
    this.mostrarModalEditar = false;
  }

  onSubmit() {
    if(this.listaParametricaForm.invalid) 
      return this.listaParametricaForm.markAllAsTouched();

    const data = this.listaParametricaForm.getRawValue();
    this.listasParametricasService.putListaParametrica(data.id, data).subscribe({
      next: (response) => {
        this.cargarDatos();
        this.mostrarModalEditar = false;
        this.listaParametricaForm.reset();
      },
      error: (error) => console.error('Error al actualizar la lista paramétrica:', error)
    });    
  }
}
