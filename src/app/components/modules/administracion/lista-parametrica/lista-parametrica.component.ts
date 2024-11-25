import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { ListasParametricasService } from '../../../../services/listas-parametricas.service';

@Component({
  selector: 'app-lista-parametrica',
  standalone: true,
  imports: [ButtonModule, CommonModule, TableModule],
  templateUrl: './lista-parametrica.component.html',
  styleUrl: './lista-parametrica.component.css'
})
export class ListaParametricaComponent {

  public listaParametrica?: any;
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
    this.listaParametrica = await this.listasParametricasService.getItemListaParametricas('cie10');
    console.log(this.listaParametrica);


    this.listaParametrica = {
      subCategoria: 'SUBCATEGORIAS',
      listaPadre: 'CATEGORIAS',
      descripcion: 'Subcategorías de las alertas',
      items: [
        { id: 1, fechaCreacion: new Date('2024-04-15'), nombre: 'No contar o demorar la autorización...', identificador: 'A', orden: 1, itemListaPadre: 'Accesibilidad' },
        { id: 2, fechaCreacion: new Date('2024-04-15'), nombre: 'El cobro de copagos...', identificador: 'B', orden: 2, itemListaPadre: 'Accesibilidad' },
        { id: 3, fechaCreacion: new Date('2024-04-15'), nombre: 'No tener implementados esquemas...', identificador: 'C', orden: 3, itemListaPadre: 'Accesibilidad' },
        { id: 4, fechaCreacion: new Date('2024-04-15'), nombre: 'Incumplir las actividades...', identificador: 'D', orden: 4, itemListaPadre: 'Accesibilidad' },
        { id: 5, fechaCreacion: new Date('2024-04-15'), nombre: 'No realizar la notificación obligatoria...', identificador: 'E', orden: 5, itemListaPadre: 'Accesibilidad' }
      ]
    };
  }
}
