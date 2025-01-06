import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { TableModule } from 'primeng/table';

import { PlantillasCorreoService } from '../../../../services/plantillas-correo.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plantilla-correo-historico',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './plantilla-correo-historico.component.html',
  styleUrl: './plantilla-correo-historico.component.css'
})
export class PlantillaCorreoHistoricoComponent implements OnInit {
  public id!: string;
  public historicos: any[] = [];

  constructor(
    private plantillasCorreoService: PlantillasCorreoService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.id = params.get('id')!;

      if (this.id) {
        this.historicos = await this.plantillasCorreoService.historioPlantillaCorreo(this.id);
      }
    });
  }
}
