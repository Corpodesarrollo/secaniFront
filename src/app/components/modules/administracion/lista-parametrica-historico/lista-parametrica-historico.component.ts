import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-lista-parametrica-historico',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './lista-parametrica-historico.component.html',
  styleUrl: './lista-parametrica-historico.component.css'
})
export class ListaParametricaHistoricoComponent {

  public historicos: any[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.historicos = [
      { fecha: new Date(), transaccion: 'Eliminar', usuarioOrigen: 'Eliana Robayo', comentario: 'Campo 5, datos del NNA' },
      { fecha: new Date(), transaccion: 'Editar', usuarioOrigen: 'Eliana Robayo', comentario: 'Campo45, datos del NNA' },
      { fecha: new Date(), transaccion: 'Crear', usuarioOrigen: 'Eliana Robayo', comentario: 'Campo 5, datos del NNA' },
      { fecha: new Date(), transaccion: 'Editar', usuarioOrigen: 'Eliana Robayo', comentario: 'Campo 3, datos del NNA' }
    ];
  }
}
