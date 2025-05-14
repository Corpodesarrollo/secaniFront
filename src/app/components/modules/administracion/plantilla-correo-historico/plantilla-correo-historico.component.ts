import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';

import { TableModule } from 'primeng/table';

import { PlantillasCorreoService } from '../../../../services/plantillas-correo.service';

@Component({
  selector: 'app-plantilla-correo-historico',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './plantilla-correo-historico.component.html',
  styleUrl: './plantilla-correo-historico.component.css'
})
export class PlantillaCorreoHistoricoComponent implements OnInit {
  public historicos: any[] = [];

  constructor(
    private plantillasCorreoService: PlantillasCorreoService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        map(params => params.get('id')),
        filter((id): id is string => !!id),
        switchMap(id => this.plantillasCorreoService.getHistorioPlantillaCorreo(id)),
      )
      .subscribe({
        next: (historicos: any) => this.historicos = historicos,
        error: (error) => this.router.navigate(['/administracion/plantilla_de_correo'])
      });
  }
}
