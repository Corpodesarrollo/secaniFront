import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CabecerasGenericas } from '../../services/cabecerasGenericas';
import { GenericService } from '../../services/generic.services';
import { environment } from '../../../environments/environment';
import { MenuModel } from '../../models/MenuModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(private service: GenericService, private router: Router) {

  }

  async ngOnInit() {
    var url = environment.url_MsAuthention;
    var parameters = {
      'roleId': '14CDDEA5-FA06-4331-8359-036E101C5046'
    };
    var arregloMenu: any[] = [];
    var menuRowsResponse: any = await this.service.postAsync(url, 'Permisos/MenuXRolId', parameters) ?? [];
    var menuRows: MenuModel[] = menuRowsResponse;
    //console.log(menuRows);

    // Crear un mapa para agrupar los menús por nombre
    const menuMap = new Map<string, any>();

    menuRows.forEach((menu: MenuModel) => { //Lista de Menus
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
              }
            };
            menuMap.get(menu.menuNombre)?.items.push(subI);
          });
        }
      } else { //Sin SubMenus
        menuMap.set(menu.menuNombre, {
          items: []
        });

        var subI = {
          label: menu.menuNombre,
          icon: menu.menuIcon,
          route: '/' + menu.menuPath,
          command: () => {
            this.router.navigate(['/' + menu.menuPath]);
          },
          styleClass:"sinSubMenus"
        };
        menuMap.get(menu.menuNombre)?.items.push(subI);
      }


    });

    // Convertir el mapa a un array
    arregloMenu = Array.from(menuMap.values());

    this.items = arregloMenu;

    //console.log("Items :: ", this.items);
    /*
        this.items = [
          {
            label: 'Documents',
            items: [
              {
                label: 'New',
                icon: 'pi pi-plus',
                shortcut: '⌘+N'
              },
              {
                label: 'Search',
                icon: 'pi pi-search',
                shortcut: '⌘+S'
              }
            ]
          },
          {
            label: 'Profile',
            items: [
              {
                label: 'Settings',
                icon: 'pi pi-cog',
                shortcut: '⌘+O'
              },
              {
                label: 'Messages',
                icon: 'pi pi-inbox',
                badge: '2'
              },
              {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                shortcut: '⌘+Q'
              }
            ]
          }
        ];*/
  }
}
