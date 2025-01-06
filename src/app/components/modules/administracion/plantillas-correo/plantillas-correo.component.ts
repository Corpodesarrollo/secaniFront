import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { PlantillasCorreoService } from '../../../../services/plantillas-correo.service';


@Component({
  selector: 'app-plantillas-correo',
  standalone: true,
  imports: [ButtonModule, ConfirmDialogModule, CommonModule, DialogModule, RouterModule, TableModule],
  templateUrl: './plantillas-correo.component.html',
  styleUrl: './plantillas-correo.component.css',
  providers: [ConfirmationService]
})
export class PlantillasCorreoComponent implements OnInit {

  public plantillasCorreo: any[] = [];
  public plantillaCorreoSeleccionada: any | null = null;
  public mostrarDetallesModal: boolean = false;

  constructor(
    private plantillasCorreoService: PlantillasCorreoService,
    private confirmationService: ConfirmationService
  ) {}

  async ngOnInit() {
    this.plantillasCorreo = await this.plantillasCorreoService.obtenerPlantillasCorreo();
    console.log(this.plantillasCorreo);
  }

  openViewModal( plantillaCorreo: any ): void {
    this.plantillaCorreoSeleccionada = plantillaCorreo;
    this.mostrarDetallesModal = true;
  }

  closeViewModal(): void {
    this.mostrarDetallesModal = false;
    this.plantillaCorreoSeleccionada = null;
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de que quieres eliminar la plantilla de correo?',
      header: 'Confirmar eliminación',
      icon: 'none',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-secondary p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
          // Acción al aceptar
      },
      reject: () => {
          // Acción al rechazar
      }
    });
  }
}
