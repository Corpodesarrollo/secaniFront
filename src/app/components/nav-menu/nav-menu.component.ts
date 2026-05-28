import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CabecerasGenericas } from '../../services/cabecerasGenericas';
import { GenericService } from '../../services/generic.services';
import { environment } from '../../../environments/environment';
import { MenuModel } from '../../models/MenuModel';
import { Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { User } from '../../core/services/user';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent implements OnInit {
  xUser = new User();
  items: MenuItem[] | undefined;
  menuRows: MenuModel[] = [];
  arregloMenu: any[] = [];

  constructor(private service: GenericService, private router: Router, private menuService: MenuService, private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    if (this.xUser.id != null) {
      var parameters = {
        'roleId': this.xUser.idRol
      };
      this.service.post('Permisos/MenuXRolId', parameters, 'Authentication').subscribe({
        next: (data: any) => {
          this.menuRows = data;
          this.cargarMenus();
        }
      });
    } else{
      window.location.href = environment.url_Sispro;
    }

    var url = environment.url_MsAuthention;

    //Cordinador
    //sessionStorage.setItem('roleId','311882D4-EAD0-4B0B-9C5D-4A434D49D16D');
    //Agente seguimiento
    //sessionStorage.setItem('roleId','14CDDEA5-FA06-4331-8359-036E101C5046');
    //Es requerido para crear un nna es el usuario createdByUserId
    //  sessionStorage.setItem('userId','12413');

    //Parametro ejemplo agente de seguimiento

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

    // Ultima opcion del menu: Cerrar sesion
    this.arregloMenu.push({
      items: [{
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
        styleClass: 'sinSubMenus'
      }]
    });

    this.items = this.arregloMenu;
    this.cd.detectChanges();

  }

  logout() {
    localStorage.removeItem('user');
    this.menuService.toggleMenu();
    window.location.href = '/qa-login';
  }
}
