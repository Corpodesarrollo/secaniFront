import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { PlantillasCorreoService } from '../../../../services/plantillas-correo.service';


@Component({
  selector: 'app-plantillas-correo',
  standalone: true,
  imports: [ButtonModule, ConfirmDialogModule, CommonModule, DialogModule, RouterModule, TableModule, ToastModule],
  templateUrl: './plantillas-correo.component.html',
  styleUrl: './plantillas-correo.component.css',
  providers: [ConfirmationService, MessageService]
})
export class PlantillasCorreoComponent implements OnInit {

  public plantillasCorreo: any[] = [];
  public plantillaCorreoSeleccionada: any | null = null;
  public mostrarDetallesModal: boolean = false;

  constructor(
    private plantillasCorreoService: PlantillasCorreoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    this.plantillasCorreo = await this.plantillasCorreoService.obtenerPlantillasCorreo();
    console.log(this.plantillasCorreo);
  }

  async openViewModal(plantillaCorreoId: string) {
    this.plantillaCorreoSeleccionada = await this.plantillasCorreoService.obtnenerPlantillaCorreoPorId(plantillaCorreoId);
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
      accept: async () => {
        if (this.plantillaCorreoSeleccionada) {
          try {
            await this.plantillaCorreoSeleccionada.eliminarPlantillaCorreo(this.plantillaCorreoSeleccionada.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminación exitosa',
              detail: `La plantilla "${this.plantillaCorreoSeleccionada.nombre}" fue eliminada correctamente.`,
              life: 3000
            });
            this.plantillasCorreo = await this.plantillasCorreoService.obtenerPlantillasCorreo(); // Refresca la lista
          } catch (error) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Hubo un problema al eliminar la plantilla. Inténtalo de nuevo.',
              life: 3000
            });
          }
        }
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'La eliminación de la plantilla fue cancelada.',
          life: 3000
        });
      }
    });
  }
}
