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
import { EliminarPlantillaCorreo } from '../../../../models/eliminarPlantillaCorreo.model';



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

  ngOnInit() {
    this.obtenerPlantillasCorreo();
  }

  obtenerPlantillasCorreo() {
    this.plantillasCorreoService.getPlantillasCorreo()
      .subscribe({
        next: (response: any) => {
          this.plantillasCorreo = response;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las plantillas de correo.',
            life: 3000
          });
        }
      });
  }

  openViewModal(plantillaCorreoId: string) {
    this.plantillasCorreoService.getPlantillaCorreo(plantillaCorreoId)
      .subscribe({
        next: (response: any) => {
          this.plantillaCorreoSeleccionada = response;
          this.mostrarDetallesModal = true;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar la plantilla de correo.',
            life: 3000
          });
        }
      });
  }

  closeViewModal(): void {
    this.mostrarDetallesModal = false;
    this.plantillaCorreoSeleccionada = null;
  }

  confirm(event: Event, plantillaCorreoId: string) {
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
        if (plantillaCorreoId) {
          let eliminar: EliminarPlantillaCorreo = {
            id: parseInt(plantillaCorreoId, 10),
            comentario: "Comentario de eliminación",
            idUsuario: "ID del usuario que elimina",
            rol: "Rol del usuario que elimina"
          }
          this.plantillasCorreoService.deletePlantillaCorreo(eliminar)
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Eliminado',
                  detail: 'La plantilla de correo fue eliminada con éxito.',
                  life: 3000
                });

                this.obtenerPlantillasCorreo();
                this.closeViewModal();
              },
              error: (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'No se pudo eliminar la plantilla de correo.',
                  life: 3000
                });
              }
            });
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
