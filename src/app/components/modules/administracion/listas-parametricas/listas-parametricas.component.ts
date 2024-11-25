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
      tablaPadre: [{ value: null, disabled: true },],
      fuenteTabla: [{ value: 0, disabled: true },, Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  async cargarDatos() {
    this.listasParametricas = (await this.listasParametricasService.getListasParametricas())
      .filter( lista => lista.fuenteTabla == 1)
      .map( lista => ({ ...lista, nombre: this.titulos[lista.nombre] }));
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

    try {
      const data = this.listaParametricaForm.getRawValue();
      const response = await this.listasParametricasService.putListaParametrica(data.id, data);
      await this.cargarDatos();
    } catch(error) {
      console.log(error);
    } finally {
      this.listaParametricaForm.reset();
    }

  }
}
