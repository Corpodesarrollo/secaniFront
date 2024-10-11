import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CabecerasGenericas } from '../../services/cabecerasGenericas';
import { GenericService } from '../../services/generic.services';
import { environment } from '../../../environments/environment';
import { MenuModel } from '../../models/MenuModel';
import { Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent implements OnInit {
  items: MenuItem[] | undefined;
  menuRows: MenuModel[] = [];
  arregloMenu: any[] = [];

  constructor(private service: GenericService, private router: Router, private menuService: MenuService, private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    var url = environment.url_MsAuthention;

    //Cordinador
    sessionStorage.setItem('roleId','311882D4-EAD0-4B0B-9C5D-4A434D49D16D');
    //Agente seguimiento
    //sessionStorage.setItem('roleId','14CDDEA5-FA06-4331-8359-036E101C5046');
    //Es requerido para crear un nna es el usuario createdByUserId
    // sessionStorage.setItem('userId','12413');

    //Parametro ejemplo agente de seguimiento
    var parameters = {
      'roleId': sessionStorage.getItem('roleId')
    };

    this.service.post('Permisos/MenuXRolId', parameters, 'Authentication').subscribe({
      next: (data: any) => {
        this.menuRows = data;
        this.cargarMenus();
      }
    });
  }

  cargarMenus() {
    const menuMap = new Map<string, any>();

    this.menuRows.forEach((menu: MenuModel) => { //Lista de Menus
      if (menu?.tieneSubMenu > 0) {
        menuMap.set(menu.menuNombre, {
          label: menu.menuNombre,

          items: []
        });

        // Agregar submenús si existen
        if (menu.subMenus && menu.subMenus.length > 0) {
          menu.subMenus.forEach(subMenu => {
            var subI =
            {
              label: subMenu.menuNombre,
              icon: subMenu.menuIcon,
              command: () => {
                this.router.navigate(['/' + menu.menuPath + '/' + subMenu.menuPath]);
                this.menuService.toggleMenu();
              }
            };
            menuMap.get(menu.menuNombre)?.items.push(subI);
          });
        }
      } else { //Sin subMenus
        menuMap.set(menu.menuNombre, {
          items: []
        });

        var subI = {
          label: menu.menuNombre,
          icon: menu.menuIcon,
          route: '/' + menu.menuPath,
          command: () => {
            this.router.navigate(['/' + menu.menuPath]);
            this.menuService.toggleMenu();
          },
          styleClass:"sinSubMenus"
        };
        menuMap.get(menu.menuNombre)?.items.push(subI);
      }
    });

    // Convertir el mapa a un array
    this.arregloMenu = Array.from(menuMap.values());
    this.items = this.arregloMenu;
    this.cd.detectChanges();

  }
}
