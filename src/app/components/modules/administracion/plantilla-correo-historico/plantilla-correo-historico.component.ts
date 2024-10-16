import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-plantilla-correo-historico',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './plantilla-correo-historico.component.html',
  styleUrl: './plantilla-correo-historico.component.css'
})
export class PlantillaCorreoHistoricoComponent implements OnInit {
  public historicos: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.historicos = [
      { fechaCreacion: new Date(), transaccion: 'Editar', usuarioOrigen: 'Juan Carlos Bernal', usuarioRol: 'Coordinador', comentario: 'Mensaje' },
      { fechaCreacion: new Date(), transaccion: 'Editar', usuarioOrigen: 'Juan Carlos Bernal', usuarioRol: 'Coordinador', comentario: 'Asunto' },
      { fechaCreacion: new Date(), transaccion: 'Editar', usuarioOrigen: 'Juan Carlos Bernal', usuarioRol: 'Coordinador', comentario: 'Cierre' },
      { fechaCreacion: new Date(), transaccion: 'Editar', usuarioOrigen: 'Juan Carlos Bernal', usuarioRol: 'Coordinador', comentario: 'Firmante' },
      { fechaCreacion: new Date(), transaccion: 'Editar', usuarioOrigen: 'Juan Carlos Bernal', usuarioRol: 'Coordinador', comentario: 'Mensaje' }
    ];
  }
}
