import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { ListasParametricasService } from '../../../../services/listas-parametricas.service';
import { ListaParametrica } from '../../../../models/listaParametrica.model';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-lista-parametrica',
  standalone: true,
  imports: [ButtonModule, CommonModule, RouterModule, TableModule],
  templateUrl: './lista-parametrica.component.html',
  styleUrl: './lista-parametrica.component.css'
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
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private listasParametricasService: ListasParametricasService
  ) { }

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
