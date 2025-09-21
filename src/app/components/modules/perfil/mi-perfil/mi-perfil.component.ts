import { Component, OnInit, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { ModalCrearComponent } from '../../usuarios/eapb/modal-crear/modal-crear.component';
import { Usuario } from '../../../../models/usuario.model';
import { GenericService } from '../../../../services/generic.services';
import { User } from '../../../../core/services/userService';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, CalendarModule, CheckboxModule, CardModule, InputSwitchModule, FormsModule, BotonNotificacionComponent, TableModule, ModalCrearComponent],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit {
  @ViewChild(ModalCrearComponent) modalCrearComponent!: ModalCrearComponent;

  estadoUsuario: boolean = true;
  fecha: string = '';
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

  vistaPerfil: string = '';
  // Datos para la primera tabla
  public datosHorarioAgente = [
    { diaActivo: false, dia: 'Lunes', horaInicio: '', horaFin: '' },
    { diaActivo: false, dia: 'Martes', horaInicio: '', horaFin: '' },
    { diaActivo: false, dia: 'Miercoles', horaInicio: '', horaFin: '' },
    { diaActivo: false, dia: 'Jueves', horaInicio: '', horaFin: '' },
    { diaActivo: false, dia: 'Viernes', horaInicio: '', horaFin: '' },
    { diaActivo: false, dia: 'Sabado', horaInicio: '', horaFin: '' },
    { diaActivo: false, dia: 'Domingo', horaInicio: '', horaFin: '' }
  ];

  // Datos para la segunda tabla
  datosAusenciasAgente = [
    { fecha: '12/09/2024', motivo: 'Cita Medica' },
    { fecha: '30/09/2024', motivo: 'Calamidad domestica' }
  ];

  constructor(private dataService: GenericService, private user: User) { }

  async ngOnInit() {
    this.idUser = localStorage.getItem('id') ?? '0';
    //this.vistaSegunPerfiil(this.user.enterpriseCode);
    this.obtenerDatosUsuario();
    this.vistaSegunPerfiil('M');
    this.obtenerHorarioAgente();
  }

  obtenerDatosUsuario() {
    if (!this.idUser || this.idUser === '0') return;
    this.dataService.get('User/GetUserDetails/', this.idUser, 'UsuariosRoles').subscribe({
      next: (data: any) => {
        this.usuario = data;
        this.estadoUsuario = this.usuario.estado === 'Activo';
        console.log(this.usuario);
      },
      error: (e) => console.error('Se presento un error al consultar el usuario', e),
      complete: () => console.info('Consulta usuario exitosa')
    });
  }

  obtenerHorarioAgente(): void {
    if (!this.idUser || this.idUser === '0') return;
    this.dataService.get('/api/horario-laboral/obtener-usuario/', this.idUser, 'Seguimiento').subscribe({
      next: (data: any[]) => { this.actualizarHorarios(data)},
      error: (e) => console.error('Se presento un error al consultar los horarios del usuario', e),
      complete: () => console.info('Consulta del horario del usuario existosa')
    });
  }

  vistaSegunPerfiil(parametro: any): void {
    if (parametro === 'MU' || parametro === 'DE' || parametro === 'DI') {
      this.vistaPerfil = 'vistaEntidadEAPB';
    } else {
      this.vistaPerfil = 'vistaUsuario';
    }
  }

  actualizarHorarios(horariosRecibidos: any[]) {
    // Primero, resetear todos los días a inactivos
    this.datosHorarioAgente.forEach(dia => {
      dia.diaActivo = false;
      dia.horaInicio = '';
      dia.horaFin = '';
    });

    // Mapeo de número de día a índice del arreglo
    // Nota: Los días suelen empezar en 1 (Lunes) a 7 (Domingo)
    const mapeoDias = {
      1: 0, // Lunes
      2: 1, // Martes
      3: 2, // Miércoles
      4: 3, // Jueves
      5: 4, // Viernes
      6: 5, // Sábado
      7: 6  // Domingo
    };

    // Actualizar solo los días que vienen en la respuesta
    horariosRecibidos.forEach(horario => {
      const indice = mapeoDias[horario.dia as keyof typeof mapeoDias];

      if (indice !== undefined && indice >= 0 && indice < this.datosHorarioAgente.length) {
        this.datosHorarioAgente[indice].diaActivo = true;
        this.datosHorarioAgente[indice].horaInicio = this.formatearHora(horario.horaEntrada);
        this.datosHorarioAgente[indice].horaFin = this.formatearHora(horario.horaSalida);
      }
    });
  }

  // Función auxiliar para formatear la hora (opcional)
  formatearHora(horaCompleta: string): string {
    // Convierte "08:00:00" a "08:00"
    return horaCompleta.substring(0, 5);
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

  onEstadoChange(nuevoEstado: boolean) {
    const data = { ...this.usuario, estado: nuevoEstado };
    this.dataService.put("Authentication", data, `user/edituserprofile/${this.idUser}`).subscribe({
      next: (value) => { this.usuario = { ...this.usuario, estado: nuevoEstado } },
      error: (err) => { console.log },
    });
  }
}
