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

  telefonoContacto: string = '+573121654328';

  aux: Boolean = true;

  // Datos para la primera tabla
  datosHorarioAgente = [
    { diaActivo: true, dia: 'Lunes', horaInicio: '', horaFin: '' },
    { diaActivo: true, dia: 'Martes', horaInicio: '', horaFin: '' },
    { diaActivo: true, dia: 'Miercoles', horaInicio: '', horaFin: '' },
    { diaActivo: true, dia: 'Jueves', horaInicio: '', horaFin: '' },
    { diaActivo: true, dia: 'Viernes', horaInicio: '', horaFin: '' },
    { diaActivo: true, dia: 'Sabado', horaInicio: '', horaFin: '' },
    { diaActivo: true, dia: 'Domingo', horaInicio: '', horaFin: '' }
  ];

  // Datos para la segunda tabla
  datosAusenciasAgente = [
    { fecha: '12/09/2024', motivo: 'Cita Medica' },
    { fecha: '30/09/2024', motivo: 'Calamidad domestica' }
  ];

  constructor(private dataService: GenericService, private user: User) { }

  async ngOnInit() {
    sessionStorage.setItem('roleId', '311882D4-EAD0-4B0B-9C5D-4A434D49D16D');
    sessionStorage.setItem('userId', '48e6efab-2c8a-4d37-bc6c-d62ec8fdd0c5');
    sessionStorage.setItem('enterpriseType', 'MU');

    this.idUser = sessionStorage.getItem('userId') ?? '0';

    //this.vistaSegunPerfiil(this.user.enterpriseCode);
    this.vistaSegunPerfiil('M');

    this.dataService.get('User/GetUserDetails/', this.idUser, 'UsuariosRoles').subscribe({
      next: (data: any) => {
        this.usuario = data;
        if (this.usuario.estado === 'Activo') {
          this.estadoUsuario = true;
        } else {
          this.estadoUsuario = false;
        }
        console.log(this.usuario);
      },
      error: (e) => console.error('Se presento un error al consultar el usuario', e),
      complete: () => console.info('Consulta usuario exitosa')
    });

    this.dataService.get_withoutParameters(`Seguimiento/GetSeguimientoHorarioAgente?UsuarioId=${this.idUser}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.datosHorarioAgente = this.actualizarHorario(data);
        console.log(this.datosHorarioAgente)
      },
      error: (e) => console.error('Se presento un error al consultar el usuario', e),
      complete: () => console.info('Consulta usuario exitosa')
    });
  }

  vistaSegunPerfiil(parametro: any): void {
    if (parametro === 'MU' || parametro === 'DE' || parametro === 'DI') {
      this.vistaPerfil = 'vistaEntidadEAPB';
    } else {
      this.vistaPerfil = 'vistaUsuario';
    }
  }

  actualizarHorario(datosHoras: Array<{ dia: number, horaEntrada: string, horaSalida: string }>): Array<{ diaActivo: boolean, dia: string, horaInicio: string, horaFin: string }> {
    // Array base con los días de la semana
    let diasSemana = [
      { diaActivo: true, dia: 'Lunes', horaInicio: '', horaFin: '' },
      { diaActivo: true, dia: 'Martes', horaInicio: '', horaFin: '' },
      { diaActivo: true, dia: 'Miercoles', horaInicio: '', horaFin: '' },
      { diaActivo: true, dia: 'Jueves', horaInicio: '', horaFin: '' },
      { diaActivo: true, dia: 'Viernes', horaInicio: '', horaFin: '' },
      { diaActivo: true, dia: 'Sabado', horaInicio: '', horaFin: '' },
      { diaActivo: true, dia: 'Domingo', horaInicio: '', horaFin: '' }
    ];

    // Mapeo de los días de la semana a números
    const mapeoDias: { [key: number]: string } = {
      1: 'Lunes',
      2: 'Martes',
      3: 'Miercoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sabado',
      7: 'Domingo'
    };

    // Función que recorre el array de días y actualiza las horas basadas en el array de datosHoras
    diasSemana = diasSemana.map(dia => {
      // Busca si hay datos para el día actual
      const diaNumero = Object.keys(mapeoDias).find(key => mapeoDias[+key] === dia.dia);
      const datosDia = datosHoras.find(d => d.dia.toString() === diaNumero);

      if (datosDia) {
        // Si hay datos, actualiza las horas y mantiene activo
        return {
          ...dia,
          diaActivo: true,
          horaInicio: datosDia.horaEntrada,
          horaFin: datosDia.horaSalida
        };
      } else {
        // Si no hay datos, desactiva el día
        return {
          ...dia,
          diaActivo: false,
          horaInicio: 'N/A',
          horaFin: 'N/A'
        };
      }
    });

    return diasSemana;
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
