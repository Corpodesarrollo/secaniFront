import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { ListasParametricasService } from '../../../../services/listas-parametricas.service';
import { ListaParametrica } from '../../../../models/listaParametrica.model';

@Component({
  selector: 'app-lista-parametrica',
  standalone: true,
  imports: [ButtonModule, CommonModule, RouterModule, TableModule],
  templateUrl: './lista-parametrica.component.html',
  styleUrl: './lista-parametrica.component.css'
})
export class ListaParametricaComponent {

  public listaParametrica?: ListaParametrica;
  public itemsListaParamtreicas: any[] = [];
  private id: string | null = null;

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private listasParametricasService: ListasParametricasService
  ) { }

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id'); // Obtiene el parámetro 'id'
    });

    if (!this.id) return;
    this.listaParametrica = await this.listasParametricasService.getListaParametrica(this.id);

    if (!this.listaParametrica) return;
    const rawItems = await this.listasParametricasService.getItemListaParametricas(this.listaParametrica.nombre);
    this.itemsListaParamtreicas = rawItems.map((item: any) => ({
      ...item,
      nombre: item.nombre || item.festivo || item.subCategoriaAlerta || 'Sin nombre',
    }));
  }
}
