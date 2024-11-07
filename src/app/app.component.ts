import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { MenuService } from './services/menu.service';
import { GenericService } from './services/generic.services';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SecaniFront';
  isMenuCollapsed = true;
  constructor(private primengConfig: PrimeNGConfig, private menuService: MenuService, private repos: GenericService) {}

  ngOnInit() {
    //this.loadAuth();

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
      monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
      monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
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

  loadAuth() {
    this.repos.get('auth', ``, 'Authentication').subscribe({
      next: (data: any) => {
        console.log("data", data);
        if (data != null) {
          localStorage.setItem('user', JSON.stringify(data));
        }
      },
      error: (err) => {
        console.log("Error", err);
      },
    });
  }
}



