import { Component, OnInit, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";
import { TableModule } from 'primeng/table';
import { ModalCrearComponent } from '../../usuarios/eapb/modal-crear/modal-crear.component';
import { Usuario } from '../../../../models/usuario.model';
import { GenericService } from '../../../../services/generic.services';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CardModule, InputSwitchModule, FormsModule, BotonNotificacionComponent, TableModule, ModalCrearComponent],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit {
  @ViewChild(ModalCrearComponent) modalCrearComponent!: ModalCrearComponent;

  switchState: boolean = true;
  usuario!: Usuario;
  idUser: string = "";

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

  constructor(private dataService: GenericService) { }

  async ngOnInit() {
    sessionStorage.setItem('roleId', '311882D4-EAD0-4B0B-9C5D-4A434D49D16D');
    sessionStorage.setItem('userId', '12413');
    sessionStorage.setItem('enterpriseType', 'MU');

    this.idUser = sessionStorage.getItem('userId') ?? '0';

    this.dataService.get('User/GetUserDetails/', this.idUser, 'UsuariosRoles').subscribe({
      next: (data: any) => {
        this.usuario = {
          idUser: data.id,
          nombre: data.fullName,
          email: data.email,
          entidadId: data.entidadId,
          roles: data.roles
        }
        console.log(this.usuario)
      },
      error: (e) => console.error('Se presento un error al consultar el usuario', e),
      complete: () => console.info('Consulta usuario exitosa')
    });
  }

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
