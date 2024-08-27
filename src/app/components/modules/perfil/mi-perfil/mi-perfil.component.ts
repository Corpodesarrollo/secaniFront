import { Component, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";
import { TableModule } from 'primeng/table';
import { ModalCrearComponent } from '../../usuarios/eapb/modal-crear/modal-crear.component';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CardModule, InputSwitchModule, FormsModule, BotonNotificacionComponent, TableModule, ModalCrearComponent],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {
  @ViewChild(ModalCrearComponent) modalCrearComponent!: ModalCrearComponent;

  switchState: boolean = true;

  data: any[] = [
    { nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987514', correo: 'luz1@sanitas.com', estado: 'Activo' },
    { nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987515', correo: 'luz2@sanitas.com', estado: 'Inactivo' },
    { nombreApe: 'Felipe Arias', cargo: 'Jefe de Doctores', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
    { nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987516', correo: 'luz4@sanitas.com', estado: 'Activo' }
  ];

  selectedItem: any = null;
  isEditing: boolean = false;

  first = 0;
  rows = 10;

    /**Modal Crear y Editar**/

    onEdit(item: any) {
      this.selectedItem = item;
      this.isEditing = true; // Modo edición
      this.openModal();
    }
  
    onCreate() {
      this.selectedItem = null; // Asegúrate de que no hay datos seleccionados
      this.isEditing = false; // Modo creación
      this.openModal();
    }
  
    openModal() {
      if (this.modalCrearComponent) {
        this.modalCrearComponent.open(); // Abre el modal
      }
    }

  /**Paginador**/
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.data ? this.first === this.data.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.data ? this.first === 0 : true;
  }
}
