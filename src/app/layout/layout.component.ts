import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { environment } from '../../environments/environment';
import { GenericService } from '../services/generic.services';
import { MenuService } from '../services/menu.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../core/services/userService';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  title = 'SecaniFront';
  isMenuCollapsed = true;
  constructor(private primengConfig: PrimeNGConfig, private menuService: MenuService, private repos: GenericService, private userServise: UserService ) {}

  async ngOnInit() {
    await this.loadAuth();

    this.primengConfig.setTranslation({
      startsWith: 'Empieza con',
      contains: 'Contiene',
      notContains: 'No contiene',
      endsWith: 'Termina con',
      equals: 'Igual',
      notEquals: 'No igual',
      noFilter: 'Sin filtro',
      lt: 'Menor que',
      lte: 'Menor o igual que',
      gt: 'Mayor que',
      gte: 'Mayor o igual que',
      is: 'Es',
      isNot: 'No es',
      before: 'Antes',
      after: 'Después',
      dateIs: 'Es',
      dateIsNot: 'No es',
      dateBefore: 'Antes',
      dateAfter: 'Después',
      clear: 'Limpiar',
      apply: 'Aplicar',
      matchAll: 'Coincidir todo',
      matchAny: 'Coincidir cualquier',
      addRule: 'Agregar regla',
      removeRule: 'Eliminar regla',
      accept: 'Aceptar',
      reject: 'Rechazar',
      choose: 'Elegir',
      upload: 'Subir',
      cancel: 'Cancelar',
      fileSizeTypes: ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
      monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
      monthNamesShort: [ "Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic" ],
      dateFormat: 'dd/mm/yy',
      firstDayOfWeek: 1,
      today: 'Hoy',
      weekHeader: 'Sm',
      weak: 'Débil',
      medium: 'Medio',
      strong: 'Fuerte',
      passwordPrompt: 'Ingrese una contraseña',
      emptyMessage: 'No hay resultados',
      emptyFilterMessage: 'No hay resultados',
      pending: 'Pendiente',
      chooseYear: 'Elegir año',
      chooseMonth: 'Elegir mes',
      chooseDate: 'Elegir fecha',
      prevDecade: 'Década anterior',
      nextDecade: 'Próxima década',
      prevYear: 'Año anterior',
      nextYear: 'Próximo año',
      prevMonth: 'Mes anterior',
      nextMonth: 'Próximo mes',
      prevHour: 'Hora anterior',
      nextHour: 'Próxima hora',
      prevMinute: 'Minuto anterior',
      nextMinute: 'Próximo minuto',
      prevSecond: 'Segundo anterior',
      nextSecond: 'Próximo segundo',
      am: 'AM',
      pm: 'PM',
      searchMessage: 'Buscar',
      selectionMessage: 'Seleccionados',
      emptySelectionMessage: 'No hay selecciones',
      emptySearchMessage: 'No hay resultados',
      aria: {
        trueLabel: 'Verdadero',
        falseLabel: 'Falso',
        nullLabel: 'Nulo',
        star: 'Estrella',
        stars: 'Estrellas',
        selectAll: 'Seleccionar todo',
        unselectAll: 'Deseleccionar todo',
        close: 'Cerrar',
        previous: 'Anterior',
        next: 'Siguiente',
        navigation: 'Navegación',
        scrollTop: 'Desplazarse hacia arriba',
        moveTop: 'Mover al principio',
        moveUp: 'Mover hacia arriba',
        moveDown: 'Mover hacia abajo',
        moveBottom: 'Mover al final',
        moveToTarget: 'Mover al objetivo',
        moveToSource: 'Mover a la fuente',
        moveAllToTarget: 'Mover todo al objetivo',
        moveAllToSource: 'Mover todo a la fuente',
        pageLabel: 'Página',
        firstPageLabel: 'Primera página',
        lastPageLabel: 'Última página',
        nextPageLabel: 'Página siguiente',
        prevPageLabel: 'Página anterior',
        rowsPerPageLabel: 'Filas por página',
        previousPageLabel: 'Página anterior',
        jumpToPageDropdownLabel: 'Saltar a la página',
        jumpToPageInputLabel: 'Introduzca un número de página',
        selectRow: 'Seleccionar fila',
        unselectRow: 'Deseleccionar fila',
        expandRow: 'Expandir fila',
        collapseRow: 'Colapsar fila',
        showFilterMenu: 'Mostrar menú de filtro',
        hideFilterMenu: 'Ocultar menú de filtro',
        filterOperator: 'Operador de filtro',
        filterConstraint: 'Restricción de filtro',
        editRow: 'Editar fila',
        saveEdit: 'Guardar edición',
        cancelEdit: 'Cancelar edición',
        listView: 'Vista de lista',
        gridView: 'Vista de cuadrícula',
        slide: 'Diapositiva',
        slideNumber: 'Número de diapositiva',
        zoomImage: 'Ampliar imagen',
        zoomIn: 'Acercar',
        zoomOut: 'Alejar',
        rotateRight: 'Girar a la derecha',
        rotateLeft: 'Girar a la izquierda',
        listLabel: 'Lista',
        selectColor: 'Seleccionar color',
        removeLabel: 'Eliminar',
        browseFiles: 'Examinar archivos',
        maximizeLabel: 'Maximizar'
      }
    });

    this.menuService.currentMenuState.subscribe(isCollapsed => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  /*
  14CDDEA5-FA06-4331-8359-036E101C5046	Agentes de seguimiento
  311882D4-EAD0-4B0B-9C5D-4A434D49D16D	Coordinador Admin
  4C4016ED-B56D-4953-B8D3-C6A0A45A3850	Cuidador
  88775B35-E8A7-4A73-A603-841C9DB3DBAD	Externos
  */

  async loadAuth(): Promise<any> {
      let jsonUsuario = {
        id: 'd54fc3db-060c-4bb3-aef2-d8b4e3e5f8c9',
        idRol: '14CDDEA5-FA06-4331-8359-036E101C5046',
        alias: 'CC3216549873',
        email: 'fermanjarres3@gmail.com',
        name: 'TRES FERNANDO MANJARRES',
        state: true,
        rolCode: ['Perfil PISIS Neo','SINTRA-ENT','SECANI-CoordinadorAdmin'],
        enterpriseCode: 'CC 3216549873',
        enterpriseDeptoCode: '',
        enterpriseEmail: 'fermanjarres3@gmail.com',
        enterpriseName: 'TRES FERNANDO MANJARRES',
        enterpriseIdentification: '3216549873',
        isMinSalud: false,
        isCoordinadorAdmin: false,
        isAgenteSeguimiento: false, 
        isCuidador: true,
        isET: false,
        isEAPB: false
      }
    if (environment.cookie) {
      let data = await this.userServise.get();
      if (data){
        jsonUsuario = data;
      }
    }

    if (jsonUsuario.id == '') {
      let userToSave = {
        email: jsonUsuario.email,
        identificacion: `Pass-${jsonUsuario.enterpriseIdentification}`,
        fullName: jsonUsuario.name,
        alias: jsonUsuario.alias,
        roles: []
      }
      this.repos.post('User/Create', userToSave, 'Authentication').subscribe({
          next: (data: any) => {
            jsonUsuario.id = data;
            localStorage.setItem('user', JSON.stringify(jsonUsuario));
          },
          error: (err) => {
            console.error(err);
          }
      });
    } else{
      localStorage.setItem('user', JSON.stringify(jsonUsuario));
    }
  }
}
function firstValueFrom(arg0: Observable<any>): any {
  throw new Error('Function not implemented.');
}

