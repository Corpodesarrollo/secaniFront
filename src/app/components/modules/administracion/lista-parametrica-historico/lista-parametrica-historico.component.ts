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

  // BUG-LZ-026: traducir nombres de columna a etiquetas en español para el comentario del histórico
  private readonly camposEs: Record<string, string> = {
    'IsDeleted': 'Eliminado',
    'Activo': 'Estado',
    'Nombre': 'Nombre',
    'Festivo': 'Fecha festivo',
    'HoraInicio': 'Hora inicio',
    'HoraFin': 'Hora fin',
    'Orden': 'Orden',
    'Descripcion': 'Descripción',
    'CategoriaAlertaId': 'Categoría de alerta',
    'Indicador': 'Identificador',
    'SubCategoriaAlerta': 'Subcategoría',
    'CodigoCIE10': 'Código CIE10',
    'Codigo': 'Código',
    'FechaCreacion': 'Fecha creación',
    'DateCreated': 'Fecha creación',
    'DateUpdated': 'Fecha actualización',
    'DateDeleted': 'Fecha eliminación',
    'CreatedByUserId': 'Usuario creador',
    'UpdatedByUserId': 'Usuario actualizador',
    'DeletedByUserId': 'Usuario eliminador'
  };

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
        switchMap((lista: any) => this.listasParametricasService.getHistoricoListaParametrica(`Tp${lista.nombre}`))
      )
      .subscribe({
        next: (response: any) => {
          this.historicos = response;
        }
      });
  }

  // BUG-LZ-026: convierte "IsDeleted, Activo" -> "Eliminado, Estado".
  // Ademas prepende "Item: <nombre>" si se puede extraer del registro.
  traducirComentario(historico: any): string {
    const comentario = historico?.comentario ?? '';
    const camposTraducidos = comentario
      ? comentario.split(',').map((f: string) => {
          const k = f.trim();
          return this.camposEs[k] ?? k;
        }).join(', ')
      : '';

    const nombre = this.extraerNombreItem(historico);
    if (nombre) {
      return camposTraducidos ? `Ítem: ${nombre}. Campos: ${camposTraducidos}` : `Ítem: ${nombre}`;
    }
    return camposTraducidos;
  }

  private extraerNombreItem(historico: any): string | null {
    if (!historico) return null;
    const intentar = (raw: string | undefined): string | null => {
      if (!raw) return null;
      try {
        const obj = JSON.parse(raw);
        return obj?.Nombre || obj?.Festivo || obj?.SubCategoriaAlerta || null;
      } catch { return null; }
    };
    return intentar(historico.registroNuevo) ?? intentar(historico.registroAnterior);
  }

  // BUG-LZ-026: si el histórico marca IsDeleted=true, mostrar transacción como "Eliminar" en lugar de "Actualizacion"
  formatTransaccion(historico: any): string {
    const t = historico?.transaccion ?? '';
    if (t === 'Actualizacion' && (historico?.comentario || '').includes('IsDeleted')) {
      return 'Eliminar';
    }
    return t;
  }
}
