import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { ListasParametricasService } from '../../../../services/listas-parametricas.service';
import { ListaParametrica } from '../../../../models/listaParametrica.model';

@Component({
  selector: 'app-lista-parametrica',
  standalone: true,
  imports: [ButtonModule, CommonModule, TableModule],
  templateUrl: './lista-parametrica.component.html',
  styleUrl: './lista-parametrica.component.css'
})
export class ListaParametricaComponent {

  public listaParametrica?: ListaParametrica;
  public itemsListaParamtreicas: any[] = [];
  private id: string | null = null;

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
    this.itemsListaParamtreicas = await this.listasParametricasService.getItemListaParametricas(this.listaParametrica.nombre);
  }
}
