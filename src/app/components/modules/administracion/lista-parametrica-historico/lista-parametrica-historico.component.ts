import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ListasParametricasService } from '../../../../services/listas-parametricas.service';
import { filter, map, switchMap, tap } from 'rxjs';
import { ListaParametrica } from '../../../../models/listaParametrica.model';

@Component({
  selector: 'app-lista-parametrica-historico',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './lista-parametrica-historico.component.html',
  styleUrl: './lista-parametrica-historico.component.css'
})
export class ListaParametricaHistoricoComponent {

  public listaParametrica: ListaParametrica | null  = null;
  public historicos: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private listasParametricasService: ListasParametricasService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        map(params => params.get('id')),
        filter((id): id is string => !!id),
        switchMap(id => this.listasParametricasService.getListaParametrica(id)),
        tap((lista: any) => this.listaParametrica = lista),
        tap((lista: any) => console.log(lista)),
        switchMap((lista: any) => this.listasParametricasService.getHistoricoListaParametrica(`Tp${lista.nombre}`))
      )
      .subscribe({
        next: (response: any) => {
          this.historicos = response;
          console.log(response);
        },
        error: () => this.router.navigate(['/administracion/lista_parametricas'])
      });
  }
}
